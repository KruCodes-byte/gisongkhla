(() => {
  function getRouteFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("district") || window.SongkhlaData.routes[0].slug;
    return window.SongkhlaApp.getRouteBySlug(slug) || window.SongkhlaData.routes[0];
  }

  function isExternalUrl(value) {
    return /^https?:\/\//i.test(String(value || "").trim());
  }

  function getExternalGameUrl(route) {
    if (isExternalUrl(route.externalGameUrl)) {
      return route.externalGameUrl;
    }

    if (isExternalUrl(route.gameUrl)) {
      return route.gameUrl;
    }

    return "";
  }

  function showStatus(message, type = "") {
    const node = document.querySelector("[data-game-link-status]");
    if (!node) {
      return;
    }

    node.hidden = !message;
    node.className = `notice-banner${type ? ` is-${type}` : ""}`;
    node.textContent = message;
  }

  function renderLauncher(route) {
    const targetUrl = getExternalGameUrl(route);
    document.querySelector("[data-game-title]").textContent = `เกมภายนอก ${route.giName}`;
    document.querySelector("[data-game-subtitle]").textContent =
      `${route.districtName} · ระบบจะบันทึกเฉพาะการกดเข้าเกม ไม่มีคะแนนเกมในเว็บไซต์นี้`;
    document.querySelector("[data-game-description]").textContent =
      `เมื่อกดเปิดเกมของ ${route.giName} ระบบจะนับสถานะว่าเข้าเกมแล้ว และให้นักเรียนกลับมาทำข้อสอบในเว็บไซต์นี้ตามปกติ`;
    document.querySelector("[data-game-requirement]").textContent =
      "เงื่อนไขเกียรติบัตรใช้เพียงการกดเข้าเกมของแต่ละ GI ครบ ไม่ได้เก็บคะแนนจากเกมภายนอก";

    const openButton = document.querySelector("[data-open-external-game]");
    const backButton = document.querySelector("[data-back-to-district]");
    backButton.href = `district.html?district=${route.slug}`;

    if (!targetUrl) {
      openButton.disabled = true;
      showStatus("ยังไม่ได้ตั้งค่าลิงก์เกมภายนอกของ GI นี้ใน js/data.js", "error");
      return { targetUrl: "" };
    }

    openButton.disabled = false;
    showStatus("");
    return { targetUrl };
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const siteState = await window.SiteBoot;
    if (siteState?.redirected) {
      return;
    }

    await window.SongkhlaApp.ready;
    const route = getRouteFromQuery();
    const { targetUrl } = renderLauncher(route);

    document.querySelector("[data-open-external-game]")?.addEventListener("click", async () => {
      await window.SongkhlaApp.markGameOpened(route.slug);
      showStatus("บันทึกสถานะเข้าเกมแล้ว ระบบกำลังเปิดเกมภายนอก", "success");

      const popup = window.open(targetUrl, "_blank", "noopener,noreferrer");
      if (!popup) {
        window.location.href = targetUrl;
      }
    });
  });
})();
