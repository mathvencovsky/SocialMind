
import React from "react";

type SelectProps = {
  value?: string;
  onValueChange?: (v: string) => void;
  children?: React.ReactNode;
};

type SelectItemProps = { value: string; children?: React.ReactNode };
type SelectItemComponent = React.FC<SelectItemProps> & { displayName?: string };

export function Select({ value, onValueChange, children }: SelectProps) {
  const items: { value: string; label: string }[] = [];

  const isSelectItem = (el: unknown): el is React.ReactElement<SelectItemProps> & { type: SelectItemComponent } => {
    return Boolean(
      el &&
        typeof el === "object" &&
        (el as any).type && // eslint-disable-line @typescript-eslint/no-explicit-any
        (el as any).type.displayName === "SelectItem" // eslint-disable-line @typescript-eslint/no-explicit-any
    );
  };

  function crawl(node: React.ReactNode): void {
    React.Children.forEach(node, (child) => {
      if (!child) return;
      if (isSelectItem(child)) {
        items.push({ value: String(child.props.value), label: String(child.props.children) });
      } else if (React.isValidElement(child) && child.props && "children" in child.props) {
        crawl(child.props.children as React.ReactNode);
      }
    });
  }

  crawl(children);

  return (
    <select
      value={value ?? ""}
      onChange={(e)=> onValueChange && onValueChange(e.target.value)}
      className="w-full px-3 py-2 rounded-xl border bg-white"
    >
      <option value="" disabled hidden>Selecionar...</option>
      {items.map(it => <option key={it.value} value={it.value}>{it.label}</option>)}
    </select>
  );
}

export function SelectTrigger({ children }: React.PropsWithChildren) { return <>{children}</>; }
export function SelectContent({ children }: React.PropsWithChildren) { return <>{children}</>; }
export function SelectValue({ placeholder }: { placeholder?: string }) { return <span className="text-sm text-gray-500">{placeholder}</span>; }

export function SelectItem({ children }: React.PropsWithChildren<SelectItemProps>) { return <>{children}</>; }
(SelectItem as unknown as SelectItemComponent).displayName = "SelectItem";
