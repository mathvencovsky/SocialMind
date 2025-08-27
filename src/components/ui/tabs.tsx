
import React, { createContext, useContext, useState } from "react";
type Ctx = { value: string; setValue: (v: string)=>void };
const TabsCtx = createContext<Ctx | null>(null);
export function Tabs({ defaultValue, className = "", children }:
  React.PropsWithChildren<{ defaultValue: string; className?: string }>) {
  const [value, setValue] = useState(defaultValue);
  return <div className={className}><TabsCtx.Provider value={{ value, setValue }}>{children}</TabsCtx.Provider></div>;
}
export function TabsList({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-xl bg-white border p-1 flex gap-2 ${className}`}>{children}</div>;
}
export function TabsTrigger({ value, children }:{ value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsCtx)!;
  const active = ctx.value === value;
  return (
    <button onClick={()=>ctx.setValue(value)}
      className={`px-3 py-2 text-sm rounded-lg ${active? "bg-indigo-600 text-white":"text-gray-700 hover:bg-gray-100"}`}>
      {children}
    </button>
  );
}
export function TabsContent({ value, className = "", children }:
  React.PropsWithChildren<{ value: string; className?: string }>) {
  const ctx = useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}
