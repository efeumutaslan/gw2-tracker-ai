import { eq, and, desc, lte } from 'drizzle-orm';
import { getDb } from './client';
import * as schema from './schema';

const db: any = getDb();

export async function getUserById(userId: string) {
  return db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  });
}

export async function createUser(data: schema.NewUser) {
  const [user] = await db.insert(schema.users).values(data).returning();
  return user;
}

/**
 * Ensures user exists in database, creates if not found
 * Call this in all endpoints that require user data
 */
export async function ensureUserExists(userId: string, email: string) {
  try {
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      console.log('Creating user record for:', userId);
      await createUser({
        id: userId,
        email,
        timezone: 'UTC',
      });
      return true; // User was created
    }
    return false; // User already existed
  } catch (err) {
    console.error('Error in ensureUserExists:', err);
    throw err;
  }
}

export async function updateUser(userId: string, data: Partial<schema.NewUser>) {
  const [user] = await db.update(schema.users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.users.id, userId))
    .returning();
  return user;
}

export async function getUserApiKey(userId: string) {
  return db.query.userApiKeys.findFirst({
    where: eq(schema.userApiKeys.userId, userId),
  });
}

export async function saveUserApiKey(data: schema.NewUserApiKey) {
  const [apiKey] = await db.insert(schema.userApiKeys)
    .values(data)
    .onConflictDoUpdate({
      target: schema.userApiKeys.userId,
      set: data,
    })
    .returning();
  return apiKey;
}

export async function deleteUserApiKey(userId: string) {
  await db.delete(schema.userApiKeys).where(eq(schema.userApiKeys.userId, userId));
}

export async function getCharactersByUserId(userId: string) {
  return db.query.characters.findMany({
    where: eq(schema.characters.userId, userId),
    orderBy: desc(schema.characters.level),
  });
}

export async function getCharacterById(characterId: string) {
  return db.query.characters.findFirst({
    where: eq(schema.characters.id, characterId),
  });
}

export async function createCharacter(data: schema.NewCharacter) {
  const [character] = await db.insert(schema.characters)
    .values(data)
    .onConflictDoUpdate({
      target: [schema.characters.userId, schema.characters.gw2CharacterName],
      set: {
        profession: data.profession,
        level: data.level,
        lastSyncedAt: new Date(),
      },
    })
    .returning();
  return character;
}

export async function deleteCharacter(characterId: string) {
  await db.delete(schema.characters).where(eq(schema.characters.id, characterId));
}

export async function getQuestTemplatesByUserId(userId: string) {
  return db.query.questTemplates.findMany({
    where: eq(schema.questTemplates.userId, userId),
    orderBy: desc(schema.questTemplates.createdAt),
  });
}

export async function getQuestTemplateById(templateId: string) {
  return db.query.questTemplates.findFirst({
    where: eq(schema.questTemplates.id, templateId),
  });
}

export async function createQuestTemplate(data: schema.NewQuestTemplate) {
  const [template] = await db.insert(schema.questTemplates).values(data).returning();
  return template;
}

export async function updateQuestTemplate(templateId: string, data: Partial<schema.NewQuestTemplate>) {
  const [template] = await db.update(schema.questTemplates)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.questTemplates.id, templateId))
    .returning();
  return template;
}

export async function deleteQuestTemplate(templateId: string) {
  await db.delete(schema.questTemplates).where(eq(schema.questTemplates.id, templateId));
}

export async function getUserQuestsByUserId(userId: string, characterId?: string) {
  const conditions = characterId
    ? and(eq(schema.userQuests.userId, userId), eq(schema.userQuests.characterId, characterId))
    : eq(schema.userQuests.userId, userId);

  return db.query.userQuests.findMany({
    where: conditions,
    with: {
      questTemplate: true,
      character: true,
    },
    orderBy: [desc(schema.userQuests.isCompleted), desc(schema.userQuests.nextResetAt)],
  });
}

export async function getUserQuestById(questId: string) {
  return db.query.userQuests.findFirst({
    where: eq(schema.userQuests.id, questId),
    with: {
      questTemplate: true,
      character: true,
    },
  });
}

export async function createUserQuest(data: schema.NewUserQuest) {
  const [quest] = await db.insert(schema.userQuests).values(data).returning();
  return quest;
}

export async function updateUserQuest(questId: string, data: Partial<schema.NewUserQuest>) {
  const [quest] = await db.update(schema.userQuests)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.userQuests.id, questId))
    .returning();
  return quest;
}

export async function completeUserQuest(questId: string, timeSpent: number = 0, goldEarned: number = 0) {
  const quest = await getUserQuestById(questId);
  if (!quest) throw new Error('Quest not found');

  const [updatedQuest] = await db.update(schema.userQuests)
    .set({
      isCompleted: true,
      completedAt: new Date(),
      completionCount: quest.completionCount + 1,
      totalTimeSpentMinutes: quest.totalTimeSpentMinutes + timeSpent,
      totalGoldEarned: String(Number(quest.totalGoldEarned) + goldEarned),
      updatedAt: new Date(),
    })
    .where(eq(schema.userQuests.id, questId))
    .returning();

  await db.insert(schema.questCompletions).values({
    userQuestId: questId,
    userId: quest.userId,
    characterId: quest.characterId,
    timeSpentMinutes: timeSpent,
    goldEarned: String(goldEarned),
  });

  return updatedQuest;
}

