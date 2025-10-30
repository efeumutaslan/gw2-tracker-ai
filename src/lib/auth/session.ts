import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Server Component'te current user'ı getirir
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Authentication gerektiren sayfalarda kullanılır
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

/**
 * Guest-only sayfalar için (login/register)
 */
export async function requireGuest() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }
}
