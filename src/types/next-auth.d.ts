import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      tokens: number
      isAdmin: boolean
    } & DefaultSession['user']
  }

  interface User {
    tokens: number
    isAdmin: boolean
  }
}
