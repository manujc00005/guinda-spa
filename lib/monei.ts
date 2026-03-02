// MONEI SDK Configuration
// Docs: https://docs.monei.com/docs/getting-started
// NPM: https://www.npmjs.com/package/@monei-js/node-sdk

import Monei from '@monei-js/node-sdk'

if (!process.env.MONEI_API_KEY) {
  throw new Error('MONEI_API_KEY is required. Get it from https://dashboard.monei.com/settings/api-keys')
}

// Initialize MONEI client
export const monei = new Monei(process.env.MONEI_API_KEY)

// Export types for convenience
export type { Payment, PaymentMethod } from '@monei-js/node-sdk'
