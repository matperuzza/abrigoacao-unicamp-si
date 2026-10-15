// Intenções ilustrativas, não receitas: valores monetários em centavos inteiros.
export const suggestedCents = [2000, 5000, 10000];

export function findSuggestedAmount(raw: string | undefined) {
  return suggestedCents.find(value => String(value) === raw);
}

export function formatBRL(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}
