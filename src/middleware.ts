
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    let supabase;
    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
            throw new Error('Missing Supabase Environment Variables');
        }

        supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                    },
                },
            }
        );
    } catch (err) {
        console.error('Middleware: Failed to initialize Supabase client:', err);
        // If requesting a page, redirect to error. If API, return JSON.
        if (request.nextUrl.pathname.startsWith('/api')) {
            return NextResponse.json({ error: 'Internal Server Configuration Error' }, { status: 500 });
        }
        const url = request.nextUrl.clone();
        url.pathname = '/admin-login-error';
        url.searchParams.set('reason', 'Server Configuration Error: Missing Environment Variables');
        return NextResponse.redirect(url);
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Protected Routes
    if (request.nextUrl.pathname.startsWith('/account')) {
        if (!user) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin-login-error')) {
        if (!user) {
            console.log('Middleware: No user found for admin route, redirecting to /');
            const url = request.nextUrl.clone();
            url.pathname = '/admin-login-error';
            url.searchParams.set('reason', 'No user session found in cookies');
            return NextResponse.redirect(url)
        }


        console.log('Middleware: User checking admin access:', user.email, user.id);

        // IMPROVED ADMIN CHECK:
        // 1. Hardcoded Super Admins (Fastest, survives DB outages/RLS issues)
        const superAdmins = ['hanzalaq63@gmail.com'];
        const superAdminIds = ['7b167b7d-50aa-41c4-8f57-e5dfc2d3ac4f'];

        const email = user.email?.toLowerCase();

        if (
            (email && superAdmins.includes(email)) ||
            superAdminIds.includes(user.id)
        ) {
            console.log('Middleware: Super admin detected via hardcoded list');
            return response; // Allow access immediately
        }

        // 2. Database Check (Original Logic)
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Middleware: Error fetching profile for admin check:', error);
        }

        console.log('Middleware: DB Admin check result:', profile);

        if (!profile?.is_admin) {
            console.log('Middleware: User is not admin, redirecting to /');
            const url = request.nextUrl.clone();
            url.pathname = '/admin-login-error';
            url.searchParams.set('reason', `User ${user.email} (ID: ${user.id}) is not an admin. Profile check: ${JSON.stringify(profile)}`);
            return NextResponse.redirect(url);
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (API routes)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
