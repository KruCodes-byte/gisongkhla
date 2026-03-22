(() => {
  const FAVICON_PATH = "assets/1.png";
  const HEADER_LOGO_PATH = "assets/1.png";
  const HEADER_LOGO_WIDTH = 72;

  function ensureFavicon() {
    let favicon = document.querySelector('link[rel="icon"]');

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    favicon.type = "image/png";
    favicon.href = FAVICON_PATH;
  }

  function decorateSiteBrand() {
    document.querySelectorAll(".brand").forEach((brand) => {
      if (brand.querySelector(".brand-icon")) {
        return;
      }

      const label = brand.textContent.trim() || "GI Songkhla Explorer";
      const icon = document.createElement("img");
      const text = document.createElement("span");

      icon.className = "brand-icon";
      icon.src = HEADER_LOGO_PATH;
      icon.alt = "";
      icon.width = HEADER_LOGO_WIDTH;
      icon.setAttribute("aria-hidden", "true");
      icon.decoding = "async";

      text.className = "brand-text";
      text.textContent = label;

      brand.textContent = "";
      brand.append(icon, text);
    });
  }

  function initMobileMenus() {
    document.querySelectorAll(".site-header").forEach((header, index) => {
      const nav = header.querySelector(".site-nav");
      if (!nav || header.querySelector(".site-nav-toggle")) {
        return;
      }

      const navId = nav.id || `site-nav-${index + 1}`;
      const profileChip = header.querySelector(".profile-chip");
      const toggleButton = document.createElement("button");
      const closeMenu = () => {
        header.classList.remove("is-nav-open");
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.setAttribute("aria-label", "Open menu");
      };
      const openMenu = () => {
        header.classList.add("is-nav-open");
        toggleButton.setAttribute("aria-expanded", "true");
        toggleButton.setAttribute("aria-label", "Close menu");
      };

      nav.id = navId;
      toggleButton.type = "button";
      toggleButton.className = "site-nav-toggle";
      toggleButton.setAttribute("aria-controls", navId);
      toggleButton.setAttribute("aria-expanded", "false");
      toggleButton.setAttribute("aria-label", "Open menu");
      toggleButton.innerHTML = `
        <span class="site-nav-toggle-icon" aria-hidden="true">
          <span class="site-nav-toggle-line"></span>
          <span class="site-nav-toggle-line"></span>
          <span class="site-nav-toggle-line"></span>
        </span>
        <span class="site-nav-toggle-label">เมนู</span>
      `;

      nav.before(toggleButton);

      toggleButton.addEventListener("click", () => {
        if (header.classList.contains("is-nav-open")) {
          closeMenu();
          return;
        }

        openMenu();
      });

      nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

      if (profileChip) {
        profileChip.addEventListener("click", closeMenu);
      }

      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu();
        }
      });

      const desktopMedia = window.matchMedia("(min-width: 641px)");
      const handleDesktopChange = (event) => {
        if (event.matches) {
          closeMenu();
        }
      };

      if (typeof desktopMedia.addEventListener === "function") {
        desktopMedia.addEventListener("change", handleDesktopChange);
      } else if (typeof desktopMedia.addListener === "function") {
        desktopMedia.addListener(handleDesktopChange);
      }
    });
  }

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
            <p>นวัตกรรมเว็บไซต์สื่อประสมเชิงปฏิสัมพันธ์เพื่อการเรียนรู้และสืบสานภูมิปัญญาสิ่งบ่งชี้ทางภูมิศาสตร์จังหวัดสงขลา</p>
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
    ensureFavicon();
    decorateSiteBrand();
    initMobileMenus();
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
