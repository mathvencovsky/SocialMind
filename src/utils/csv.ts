
import { LINE_SPLIT } from "./constants";
export type CsvRow = Record<string, string | number | undefined>;
export type CsvParsed = { headers: string[]; rows: CsvRow[] };
export function parseCSV(text: string): CsvParsed {
  const clean = String(text ?? "").trim();
  if (!clean) return { headers: [], rows: [] };
  const [head, ...rows] = clean.split(LINE_SPLIT);
  const headers = head.split(",").map(h => h.trim());
  const parsed = rows.map(r => {
    if (!r) return null;
    const cols = r.split(",");
    if (cols.every(c => c === "")) return null;
    const obj: CsvRow = {};
    headers.forEach((h, i) => {
      const v = cols[i];
      const n = Number(v);
      obj[h] = v === undefined ? "" : (isNaN(n) || v.trim() === "" ? v : n);
    });
    return obj;
  }).filter((x): x is CsvRow => Boolean(x));
  return { headers, rows: parsed };
}
export function joinCSV(rows: CsvRow[]): string {
  if (!rows || !rows.length) return "";
  const headers = Object.keys(rows[0] ?? {});
  return [headers.join(",")]
    .concat(rows.map(r => headers.map(h => r[h] ?? "").join(",")))
    .join("\n");
}
