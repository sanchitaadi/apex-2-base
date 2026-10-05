import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseSecretKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

/* ============================================================
   SERVER CLIENTS
============================================================ */

const authClient = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const adminClient = createClient(
  supabaseUrl,
  supabaseSecretKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

/* ============================================================
   AUTHORIZE REQUEST
============================================================ */

async function getAuthorizedAdmin(
  request: NextRequest
) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      user: null,
      admin: null,
      error: "Missing authorization.",
    };
  }

  const token = authorization.slice(7);

  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser(token);

  if (userError || !user) {
    return {
      user: null,
      admin: null,
      error: "Invalid or expired session.",
    };
  }

  const {
    data: admin,
    error: adminError,
  } = await adminClient
    .from("admin_users")
    .select(
      "id, email, full_name, role, is_active"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (
    adminError ||
    !admin ||
    !admin.is_active ||
    !["admin", "super_admin"].includes(
      admin.role
    )
  ) {
    return {
      user,
      admin: null,
      error:
        "You are not authorized to manage CMS users.",
    };
  }

  return {
    user,
    admin,
    error: null,
  };
}

/* ============================================================
   POST — CREATE CMS USER
============================================================ */

export async function POST(
  request: NextRequest
) {
  try {
    const {
      admin,
      error: authorizationError,
    } = await getAuthorizedAdmin(request);

    if (!admin) {
      return NextResponse.json(
        {
          error:
            authorizationError ||
            "Unauthorized.",
        },
        { status: 401 }
      );
    }

    /* Only Super Admin can create users */

    if (admin.role !== "super_admin") {
      return NextResponse.json(
        {
          error:
            "Only a Super Administrator can create CMS users.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const action = String(
      body.action || ""
    );

    if (action !== "create") {
      return NextResponse.json(
        {
          error:
            "Invalid user creation action.",
        },
        { status: 400 }
      );
    }

    const email = String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

    const fullName = String(
      body.fullName || ""
    ).trim();

    const password = String(
      body.password || ""
    );

    const role =
      body.role === "super_admin"
        ? "super_admin"
        : "admin";

    /* ----------------------------------------------------------
       VALIDATION
    ---------------------------------------------------------- */

    if (!email) {
      return NextResponse.json(
        {
          error:
            "Email address is required.",
        },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least 8 characters.",
        },
        { status: 400 }
      );
    }

    /* ----------------------------------------------------------
       CHECK EXISTING CMS USER
    ---------------------------------------------------------- */

    const {
      data: existingAdmin,
      error: existingAdminError,
    } = await adminClient
      .from("admin_users")
      .select(
        "id, email, full_name, role, is_active"
      )
      .eq("email", email)
      .maybeSingle();

    if (existingAdminError) {
      throw existingAdminError;
    }

    if (existingAdmin) {
      return NextResponse.json(
        {
          error:
            existingAdmin.is_active
              ? "This email is already a CMS user."
              : "This email already belongs to an inactive CMS user. Activate it instead.",
        },
        { status: 409 }
      );
    }

    /* ----------------------------------------------------------
       CHECK SUPABASE AUTH USER
    ---------------------------------------------------------- */

    const {
      data: authUsers,
      error: listError,
    } =
      await adminClient.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

    if (listError) {
      throw listError;
    }

    const existingAuthUser =
      authUsers.users.find(
        (user) =>
          user.email?.toLowerCase() ===
          email
      );

    /* ----------------------------------------------------------
       IF AUTH USER EXISTS BUT IS NOT CMS USER
       CONFIRM + RESET PASSWORD + USE IT
    ---------------------------------------------------------- */

    if (existingAuthUser) {
      const {
        data: updatedUser,
        error: updateAuthError,
      } =
        await adminClient.auth.admin.updateUserById(
          existingAuthUser.id,
          {
            password,
            email_confirm: true,
            user_metadata: {
              ...(existingAuthUser.user_metadata ||
                {}),
              full_name: fullName,
            },
          }
        );

      if (updateAuthError) {
        throw updateAuthError;
      }

      if (!updatedUser.user) {
        throw new Error(
          "Could not update the existing authentication account."
        );
      }

      const {
        error: insertExistingError,
      } = await adminClient
        .from("admin_users")
        .insert({
          id: existingAuthUser.id,
          email,
          full_name:
            fullName || null,
          role,
          is_active: true,
        });

      if (insertExistingError) {
        throw insertExistingError;
      }

      return NextResponse.json({
        success: true,
        userId: existingAuthUser.id,
        existingAuthAccount: true,
        emailConfirmed: true,
      });
    }

    /* ----------------------------------------------------------
       CREATE NEW AUTH USER
       AUTO-CONFIRM EMAIL
    ---------------------------------------------------------- */

    const {
      data: created,
      error: createError,
    } =
      await adminClient.auth.admin.createUser({
        email,
        password,

        /* IMPORTANT:
           Staff created through the CMS do not
           need to confirm their email through
           Supabase. */
        email_confirm: true,

        user_metadata: {
          full_name: fullName,
        },
      });

    if (createError) {
      throw createError;
    }

    if (!created.user) {
      throw new Error(
        "Supabase did not return the new user."
      );
    }

    /* ----------------------------------------------------------
       CREATE CMS AUTHORIZATION RECORD
    ---------------------------------------------------------- */

    const {
      error: insertError,
    } = await adminClient
      .from("admin_users")
      .insert({
        id: created.user.id,
        email,
        full_name:
          fullName || null,
        role,
        is_active: true,
      });

    /* ----------------------------------------------------------
       CLEANUP AUTH USER IF DATABASE INSERT FAILS
    ---------------------------------------------------------- */

    if (insertError) {
      await adminClient.auth.admin.deleteUser(
        created.user.id
      );

      throw insertError;
    }

    return NextResponse.json({
      success: true,
      userId: created.user.id,
      existingAuthAccount: false,
      emailConfirmed: true,
    });
  } catch (error: any) {
    console.error(
      "Create CMS user failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Could not create CMS user.",
      },
      { status: 500 }
    );
  }
}

