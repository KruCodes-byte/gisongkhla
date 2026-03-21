(() => {
  function getSharedFooterMarkup() {
    return `
      <footer class="site-footer showcase-footer">
        <div class="showcase-footer-grid">
          <section class="showcase-footer-team">
            <p class="showcase-overline"></p>
            <h2>ผู้จัดทำ</h2>
            <ul class="showcase-team-list" data-site-developers></ul>
            <div class="showcase-footer-meta">
              <h3>อาจารย์ที่ปรึกษา</h3>
              <p data-site-advisor></p>
              <p data-site-university></p>
            </div>
          </section>

          <section class="showcase-footer-brand">
            <img class="showcase-footer-logo" src="assets/ชื่อ.png" alt="GI Songkhla Explorer">
            <p>นวัตกรรมเว็บไซต์สื่อประสมเชิงปฏิสัมพันธ์เพื่อการเรียนรู้และสื่อสารอัตลักษณ์สินค้า GI ของจังหวัดสงขลาในรูปแบบที่เข้าถึงง่ายขึ้น</p>
            <div class="showcase-footer-decor" aria-hidden="true">
              <img class="showcase-footer-oldtown" src="assets/1.png" alt="">
            </div>
          </section>
        </div>
        <p class="footer-end">&copy; <span data-current-year></span> GI Songkhla Explorer</p>
      </footer>
    `.trim();
  }

  function ensureSharedFooter() {
    if (document.body.dataset.page === "home") {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = getSharedFooterMarkup();
    const footer = wrapper.firstElementChild;
    const existingFooter = document.querySelector("footer.site-footer");

    if (existingFooter) {
      existingFooter.replaceWith(footer);
      return;
    }

    document.body.appendChild(footer);
  }

  function setActiveNav() {
    const current = document.body.dataset.page;
    if (!current) {
      return;
    }

    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === current) {
        link.classList.add("is-active");
      }
    });
  }

  function bindFooterYear() {
    document.querySelectorAll("[data-current-year]").forEach((yearNode) => {
      yearNode.textContent = new Date().getFullYear();
    });
  }

  function bindFooterMeta() {
    if (!window.SongkhlaData) {
      return;
    }

    document.querySelectorAll("[data-site-developers]").forEach((developersNode) => {
      developersNode.innerHTML = window.SongkhlaData.developers
        .map((name) => `<li>${name}</li>`)
        .join("");
    });

    document.querySelectorAll("[data-site-advisor]").forEach((advisorNode) => {
      advisorNode.textContent = window.SongkhlaData.advisor;
    });

    document.querySelectorAll("[data-site-university]").forEach((universityNode) => {
      universityNode.textContent = window.SongkhlaData.university;
    });
  }

  function getCurrentPathWithQuery() {
    return `${window.location.pathname.split("/").pop() || "index.html"}${window.location.search}`;
  }

  function getAuthUrl(mode = "login") {
    return `auth.html?mode=${encodeURIComponent(mode)}&next=${encodeURIComponent(
      getCurrentPathWithQuery()
    )}`;
  }

  async function getCurrentUser() {
    if (!window.SupabaseService?.configured) {
      return null;
    }

    return window.SupabaseService.getUser();
  }

  async function enforceProtectedRoute(user) {
    if (document.body.dataset.authRequired !== "true") {
      return false;
    }

    if (user) {
      return false;
    }

    window.location.replace(getAuthUrl("login"));
    return true;
  }

  async function renderHeaderProfile(user) {
    const profileChip = document.querySelector(".profile-chip");
    const profileName = document.querySelector("[data-profile-name]");
    if (!profileChip || !profileName) {
      return;
    }

    if (user) {
      const displayName =
        user.user_metadata?.full_name || user.email || "โปรไฟล์";
      profileChip.href = "profile.html";
      profileName.textContent = displayName;
      return;
    }

    profileChip.href = getAuthUrl("login");
    profileName.textContent = "เข้าสู่ระบบ";
  }

  window.SiteBoot = (async () => {
    setActiveNav();
    ensureSharedFooter();
    bindFooterMeta();
    bindFooterYear();

    const user = await getCurrentUser();
    const redirected = await enforceProtectedRoute(user);
    if (redirected) {
      return { user: null, redirected: true };
    }
    await renderHeaderProfile(user);

    return { user, redirected: false };
  })();
})();
