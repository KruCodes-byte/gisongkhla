(() => {
  function initials(name) {
    return (name || "SP")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function renderAvatar(profile) {
    const avatar = document.querySelector("[data-avatar]");
    if (!avatar) {
      return;
    }

    if (profile.avatarUrl) {
      avatar.innerHTML = `<img src="${profile.avatarUrl}" alt="${profile.fullName}">`;
      return;
    }

    avatar.innerHTML = `<span>${initials(profile.fullName)}</span>`;
  }

  function renderProgressList() {
    const list = document.querySelector("[data-profile-progress]");
    list.innerHTML = window.SongkhlaData.routes
      .map((route) => {
        const progress = window.SongkhlaApp.getRouteProgress(route.slug);
        return `
          <li>
            <strong>${route.giName}</strong>
            <span>${progress.quizScore !== null ? `คะแนน ${progress.quizScore}/${progress.quizTotal}` : "ยังไม่สอบ"}</span>
            <span>${progress.gameOpened ? "กดเข้าเกมแล้ว" : "ยังไม่กดเข้าเกม"}</span>
          </li>
        `;
      })
      .join("");
  }

  function renderProfile() {
    const profile = window.SongkhlaApp.getProfile();
    const stats = window.SongkhlaApp.getStats();
    const certificate = window.SongkhlaApp.getCertificate();

    renderAvatar(profile);
    document.querySelector("[data-profile-full-name]").textContent = profile.fullName;
    document.querySelector("[data-profile-email]").textContent = profile.email;

    document.querySelector("[data-input-full-name]").value = profile.fullName;
    document.querySelector("[data-input-email]").value = profile.email;
    document.querySelector("[data-input-avatar]").value = profile.avatarUrl || "";

    document.querySelector("[data-profile-total-score]").textContent = `${stats.totalScore}/${stats.totalPossible}`;
    document.querySelector("[data-profile-games]").textContent = `${stats.gamesOpened}/${stats.totalRoutes}`;
    document.querySelector("[data-profile-certificate]").textContent = certificate
      ? `ออกแล้ว ${certificate.code}`
      : "ยังไม่พร้อม";

    const certLink = document.querySelector("[data-certificate-link]");
    if (certLink) {
      certLink.hidden = !certificate;
    }
    if (certificate && certLink) {
      certLink.href = "certificate.html";
    }

    renderProgressList();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const siteState = await window.SiteBoot;
    if (siteState?.redirected) {
      return;
    }
    await window.SongkhlaApp.ready;
    renderProfile();

    document.querySelector("[data-profile-form]").addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = {
        fullName: document.querySelector("[data-input-full-name]").value.trim() || "ผู้เรียน GI Songkhla Explorer",
        email: document.querySelector("[data-input-email]").value.trim() || "guest@softpower-songkhla.local",
        avatarUrl: document.querySelector("[data-input-avatar]").value.trim(),
      };
      await window.SongkhlaApp.saveProfile(payload);
      renderProfile();
    });

    document.querySelector("[data-logout]")?.addEventListener("click", async () => {
      await window.SongkhlaApp.logout();
      window.location.href = "index.html";
    });
  });
})();
