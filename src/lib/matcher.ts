// Auto-responder matching logic shared between API and frontend display.
// Pure function — safe to use on both server and client.

export interface Rule {
  id: string
  keyword: string
  response: string
  isActive: boolean
}

export interface MatchResult {
  matched: boolean
  rule: Rule | null
  response: string
  usedDefault: boolean
}

export function findMatchingRule(content: string, rules: Rule[]): MatchResult {
  const normalized = content.trim().toLowerCase()
  for (const rule of rules) {
    if (!rule.isActive) continue
    if (normalized.includes(rule.keyword.toLowerCase())) {
      return { matched: true, rule, response: rule.response, usedDefault: false }
    }
  }
  return {
    matched: false,
    rule: null,
    response: '',
    usedDefault: true,
  }
}
