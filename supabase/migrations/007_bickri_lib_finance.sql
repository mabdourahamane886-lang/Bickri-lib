-- Bickri Lib — Finance, wallet, payments, purchases and secure transaction ledger
-- Additive migration: preserves the existing Bickri Lib schema.

create extension if not exists pgcrypto;

-- ============================================================
-- PAYMENT ENUMS
-- ============================================================

do $$ begin
  create type public.bickri_payment_status as enum (
    'pending', 'processing', 'successful', 'failed', 'cancelled', 'refunded'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.bickri_wallet_transaction_type as enum (
    'deposit', 'purchase', 'refund', 'withdrawal', 'adjustment'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.bickri_purchase_status as enum (
    'pending', 'completed', 'cancelled', 'refunded'
  );
exception when duplicate_object then null;
end $$;

-- ============================================================
-- WALLET
-- Internal Bickri Lib credit balance. It is not an external
-- bank account or an independently issued payment instrument.
-- ============================================================

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  currency text not null default 'XOF',
  balance bigint not null default 0 check (balance >= 0),
  status text not null default 'active' check (status in ('active','locked','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.wallets enable row level security;

-- ============================================================
-- PAYMENTS
-- provider examples: ipay, airtel, moov, orange, zamani, card
-- payment_method examples: airtel_money, moov_money, orange_money,
-- zamani, visa, mastercard
-- ============================================================

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  provider text not null,
  payment_method text not null,
  external_reference text,
  provider_transaction_id text,
  amount bigint not null check (amount > 0),
  currency text not null default 'XOF',
  status public.bickri_payment_status not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unique(provider, external_reference)
);

alter table public.payments enable row level security;

create index if not exists payments_user_idx on public.payments(user_id);
create index if not exists payments_status_idx on public.payments(status);
create index if not exists payments_provider_idx on public.payments(provider);

-- ============================================================
-- WALLET LEDGER
-- Every financial movement is recorded with before/after balances.
-- ============================================================

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallets(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  payment_id uuid references public.payments(id) on delete set null,
  type public.bickri_wallet_transaction_type not null,
  amount bigint not null check (amount > 0),
  balance_before bigint not null check (balance_before >= 0),
  balance_after bigint not null check (balance_after >= 0),
  reference text not null unique,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.wallet_transactions enable row level security;

create index if not exists wallet_transactions_wallet_idx
  on public.wallet_transactions(wallet_id, created_at desc);
create index if not exists wallet_transactions_user_idx
  on public.wallet_transactions(user_id, created_at desc);

-- ============================================================
-- PURCHASES
-- ============================================================

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  book_id uuid not null references public.books(id) on delete restrict,
  payment_id uuid references public.payments(id) on delete set null,
  wallet_transaction_id uuid references public.wallet_transactions(id) on delete set null,
  amount bigint not null check (amount > 0),
  currency text not null default 'XOF',
  status public.bickri_purchase_status not null default 'pending',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.purchases enable row level security;

create index if not exists purchases_user_idx on public.purchases(user_id, created_at desc);
create index if not exists purchases_book_idx on public.purchases(book_id);

-- One completed library entitlement per user/book.
create table if not exists public.user_library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  purchase_id uuid references public.purchases(id) on delete set null,
  access_type text not null default 'purchase',
  created_at timestamptz not null default now(),
  unique(user_id, book_id)
);

alter table public.user_library enable row level security;

create index if not exists user_library_user_idx on public.user_library(user_id);

-- ============================================================
-- PAYMENT WEBHOOK IDEMPOTENCY / AUDIT
-- ============================================================

create table if not exists public.payment_webhooks (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  external_event_id text not null,
  event_type text,
  payload jsonb not null,
  signature_valid boolean not null default false,
  processed boolean not null default false,
  processed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  unique(provider, external_event_id)
);

alter table public.payment_webhooks enable row level security;

-- ============================================================
-- REFUNDS
-- ============================================================

create table if not exists public.refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete restrict,
  purchase_id uuid references public.purchases(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete restrict,
  amount bigint not null check (amount > 0),
  currency text not null default 'XOF',
  reason text,
  status public.bickri_payment_status not null default 'pending',
  external_reference text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

alter table public.refunds enable row level security;

-- ============================================================
-- UPDATED_AT
-- ============================================================

create or replace function public.bickri_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists wallets_updated_at on public.wallets;
create trigger wallets_updated_at
before update on public.wallets
for each row execute function public.bickri_set_updated_at();

-- ============================================================
-- AUTOMATIC WALLET CREATION FOR NEW USERS
-- ============================================================

create or replace function public.bickri_create_wallet_for_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.wallets(user_id, currency, balance, status)
  values(new.id, 'XOF', 0, 'active')
  on conflict(user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_wallet on auth.users;
create trigger on_auth_user_created_wallet
after insert on auth.users
for each row execute function public.bickri_create_wallet_for_user();

-- Backfill wallets for existing accounts.
insert into public.wallets(user_id, currency, balance, status)
select id, 'XOF', 0, 'active'
from auth.users
on conflict(user_id) do nothing;

-- ============================================================
-- SECURE WALLET CREDIT
-- Only trusted server-side code should execute this function.
-- ============================================================

create or replace function public.bickri_credit_wallet(
  p_user_id uuid,
  p_amount bigint,
  p_payment_id uuid,
  p_reference text,
  p_description text default 'Wallet recharge'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_wallet_id uuid;
  v_before bigint;
  v_after bigint;
  v_transaction_id uuid;
begin
  if p_amount <= 0 then
    raise exception 'Amount must be greater than zero';
  end if;

  if not exists (
    select 1 from public.payments
    where id = p_payment_id
      and user_id = p_user_id
      and status = 'successful'
  ) then
    raise exception 'Payment is not a confirmed successful payment';
  end if;

  select id, balance
    into v_wallet_id, v_before
  from public.wallets
  where user_id = p_user_id and status = 'active'
  for update;

  if v_wallet_id is null then
    raise exception 'Active wallet not found';
  end if;

  if exists (select 1 from public.wallet_transactions where reference = p_reference) then
    select id into v_transaction_id
    from public.wallet_transactions
    where reference = p_reference;
    return v_transaction_id;
  end if;

  v_after := v_before + p_amount;

  update public.wallets
  set balance = v_after, updated_at = now()
  where id = v_wallet_id;

  insert into public.wallet_transactions(
    wallet_id, user_id, payment_id, type, amount,
    balance_before, balance_after, reference, description
  )
  values(
    v_wallet_id, p_user_id, p_payment_id, 'deposit', p_amount,
    v_before, v_after, p_reference, p_description
  )
  returning id into v_transaction_id;

  return v_transaction_id;
end;
$$;

-- ============================================================
-- SECURE WALLET DEBIT
-- ============================================================

create or replace function public.bickri_debit_wallet(
  p_user_id uuid,
  p_amount bigint,
  p_reference text,
  p_description text default 'Book purchase'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_wallet_id uuid;
  v_before bigint;
  v_after bigint;
  v_transaction_id uuid;
begin
  if p_amount <= 0 then
    raise exception 'Amount must be greater than zero';
  end if;

  select id, balance
    into v_wallet_id, v_before
  from public.wallets
  where user_id = p_user_id and status = 'active'
  for update;

  if v_wallet_id is null then
    raise exception 'Active wallet not found';
  end if;

  if v_before < p_amount then
    raise exception 'Insufficient wallet balance';
  end if;

  if exists (select 1 from public.wallet_transactions where reference = p_reference) then
    select id into v_transaction_id
    from public.wallet_transactions
    where reference = p_reference;
    return v_transaction_id;
  end if;

  v_after := v_before - p_amount;

  update public.wallets
  set balance = v_after, updated_at = now()
  where id = v_wallet_id;

  insert into public.wallet_transactions(
    wallet_id, user_id, type, amount,
    balance_before, balance_after, reference, description
  )
  values(
    v_wallet_id, p_user_id, 'purchase', p_amount,
    v_before, v_after, p_reference, p_description
  )
  returning id into v_transaction_id;

  return v_transaction_id;
end;
$$;

-- ============================================================
-- RLS: users can read their own financial records.
-- No client-side INSERT/UPDATE/DELETE policies are created for
-- financial tables. Payment/webhook/wallet mutations stay server-side.
-- ============================================================

create policy "users can read own wallet"
on public.wallets
for select to authenticated
using ((select auth.uid()) = user_id);

create policy "users can read own payments"
on public.payments
for select to authenticated
using ((select auth.uid()) = user_id);

create policy "users can read own wallet transactions"
on public.wallet_transactions
for select to authenticated
using ((select auth.uid()) = user_id);

create policy "users can read own purchases"
on public.purchases
for select to authenticated
using ((select auth.uid()) = user_id);

create policy "users can read own library"
on public.user_library
for select to authenticated
using ((select auth.uid()) = user_id);

create policy "users can read own refunds"
on public.refunds
for select to authenticated
using ((select auth.uid()) = user_id);

-- payment_webhooks intentionally has no client policy.

-- ============================================================
-- GRANTS
-- ============================================================

revoke all on function public.bickri_credit_wallet(uuid,bigint,uuid,text,text) from public, anon, authenticated;
revoke all on function public.bickri_debit_wallet(uuid,bigint,text,text) from public, anon, authenticated;

-- ============================================================
-- END BICKRI LIB FINANCE MIGRATION
-- ============================================================
