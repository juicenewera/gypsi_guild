import { NextResponse } from 'next/server'
import PocketBase from 'pocketbase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, reward_amount, reward_currency, company_name, contact_info, category } = body

    // Validation
    if (!title || !description || !company_name || !contact_info) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090')
    
    // Auth as admin to create external bounty
    // Note: In production use environment variables for admin credentials
    await pb.collection('_superusers').authWithPassword(
      process.env.PB_ADMIN_EMAIL || 'admin@guild.com',
      process.env.PB_ADMIN_PASSWORD || 'admin12345678'
    )

    const record = await pb.collection('bounties').create({
      title,
      description,
      reward_amount: parseFloat(reward_amount),
      reward_currency: reward_currency || 'BRL',
      company_name,
      contact_info,
      category: category || 'automation',
      status: 'open',
      is_external: true
    })

    return NextResponse.json({ success: true, id: record.id }, { status: 201 })
  } catch (error: any) {
    console.error('Public Bounty Error:', error)
    return NextResponse.json({ error: 'Failed to create bounty' }, { status: 500 })
  }
}