/* ============================================================
   PATCH — STATUS / ROLE / PASSWORD
============================================================ */

export async function PATCH(
  request: NextRequest
) {
  try {
    const {
      admin,
      error: authorizationError,
    } = await getAuthorizedAdmin(request);

    if (!admin) {
      return NextResponse.json(
        {
          error:
            authorizationError ||
            "Unauthorized.",
        },
        { status: 401 }
      );
    }

    if (admin.role !== "super_admin") {
      return NextResponse.json(
        {
          error:
            "Only a Super Administrator can modify CMS users.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const action = String(
      body.action || ""
    );

    const userId = String(
      body.userId || ""
    ).trim();

    if (!userId) {
      return NextResponse.json(
        {
          error: "User ID is required.",
        },
        { status: 400 }
      );
    }

    if (userId === admin.id) {
      return NextResponse.json(
        {
          error:
            "You cannot modify your own account from this panel.",
        },
        { status: 400 }
      );
    }

    /* ========================================================
       STATUS
    ======================================================== */

    if (action === "status") {
      const isActive =
        Boolean(body.isActive);

      const {
        data: targetUser,
        error: targetError,
      } = await adminClient
        .from("admin_users")
        .select(
          "id, role, is_active"
        )
        .eq("id", userId)
        .maybeSingle();

      if (targetError) {
        throw targetError;
      }

      if (!targetUser) {
        return NextResponse.json(
          {
            error:
              "CMS user not found.",
          },
          { status: 404 }
        );
      }

      /* Never deactivate the last Super Admin */

      if (
        targetUser.role ===
          "super_admin" &&
        !isActive
      ) {
        const {
          count,
          error: countError,
        } = await adminClient
          .from("admin_users")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq(
            "role",
            "super_admin"
          )
          .eq(
            "is_active",
            true
          );

        if (countError) {
          throw countError;
        }

        if ((count || 0) <= 1) {
          return NextResponse.json(
            {
              error:
                "The last active Super Administrator cannot be deactivated.",
            },
            { status: 400 }
          );
        }
      }

      /* Update CMS status */

      const {
        error: updateError,
      } = await adminClient
        .from("admin_users")
        .update({
          is_active: isActive,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          userId
        );

      if (updateError) {
        throw updateError;
      }

      /* Disable/enable Auth login */

      const {
        error: authStatusError,
      } =
        await adminClient.auth.admin.updateUserById(
          userId,
          {
            ban_duration: isActive
              ? "none"
              : "876000h",
          }
        );

      if (authStatusError) {
        throw authStatusError;
      }

      return NextResponse.json({
        success: true,
        isActive,
      });
    }

    /* ========================================================
       ROLE
    ======================================================== */

    if (action === "role") {
      const role =
        body.role === "super_admin"
          ? "super_admin"
          : "admin";

      const {
        data: targetUser,
        error: targetError,
      } = await adminClient
        .from("admin_users")
        .select(
          "id, role, is_active"
        )
        .eq(
          "id",
          userId
        )
        .maybeSingle();

      if (targetError) {
        throw targetError;
      }

      if (!targetUser) {
        return NextResponse.json(
          {
            error:
              "CMS user not found.",
          },
          { status: 404 }
        );
      }

      /* Never downgrade the last active Super Admin */

      if (
        role !== "super_admin" &&
        targetUser.role ===
          "super_admin" &&
        targetUser.is_active
      ) {
        const {
          count,
          error: countError,
        } = await adminClient
          .from("admin_users")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq(
            "role",
            "super_admin"
          )
          .eq(
            "is_active",
            true
          );

        if (countError) {
          throw countError;
        }

        if ((count || 0) <= 1) {
          return NextResponse.json(
            {
              error:
                "The last active Super Administrator cannot be downgraded.",
            },
            { status: 400 }
          );
        }
      }

      const {
        error: updateError,
      } = await adminClient
        .from("admin_users")
        .update({
          role,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          userId
        );

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json({
        success: true,
        role,
      });
    }

    /* ========================================================
       PASSWORD
    ======================================================== */

    if (action === "password") {
      const password = String(
        body.password || ""
      );

      if (password.length < 8) {
        return NextResponse.json(
          {
            error:
              "Password must contain at least 8 characters.",
          },
          { status: 400 }
        );
      }

      /*
        Password is changed server-side.
        email_confirm:true guarantees the account
        remains usable without a confirmation flow.
      */

      const {
        error: passwordError,
      } =
        await adminClient.auth.admin.updateUserById(
          userId,
          {
            password,
            email_confirm: true,
          }
        );

      if (passwordError) {
        throw passwordError;
      }

      return NextResponse.json({
        success: true,
        emailConfirmed: true,
      });
    }

    return NextResponse.json(
      {
        error:
          "Unsupported user operation.",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error(
      "Modify CMS user failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Could not modify CMS user.",
      },
      { status: 500 }
    );
  }
}

/* ============================================================
   DELETE — REMOVE AUTH + CMS USER
============================================================ */

export async function DELETE(
  request: NextRequest
) {
  try {
    const {
      admin,
      error: authorizationError,
    } = await getAuthorizedAdmin(request);

    if (!admin) {
      return NextResponse.json(
        {
          error:
            authorizationError ||
            "Unauthorized.",
        },
        { status: 401 }
      );
    }

    if (admin.role !== "super_admin") {
      return NextResponse.json(
        {
          error:
            "Only a Super Administrator can delete CMS users.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const userId = String(
      body.userId || ""
    ).trim();

    if (!userId) {
      return NextResponse.json(
        {
          error: "User ID is required.",
        },
        { status: 400 }
      );
    }

    if (userId === admin.id) {
      return NextResponse.json(
        {
          error:
            "You cannot delete your own account.",
        },
        { status: 400 }
      );
    }

    /* ----------------------------------------------------------
       FIND TARGET
    ---------------------------------------------------------- */

    const {
      data: targetUser,
      error: targetError,
    } = await adminClient
      .from("admin_users")
      .select(
        "id, role, is_active"
      )
      .eq(
        "id",
        userId
      )
      .maybeSingle();

    if (targetError) {
      throw targetError;
    }

    if (!targetUser) {
      return NextResponse.json(
        {
          error:
            "CMS user not found.",
        },
        { status: 404 }
      );
    }

    /* ----------------------------------------------------------
       PROTECT LAST ACTIVE SUPER ADMIN
    ---------------------------------------------------------- */

    if (
      targetUser.role ===
        "super_admin" &&
      targetUser.is_active
    ) {
      const {
        count,
        error: countError,
      } = await adminClient
        .from("admin_users")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "role",
          "super_admin"
        )
        .eq(
          "is_active",
          true
        );

      if (countError) {
        throw countError;
      }

      if ((count || 0) <= 1) {
        return NextResponse.json(
          {
            error:
              "The last active Super Administrator cannot be deleted.",
          },
          { status: 400 }
        );
      }
    }

    /* ----------------------------------------------------------
       DELETE AUTH ACCOUNT
       admin_users should have ON DELETE CASCADE
    ---------------------------------------------------------- */

    const {
      error: deleteError,
    } =
      await adminClient.auth.admin.deleteUser(
        userId
      );

    if (deleteError) {
      throw deleteError;
    }

    /* ----------------------------------------------------------
       EXTRA CLEANUP
    ---------------------------------------------------------- */

    await adminClient
      .from("admin_users")
      .delete()
      .eq(
        "id",
        userId
      );

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error(
      "Delete CMS user failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Could not delete CMS user.",
      },
      { status: 500 }
    );
  }
}