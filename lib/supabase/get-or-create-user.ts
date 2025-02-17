import { createClient } from "@/lib/supabase/server"

export async function getOrCreateUser(userId: string) {
    const supabase = await createClient()
    
    // First try to get the user
    const { data: user, error: fetchError } = await supabase
        .from('user')
        .select('*')
        .eq('user_id', userId)
        .single()
    
    // If user exists, return it
    if (user) {
        return { user, error: null }
    }
    
    // If not, create it
    if (fetchError?.code === 'PGRST116') { // No rows returned
        const { data: newUser, error: createError } = await supabase
            .from('user')
            .insert([{ user_id: userId }])
            .select()
            .single()
            
        return { user: newUser, error: createError }
    }
    
    return { user: null, error: fetchError }
} 