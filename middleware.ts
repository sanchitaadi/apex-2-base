import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  /*
   * Clone the incoming request headers so we can safely
   * pass the current pathname to the Server Component layout.
   */
  const requestHeaders = new Headers(
    request.headers
  );

  requestHeaders.set(
    "x-admin-pathname",
    request.nextUrl.pathname
  );

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          for (const {
            name,
            value,
            options,
          } of cookiesToSet) {
            request.cookies.set(name, value);

            response.cookies.set(
              name,
              value,
              options
            );
          }
        },
      },
    }
  );

  /*
   * Refresh/read the Supabase auth session.
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isLoginPage =
    pathname === "/admin/login";

  const isAdminPage =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  /*
   * Public website:
   * leave it completely alone.
   */
  if (!isAdminPage) {
    return response;
  }

  /*
   * IMPORTANT:
   * /admin/login is ALWAYS allowed.
   *
   * We do NOT redirect logged-in users away from it here.
   * The login page can decide what to do after login.
   */
  if (isLoginPage) {
    return response;
  }

  /*
   * Every other admin route requires
   * a logged-in Supabase user.
   */
  if (!user) {
    return NextResponse.redirect(
      new URL(
        "/admin/login",
        request.url
      )
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};