export async function uncompleteUserQuest(questId: string) {
  const [quest] = await db.update(schema.userQuests)
    .set({
      isCompleted: false,
      completedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(schema.userQuests.id, questId))
    .returning();
  return quest;
}

export async function deleteUserQuest(questId: string) {
  await db.delete(schema.userQuests).where(eq(schema.userQuests.id, questId));
}

export async function getQuestsToReset(beforeDate: Date) {
  return db.query.userQuests.findMany({
    where: and(
      eq(schema.userQuests.isCompleted, true),
      lte(schema.userQuests.nextResetAt, beforeDate)
    ),
    with: {
      questTemplate: true,
    },
  });
}

export async function getQuestCompletionHistory(userId: string, limit: number = 50) {
  return db.query.questCompletions.findMany({
    where: eq(schema.questCompletions.userId, userId),
    with: {
      userQuest: {
        with: {
          questTemplate: true,
        },
      },
      character: true,
    },
    orderBy: desc(schema.questCompletions.completedAt),
    limit,
  });
}

// ==========================================
// Legendary Tracking Queries
// ==========================================

export async function getUserLegendaries(userId: string) {
  return db.query.userLegendaries.findMany({
    where: eq(schema.userLegendaries.userId, userId),
    orderBy: desc(schema.userLegendaries.updatedAt),
  });
}

export async function getUserLegendaryById(legendaryId: string) {
  return db.query.userLegendaries.findFirst({
    where: eq(schema.userLegendaries.id, legendaryId),
  });
}

export async function getUserLegendaryByLegendaryId(userId: string, legendaryId: string) {
  return db.query.userLegendaries.findFirst({
    where: and(
      eq(schema.userLegendaries.userId, userId),
      eq(schema.userLegendaries.legendaryId, legendaryId)
    ),
  });
}

export async function createUserLegendary(data: schema.NewUserLegendary) {
  const [legendary] = await db.insert(schema.userLegendaries)
    .values(data)
    .returning();
  return legendary;
}

export async function updateUserLegendary(legendaryId: string, data: Partial<schema.NewUserLegendary>) {
  const [legendary] = await db.update(schema.userLegendaries)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.userLegendaries.id, legendaryId))
    .returning();
  return legendary;
}

export async function deleteUserLegendary(legendaryId: string) {
  await db.delete(schema.userLegendaries).where(eq(schema.userLegendaries.id, legendaryId));
}

// Material Reserves
export async function getMaterialReservesByUserId(userId: string) {
  return db.query.materialReserves.findMany({
    where: eq(schema.materialReserves.userId, userId),
  });
}

export async function getMaterialReservesByLegendaryId(legendaryId: string) {
  return db.query.materialReserves.findMany({
    where: eq(schema.materialReserves.userLegendaryId, legendaryId),
  });
}

export async function upsertMaterialReserve(data: schema.NewMaterialReserve) {
  const [reserve] = await db.insert(schema.materialReserves)
    .values(data)
    .onConflictDoUpdate({
      target: [schema.materialReserves.userLegendaryId, schema.materialReserves.itemName],
      set: {
        quantityReserved: data.quantityReserved,
        updatedAt: new Date(),
      },
    })
    .returning();
  return reserve;
}

export async function deleteMaterialReservesByLegendaryId(legendaryId: string) {
  await db.delete(schema.materialReserves)
    .where(eq(schema.materialReserves.userLegendaryId, legendaryId));
}

// Material Progress
export async function getMaterialProgressByLegendaryId(legendaryId: string) {
  return db.query.materialProgress.findMany({
    where: eq(schema.materialProgress.userLegendaryId, legendaryId),
  });
}

export async function upsertMaterialProgress(data: schema.NewMaterialProgress) {
  const [progress] = await db.insert(schema.materialProgress)
    .values(data)
    .onConflictDoUpdate({
      target: [
        schema.materialProgress.userLegendaryId,
        schema.materialProgress.componentId,
        schema.materialProgress.itemName,
      ],
      set: {
        completed: data.completed,
        completedAt: data.completed ? new Date() : null,
        updatedAt: new Date(),
      },
    })
    .returning();
  return progress;
}

export async function deleteMaterialProgressByLegendaryId(legendaryId: string) {
  await db.delete(schema.materialProgress)
    .where(eq(schema.materialProgress.userLegendaryId, legendaryId));
}

// Progress History
export async function getProgressHistory(userId: string, legendaryId: string, limit: number = 30) {
  return db.query.legendaryProgressHistory.findMany({
    where: and(
      eq(schema.legendaryProgressHistory.userId, userId),
      eq(schema.legendaryProgressHistory.legendaryId, legendaryId)
    ),
    orderBy: desc(schema.legendaryProgressHistory.snapshotAt),
    limit,
  });
}

export async function createProgressSnapshot(data: schema.NewLegendaryProgressHistory) {
  const [snapshot] = await db.insert(schema.legendaryProgressHistory)
    .values(data)
    .returning();
  return snapshot;
}

export async function deleteProgressHistoryByLegendaryId(userId: string, legendaryId: string) {
  await db.delete(schema.legendaryProgressHistory)
    .where(
      and(
        eq(schema.legendaryProgressHistory.userId, userId),
        eq(schema.legendaryProgressHistory.legendaryId, legendaryId)
      )
    );
}
