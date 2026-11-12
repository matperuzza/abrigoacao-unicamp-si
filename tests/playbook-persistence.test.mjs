import test from 'node:test';
import assert from 'node:assert/strict';

const mockStorage = new Map();
const STORAGE_KEY = 'abrigoacao.playbook.v1';
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

async function loadPlaybookReal() {
  return withMockStorage(async () => {
    const { loadPlaybook } = await import('../services/playbook.ts');
    return loadPlaybook();
  });
}

async function createEntryReal(title, category, content, summary, profile = 'Voluntário') {
  return withMockStorage(async () => {
    const { createEntry } = await import('../services/playbook.ts');
    return createEntry(title, category, content, summary, profile);
  });
}

async function updateEntryReal(id, title, category, content, summary, profile = 'Voluntário') {
  return withMockStorage(async () => {
    const { updateEntry } = await import('../services/playbook.ts');
    return updateEntry(id, title, category, content, summary, profile);
  });
}

async function findEntryReal(id) {
  return withMockStorage(async () => {
    const { findEntry } = await import('../services/playbook.ts');
    return findEntry(id);
  });
}

test('playbook: inicialização cria exemplos e persiste', async () => {
  resetMockStorage();
  const entries = await loadPlaybookReal();
  assert.ok(entries.length >= 6);
  const stored = mockStorage.get(STORAGE_KEY);
  assert.ok(stored);
  const parsed = JSON.parse(stored);
  assert.equal(parsed.schemaVersion, SCHEMA_VERSION);
  assert.ok(Array.isArray(parsed.entries));
});

test('playbook: reabertura recupera dados sem duplicar exemplos', async () => {
  resetMockStorage();
  const firstLoad = await loadPlaybookReal();
  const firstCount = firstLoad.length;
  const secondLoad = await loadPlaybookReal();
  assert.equal(secondLoad.length, firstCount);
  const stored = mockStorage.get(STORAGE_KEY);
  const parsed = JSON.parse(stored);
  assert.equal(parsed.entries.length, firstCount);
});

test('playbook: criação de documento gera ID único e versão inicial', async () => {
  resetMockStorage();
  const newEntry = await createEntryReal('Novo procedimento', 'Integração', 'Conteúdo do procedimento', 'Criação inicial.');
  assert.ok(newEntry.id);
  assert.equal(newEntry.title, 'Novo procedimento');
  assert.equal(newEntry.category, 'Integração');
  assert.equal(newEntry.versions.length, 1);
  assert.equal(newEntry.versions[0].version, 1);
  assert.equal(newEntry.versions[0].title, 'Novo procedimento');
  assert.equal(newEntry.versions[0].category, 'Integração');
  assert.equal(newEntry.versions[0].content, 'Conteúdo do procedimento');
  assert.match(newEntry.versions[0].author, /demo/);
  assert.ok(newEntry.versions[0].date.match(/^\d{4}-\d{2}-\d{2}$/));
});

test('playbook: edição cria nova versão preservando anterior', async () => {
  resetMockStorage();
  const created = await createEntryReal('Doc para editar', 'Integração', 'Conteúdo original', 'Criação.');
  const updated = await updateEntryReal(created.id, 'Doc para editar', 'Integração', 'Conteúdo alterado', 'Atualização de conteúdo.');
  assert.ok(updated);
  assert.equal(updated.versions.length, 2);
  assert.equal(updated.versions[0].version, 2);
  assert.equal(updated.versions[0].content, 'Conteúdo alterado');
  assert.equal(updated.versions[1].version, 1);
  assert.equal(updated.versions[1].content, 'Conteúdo original');
});

test('playbook: edição sem alterações não cria nova versão', async () => {
  resetMockStorage();
  const created = await createEntryReal('Sem mudança', 'Integração', 'Conteúdo', 'Criação.');
  const before = await findEntryReal(created.id);
  const updated = await updateEntryReal(created.id, 'Sem mudança', 'Integração', 'Conteúdo', 'Resumo.');
  assert.ok(updated);
  assert.equal(updated.versions.length, 1);
  assert.equal(updated.id, before.id);
});

test('playbook: atualização de título e categoria é versionada', async () => {
  resetMockStorage();
  const created = await createEntryReal('Título original', 'Integração', 'Conteúdo', 'Criação.');
  const updated = await updateEntryReal(created.id, 'Título novo', 'Procedimentos de campo', 'Conteúdo', 'Título e categoria alterados.');
  assert.ok(updated);
  assert.equal(updated.title, 'Título novo');
  assert.equal(updated.category, 'Procedimentos de campo');
  assert.equal(updated.versions[0].title, 'Título novo');
  assert.equal(updated.versions[0].category, 'Procedimentos de campo');
  assert.equal(updated.versions[1].title, 'Título original');
  assert.equal(updated.versions[1].category, 'Integração');
});

