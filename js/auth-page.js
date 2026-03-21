(() => {
  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function getSafeNextPath() {
    const raw = getParams().get("next");
    if (!raw) {
      return "profile.html";
    }

    if (
      raw.startsWith("http://") ||
      raw.startsWith("https://") ||
      raw.startsWith("auth.html")
    ) {
      return "profile.html";
    }

    return raw;
  }

  function getGoogleRedirectUrl() {
    const target = new URL("auth.html", window.location.href);
    target.searchParams.set("mode", "login");
    target.searchParams.set("next", getSafeNextPath());
    return target.toString();
  }

  function getModeContent(isLogin) {
    if (isLogin) {
      return {
        title: "Sign in",
        caption: "เข้าสู่ระบบเพื่อกลับไปยังเส้นทางการเรียนรู้ของคุณ",
      };
    }

    return {
      title: "Sign up",
      caption: "สร้างบัญชีเพื่อบันทึกความคืบหน้า คะแนน และเกียรติบัตรของคุณ",
    };
  }

  function setMode(mode) {
    const isLogin = mode !== "register";
    document.querySelector("[data-login-form]").hidden = !isLogin;
    document.querySelector("[data-register-form]").hidden = isLogin;
    document.querySelector("[data-open-login]").classList.toggle("is-active", isLogin);
    document.querySelector("[data-open-register]").classList.toggle("is-active", !isLogin);
    const content = getModeContent(isLogin);
    document.querySelector("[data-auth-title]").textContent = content.title;
    document.querySelector("[data-auth-caption]").textContent = content.caption;

    const params = getParams();
    params.set("mode", isLogin ? "login" : "register");
    window.history.replaceState({}, "", `auth.html?${params.toString()}`);
  }

  function showStatus(message, type = "") {
    const node = document.querySelector("[data-auth-status]");
    node.hidden = !message;
    node.className = `notice-banner${type ? ` is-${type}` : ""}`;
    node.textContent = message;
  }

  function setLoading(form, isLoading) {
    form.querySelectorAll("input, button").forEach((element) => {
      element.disabled = isLoading;
    });
  }

  async function redirectIfAuthenticated() {
    if (!window.SupabaseService?.configured) {
      return false;
    }

    const user = await window.SupabaseService.getUser();
    if (!user) {
      return false;
    }

    window.location.replace(getSafeNextPath());
    return true;
  }

  function initConfigWarning() {
    const warning = document.querySelector("[data-auth-config-warning]");
    if (!window.SupabaseService?.configured) {
      warning.hidden = false;
      showStatus("กรุณาใส่ Project URL และ Public Anon Key ใน js/supabase.js และเปิด Google provider ใน Supabase ก่อนใช้งานระบบสมาชิก", "error");
      document.querySelectorAll("[data-login-form] input, [data-login-form] button, [data-register-form] input, [data-register-form] button, [data-google-auth]").forEach((element) => {
        element.disabled = true;
      });
      return;
    }

    warning.hidden = true;
  }

  async function handleLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    setLoading(form, true);
    showStatus("");

    const result = await window.SupabaseService.signIn({ email, password });
    if (!result.ok) {
      showStatus(result.error || "เข้าสู่ระบบไม่สำเร็จ", "error");
      setLoading(form, false);
      return;
    }

    await window.SongkhlaApp.resetState();
    await window.SongkhlaApp.reloadRemoteState({ resetFirst: true });
    showStatus("เข้าสู่ระบบสำเร็จ กำลังพาไปยังหน้าถัดไป", "success");
    window.location.replace(getSafeNextPath());
  }

  async function handleRegister(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password.length < 6) {
      showStatus("รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร", "error");
      return;
    }

    if (password !== confirmPassword) {
      showStatus("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน", "error");
      return;
    }

    setLoading(form, true);
    showStatus("");

    const result = await window.SupabaseService.signUp({
      email,
      password,
      fullName,
    });

    if (!result.ok) {
      showStatus(result.error || "สมัครสมาชิกไม่สำเร็จ", "error");
      setLoading(form, false);
      return;
    }

    if (result.needsEmailConfirmation) {
      showStatus("สมัครสมาชิกสำเร็จ กรุณาตรวจอีเมลเพื่อยืนยันบัญชีก่อนเข้าสู่ระบบ", "success");
      setMode("login");
      setLoading(form, false);
      return;
    }

    await window.SongkhlaApp.resetState();
    await window.SongkhlaApp.saveProfile({
      fullName,
      email,
      avatarUrl: "",
    });
    await window.SongkhlaApp.reloadRemoteState({ resetFirst: true });
    showStatus("สมัครสมาชิกสำเร็จ กำลังพาไปยังหน้าถัดไป", "success");
    window.location.replace(getSafeNextPath());
  }

  async function handleGoogleAuth() {
    showStatus("");
    const result = await window.SupabaseService.signInWithGoogle({
      function getGoogleRedirectUrl() {
  const target = new URL("auth.html", window.location.href);
  target.searchParams.set("mode", "login");
  target.searchParams.set("next", getSafeNextPath());
  return target.toString();
});

    if (!result.ok) {
      showStatus(result.error || "ไม่สามารถเริ่มการเข้าสู่ระบบด้วย Google ได้", "error");
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const siteState = await window.SiteBoot;
    if (siteState?.redirected) {
      return;
    }
    initConfigWarning();

    if (await redirectIfAuthenticated()) {
      return;
    }

    const mode = getParams().get("mode") === "register" ? "register" : "login";
    setMode(mode);

    document.querySelector("[data-open-login]").addEventListener("click", () => setMode("login"));
    document.querySelector("[data-open-register]").addEventListener("click", () => setMode("register"));
    document.querySelector("[data-login-form]").addEventListener("submit", handleLogin);
    document.querySelector("[data-register-form]").addEventListener("submit", handleRegister);
    document.querySelector("[data-google-auth]").addEventListener("click", handleGoogleAuth);
  });
})();
