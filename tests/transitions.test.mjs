import test from 'node:test';
import assert from 'node:assert/strict';

const mockStorage = new Map();

const STORAGE_KEY = 'abrigoacao.transitions.v1';
const SCHEMA_VERSION = 1;

function generateTransitionId() {
  return `tr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getDemoAuthor(profile) {
  return `${profile} (demo)`;
}

function formatDateTimeForStorage(date) {
  return date.toISOString();
}

function validateTransitionInput(projectId, responsible, pending, learnings) {
  const resp = responsible.trim();
  const pend = pending.trim();
  const learn = learnings.trim();

  if (!resp) {
    return { valid: false, error: 'Informe o responsável pela continuidade.' };
  }
  if (!pend && !learn) {
    return { valid: false, error: 'Informe ao menos uma pendência ou um aprendizado.' };
  }
  if (!projectId) {
    return { valid: false, error: 'Projeto não identificado.' };
  }
  return { valid: true };
}

function validateStored(data) {
  if (!data || typeof data !== 'object') return false;
  const d = data;
  return (
    typeof d.schemaVersion === 'number' &&
    d.schemaVersion === SCHEMA_VERSION &&
    Array.isArray(d.records) &&
    typeof d.updatedAt === 'string'
  );
}

async function loadTransitions() {
  try {
    const stored = mockStorage.get(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    if (!validateStored(parsed)) {
      return [];
    }
    return parsed.records;
  } catch {
    return [];
  }
}

async function saveTransitions(records) {
  const payload = {
    schemaVersion: SCHEMA_VERSION,
    records,
    updatedAt: new Date().toISOString(),
  };
  mockStorage.set(STORAGE_KEY, JSON.stringify(payload));
}

async function createTransition(projectId, responsible, pending, learnings, profile) {
  const records = await loadTransitions();
  const now = new Date();
  const record = {
    id: generateTransitionId(),
    projectId,
    responsible: responsible.trim(),
    pending: pending.trim(),
    learnings: learnings.trim(),
    author: getDemoAuthor(profile),
    createdAt: formatDateTimeForStorage(now),
  };
  const updated = [...records, record];
  await saveTransitions(updated);
  return record;
}

async function getTransitionsByProject(projectId) {
  const records = await loadTransitions();
  return records
    .filter((r) => r.projectId === projectId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function findProjectTransitions(projectId) {
  if (!projectId) return [];
  return getTransitionsByProject(projectId);
}

function resetMockStorage() {
  mockStorage.clear();
}

test('transitions: validar entrada rejeita responsável vazio', () => {
  const result = validateTransitionInput('proj-1', '', 'pendência', 'aprendizado');
  assert.equal(result.valid, false);
  assert.match(result.error ?? '', /responsável/);
});

test('transitions: validar entrada rejeita sem pendências nem aprendizados', () => {
  const result = validateTransitionInput('proj-1', 'Responsável', '', '');
  assert.equal(result.valid, false);
  assert.match(result.error ?? '', /pendência|aprendizado/);
});

test('transitions: validar entrada aceita responsável e pendência', () => {
  const result = validateTransitionInput('proj-1', 'João', 'Pendência 1', '');
  assert.equal(result.valid, true);
});

test('transitions: validar entrada aceita responsável e aprendizado', () => {
  const result = validateTransitionInput('proj-1', 'João', '', 'Aprendizado 1');
  assert.equal(result.valid, true);
});

test('transitions: validar entrada rejeita projeto vazio', () => {
  const result = validateTransitionInput('', 'João', 'Pendência', '');
  assert.equal(result.valid, false);
  assert.match(result.error ?? '', /Projeto não identificado/);
});

test('transitions: criar transição gera ID único e autor correto', async () => {
  resetMockStorage();
  const record = await createTransition('proj-1', 'João Silva', 'Pendência A', 'Aprendizado B', 'Voluntário');
  assert.ok(record.id.startsWith('tr-'));
  assert.equal(record.projectId, 'proj-1');
  assert.equal(record.responsible, 'João Silva');
  assert.equal(record.pending, 'Pendência A');
  assert.equal(record.learnings, 'Aprendizado B');
  assert.equal(record.author, 'Voluntário (demo)');
  assert.ok(record.createdAt.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/));
});

test('transitions: autor reflete perfil Coordenação', async () => {
  resetMockStorage();
  const record = await createTransition('proj-1', 'Maria', 'Pendência', 'Aprendizado', 'Coordenação');
  assert.equal(record.author, 'Coordenação (demo)');
});

test('transitions: múltiplas transições preservam histórico', async () => {
  resetMockStorage();
  await createTransition('proj-1', 'João', 'Pendência 1', '', 'Voluntário');
  await createTransition('proj-1', 'Maria', '', 'Aprendizado 1', 'Coordenação');
  await createTransition('proj-1', 'Pedro', 'Pendência 2', 'Aprendizado 2', 'Voluntário');

  const records = await getTransitionsByProject('proj-1');
  assert.equal(records.length, 3);
  assert.equal(records[0].author, 'Voluntário (demo)');
  assert.equal(records[1].author, 'Coordenação (demo)');
  assert.equal(records[2].author, 'Voluntário (demo)');
});

test('transitions: histórico ordenado por data decrescente', async () => {
  resetMockStorage();
  await createTransition('proj-1', 'Primeiro', 'P', '', 'Voluntário');
  await new Promise(r => setTimeout(r, 10));
  await createTransition('proj-1', 'Segundo', 'P', '', 'Voluntário');
  await new Promise(r => setTimeout(r, 10));
  await createTransition('proj-1', 'Terceiro', 'P', '', 'Voluntário');

  const records = await getTransitionsByProject('proj-1');
  assert.equal(records[0].responsible, 'Terceiro');
  assert.equal(records[1].responsible, 'Segundo');
  assert.equal(records[2].responsible, 'Primeiro');
});

test('transitions: projetos diferentes têm históricos isolados', async () => {
  resetMockStorage();
  await createTransition('proj-1', 'João', 'P1', '', 'Voluntário');
  await createTransition('proj-2', 'Maria', 'P2', '', 'Coordenação');

  const records1 = await getTransitionsByProject('proj-1');
  const records2 = await getTransitionsByProject('proj-2');

  assert.equal(records1.length, 1);
  assert.equal(records2.length, 1);
  assert.equal(records1[0].responsible, 'João');
  assert.equal(records2[0].responsible, 'Maria');
});

test('transitions: reabertura recupera dados sem duplicar', async () => {
  resetMockStorage();
  await createTransition('proj-1', 'João', 'Pendência', '', 'Voluntário');
  const count1 = (await getTransitionsByProject('proj-1')).length;
  const count2 = (await getTransitionsByProject('proj-1')).length;
  assert.equal(count1, count2);
  assert.equal(count1, 1);
});

test('transitions: armazenamento ausente retorna array vazio', async () => {
  resetMockStorage();
  const records = await loadTransitions();
  assert.ok(Array.isArray(records));
  assert.equal(records.length, 0);
});

test('transitions: JSON inválido não apaga armazenamento', async () => {
  resetMockStorage();
  mockStorage.set(STORAGE_KEY, 'dados inválidos {');
  const records = await loadTransitions();
  assert.ok(Array.isArray(records));
  assert.equal(records.length, 0);
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.equal(stillStored, 'dados inválidos {');
});

test('transitions: estrutura inválida não apaga armazenamento', async () => {
  resetMockStorage();
  const badPayload = { schemaVersion: SCHEMA_VERSION, records: 'não é array', updatedAt: new Date().toISOString() };
  mockStorage.set(STORAGE_KEY, JSON.stringify(badPayload));
  const records = await loadTransitions();
  assert.ok(Array.isArray(records));
  assert.equal(records.length, 0);
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.ok(stillStored.includes('não é array'));
});

test('transitions: schema version incompatível não apaga armazenamento', async () => {
  resetMockStorage();
  const oldPayload = { schemaVersion: 999, records: [], updatedAt: new Date().toISOString() };
  mockStorage.set(STORAGE_KEY, JSON.stringify(oldPayload));
  const records = await loadTransitions();
  assert.ok(Array.isArray(records));
  assert.equal(records.length, 0);
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.ok(stillStored.includes('999'));
});

test('transitions: falha de gravação não perde registros anteriores', async () => {
  resetMockStorage();
  await createTransition('proj-1', 'João', 'P1', '', 'Voluntário');
  const originalRecords = await loadTransitions();

  const originalSetItem = mockStorage.set.bind(mockStorage);
  mockStorage.set = () => { throw new Error('Falha simulada'); };

  try {
    await createTransition('proj-1', 'Maria', 'P2', '', 'Voluntário');
  } catch {
  }

  mockStorage.set = originalSetItem;
  const recordsAfterFailure = await loadTransitions();
  assert.equal(recordsAfterFailure.length, originalRecords.length);
  assert.equal(recordsAfterFailure[0].responsible, 'João');
});

test('transitions: findProjectTransitions com ID inválido retorna array vazio', async () => {
  resetMockStorage();
  const result = await findProjectTransitions('inexistente');
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 0);
  const result2 = await findProjectTransitions(undefined);
  assert.equal(result2.length, 0);
});