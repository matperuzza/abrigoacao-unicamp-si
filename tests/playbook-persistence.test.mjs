import test from 'node:test';
import assert from 'node:assert/strict';

const mockStorage = new Map();

const STORAGE_KEY = 'abrigoacao.playbook.v1';
const SCHEMA_VERSION = 1;

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatDateForStorage(date) {
  return date.toISOString().split('T')[0];
}

function getDemoAuthor() {
  return 'Voluntário (demo)';
}

function getInitialEntries() {
  const welcome = 'Guia inicial com missões, valores e primeiros passos.\n\n1. Conheça a missão da AbrigoAção.\n2. Participe do encontro de integração.\n3. Acesse o Playbook para procedimentos.\n4. Registre suas atividades semanalmente.';

  return [
    {
      id: '1',
      title: 'Boas-vindas ao voluntário',
      category: 'Integração',
      versions: [
        {
          version: 2,
          author: 'Ana Costa (demo)',
          date: '2024-06-10',
          summary: 'Atualização de passos de integração.',
          title: 'Boas-vindas ao voluntário',
          category: 'Integração',
          content: welcome,
        },
        {
          version: 1,
          author: 'Ana Costa (demo)',
          date: '2024-05-01',
          summary: 'Criação inicial.',
          title: 'Boas-vindas ao voluntário',
          category: 'Integração',
          content: 'Guia inicial com missões, valores e primeiros passos.\n\n1. Conheça a missão.\n2. Participe do encontro.\n3. Acesse o Playbook.',
        },
      ],
    },
    {
      id: '2',
      title: 'Procedimento de visita a obra',
      category: 'Procedimentos de campo',
      versions: [
        {
          version: 1,
          author: 'Pedro Lima (demo)',
          date: '2024-05-22',
          summary: 'Criação inicial.',
          title: 'Procedimento de visita a obra',
          category: 'Procedimentos de campo',
          content: 'Checklist de segurança, relatório fotográfico e entrega de materiais.\n\n- Verificar EPIs.\n- Fotografia antes/depois.\n- Preencher formulário de visita.',
        },
      ],
    },
  ];
}

async function loadPlaybook() {
  try {
    const stored = mockStorage.get(STORAGE_KEY);
    if (!stored) {
      const initial = getInitialEntries();
      await savePlaybook(initial);
      return initial;
    }
    const parsed = JSON.parse(stored);
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      const initial = getInitialEntries();
      await savePlaybook(initial);
      return initial;
    }
    if (!Array.isArray(parsed.entries)) {
      const initial = getInitialEntries();
      await savePlaybook(initial);
      return initial;
    }
    return parsed.entries;
  } catch {
    return getInitialEntries();
  }
}

async function savePlaybook(entries) {
  const payload = {
    schemaVersion: SCHEMA_VERSION,
    entries,
    updatedAt: new Date().toISOString(),
  };
  mockStorage.set(STORAGE_KEY, JSON.stringify(payload));
}

async function createEntry(title, category, content, summary) {
  const entries = await loadPlaybook();
  const now = new Date();
  const newEntry = {
    id: generateId(),
    title,
    category,
    versions: [
      {
        version: 1,
        author: getDemoAuthor(),
        date: formatDateForStorage(now),
        summary,
        title,
        category,
        content,
      },
    ],
  };
  const updated = [...entries, newEntry];
  await savePlaybook(updated);
  return newEntry;
}

async function updateEntry(id, title, category, content, summary) {
  const entries = await loadPlaybook();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return null;

  const entry = entries[index];
  const currentVersion = entry.versions[0];
  const hasChanges =
    currentVersion.title !== title ||
    currentVersion.category !== category ||
    currentVersion.content !== content;

  if (!hasChanges) return entry;

  const now = new Date();
  const newVersion = {
    version: currentVersion.version + 1,
    author: getDemoAuthor(),
    date: formatDateForStorage(now),
    summary,
    title,
    category,
    content,
  };

  const updatedEntry = {
    ...entry,
    title,
    category,
    versions: [newVersion, ...entry.versions],
  };

  const updatedEntries = [...entries];
  updatedEntries[index] = updatedEntry;
  await savePlaybook(updatedEntries);
  return updatedEntry;
}

async function findEntry(id) {
  if (!id) return undefined;
  const entries = await loadPlaybook();
  return entries.find((e) => e.id === id);
}

