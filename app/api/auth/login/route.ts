import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )

    // Sign in user
    const { data, error } = await supabase.auth.admin.listUsers()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Find user by email
    const user = data.users.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Create session
    const { data: signInData, error: signInError } = await supabase.auth.admin.createSession(
      user.id
    )

    if (signInError) {
      return NextResponse.json({ error: signInError.message }, { status: 400 })
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({
      user,
      profile,
      session: signInData.session,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
