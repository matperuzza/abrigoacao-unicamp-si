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

export function formatDateForStorage(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDateTimeForStorage(date: Date): string {
  return date.toISOString();
}

export function getDemoAuthor(profile: 'Voluntário' | 'Coordenação'): string {
  return `${profile} (demo)`;
}

export function generateTransitionId(): string {
  return `tr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}