function resetMockStorage() {
  mockStorage.clear();
}

test('playbook: inicialização cria exemplos e persiste', async () => {
  resetMockStorage();
  const entries = await loadPlaybook();
  assert.ok(entries.length >= 2);
  const stored = mockStorage.get(STORAGE_KEY);
  assert.ok(stored);
  const parsed = JSON.parse(stored);
  assert.equal(parsed.schemaVersion, SCHEMA_VERSION);
  assert.ok(Array.isArray(parsed.entries));
});

test('playbook: reabertura recupera dados sem duplicar exemplos', async () => {
  resetMockStorage();
  const firstLoad = await loadPlaybook();
  const firstCount = firstLoad.length;
  const secondLoad = await loadPlaybook();
  assert.equal(secondLoad.length, firstCount);
  const stored = mockStorage.get(STORAGE_KEY);
  const parsed = JSON.parse(stored);
  assert.equal(parsed.entries.length, firstCount);
});

test('playbook: criação de documento gera ID único e versão inicial', async () => {
  resetMockStorage();
  const newEntry = await createEntry('Novo procedimento', 'Integração', 'Conteúdo do procedimento', 'Criação inicial.');
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
  const created = await createEntry('Doc para editar', 'Integração', 'Conteúdo original', 'Criação.');
  const updated = await updateEntry(created.id, 'Doc para editar', 'Integração', 'Conteúdo alterado', 'Atualização de conteúdo.');
  assert.ok(updated);
  assert.equal(updated.versions.length, 2);
  assert.equal(updated.versions[0].version, 2);
  assert.equal(updated.versions[0].content, 'Conteúdo alterado');
  assert.equal(updated.versions[1].version, 1);
  assert.equal(updated.versions[1].content, 'Conteúdo original');
});

test('playbook: edição sem alterações não cria nova versão', async () => {
  resetMockStorage();
  const created = await createEntry('Sem mudança', 'Integração', 'Conteúdo', 'Criação.');
  const before = await findEntry(created.id);
  const updated = await updateEntry(created.id, 'Sem mudança', 'Integração', 'Conteúdo', 'Resumo.');
  assert.ok(updated);
  assert.equal(updated.versions.length, 1);
  assert.equal(updated.id, before.id);
});

test('playbook: atualização de título e categoria é versionada', async () => {
  resetMockStorage();
  const created = await createEntry('Título original', 'Integração', 'Conteúdo', 'Criação.');
  const updated = await updateEntry(created.id, 'Título novo', 'Procedimentos de campo', 'Conteúdo', 'Título e categoria alterados.');
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
  const result = await updateEntry('id-inexistente', 'Título', 'Integração', 'Conteúdo', 'Resumo');
  assert.equal(result, null);
});

test('playbook: busca por ID inexistente retorna undefined', async () => {
  resetMockStorage();
  const result = await findEntry('id-inexistente');
  assert.equal(result, undefined);
  const result2 = await findEntry(undefined);
  assert.equal(result2, undefined);
});

test('playbook: falha de leitura retorna exemplos sem apagar armazenamento', async () => {
  resetMockStorage();
  mockStorage.set(STORAGE_KEY, 'dados inválidos {');
  const entries = await loadPlaybook();
  assert.ok(entries.length >= 2);
  const stillStored = mockStorage.get(STORAGE_KEY);
  assert.equal(stillStored, 'dados inválidos {');
});

test('playbook: schema version incompatível reinicializa exemplos', async () => {
  resetMockStorage();
  const oldPayload = { schemaVersion: 999, entries: [], updatedAt: new Date().toISOString() };
  mockStorage.set(STORAGE_KEY, JSON.stringify(oldPayload));
  const entries = await loadPlaybook();
  assert.ok(entries.length >= 2);
  const parsed = JSON.parse(mockStorage.get(STORAGE_KEY));
  assert.equal(parsed.schemaVersion, SCHEMA_VERSION);
});

test('playbook: entradas com array inválido reinicializa exemplos', async () => {
  resetMockStorage();
  const badPayload = { schemaVersion: SCHEMA_VERSION, entries: 'não é array', updatedAt: new Date().toISOString() };
  mockStorage.set(STORAGE_KEY, JSON.stringify(badPayload));
  const entries = await loadPlaybook();
  assert.ok(entries.length >= 2);
});