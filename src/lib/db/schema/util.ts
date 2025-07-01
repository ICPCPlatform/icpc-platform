import { customType } from "drizzle-orm/pg-core";

/**
 * A custom type definition for PostgreSQL `citext` (case-insensitive text) type.
 *
 * @example
 * ```typescript
 * import { citext } from './path/to/util';
 *
 * // Usage in a table definition
 * const users = pgTable('users', {
 *   username: citext,
 * });
 * ```
 */
export const citext = customType<{ data: string }>({
  dataType: () =>  `citext` 
});
