import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      const { user } = data
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) {
        const username = user.email?.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_') + '_' + Math.random().toString(36).substring(7)
        
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
          username: username,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
