import test from 'node:test';
import assert from 'node:assert/strict';

const mockStorage = new Map();
const STORAGE_KEY = 'abrigoacao.transitions.v1';
const SCHEMA_VERSION = 1;

const mockAsyncStorage = {
  getItem: async (key) => mockStorage.get(key) ?? null,
  setItem: async (key, value) => { mockStorage.set(key, value); },
  removeItem: async (key) => { mockStorage.delete(key); },
  clear: async () => { mockStorage.clear(); },
};

let originalGetItem;
let originalSetItem;

async function withMockStorage(fn) {
  const mod = await import('@react-native-async-storage/async-storage');
  const storage = mod.default || mod;
  originalGetItem = storage.getItem;
  originalSetItem = storage.setItem;
  storage.getItem = mockAsyncStorage.getItem;
  storage.setItem = mockAsyncStorage.setItem;
  try {
    return await fn();
  } finally {
    storage.getItem = originalGetItem;
    storage.setItem = originalSetItem;
  }
}

function resetMockStorage() {
  mockStorage.clear();
}

async function loadTransitionsReal() {
  return withMockStorage(async () => {
    const { loadTransitions } = await import('../services/transitions.ts');
    return loadTransitions();
  });
}

async function createTransitionReal(projectId, responsible, pending, learnings, profile) {
  return withMockStorage(async () => {
    const { createTransition } = await import('../services/transitions.ts');
    return createTransition(projectId, responsible, pending, learnings, profile);
  });
}

async function getTransitionsByProjectReal(projectId) {
  return withMockStorage(async () => {
    const { getTransitionsByProject } = await import('../services/transitions.ts');
    return getTransitionsByProject(projectId);
  });
}

async function findProjectTransitionsReal(projectId) {
  return withMockStorage(async () => {
    const { findProjectTransitions } = await import('../services/transitions.ts');
    return findProjectTransitions(projectId);
  });
}

async function validateTransitionInputReal(projectId, responsible, pending, learnings) {
  return withMockStorage(async () => {
    const { validateTransitionInput } = await import('../services/transitions.ts');
    return validateTransitionInput(projectId, responsible, pending, learnings);
  });
}

test('transitions: validar entrada rejeita responsável vazio', async () => {
  const result = await validateTransitionInputReal('proj-1', '', 'pendência', 'aprendizado');
  assert.equal(result.valid, false);
  assert.match(result.error ?? '', /responsável/);
});

test('transitions: validar entrada rejeita sem pendências nem aprendizados', async () => {
  const result = await validateTransitionInputReal('proj-1', 'Responsável', '', '');
  assert.equal(result.valid, false);
  assert.match(result.error ?? '', /pendência|aprendizado/);
});

test('transitions: validar entrada aceita responsável e pendência', async () => {
  const result = await validateTransitionInputReal('proj-1', 'João', 'Pendência 1', '');
  assert.equal(result.valid, true);
});

test('transitions: validar entrada aceita responsável e aprendizado', async () => {
  const result = await validateTransitionInputReal('proj-1', 'João', '', 'Aprendizado 1');
  assert.equal(result.valid, true);
});

test('transitions: validar entrada rejeita projeto vazio', async () => {
  const result = await validateTransitionInputReal('', 'João', 'Pendência', '');
  assert.equal(result.valid, false);
  assert.match(result.error ?? '', /Projeto não identificado/);
});

test('transitions: criar transição gera ID único e autor correto', async () => {
  resetMockStorage();
  const record = await createTransitionReal('proj-1', 'João Silva', 'Pendência A', 'Aprendizado B', 'Voluntário');
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
  const record = await createTransitionReal('proj-1', 'Maria', 'Pendência', 'Aprendizado', 'Coordenação');
  assert.equal(record.author, 'Coordenação (demo)');
});

test('transitions: múltiplas transições preservam histórico', async () => {
  resetMockStorage();
  await createTransitionReal('proj-1', 'João', 'Pendência 1', '', 'Voluntário');
  await new Promise(r => setTimeout(r, 10));
  await createTransitionReal('proj-1', 'Maria', '', 'Aprendizado 1', 'Coordenação');
  await new Promise(r => setTimeout(r, 10));
  await createTransitionReal('proj-1', 'Pedro', 'Pendência 2', 'Aprendizado 2', 'Voluntário');

  const records = await getTransitionsByProjectReal('proj-1');
  assert.equal(records.length, 3);
  assert.equal(records[0].author, 'Voluntário (demo)');
  assert.equal(records[1].author, 'Coordenação (demo)');
  assert.equal(records[2].author, 'Voluntário (demo)');
});

