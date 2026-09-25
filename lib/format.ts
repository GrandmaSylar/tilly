export function cedis(amount: number) {
  return `GH₵${amount.toLocaleString("en-GH")}`;
}

export function discountPercent(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
