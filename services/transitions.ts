import AsyncStorage from '@react-native-async-storage/async-storage';

export type TransitionRecord = {
  id: string;
  projectId: string;
  responsible: string;
  pending: string;
  learnings: string;
  author: string;
  createdAt: string;
};

export function validateTransitionInput(
  projectId: string,
  responsible: string,
  pending: string,
  learnings: string
): { valid: boolean; error?: string } {
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

export function formatDateTimeForStorage(date: Date): string {
  return date.toISOString();
}

export function getDemoAuthor(profile: 'Voluntário' | 'Coordenação', personName?: string): string {
  if (personName) {
    return `${personName} (${profile})`;
  }
  return `${profile} (demo)`;
}

export function generateTransitionId(): string {
  return `tr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const STORAGE_KEY = 'abrigoacao.transitions.v1';
const SCHEMA_VERSION = 1;
const DATA_VERSION = 2;

type StoredTransitions = {
  schemaVersion: number;
  dataVersion: number;
  records: TransitionRecord[];
  updatedAt: string;
};

export class TransitionsStorageError extends Error {
  public readonly code: 'NOT_FOUND' | 'PARSE_ERROR' | 'SCHEMA_MISMATCH' | 'INVALID_STRUCTURE' | 'INVALID_CONTENT' | 'WRITE_ERROR' | 'UNKNOWN';
  public readonly originalError?: Error;

  constructor(
    message: string,
    code: 'NOT_FOUND' | 'PARSE_ERROR' | 'SCHEMA_MISMATCH' | 'INVALID_STRUCTURE' | 'INVALID_CONTENT' | 'WRITE_ERROR' | 'UNKNOWN',
    originalError?: Error
  ) {
    super(message);
    this.name = 'TransitionsStorageError';
    this.code = code;
    this.originalError = originalError;
  }
}

function validateRecord(record: unknown): record is TransitionRecord {
  if (!record || typeof record !== 'object') return false;
  const r = record as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.projectId === 'string' &&
    typeof r.responsible === 'string' &&
    typeof r.pending === 'string' &&
    typeof r.learnings === 'string' &&
    typeof r.author === 'string' &&
    typeof r.createdAt === 'string'
  );
}

function validateStored(data: unknown): data is StoredTransitions {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.schemaVersion === 'number' &&
    d.schemaVersion === SCHEMA_VERSION &&
    Array.isArray(d.records) &&
    typeof d.updatedAt === 'string'
  );
}

async function migrateTransitionsIfNeeded(parsed: StoredTransitions): Promise<TransitionRecord[]> {
  if (parsed.dataVersion === DATA_VERSION) {
    return parsed.records;
  }
  return parsed.records;
}

export async function loadTransitions(): Promise<TransitionRecord[]> {
  let stored: string | null;
  try {
    stored = await AsyncStorage.getItem(STORAGE_KEY);
  } catch (e) {
    throw new TransitionsStorageError('Falha ao acessar o armazenamento.', 'UNKNOWN', e as Error);
  }

  if (stored === null) {
    return [];
  }

  let parsed: StoredTransitions;
  try {
    parsed = JSON.parse(stored);
  } catch (e) {
    throw new TransitionsStorageError('Dados corrompidos no armazenamento.', 'PARSE_ERROR', e as Error);
  }

  if (!validateStored(parsed)) {
    const schemaVersion = typeof parsed === 'object' && parsed !== null && 'schemaVersion' in parsed
      ? (parsed as Record<string, unknown>).schemaVersion
      : undefined;
    if (typeof schemaVersion !== 'number' || schemaVersion !== SCHEMA_VERSION) {
      throw new TransitionsStorageError(`Versão de esquema incompatível: esperado ${SCHEMA_VERSION}, encontrado ${schemaVersion}.`, 'SCHEMA_MISMATCH');
    }
    throw new TransitionsStorageError('Estrutura inválida: envelope não confere.', 'INVALID_STRUCTURE');
  }

  for (const record of parsed.records) {
    if (!validateRecord(record)) {
      throw new TransitionsStorageError('Conteúdo inválido: registro com campos ausentes ou inválidos.', 'INVALID_CONTENT');
    }
  }

  const migrated = await migrateTransitionsIfNeeded(parsed);

  if (parsed.dataVersion !== DATA_VERSION || JSON.stringify(migrated) !== JSON.stringify(parsed.records)) {
    try {
      await saveTransitions(migrated);
    } catch (e) {
      throw new TransitionsStorageError('Falha ao atualizar dados de transições.', 'WRITE_ERROR', e as Error);
    }
  }

  return migrated;
}

export async function saveTransitions(records: TransitionRecord[]): Promise<void> {
  const payload: StoredTransitions = {
    schemaVersion: SCHEMA_VERSION,
    dataVersion: DATA_VERSION,
    records,
    updatedAt: new Date().toISOString(),
  };
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    throw new TransitionsStorageError('Falha ao gravar no armazenamento.', 'WRITE_ERROR', e as Error);
  }
}

export async function createTransition(
  projectId: string,
  responsible: string,
  pending: string,
  learnings: string,
  profile: 'Voluntário' | 'Coordenação',
  personName?: string
): Promise<TransitionRecord> {
  const records = await loadTransitions();
  const now = new Date();
  const record: TransitionRecord = {
    id: generateTransitionId(),
    projectId,
    responsible: responsible.trim(),
    pending: pending.trim(),
    learnings: learnings.trim(),
    author: getDemoAuthor(profile, personName),
    createdAt: formatDateTimeForStorage(now),
  };
  const updated = [...records, record];
  await saveTransitions(updated);
  return record;
}

export async function getTransitionsByProject(projectId: string): Promise<TransitionRecord[]> {
  const records = await loadTransitions();
  return records
    .filter((r) => r.projectId === projectId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function findProjectTransitions(projectId: string | undefined): Promise<TransitionRecord[]> {
  if (!projectId) return [];
  return getTransitionsByProject(projectId);
}

export async function getAllTransitions(): Promise<TransitionRecord[]> {
  const records = await loadTransitions();
  return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}