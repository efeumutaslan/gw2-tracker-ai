import { pgTable, uuid, varchar, text, boolean, integer, decimal, timestamp, time, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  timezone: varchar('timezone', { length: 100 }).default('UTC'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const userApiKeys = pgTable('user_api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  apiKeyEncrypted: text('api_key_encrypted').notNull(),
  apiKeyIv: text('api_key_iv').notNull(),
  apiKeyAuthTag: text('api_key_auth_tag').notNull(),
  permissions: text('permissions').array().notNull().default(sql`ARRAY[]::text[]`),
  accountName: varchar('account_name', { length: 255 }),
  lastValidatedAt: timestamp('last_validated_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userIdIdx: uniqueIndex('user_api_keys_user_id_idx').on(table.userId),
}));

export const characters = pgTable('characters', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  gw2CharacterName: varchar('gw2_character_name', { length: 100 }).notNull(),
  profession: varchar('profession', { length: 50 }),
  level: integer('level'),
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userCharacterIdx: uniqueIndex('characters_user_character_idx').on(table.userId, table.gw2CharacterName),
  userIdIdx: index('characters_user_id_idx').on(table.userId),
}));

export const questTemplates = pgTable('quest_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  frequency: varchar('frequency', { length: 20 }).notNull(),
  resetTime: time('reset_time').default('00:00:00'),
  isAccountBound: boolean('is_account_bound').default(false),
  isCharacterBound: boolean('is_character_bound').default(false),
  waypointCode: varchar('waypoint_code', { length: 50 }),
  goldReward: decimal('gold_reward', { precision: 10, scale: 2 }).default('0'),
  estimatedDurationMinutes: integer('estimated_duration_minutes').default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userIdIdx: index('quest_templates_user_id_idx').on(table.userId),
}));

export const userQuests = pgTable('user_quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  questTemplateId: uuid('quest_template_id').notNull().references(() => questTemplates.id, { onDelete: 'cascade' }),
  characterId: uuid('character_id').references(() => characters.id, { onDelete: 'cascade' }),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  lastResetAt: timestamp('last_reset_at', { withTimezone: true }).defaultNow(),
  nextResetAt: timestamp('next_reset_at', { withTimezone: true }).notNull(),
  completionCount: integer('completion_count').default(0),
  streakCount: integer('streak_count').default(0),
  totalGoldEarned: decimal('total_gold_earned', { precision: 10, scale: 2 }).default('0'),
  totalTimeSpentMinutes: integer('total_time_spent_minutes').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userQuestIdx: uniqueIndex('user_quests_unique_idx').on(table.userId, table.questTemplateId, table.characterId),
  userIdIdx: index('user_quests_user_id_idx').on(table.userId),
  nextResetIdx: index('user_quests_next_reset_idx').on(table.nextResetAt),
  characterIdx: index('user_quests_character_idx').on(table.characterId),
}));

export const questCompletions = pgTable('quest_completions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userQuestId: uuid('user_quest_id').notNull().references(() => userQuests.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  characterId: uuid('character_id').references(() => characters.id, { onDelete: 'set null' }),
  timeSpentMinutes: integer('time_spent_minutes').default(0),
  goldEarned: decimal('gold_earned', { precision: 10, scale: 2 }).default('0'),
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userIdIdx: index('quest_completions_user_id_idx').on(table.userId, table.completedAt),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  apiKeys: many(userApiKeys),
  characters: many(characters),
  questTemplates: many(questTemplates),
  userQuests: many(userQuests),
  questCompletions: many(questCompletions),
}));

export const userApiKeysRelations = relations(userApiKeys, ({ one }) => ({
  user: one(users, {
    fields: [userApiKeys.userId],
    references: [users.id],
  }),
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
  user: one(users, {
    fields: [characters.userId],
    references: [users.id],
  }),
  userQuests: many(userQuests),
  questCompletions: many(questCompletions),
}));

export const questTemplatesRelations = relations(questTemplates, ({ one, many }) => ({
  user: one(users, {
    fields: [questTemplates.userId],
    references: [users.id],
  }),
  userQuests: many(userQuests),
}));

export const userQuestsRelations = relations(userQuests, ({ one, many }) => ({
  user: one(users, {
    fields: [userQuests.userId],
    references: [users.id],
  }),
  questTemplate: one(questTemplates, {
    fields: [userQuests.questTemplateId],
    references: [questTemplates.id],
  }),
  character: one(characters, {
    fields: [userQuests.characterId],
    references: [characters.id],
  }),
  completions: many(questCompletions),
}));

export const questCompletionsRelations = relations(questCompletions, ({ one }) => ({
  userQuest: one(userQuests, {
    fields: [questCompletions.userQuestId],
    references: [userQuests.id],
  }),
  user: one(users, {
    fields: [questCompletions.userId],
    references: [users.id],
  }),
  character: one(characters, {
    fields: [questCompletions.characterId],
    references: [characters.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserApiKey = typeof userApiKeys.$inferSelect;
export type NewUserApiKey = typeof userApiKeys.$inferInsert;
export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;
export type QuestTemplate = typeof questTemplates.$inferSelect;
export type NewQuestTemplate = typeof questTemplates.$inferInsert;
export type UserQuest = typeof userQuests.$inferSelect;
export type NewUserQuest = typeof userQuests.$inferInsert;
export type QuestCompletion = typeof questCompletions.$inferSelect;
export type NewQuestCompletion = typeof questCompletions.$inferInsert;