test('playbook: ID inexistente retorna null na atualização', async () => {
  resetMockStorage();
  const result = await updateEntryReal('id-inexistente', 'Título', 'Integração', 'Conteúdo', 'Resumo');
  assert.equal(result, null);
});

test('playbook: busca por ID inexistente retorna undefined', async () => {
  resetMockStorage();
  const result = await findEntryReal('id-inexistente');
  assert.equal(result, undefined);
  const result2 = await findEntryReal(undefined);
  assert.equal(result2, undefined);
});

test('playbook: falha de leitura (JSON inválido) lança erro e não apaga armazenamento', async () => {
  resetMockStorage();
  mockStorage.set(STORAGE_KEY, 'dados inválidos {');
  try {
    await loadPlaybookReal();
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /corrompidos|PARSE_ERROR/);
  }
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.equal(stillStored, 'dados inválidos {');
});

test('playbook: schema version incompatível lança erro e não apaga armazenamento', async () => {
  resetMockStorage();
  const oldPayload = { schemaVersion: 999, entries: [], updatedAt: new Date().toISOString() };
  mockStorage.set(STORAGE_KEY, JSON.stringify(oldPayload));
  try {
    await loadPlaybookReal();
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /incompatível|SCHEMA_MISMATCH/);
  }
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.ok(stillStored.includes('999'));
});

test('playbook: entradas com array inválido lança erro e não apaga armazenamento', async () => {
  resetMockStorage();
  const badPayload = { schemaVersion: SCHEMA_VERSION, entries: 'não é array', updatedAt: new Date().toISOString() };
  mockStorage.set(STORAGE_KEY, JSON.stringify(badPayload));
  try {
    await loadPlaybookReal();
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /inválida|INVALID_STRUCTURE/);
  }
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.ok(stillStored.includes('não é array'));
});

test('playbook: entrada com versão inválida lança erro', async () => {
  resetMockStorage();
  const badPayload = {
    schemaVersion: SCHEMA_VERSION,
    entries: [{
      id: '1',
      title: 'Test',
      category: 'Integração',
      versions: [{ version: 1, author: 'Test', date: '2024-01-01', summary: 'Test', title: 'Test', category: 'Integração' }]
    }],
    updatedAt: new Date().toISOString()
  };
  mockStorage.set(STORAGE_KEY, JSON.stringify(badPayload));
  try {
    await loadPlaybookReal();
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /inválido|INVALID_CONTENT/);
  }
});

test('playbook: createEntry falha se loadPlaybook falhar', async () => {
  resetMockStorage();
  mockStorage.set(STORAGE_KEY, 'dados inválidos {');
  try {
    await createEntryReal('Teste', 'Integração', 'Conteúdo', 'Resumo');
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /corrompidos|PARSE_ERROR/);
  }
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.equal(stillStored, 'dados inválidos {');
});

test('playbook: updateEntry falha se loadPlaybook falhar', async () => {
  resetMockStorage();
  mockStorage.set(STORAGE_KEY, 'dados inválidos {');
  try {
    await updateEntryReal('id-inexistente', 'Teste', 'Integração', 'Conteúdo', 'Resumo');
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /corrompidos|PARSE_ERROR/);
  }
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.equal(stillStored, 'dados inválidos {');
});

test('playbook: falha de gravação preserva dados anteriores', async () => {
  resetMockStorage();
  await createEntryReal('Original', 'Integração', 'Conteúdo original', 'Criação.');
  const originalData = mockStorage.get(STORAGE_KEY);

  const originalSetItem = mockAsyncStorage.setItem;
  mockAsyncStorage.setItem = async () => { throw new Error('Falha simulada'); };

  try {
    await createEntryReal('Novo', 'Integração', 'Conteúdo novo', 'Criação.');
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /gravar|WRITE_ERROR/);
  }

  mockAsyncStorage.setItem = originalSetItem;

  const afterFailure = mockStorage.get(STORAGE_KEY);
  assert.deepEqual(afterFailure, originalData);
});

test('playbook: validação de conteúdo rejeita categoria inválida', async () => {
  resetMockStorage();
  const badPayload = {
    schemaVersion: SCHEMA_VERSION,
    entries: [{
      id: '1',
      title: 'Test',
      category: 'Categoria Inválida',
      versions: [{ version: 1, author: 'Test', date: '2024-01-01', summary: 'Test', title: 'Test', category: 'Categoria Inválida', content: 'Test' }]
    }],
    updatedAt: new Date().toISOString()
  };
  mockStorage.set(STORAGE_KEY, JSON.stringify(badPayload));
  try {
    await loadPlaybookReal();
    assert.fail('Deveria ter lançado erro');
  } catch (e) {
    assert.ok(e instanceof Error);
    assert.match(e.message, /inválido|INVALID_CONTENT/);
  }
});