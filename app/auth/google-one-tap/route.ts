import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const credential = body.credential
        
        const supabase = await createClient()
        
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: credential,
        })

        if (error) throw error

        return NextResponse.json({ 
            success: true,
            redirectTo: '/protected'
        })
    } catch (error) {
        console.error('Google One Tap error:', error)
        return NextResponse.json({ 
            success: false,
            error: 'Authentication failed'
        }, { status: 400 })
    }
} 