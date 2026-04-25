import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const PUBLIC_EXACT = new Set<string>([
    '/', '/sobre', '/guild', '/consultoria', '/oportunidades',
    '/agentes', '/ventures', '/matilha',
  ])
  const PUBLIC_PREFIXES = ['/login', '/register', '/esqueci-senha', '/reset-password']

  const isPublicRoute =
    PUBLIC_EXACT.has(pathname) ||
    PUBLIC_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
     const url = request.nextUrl.clone()
     url.pathname = '/dashboard'
     return NextResponse.redirect(url)
  }

  if (user && isAdminRoute) {
    const { data: staff, error } = await supabase.rpc('is_staff', { p_user: user.id })
    if (error || !staff) {
      const url = request.nextUrl.clone()
      url.pathname = '/feed'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
};
