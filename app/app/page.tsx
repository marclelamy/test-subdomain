import { createClient } from "@/lib/supabase/server"
import { getOrCreateUser } from "@/lib/supabase/get-or-create-user"
import { redirect } from "next/navigation"



export default async function AppPage() {
    const supabase = await createClient()

    const { data: { user: authedUser } } = await supabase.auth.getUser()

    if (!authedUser?.id) {
        return redirect("/sign-in")
    }

    const { user, error } = await getOrCreateUser(authedUser.id)

    if (error) {
        console.error('Error fetching profile:', error)
    }
    return (
        <div>
            <h1>App Page</h1>
        </div>
    )
}