"use client";

import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type Book = {
  id: number | string;
  title: string;
  author: string;
  category: string;
  price: string;
  cover: string;
  rating: number;
  premium?: boolean;
};

export default function BookCard({ book }: { book: Book }) {
  const [favorite, setFavorite] = useState(false);

  return (
    <article className="group min-w-[185px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-w-0">
      <div className="relative h-56 overflow-hidden bg-slate-200">
        <img
          src={book.cover}
          alt={`Couverture de ${book.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
              book.premium
                ? "bg-[#d9a441] text-[#071a33]"
                : "bg-emerald-500 text-white"
            }`}
          >
            {book.premium ? "Premium" : "Gratuit"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setFavorite((value) => !value)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:scale-105"
          aria-label={
            favorite
              ? `Retirer ${book.title} des favoris`
              : `Ajouter ${book.title} aux favoris`
          }
          aria-pressed={favorite}
        >
          <Heart
            size={17}
            className={favorite ? "fill-red-500 text-red-500" : "text-slate-700"}
          />
        </button>
      </div>

      <div className="p-4">
        <p className="mb-1 text-xs font-medium text-[#d09a32]">
          {book.category}
        </p>

        <h3 className="line-clamp-2 min-h-[42px] text-sm font-bold text-[#071a33]">
          {book.title}
        </h3>

        <p className="mt-1 truncate text-xs text-slate-500">{book.author}</p>

        <div className="mt-3 flex items-center justify-between">
          <div
            className="flex items-center gap-1 text-xs text-slate-600"
            aria-label={`Note ${book.rating} sur 5`}
          >
            <Star size={14} className="fill-[#d9a441] text-[#d9a441]" />
            {book.rating}
          </div>

          <span className="text-sm font-bold text-[#071a33]">
            {book.price}
          </span>
        </div>

        <Link
          href={`/books/${book.id}`}
          className="mt-3 block w-full rounded-xl bg-[#071a33] py-2.5 text-center text-xs font-bold text-white transition hover:bg-[#0d2a4d] focus:outline-none focus:ring-2 focus:ring-[#d9a441] focus:ring-offset-2"
        >
          Voir le livre
        </Link>
      </div>
    </article>
  );
}
