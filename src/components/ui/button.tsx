
import React from "react";
import clsx from "clsx";
export function Button({ children, variant = "default", className = "", ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "outline" }) {
  const base = "px-3 py-2 rounded-xl text-sm font-medium transition border";
  const styles = {
    default: "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700",
    secondary: "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200",
    outline: "bg-white text-gray-900 border-gray-300 hover:bg-gray-50",
  }[variant];
  return <button className={clsx(base, styles, className)} {...props}>{children}</button>;
}
