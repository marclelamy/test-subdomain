import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
    // This `try/catch` block is only here for the interactive tutorial.
    // Feel free to remove once you have Supabase connected.
    try {
        // Create an unmodified response
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookieOptions: {
                    domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.sortmyfilm.com',
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30,
                    httpOnly: true,
                },
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set({
                                name,
                                value,
                                ...options,
                                domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.sortmyfilm.com'
                            });
                        });
                    },
                },
            },
        );

        // This will refresh session if expired - required for Server Components
        // https://supabase.com/docs/guides/auth/server-side/nextjs
        const user = await supabase.auth.getUser();
        console.log('host', request.headers.get('host'));
        console.log('url', request.url);
        console.log(
            "user middleware",
            user ? "\x1b[32muser logged in\x1b[0m" : "\x1b[31muser not logged in\x1b[0m"
        )

        // protected routes
        if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        // If logged in on main domain, redirect to app subdomain
        if (
            request.nextUrl.pathname === "/" && 
            !user.error && 
            request.headers.get('host') === 'localhost:3000'
        ) {
            const url = new URL(request.url)
            url.host = 'app.localhost:3000'
            return NextResponse.redirect(url)
        }

        return response;
    } catch (e) {
        // If you are here, a Supabase client could not be created!
        // This is likely because you have not set up environment variables.
        // Check out http://localhost:3000 for Next Steps.
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }
};
