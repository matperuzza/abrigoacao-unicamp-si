import test from 'node:test';
import assert from 'node:assert/strict';
import { suggestedCents, findSuggestedAmount, formatBRL } from '../features/donations/data.ts';

test('donations: suggestedCents contém os três valores esperados em centavos', () => {
  assert.deepEqual(suggestedCents, [2000, 5000, 10000]);
});

test('donations: findSuggestedAmount encontra valor válido', () => {
  assert.equal(findSuggestedAmount('2000'), 2000);
  assert.equal(findSuggestedAmount('5000'), 5000);
  assert.equal(findSuggestedAmount('10000'), 10000);
});

test('donations: findSuggestedAmount rejeita valor inválido', () => {
  assert.equal(findSuggestedAmount('1000'), undefined);
  assert.equal(findSuggestedAmount('9999'), undefined);
  assert.equal(findSuggestedAmount('abc'), undefined);
  assert.equal(findSuggestedAmount(''), undefined);
  assert.equal(findSuggestedAmount(undefined), undefined);
});

test('donations: formatBRL formata centavos em BRL corretamente', () => {
  // Intl.NumberFormat usa espaço não separador (NBSP) entre símbolo e valor
  const formatted2000 = formatBRL(2000);
  const formatted5000 = formatBRL(5000);
  const formatted10000 = formatBRL(10000);
  assert.ok(formatted2000.includes('20,00') && formatted2000.includes('R$'));
  assert.ok(formatted5000.includes('50,00') && formatted5000.includes('R$'));
  assert.ok(formatted10000.includes('100,00') && formatted10000.includes('R$'));
  assert.ok(formatBRL(123).includes('1,23') && formatBRL(123).includes('R$'));
  assert.ok(formatBRL(0).includes('0,00') && formatBRL(0).includes('R$'));
});

test('donations: suggestedCents são todos inteiros positivos', () => {
  for (const cents of suggestedCents) {
    assert.ok(Number.isInteger(cents));
    assert.ok(cents > 0);
  }
});

test('donations: suggestedCents não tem duplicatas', () => {
  const unique = new Set(suggestedCents);
  assert.equal(unique.size, suggestedCents.length);
});