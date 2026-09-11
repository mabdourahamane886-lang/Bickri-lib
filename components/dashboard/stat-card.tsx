import type { LucideIcon } from "lucide-react";

type StatCardProps = { title:string; value:string; subtitle:string; icon:LucideIcon; color?:string };
export default function StatCard({title,value,subtitle,icon:Icon}:StatCardProps){return <div className="card stat"><div><p className="muted" style={{margin:0,fontSize:13}}>{title}</p><p className="stat-value">{value}</p><p className="muted" style={{margin:0,fontSize:12}}>{subtitle}</p></div><div className="stat-icon"><Icon size={21}/></div></div>}
