import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined

export function useDb() {
  if (_db) return _db
  const dbPath = resolve(process.cwd(), '.data/scenes.sqlite')
  mkdirSync(resolve(process.cwd(), '.data'), { recursive: true })
  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  _db = drizzle(sqlite, { schema })
  migrate(_db, { migrationsFolder: resolve(process.cwd(), 'server/db/migrations') })
  return _db
}
