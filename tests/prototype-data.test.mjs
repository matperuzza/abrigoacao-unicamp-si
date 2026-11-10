import test from 'node:test';
import assert from 'node:assert/strict';
import { projects, findProject } from '../features/projects/data.ts';
import { findSuggestedAmount, formatBRL } from '../features/donations/data.ts';

test('endereços inválidos não exibem silenciosamente outro registro', () => {
  for (const invalid of [undefined, '', 'inexistente', '999', '__proto__']) {
    assert.equal(findProject(invalid), undefined);
  }
});

test('todos os projetos de lista têm detalhes próprios e estado vazio demonstrável', () => {
  assert.equal(new Set(projects.map(project => project.id)).size, projects.length);
  for (const project of projects) {
    assert.equal(findProject(project.id)?.title, project.title);
    assert.ok(project.objective.trim());
    assert.ok(project.progress >= 0 && project.progress <= 100);
    assert.ok(project.overdue <= project.pending.length);
  }
  assert.ok(projects.some(project => project.pending.length === 0));
  assert.equal(findProject('4').title, 'Projeto Luz no Lar');
  assert.equal(findProject('5').title, 'Jardim Solidário');
});

test('resumo rejeita valores arbitrários e não confunde reais com centavos', () => {
  assert.equal(findSuggestedAmount('2000'), 2000);
  assert.equal(findSuggestedAmount('5000'), 5000);
  assert.equal(findSuggestedAmount('10000'), 10000);
  for (const invalid of [undefined, '', '20', '-2000', '2000.0', '2000x', 'Infinity', 'NaN']) {
    assert.equal(findSuggestedAmount(invalid), undefined);
  }
  assert.equal(formatBRL(2000).replace(/\s/g, ''), 'R$20,00');
});