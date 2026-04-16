import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, path } = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )

    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        display_name: username,
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'User creation failed' }, { status: 400 })
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username,
        email,
        name: username,
        path,
        level: 1,
        xp: 0,
      })
      .select()
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({
      user: authData.user,
      profile,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
