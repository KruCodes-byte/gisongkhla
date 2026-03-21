(() => {
  const PROVINCE_MAP_ASSET = "assets/songkhla.svg";

  function getDistrictFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("district") || window.SongkhlaData.districts[0].slug;
    return window.SongkhlaData.districts.find((district) => district.slug === slug) || window.SongkhlaData.districts[0];
  }

  function getDistrictRoutes(district) {
    return district.giSlugs
      .map((slug) => window.SongkhlaApp.getRouteBySlug(slug))
      .filter(Boolean);
  }

  function getDistrictProgress(routes) {
    const progressList = routes.map((route) => window.SongkhlaApp.getRouteProgress(route.slug));
    return {
      learningStarted: progressList.filter((progress) => progress.learningStarted).length,
      quizCompleted: progressList.filter((progress) => progress.quizScore !== null).length,
      gamesOpened: progressList.filter((progress) => progress.gameOpened).length,
      total: routes.length,
    };
  }

  function getDistrictStatus(district) {
    const routes = getDistrictRoutes(district);
    const progressList = routes.map((route) => window.SongkhlaApp.getRouteProgress(route.slug));
    const learningStarted = progressList.filter((progress) => progress.learningStarted).length;
    const quizCompleted = progressList.filter((progress) => progress.quizScore !== null).length;
    const gamesOpened = progressList.filter((progress) => progress.gameOpened).length;
    const scoreEarned = progressList.reduce(
      (sum, progress) => sum + (typeof progress.quizScore === "number" ? progress.quizScore : 0),
      0
    );
    const scorePossible = progressList.reduce((sum, progress) => sum + (progress.quizTotal || 0), 0);
    const inProgress = learningStarted > 0 || quizCompleted > 0 || gamesOpened > 0;
    const completed = routes.length > 0 && quizCompleted === routes.length;

    return {
      learningStarted,
      quizCompleted,
      gamesOpened,
      total: routes.length,
      scoreEarned,
      scorePossible,
      label: completed ? "สำเร็จแล้ว" : inProgress ? "กำลังเรียนรู้" : "ยังไม่เริ่ม",
      className: completed ? "is-complete" : inProgress ? "is-progress" : "is-faded",
    };
  }

  function getRouteProgressState(route) {
    const progress = window.SongkhlaApp.getRouteProgress(route.slug);
    const state = window.SongkhlaEvolution.getProgressState(progress);

    return {
      route,
      progress,
      percent: state.percent,
      stage: state.stage,
      status: state.status,
    };
  }

  function hexToRgba(hex, alpha) {
    const normalized = String(hex || "").trim().replace("#", "");
    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
      return `rgba(15, 93, 168, ${alpha})`;
    }

    const red = parseInt(normalized.slice(0, 2), 16);
    const green = parseInt(normalized.slice(2, 4), 16);
    const blue = parseInt(normalized.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function createCalloutGeometry(svg, district) {
    const targetGroup = svg.querySelector(`#${district.svgId}`);
    if (!targetGroup || !svg.viewBox?.baseVal) {
      return null;
    }

    const box = targetGroup.getBBox();
    const viewBox = svg.viewBox.baseVal;
    const centerX = ((box.x + box.width / 2) / viewBox.width) * 100;
    const centerY = ((box.y + box.height / 2) / viewBox.height) * 100;
    const placeOnRight = centerX <= 55;

    const labelX = clamp(centerX + (placeOnRight ? 22 : -22), 16, 84);
    const labelY = clamp(
      centerY < 24 ? centerY + 10 : centerY > 76 ? centerY - 10 : centerY - 4,
      14,
      86
    );
    const elbowX = clamp(centerX + (placeOnRight ? 9 : -9), 8, 92);
    const endX = placeOnRight ? labelX - 2 : labelX + 2;

    return {
      centerX,
      centerY,
      labelX,
      labelY,
      direction: placeOnRight ? "right" : "left",
      linePath: `M ${centerX} ${centerY} L ${elbowX} ${labelY} L ${endX} ${labelY}`,
    };
  }

  function createCalloutMarkup(district, geometry) {
    return `
      <div class="district-map-callout is-${geometry.direction}" style="left:${geometry.labelX}%;top:${geometry.labelY}%;">
        <div class="district-map-callout-card">
          <div class="district-map-callout-hero">
            <img class="district-map-callout-logo" src="${district.logo}" alt="${district.districtName}">
          </div>
        </div>
      </div>
    `;
  }

  function getProductImage(route) {
    return route.productImage || route.logo;
  }

  function normalizeYouTubeEmbedUrl(url) {
    const value = String(url || "").trim();
    if (!value) {
      return "";
    }

    if (value.includes("youtube.com/embed/") || value.includes("youtube-nocookie.com/embed/")) {
      return value;
    }

    const watchMatch = value.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    const shortMatch = value.match(/youtu\.be\/([^?&/]+)/);
    if (shortMatch) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    return value;
  }

  function getVideoEmbedUrl(video) {
    return normalizeYouTubeEmbedUrl(video.youtubeEmbed || video.youtubeUrl || video.url || video.embedUrl || "");
  }

  function getAutoplayEmbedUrl(url) {
    if (!url) {
      return "";
    }

    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set("autoplay", "1");
      parsedUrl.searchParams.set("mute", "1");
      parsedUrl.searchParams.set("playsinline", "1");
      parsedUrl.searchParams.set("controls", "1");
      parsedUrl.searchParams.set("rel", "0");
      parsedUrl.searchParams.set("modestbranding", "1");
      parsedUrl.searchParams.set("iv_load_policy", "3");
      return parsedUrl.toString();
    } catch (error) {
      return url;
    }
  }

  function getDirectGameUrl(route) {
    const targetUrl = String(route.externalGameUrl || route.gameUrl || "").trim();
    if (!targetUrl) {
      return "";
    }

    if (/^game\.html/i.test(targetUrl)) {
      return "";
    }

    return targetUrl;
  }

  async function ensureDistrictLearningStarted(routes) {
    const pendingRoutes = routes.filter((route) => !window.SongkhlaApp.getRouteProgress(route.slug).learningStarted);
    if (!pendingRoutes.length) {
      return;
    }

    await Promise.all(pendingRoutes.map((route) => window.SongkhlaApp.markLearningStarted(route.slug)));
  }

  function renderOverview(district, routes) {
    const progress = getDistrictProgress(routes);
    const giNames = routes.map((route) => route.giName).join(", ");

    document.querySelector("[data-district-label]").textContent = `มีสินค้า GI ${routes.length} รายการ`;
    document.querySelector("[data-district-title]").textContent = district.districtName;
    document.querySelector("[data-district-subtitle]").textContent = `สินค้า GI ในอำเภอนี้: ${giNames}`;
    document.querySelector("[data-learning-status]").textContent = `${progress.learningStarted}/${progress.total} รายการ`;
    document.querySelector("[data-score-status]").textContent = `${progress.quizCompleted}/${progress.total} รายการ`;
    document.querySelector("[data-game-status]").textContent = `${progress.gamesOpened}/${progress.total} รายการ`;
  }

  function renderHeroEvolution(routes) {
    const wrapper = document.querySelector("[data-district-hero-evolution]");
    if (!wrapper) {
      return;
    }

    wrapper.innerHTML = routes
      .map((route) => {
        const state = getRouteProgressState(route);
        return `
          <article class="district-hero-evolution-card ${state.status.className}">
            <div class="district-hero-evolution-visual is-${state.stage.key}">
              ${window.SongkhlaEvolution.renderSvg(route.evolutionType, state.stage.key)}
            </div>
            <div class="district-hero-evolution-copy">
              <span class="district-hero-evolution-label">วิวัฒนาการสินค้า GI</span>
              <strong>${route.giName}</strong>
              <span class="district-hero-evolution-meta">${state.status.label} · ${state.percent}%</span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderInfoCards(routes) {
    const wrapper = document.querySelector("[data-gi-info-stack]");
    wrapper.innerHTML = routes
      .map(
        (route) => `
          <article class="section-card district-product-card">
            <div class="district-product-top">
              <div class="district-product-visual">
                <img src="${getProductImage(route)}" alt="${route.giName}">
              </div>
              <div class="district-product-copy">
                <h2>${route.giName}</h2>
                <p>${route.overview}</p>
              </div>
            </div>
            <ul class="info-list">
              <li>
                <strong>ประวัติ</strong>
                <p>${route.history}</p>
              </li>
              <li>
                <strong>ความสำคัญ</strong>
                <p>${route.importance}</p>
              </li>
              <li>
                <strong>แหล่งผลิต</strong>
                <p>${route.source}</p>
              </li>
            </ul>
            <ul class="requirements-list">
              ${route.learningGoals.map((goal) => `<li>${goal}</li>`).join("")}
            </ul>
          </article>
        `
      )
      .join("");
  }

  async function renderMap(district) {
    const mapNode = document.querySelector("[data-district-map]");
    const pointList = document.querySelector("[data-point-list]");
    pointList.hidden = true;
    pointList.innerHTML = "";

    mapNode.classList.add("has-image", "has-province-map");
    mapNode.style.setProperty("--district-map-fill", hexToRgba(district.accent, 0.28));
    mapNode.style.setProperty("--district-map-stroke", district.accent || "#0f5da8");

    try {
      const response = await fetch(PROVINCE_MAP_ASSET);
      if (!response.ok) {
        throw new Error(`Unable to load ${PROVINCE_MAP_ASSET}`);
      }

      const markup = await response.text();
      mapNode.innerHTML = `
        <div class="district-map-svg district-map-svg-province" aria-label="แผนที่จังหวัดสงขลา">
          ${markup}
        </div>
        <svg class="district-map-callout-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>
        <div class="district-map-callout-host" aria-hidden="true"></div>
      `;

      const svg = mapNode.querySelector(".district-map-svg svg");
      if (!svg) {
        throw new Error("Province SVG element not found.");
      }

      svg.querySelectorAll("g[id]").forEach((group) => {
        group.classList.add("is-dimmed");
      });

      const activeGroup = svg.querySelector(`#${district.svgId}`);
      if (activeGroup) {
        activeGroup.classList.remove("is-dimmed");
        activeGroup.classList.add("is-active");
      }

      const geometry = createCalloutGeometry(svg, district);
      if (!geometry) {
        return;
      }

      mapNode.querySelector(".district-map-callout-layer").innerHTML = `
        <path class="district-map-callout-line" d="${geometry.linePath}" pathLength="100"></path>
        <circle class="district-map-callout-dot" cx="${geometry.centerX}" cy="${geometry.centerY}" r="1.15"></circle>
      `;
      mapNode.querySelector(".district-map-callout-host").innerHTML = createCalloutMarkup(district, geometry);
    } catch (error) {
      console.warn("Unable to render province svg map.", error);
      mapNode.classList.remove("has-province-map");
      mapNode.innerHTML = `
        <div class="district-map-fallback">
          <strong>${district.districtName}</strong>
          <span>ไม่สามารถโหลดแผนที่จังหวัดสงขลาได้ในขณะนี้</span>
        </div>
      `;
    }
  }

  function renderVideos(routes) {
    const wrapper = document.querySelector("[data-video-grid]");
    if (!wrapper) {
      return;
    }

    const videoEntries = routes
      .filter((route) => Array.isArray(route.videos) && route.videos.length)
      .map((route) => ({
        route,
        video: route.videos[0],
      }));

    if (!videoEntries.length) {
      wrapper.innerHTML = "";
      return;
    }

    wrapper.innerHTML = `
      ${
        videoEntries.length > 1
          ? `
            <div class="video-choice-row" role="tablist" aria-label="เลือกคลิปสินค้า GI">
              ${videoEntries
                .map(
                  ({ route }, index) => `
                    <button
                      class="video-choice-button ${index === 0 ? "is-active" : ""}"
                      type="button"
                      role="tab"
                      aria-selected="${index === 0 ? "true" : "false"}"
                      data-video-choice="${index}"
                    >
                      ${route.giName}
                    </button>
                  `
                )
                .join("")}
            </div>
          `
          : ""
      }
      <div class="video-player-shell" data-video-player></div>
    `;

    const player = wrapper.querySelector("[data-video-player]");
    const choiceButtons = Array.from(wrapper.querySelectorAll("[data-video-choice]"));

    function renderActiveVideo(activeIndex) {
      const safeIndex = clamp(activeIndex, 0, videoEntries.length - 1);
      const { route, video } = videoEntries[safeIndex];
      const embedUrl = getAutoplayEmbedUrl(getVideoEmbedUrl(video));

      if (!player) {
        return;
      }

      player.innerHTML = `
        <article class="video-card youtube-video-card youtube-video-card-single">
          <div class="youtube-video-media">
            ${
              embedUrl
                ? `<iframe src="${embedUrl}" title="${video.title} ${route.giName}" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
                : `
                  <div class="youtube-video-fallback">
                    <img src="${getProductImage(route)}" alt="${route.giName}">
                    <div class="youtube-video-placeholder-note">
                      รอลิงก์ YouTube ของ ${route.giName} ครับ
                    </div>
                  </div>
                `
            }
          </div>
        </article>
      `;

      choiceButtons.forEach((button, index) => {
        const isActive = index === safeIndex;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    }

    choiceButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        renderActiveVideo(index);
      });
    });

    renderActiveVideo(0);
  }

  function renderActions(routes) {
    const wrapper = document.querySelector("[data-gi-actions]");
    wrapper.innerHTML = routes
      .map((route) => {
        const progress = window.SongkhlaApp.getRouteProgress(route.slug);
        const routeStatus =
          progress.quizScore !== null
            ? "สำเร็จแล้ว"
            : progress.learningStarted || progress.gameOpened
              ? "กำลังเรียนรู้"
              : "ยังไม่เริ่ม";
        const scoreStatus = progress.quizScore !== null ? `${progress.quizScore}/${progress.quizTotal}` : "ยังไม่สอบ";
        const gameStatus = progress.gameOpened ? "เข้าเกมแล้ว" : "ยังไม่เข้าเกม";
        const directGameUrl = getDirectGameUrl(route);

        return `
          <article class="section-card gi-action-card">
            <div class="section-head">
              <div>
                <h3>${route.giName}</h3>
              </div>
            </div>
            <div class="status-strip">
              <div class="status-badge">
                <span>สถานะ</span>
                <strong>${routeStatus}</strong>
              </div>
              <div class="status-badge">
                <span>ข้อสอบ</span>
                <strong>${scoreStatus}</strong>
              </div>
              <div class="status-badge">
                <span>เกม</span>
                <strong>${gameStatus}</strong>
              </div>
            </div>
            <div class="inline-actions">
              <button class="button button-dark" type="button" data-gi-action="game" data-route-slug="${route.slug}" data-game-url="${directGameUrl}" ${directGameUrl ? "" : "disabled"}>${directGameUrl ? "เล่นเกม" : "รอเพิ่มลิงก์เกม"}</button>
              <button class="button button-ghost" type="button" data-gi-action="quiz" data-route-slug="${route.slug}">ทำข้อสอบ ${window.SongkhlaData.quizPerRoute} ข้อ</button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderTrackStatus() {
    const wrapper = document.querySelector("[data-track-status]");
    wrapper.innerHTML = window.SongkhlaData.districts
      .map((district) => {
        const status = getDistrictStatus(district);
        const giNames = getDistrictRoutes(district)
          .map((route) => route.giName)
          .join(", ");
        const scoreLabel = status.scorePossible ? `${status.scoreEarned}/${status.scorePossible}` : "ยังไม่มีคะแนน";

        return `
          <a class="track-chip ${status.className}" href="district.html?district=${district.slug}">
            <img src="${district.logo}" alt="${district.districtName}">
            <strong>${district.districtName}</strong>
            <span>${status.label}</span>
            <small>${scoreLabel}</small>
            <span class="track-chip-detail">${giNames}</span>
          </a>
        `;
      })
      .join("");
  }

  async function handleActionClick(event, district) {
    const button = event.target.closest("[data-gi-action]");
    if (!button) {
      return;
    }

    const route = window.SongkhlaApp.getRouteBySlug(button.dataset.routeSlug);
    if (!route) {
      return;
    }

    const action = button.dataset.giAction;
    if (action === "game") {
      const targetUrl = button.dataset.gameUrl || getDirectGameUrl(route);
      if (!targetUrl) {
        return;
      }
      await window.SongkhlaApp.markGameOpened(route.slug);
      window.location.href = targetUrl;
      return;
    }

    if (action === "quiz") {
      window.location.href = `quiz.html?district=${route.slug}`;
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const siteState = await window.SiteBoot;
    if (siteState?.redirected) {
      return;
    }

    await window.SongkhlaApp.ready;
    const district = getDistrictFromQuery();
    const routes = getDistrictRoutes(district);
    await ensureDistrictLearningStarted(routes);

    renderOverview(district, routes);
    renderHeroEvolution(routes);
    renderInfoCards(routes);
    await renderMap(district);
    renderVideos(routes);
    renderActions(routes);
    renderTrackStatus();

    document.querySelector("[data-gi-actions]")?.addEventListener("click", (event) => {
      handleActionClick(event, district);
    });
  });
})();
