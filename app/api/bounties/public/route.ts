import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import PocketBase from 'pocketbase'

function bearerOk(headerValue: string | null, expected: string): boolean {
  if (!headerValue || !headerValue.startsWith('Bearer ')) return false
  const got = Buffer.from(headerValue.slice(7))
  const want = Buffer.from(expected)
  if (got.length !== want.length) return false
  return timingSafeEqual(got, want)
}

export async function POST(request: Request) {
  const expectedToken = process.env.BOUNTY_API_TOKEN
  const pbUrl         = process.env.POCKETBASE_URL
  const pbAdminEmail  = process.env.PB_ADMIN_EMAIL
  const pbAdminPass   = process.env.PB_ADMIN_PASSWORD

  if (!expectedToken || !pbUrl || !pbAdminEmail || !pbAdminPass) {
    return NextResponse.json({ error: 'Endpoint not configured' }, { status: 503 })
  }

  if (!bearerOk(request.headers.get('authorization'), expectedToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, reward_amount, reward_currency, company_name, contact_info, category } = body

    if (typeof title !== 'string' || title.length === 0 || title.length > 200) {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 })
    }
    if (typeof description !== 'string' || description.length === 0 || description.length > 5000) {
      return NextResponse.json({ error: 'Invalid description' }, { status: 400 })
    }
    if (typeof company_name !== 'string' || company_name.length === 0 || company_name.length > 200) {
      return NextResponse.json({ error: 'Invalid company_name' }, { status: 400 })
    }
    if (typeof contact_info !== 'string' || contact_info.length === 0 || contact_info.length > 500) {
      return NextResponse.json({ error: 'Invalid contact_info' }, { status: 400 })
    }
    const reward = Number(reward_amount)
    if (!Number.isFinite(reward) || reward < 0 || reward > 10_000_000) {
      return NextResponse.json({ error: 'Invalid reward_amount' }, { status: 400 })
    }

    const pb = new PocketBase(pbUrl)
    await pb.collection('_superusers').authWithPassword(pbAdminEmail, pbAdminPass)

    const record = await pb.collection('bounties').create({
      title,
      description,
      reward_amount: reward,
      reward_currency: reward_currency || 'BRL',
      company_name,
      contact_info,
      category: category || 'automation',
      status: 'open',
      is_external: true,
    })

    return NextResponse.json({ success: true, id: record.id }, { status: 201 })
  } catch (error: any) {
    console.error('Public Bounty Error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to create bounty' }, { status: 500 })
  }
}
