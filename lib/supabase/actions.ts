"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signInWithGoogle = async () => {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        console.error(error);
        return redirect('/sign-in?error=' + error.message);
    }

    return redirect(data.url);
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
};
