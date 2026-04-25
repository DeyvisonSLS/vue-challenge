export interface GitHubComponent {
  id: string
  name: string
  status: 'operational' | 'degraded' | 'outage'
  description: string | null
  showcase: boolean
  incidents: any[]
}

export interface GitHubSummary {
  components: GitHubComponent[]
  incidents: any[]
}