test('transitions: histórico ordenado por data decrescente', async () => {
  resetMockStorage();
  await createTransitionReal('proj-1', 'Primeiro', 'P', '', 'Voluntário');
  await new Promise(r => setTimeout(r, 10));
  await createTransitionReal('proj-1', 'Segundo', 'P', '', 'Voluntário');
  await new Promise(r => setTimeout(r, 10));
  await createTransitionReal('proj-1', 'Terceiro', 'P', '', 'Voluntário');

  const records = await getTransitionsByProjectReal('proj-1');
  assert.equal(records[0].responsible, 'Terceiro');
  assert.equal(records[1].responsible, 'Segundo');
  assert.equal(records[2].responsible, 'Primeiro');
});

test('transitions: projetos diferentes têm históricos isolados', async () => {
  resetMockStorage();
  await createTransitionReal('proj-1', 'João', 'P1', '', 'Voluntário');
  await createTransitionReal('proj-2', 'Maria', 'P2', '', 'Coordenação');

  const records1 = await getTransitionsByProjectReal('proj-1');
  const records2 = await getTransitionsByProjectReal('proj-2');

  assert.equal(records1.length, 1);
  assert.equal(records2.length, 1);
  assert.equal(records1[0].responsible, 'João');
  assert.equal(records2[0].responsible, 'Maria');
});

test('transitions: reabertura recupera dados sem duplicar', async () => {
  resetMockStorage();
  await createTransitionReal('proj-1', 'João', 'Pendência', '', 'Voluntário');
  const count1 = (await getTransitionsByProjectReal('proj-1')).length;
  const count2 = (await getTransitionsByProjectReal('proj-1')).length;
  assert.equal(count1, count2);
  assert.equal(count1, 1);
});

test('transitions: armazenamento ausente retorna array vazio', async () => {
  resetMockStorage();
  const records = await loadTransitionsReal();
  assert.ok(Array.isArray(records));
  assert.equal(records.length, 0);
});

test('transitions: JSON inválido lança erro e não apaga armazenamento', async () => {
  resetMockStorage();
  mockStorage.set(STORAGE_KEY, 'dados inválidos {');
  try {
    await loadTransitionsReal();
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /corrompidos|PARSE_ERROR/);
  }
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.equal(stillStored, 'dados inválidos {');
});

test('transitions: estrutura inválida lança erro e não apaga armazenamento', async () => {
  resetMockStorage();
  const badPayload = { schemaVersion: SCHEMA_VERSION, records: 'não é array', updatedAt: new Date().toISOString() };
  mockStorage.set(STORAGE_KEY, JSON.stringify(badPayload));
  try {
    await loadTransitionsReal();
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /inválida|INVALID_STRUCTURE/);
  }
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.ok(stillStored.includes('não é array'));
});

test('transitions: schema version incompatível lança erro e não apaga armazenamento', async () => {
  resetMockStorage();
  const oldPayload = { schemaVersion: 999, records: [], updatedAt: new Date().toISOString() };
  mockStorage.set(STORAGE_KEY, JSON.stringify(oldPayload));
  try {
    await loadTransitionsReal();
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /incompatível|SCHEMA_MISMATCH/);
  }
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.ok(stillStored.includes('999'));
});

test('transitions: registro com campos inválidos lança erro', async () => {
  resetMockStorage();
  const badPayload = {
    schemaVersion: SCHEMA_VERSION,
    records: [{ id: '1', projectId: 'p1', responsible: 'R', pending: 'P', learnings: 'L', author: 'A' }],
    updatedAt: new Date().toISOString()
  };
  mockStorage.set(STORAGE_KEY, JSON.stringify(badPayload));
  try {
    await loadTransitionsReal();
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /inválido|INVALID_CONTENT/);
  }
});

test('transitions: falha de gravação não perde registros anteriores', async () => {
  resetMockStorage();
  await createTransitionReal('proj-1', 'João', 'P1', '', 'Voluntário');
  const originalData = mockStorage.get(STORAGE_KEY);

  const originalSetItem = mockAsyncStorage.setItem;
  mockAsyncStorage.setItem = async () => { throw new Error('Falha simulada'); };

  try {
    await createTransitionReal('proj-1', 'Maria', 'P2', '', 'Voluntário');
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /gravar|WRITE_ERROR/);
  }

  mockAsyncStorage.setItem = originalSetItem;

  const afterFailure = mockStorage.get(STORAGE_KEY);
  assert.deepEqual(afterFailure, originalData);
});

test('transitions: createTransition falha se loadTransitions falhar', async () => {
  resetMockStorage();
  mockStorage.set(STORAGE_KEY, 'dados inválidos {');
  try {
    await createTransitionReal('proj-1', 'Teste', 'Pendência', 'Aprendizado', 'Voluntário');
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /corrompidos|PARSE_ERROR/);
  }
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.equal(stillStored, 'dados inválidos {');
});

test('transitions: findProjectTransitions com ID inválido retorna array vazio', async () => {
  resetMockStorage();
  const result = await findProjectTransitionsReal('inexistente');
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 0);
  const result2 = await findProjectTransitionsReal(undefined);
  assert.equal(result2.length, 0);
});