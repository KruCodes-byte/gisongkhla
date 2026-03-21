(() => {
  const PLACEHOLDER_URL = "https://YOUR_PROJECT.supabase.co";
  const PLACEHOLDER_KEY = "YOUR_PUBLIC_ANON_KEY";
  const SUPABASE_URL = "https://vmpcajlimjnmzfzompbi.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcGNhamxpbWpubXpmem9tcGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODg5OTcsImV4cCI6MjA4OTU2NDk5N30.ezkwtEKdVZVO575WA69ZlPRQoiFwzx24wGPQBDtJuGE";

  function isConfigured() {
    return (
      typeof window.supabase !== "undefined" &&
      SUPABASE_URL &&
      SUPABASE_ANON_KEY &&
      SUPABASE_URL !== PLACEHOLDER_URL &&
      SUPABASE_ANON_KEY !== PLACEHOLDER_KEY
    );
  }

  const client = isConfigured()
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

  async function getUser() {
    if (!client) {
      return null;
    }

    try {
      const { data, error } = await client.auth.getUser();
      if (error || !data.user) {
        return null;
      }
      return data.user;
    } catch (error) {
      console.warn("Unable to read Supabase user.", error);
      return null;
    }
  }

  async function getSession() {
    if (!client) {
      return null;
    }

    try {
      const { data, error } = await client.auth.getSession();
      if (error || !data.session) {
        return null;
      }
      return data.session;
    } catch (error) {
      console.warn("Unable to read Supabase session.", error);
      return null;
    }
  }

  async function signIn({ email, password }) {
    if (!client) {
      return {
        ok: false,
        error: "Supabase ยังไม่ได้ตั้งค่า",
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          ok: false,
          error: error.message,
        };
      }

      return {
        ok: true,
        user: data.user || null,
        session: data.session || null,
      };
    } catch (error) {
      return {
        ok: false,
        error: "ไม่สามารถเข้าสู่ระบบได้ในขณะนี้",
      };
    }
  }

  async function signUp({ email, password, fullName }) {
    if (!client) {
      return {
        ok: false,
        error: "Supabase ยังไม่ได้ตั้งค่า",
      };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return {
          ok: false,
          error: error.message,
        };
      }

      return {
        ok: true,
        user: data.user || null,
        session: data.session || null,
        needsEmailConfirmation: !!data.user && !data.session,
      };
    } catch (error) {
      return {
        ok: false,
        error: "ไม่สามารถสมัครสมาชิกได้ในขณะนี้",
      };
    }
  }

  async function signInWithGoogle({ redirectTo }) {
    if (!client) {
      return {
        ok: false,
        error: "Supabase ยังไม่ได้ตั้งค่า",
      };
    }

    try {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        return {
          ok: false,
          error: error.message,
        };
      }

      return {
        ok: true,
        data,
      };
    } catch (error) {
      return {
        ok: false,
        error: "ไม่สามารถเชื่อมต่อการเข้าสู่ระบบด้วย Google ได้",
      };
    }
  }

  function onAuthStateChange(callback) {
    if (!client) {
      return () => {};
    }

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }

  async function fetchBundle() {
    const user = await getUser();
    if (!user) {
      return null;
    }

    try {
      const [profileResult, progressResult, certificateResult] = await Promise.all([
        client
          .from("profiles")
          .select("full_name,email,avatar_url")
          .eq("id", user.id)
          .maybeSingle(),
        client.from("gi_progress").select("*").eq("user_id", user.id),
        client
          .from("certificates")
          .select("certificate_code,total_score,total_possible,average_percent,issued_at")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      return {
        profile: {
          fullName:
            profileResult.data?.full_name ||
            user.user_metadata?.full_name ||
            "ผู้เรียน GI Songkhla Explorer",
          email: profileResult.data?.email || user.email || "guest@softpower-songkhla.local",
          avatarUrl: profileResult.data?.avatar_url || user.user_metadata?.avatar_url || "",
        },
        progress: progressResult.data || [],
        certificate: certificateResult.data
          ? {
              code: certificateResult.data.certificate_code,
              totalScore: certificateResult.data.total_score,
              totalPossible: certificateResult.data.total_possible,
              averagePercent: certificateResult.data.average_percent,
              issuedAt: certificateResult.data.issued_at,
            }
          : null,
      };
    } catch (error) {
      console.warn("Unable to fetch Supabase bundle.", error);
      return null;
    }
  }

  async function saveProfile(profile) {
    const user = await getUser();
    if (!user) {
      return null;
    }

    try {
      await client.from("profiles").upsert(
        {
          id: user.id,
          full_name: profile.fullName,
          email: profile.email,
          avatar_url: profile.avatarUrl || "",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    } catch (error) {
      console.warn("Unable to save Supabase profile.", error);
    }

    return null;
  }

  async function saveRouteProgress(routeState) {
    const user = await getUser();
    if (!user) {
      return null;
    }

    try {
      await client.from("gi_progress").upsert(
        {
          user_id: user.id,
          gi_slug: routeState.slug,
          learning_started: !!routeState.learningStarted,
          game_opened: !!routeState.gameOpened,
          game_completed: !!routeState.gameCompleted,
          quiz_score: routeState.quizScore,
          quiz_total: routeState.quizTotal,
          quiz_percent: routeState.quizPercent,
          quiz_completed_at: routeState.completedAt,
          game_completed_at: routeState.gameCompletedAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,gi_slug" }
      );
    } catch (error) {
      console.warn("Unable to save Supabase progress.", error);
    }

    return null;
  }

  async function saveCertificate(certificate) {
    const user = await getUser();
    if (!user) {
      return null;
    }

    try {
      await client.from("certificates").upsert(
        {
          user_id: user.id,
          certificate_code: certificate.code,
          total_score: certificate.totalScore,
          total_possible: certificate.totalPossible,
          average_percent: certificate.averagePercent,
          issued_at: certificate.issuedAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    } catch (error) {
      console.warn("Unable to save certificate.", error);
    }

    return null;
  }

  async function logout() {
    if (!client) {
      return;
    }

    try {
      await client.auth.signOut();
    } catch (error) {
      console.warn("Unable to sign out from Supabase.", error);
    }
  }

  window.SupabaseService = {
    configured: !!client,
    client,
    getSession,
    getUser,
    signIn,
    signUp,
    signInWithGoogle,
    onAuthStateChange,
    fetchBundle,
    saveProfile,
    saveRouteProgress,
    saveCertificate,
    logout,
  };
})();
