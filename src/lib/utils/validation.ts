import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Frontend validation schema (with confirmPassword)
export const registerFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// API validation schema (without confirmPassword)
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const apiKeySchema = z.object({
  apiKey: z.string()
    .length(72, 'GW2 API key must be 72 characters')
    .regex(/^[A-F0-9\-]+$/i, 'Invalid API key format'),
});

export const questTemplateSchema = z.object({
  name: z.string()
    .min(1, 'Quest name is required')
    .max(200, 'Quest name too long')
    .transform(val => DOMPurify.sanitize(val.trim())),
  description: z.string()
    .max(1000, 'Description too long')
    .optional()
    .transform(val => val ? DOMPurify.sanitize(val) : undefined),
  category: z.string()
    .max(100, 'Category too long')
    .optional(),
  frequency: z.enum(['daily', 'weekly', 'custom', 'once']),
  resetTime: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)')
    .default('00:00'),
  isAccountBound: z.boolean().default(false),
  isCharacterBound: z.boolean().default(false),
  waypointCode: z.string()
    .max(50, 'Waypoint code too long')
    .optional()
    .nullable(),
  goldReward: z.number()
    .min(0, 'Gold reward cannot be negative')
    .default(0),
  estimatedDurationMinutes: z.number()
    .min(0, 'Duration cannot be negative')
    .default(0),
  notes: z.string()
    .max(500, 'Notes too long')
    .optional()
    .transform(val => val ? DOMPurify.sanitize(val) : undefined),
}).refine((data) => {
  return data.isAccountBound || data.isCharacterBound;
}, {
  message: 'Quest must be either account-bound or character-bound',
  path: ['isAccountBound'],
});

export const questCompletionSchema = z.object({
  questId: z.string().uuid('Invalid quest ID'),
  timeSpent: z.number().min(0).optional().default(0),
  goldEarned: z.number().min(0).optional().default(0),
});

export const userSettingsSchema = z.object({
  timezone: z.string().min(1, 'Timezone is required'),
});

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
