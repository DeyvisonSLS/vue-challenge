export type StatusType = 'operational' | 'degraded' | 'outage' | ''

export interface FilterData {
  status: StatusType
  category: string
}

export const CATEGORY_MAP: Record<string, string> = {
  'Git Operations': 'Core Services',
  'Pull Requests': 'Collaboration',
  Issues: 'Collaboration',
  Actions: 'Automation',
  Packages: 'Automation',
  Pages: 'Automation',
  Webhooks: 'Developer Tools',
  Codespaces: 'Developer Tools',
  Copilot: 'AI Features',
  'Copilot AI Model Providers': 'AI Features',
  'API Requests': 'Core Services',
}

// Já exporta as categorias únicas para o Select
export const CATEGORY_OPTIONS = [...new Set(Object.values(CATEGORY_MAP))]