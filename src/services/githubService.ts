import type { GitHubSummary } from '../types/github'

export const githubService = {
  async getSummary(): Promise<GitHubSummary> {
    const response = await fetch('https://www.githubstatus.com/api/v2/summary.json')
    if (!response.ok) throw new Error('Falha na comunicação com o github.')
    return response.json()
  },
}
