import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TransitionRecord } from '@/features/projects/transition';
import { generateTransitionId, getDemoAuthor, formatDateTimeForStorage, validateTransitionInput } from '@/features/projects/transition';

const STORAGE_KEY = 'abrigoacao.transitions.v1';
const SCHEMA_VERSION = 1;

type StoredTransitions = {
  schemaVersion: number;
  records: TransitionRecord[];
  updatedAt: string;
};

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

export async function loadTransitions(): Promise<TransitionRecord[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
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

export async function saveTransitions(records: TransitionRecord[]): Promise<void> {
  const payload: StoredTransitions = {
    schemaVersion: SCHEMA_VERSION,
    records,
    updatedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function createTransition(
  projectId: string,
  responsible: string,
  pending: string,
  learnings: string,
  profile: 'Voluntário' | 'Coordenação'
): Promise<TransitionRecord> {
  const records = await loadTransitions();
  const now = new Date();
  const record: TransitionRecord = {
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

export { validateTransitionInput, type TransitionRecord };