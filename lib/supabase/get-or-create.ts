import { createClient } from "@/utils/supabase/server";

export async function getOrCreate(userId: string) {
    const supabase = await createClient();
    
    // Try to get the existing user record
    const { data: existingUser, error: fetchError } = await supabase
        .from('user')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Error fetching user: ${fetchError.message}`);
    }
    
    // If user exists, return it
    if (existingUser) {
        return existingUser;
    }
    
    // If user doesn't exist, create it
    const { data: newUser, error: insertError } = await supabase
        .from('user')
        .insert([{ user_id: userId }])
        .select()
        .single();
        
    if (insertError) {
        throw new Error(`Error creating user: ${insertError.message}`);
    }
    
    return newUser;
} 