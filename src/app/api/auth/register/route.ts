import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { registerSchema } from '@/lib/utils/validation';
import { createUser } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Registration failed' },
        { status: 500 }
      );
    }

    // User record is automatically created via database trigger
    // But we'll create it manually as fallback
    try {
      await createUser({
        id: authData.user.id,
        email: authData.user.email!,
        timezone: 'UTC',
      });
    } catch (err) {
      // Ignore if already exists (created by trigger)
      console.log('User record creation handled by trigger or already exists');
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
