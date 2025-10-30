import { z } from 'zod';

// Simple HTML sanitization function (server-side safe, no JSDOM dependency)
function sanitizeString(str: string): string {
  if (!str) return str;
  // Remove HTML tags and potentially dangerous characters
  return str
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"&]/g, (char) => { // Escape dangerous characters
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return escapeMap[char] || char;
    })
    .trim();
}

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
    .min(60, 'GW2 API key is too short')
    .max(80, 'GW2 API key is too long')
    .regex(/^[A-F0-9\-]+$/i, 'Invalid API key format (must contain only A-F, 0-9, and hyphens)'),
});

export const questTemplateSchema = z.object({
  name: z.string()
    .min(1, 'Quest name is required')
    .max(200, 'Quest name too long')
    .transform(val => sanitizeString(val)),
  description: z.string()
    .max(1000, 'Description too long')
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
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
    .transform(val => val ? sanitizeString(val) : undefined),
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
  return sanitizeString(html);
}

export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
