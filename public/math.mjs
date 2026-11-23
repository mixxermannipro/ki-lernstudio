export const number = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 4 });
export const fmt = value => value === null ? 'nicht definiert' : number.format(value);
export const pct = value => value === null ? 'nicht definiert' : fmt(100 * value) + ' %';
export const sigmoid = z => 1 / (1 + Math.exp(-z));
export const ratio = (a, b) => b === 0 ? null : a / b;
export const mean = xs => xs.reduce((a, b) => a + b, 0) / xs.length;
export const gini = (a, b) => a + b === 0 ? 0 : 1 - (a / (a + b)) ** 2 - (b / (a + b)) ** 2;
export const entropy = (a, b) => [a, b].reduce((h, n) => n ? h - n / (a + b) * Math.log2(n / (a + b)) : h, 0);
const median = xs => xs.length % 2 ? xs[(xs.length - 1) / 2] : mean(xs.slice(xs.length / 2 - 1, xs.length / 2 + 1));
export function distribution(values) {
  const xs = [...values].sort((a, b) => a - b);
  const mid = Math.floor(xs.length / 2);
  const q2 = median(xs);
  const q1 = mid ? median(xs.slice(0, mid)) : q2;
  const q3 = mid ? median(xs.slice(Math.ceil(xs.length / 2))) : q2;
  const iqr = q3 - q1;
  const fences = [q1 - 1.5 * iqr, q3 + 1.5 * iqr];
  const inside = xs.filter(x => x >= fences[0] && x <= fences[1]);
  const average = mean(xs);
  const squares = xs.reduce((sum, x) => sum + (x - average) ** 2, 0);
  return { xs, q1, q2, q3, iqr, fences, whiskers: [inside[0], inside.at(-1)], outliers: xs.filter(x => !inside.includes(x)), average, variance: squares / xs.length, sampleVariance: ratio(squares, xs.length - 1) };
}
export function metrics(tp, fp, fn, tn) {
  return [ratio(tp + tn, tp + fp + fn + tn), ratio(tp, tp + fp), ratio(tp, tp + fn), ratio(2 * tp, 2 * tp + fp + fn)];
}

export function parseNumber(text) {
  const normalized = text.trim().replace('−','-').replace(',','.');
  if(!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalized))return null;
  const value=Number(normalized);
  return Number.isFinite(value)?value:null;
}

export function parseSeries(text) {
  const lexemes=text.trim().split(/[;\s]+/);
  if(lexemes.length<2||lexemes.length>24)return null;
  const values=lexemes.map(parseNumber);
  return values.some(value=>value===null||Math.abs(value)>1e6)?null:values;
}
