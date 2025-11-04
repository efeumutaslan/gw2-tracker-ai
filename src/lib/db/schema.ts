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

// Legendary Tracking Tables
export const userLegendaries = pgTable('user_legendaries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  legendaryId: varchar('legendary_id', { length: 100 }).notNull(), // e.g., 'eternity', 'sunrise'
  isTracking: boolean('is_tracking').default(true),
  progress: integer('progress').default(0), // 0-100
  notes: text('notes'),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (table) => ({
  userLegendaryIdx: uniqueIndex('user_legendaries_user_legendary_idx').on(table.userId, table.legendaryId),
  userIdIdx: index('user_legendaries_user_id_idx').on(table.userId),
}));

// Material Reserves - tracks which materials are reserved for which legendary
export const materialReserves = pgTable('material_reserves', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  userLegendaryId: uuid('user_legendary_id').notNull().references(() => userLegendaries.id, { onDelete: 'cascade' }),
  itemId: integer('item_id'), // GW2 API item ID
  itemName: varchar('item_name', { length: 200 }).notNull(),
  quantityReserved: integer('quantity_reserved').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userLegendaryItemIdx: uniqueIndex('material_reserves_legendary_item_idx').on(table.userLegendaryId, table.itemName),
  userIdIdx: index('material_reserves_user_id_idx').on(table.userId),
}));

// Material Progress - tracks user's progress on individual materials
export const materialProgress = pgTable('material_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  userLegendaryId: uuid('user_legendary_id').notNull().references(() => userLegendaries.id, { onDelete: 'cascade' }),
  componentId: varchar('component_id', { length: 100 }).notNull(), // e.g., 'gifts_of_mastery'
  itemName: varchar('item_name', { length: 200 }).notNull(),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userLegendaryComponentItemIdx: uniqueIndex('material_progress_legendary_component_item_idx').on(
    table.userLegendaryId,
    table.componentId,
    table.itemName
  ),
  userIdIdx: index('material_progress_user_id_idx').on(table.userId),
}));

// Legendary Progress History - tracks snapshots of legendary crafting progress over time
export const legendaryProgressHistory = pgTable('legendary_progress_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  legendaryId: varchar('legendary_id', { length: 100 }).notNull(), // e.g., 'eternity', 'sunrise'
  progressPercentage: integer('progress_percentage').notNull().default(0), // 0-100
  materialsObtained: integer('materials_obtained').notNull().default(0),
  totalMaterials: integer('total_materials').notNull().default(0),
  totalValueCopper: integer('total_value_copper').default(0), // estimated value in copper
  snapshotType: varchar('snapshot_type', { length: 20 }).default('auto'), // 'auto', 'manual', 'milestone'
  snapshotAt: timestamp('snapshot_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userLegendaryIdx: index('legendary_progress_history_user_legendary_idx').on(table.userId, table.legendaryId, table.snapshotAt),
  userIdIdx: index('legendary_progress_history_user_id_idx').on(table.userId),
  snapshotAtIdx: index('legendary_progress_history_snapshot_at_idx').on(table.snapshotAt),
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
export type UserLegendary = typeof userLegendaries.$inferSelect;
export type NewUserLegendary = typeof userLegendaries.$inferInsert;
export type MaterialReserve = typeof materialReserves.$inferSelect;
export type NewMaterialReserve = typeof materialReserves.$inferInsert;
export type MaterialProgress = typeof materialProgress.$inferSelect;
export type NewMaterialProgress = typeof materialProgress.$inferInsert;
export type LegendaryProgressHistory = typeof legendaryProgressHistory.$inferSelect;
export type NewLegendaryProgressHistory = typeof legendaryProgressHistory.$inferInsert;
