export interface Upgrade {
  name: string
  cost: { resource: string, count: number }[]
  description: string
}