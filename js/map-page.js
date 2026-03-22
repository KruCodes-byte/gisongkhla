(() => {
  const MIN_ZOOM = 0.8;
  const MAX_ZOOM = 2.4;
  const DRAG_THRESHOLD = 6;
  const CLICK_SUPPRESS_MS = 180;
  const mapState = {
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragOriginX: 0,
    dragOriginY: 0,
    suppressClick: false,
    suppressTimer: null,
    controlsBound: false,
    svgSurfaceBound: false,
    activeSvgDocument: null,
    overlayLayoutBound: false,
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getMapNodes() {
    return {
      stage: document.querySelector("[data-map-stage]"),
      target: document.querySelector("[data-map-zoom]"),
      tooltip: document.querySelector("[data-map-tooltip]"),
      object: document.getElementById("songkhlaMapObject"),
    };
  }

  function getDistrictRoutes(district) {
    return district.giSlugs
      .map((slug) => window.SongkhlaApp.getRouteBySlug(slug))
      .filter(Boolean);
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

  function getDistrictStatus(district) {
    const routes = getDistrictRoutes(district);
    const productStates = routes.map(getRouteProgressState);
    const progressList = productStates.map((item) => item.progress);
    const percentList = productStates.map((item) => item.percent);
    const progressPercent = routes.length
      ? Math.round(percentList.reduce((sum, value) => sum + value, 0) / routes.length)
      : 0;
    const completed = progressList.filter((progress) => progress.quizScore !== null).length;
    const scoreEarned = progressList.reduce(
      (sum, progress) => sum + (typeof progress.quizScore === "number" ? progress.quizScore : 0),
      0
    );
    const scorePossible = progressList.reduce((sum, progress) => sum + (progress.quizTotal || 0), 0);
    const overallStatus = window.SongkhlaEvolution.getStatus(progressPercent);

    return {
      label: overallStatus.label,
      className: overallStatus.className,
      progressPercent,
      completed,
      total: routes.length,
      scoreEarned,
      scorePossible,
      productStates,
    };
  }

  function renderStats() {
    const stats = window.SongkhlaApp.getStats();
    const nodes = {
      totalScore: document.querySelector("[data-total-score]"),
      completedRoutes: document.querySelector("[data-completed-routes]"),
      gamesOpened: document.querySelector("[data-games-opened]"),
      certificateReady: document.querySelector("[data-certificate-ready]"),
    };

    if (nodes.totalScore) {
      nodes.totalScore.textContent = `${stats.totalScore}/${stats.totalPossible}`;
    }
    if (nodes.completedRoutes) {
      nodes.completedRoutes.textContent = `${stats.completedRoutes}/${stats.totalRoutes}`;
    }
    if (nodes.gamesOpened) {
      nodes.gamesOpened.textContent = `${stats.gamesOpened}/${stats.totalRoutes}`;
    }
    if (nodes.certificateReady) {
      nodes.certificateReady.textContent = stats.certificateReady
        ? "พร้อมออกเกียรติบัตร"
        : "ยังไม่ครบเงื่อนไข";
    }
  }

  function renderProgressCards() {
    const container = document.querySelector("[data-route-progress]");
    if (!container) {
      return;
    }

    container.innerHTML = window.SongkhlaData.districts
      .map((district) => {
        const status = getDistrictStatus(district);
        const scoreLabel = status.scorePossible
          ? `${status.scoreEarned}/${status.scorePossible}`
          : "รอคะแนน";
        const productLabel = `${status.total} สินค้า GI`;
        const completionLabel = status.completed
          ? `สอบแล้ว ${status.completed}/${status.total}`
          : "ยังไม่สอบ";
        const evolutionMarkup = status.productStates
          .map(
            ({ route, percent, stage, status: productStatus }) => `
              <article class="district-progress-evolution-item ${productStatus.className}">
                <div class="district-progress-evolution-visual is-${stage.key}">
                  ${window.SongkhlaEvolution.renderSvg(route.evolutionType, stage.key)}
                </div>
                <div class="district-progress-evolution-copy">
                  <strong>${route.giName}</strong>
                  <span>${productStatus.label} ${percent}%</span>
                </div>
              </article>
            `
          )
          .join("");

        return `
          <button class="route-progress-card district-progress-card ${status.className}" data-route-card="${district.slug}">
            <div class="route-progress-header">
              <span class="eyebrow">${district.districtName}</span>
              <span class="status-pill ${status.className}">${status.label}</span>
            </div>
            <div class="district-progress-body">
              <div class="district-progress-evolution-strip">
                ${evolutionMarkup}
              </div>
              <div class="district-progress-copy">
                <span class="district-progress-focus">${productLabel}</span>
                <div class="district-progress-bar" aria-hidden="true">
                  <span style="width: ${status.progressPercent}%;"></span>
                </div>
                <div class="district-progress-meta">
                  <span>${status.progressPercent}%</span>
                  <span>${completionLabel}</span>
                  <span>คะแนน ${scoreLabel}</span>
                </div>
              </div>
            </div>
          </button>
        `;
      })
      .join("");

    container.querySelectorAll("[data-route-card]").forEach((button) => {
      button.addEventListener("click", () => {
        const slug = button.dataset.routeCard;
        window.location.href = `district.html?district=${slug}`;
      });
    });
  }

  function syncRoutePanelBounds() {
    const panel = document.querySelector(".map-screen-routes");
    const npc = document.querySelector(".map-page-npc");
    if (!panel) {
      return;
    }

    panel.style.maxHeight = "";

    if (!npc) {
      return;
    }

    const panelStyle = window.getComputedStyle(panel);
    if (panelStyle.position !== "fixed") {
      return;
    }

    const panelRect = panel.getBoundingClientRect();
    const npcRect = npc.getBoundingClientRect();
    const gap = 18;
    const availableHeight = Math.floor(npcRect.top - panelRect.top - gap);

    if (availableHeight > 180) {
      panel.style.maxHeight = `${availableHeight}px`;
    }
  }

  function bindOverlayLayout() {
    if (mapState.overlayLayoutBound) {
      return;
    }

    const panel = document.querySelector(".map-screen-routes");
    const npc = document.querySelector(".map-page-npc");
    if (!panel) {
      return;
    }

    const scheduleSync = () => window.requestAnimationFrame(syncRoutePanelBounds);
    window.addEventListener("resize", scheduleSync);
    window.addEventListener("load", scheduleSync, { once: true });

    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(scheduleSync);
      observer.observe(panel);
      if (npc) {
        observer.observe(npc);
      }
    }

    mapState.overlayLayoutBound = true;
    scheduleSync();
    window.setTimeout(scheduleSync, 240);
    window.setTimeout(scheduleSync, 1200);
    window.setTimeout(scheduleSync, 2400);
  }

  function getPanBounds() {
    const { stage } = getMapNodes();
    if (!stage) {
      return {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
      };
    }

    const baseSlackX = Math.min(120, stage.clientWidth * 0.08) * 2;
    const baseSlackY = Math.min(96, stage.clientHeight * 0.08) * 2;
    const overflowX = Math.max(baseSlackX, stage.clientWidth * mapState.zoom - stage.clientWidth);
    const overflowY = Math.max(baseSlackY, stage.clientHeight * mapState.zoom - stage.clientHeight);
    const maxX = overflowX / 2;
    const maxY = overflowY / 2;

    return {
      minX: -maxX,
      maxX,
      minY: -maxY,
      maxY,
    };
  }

  function applyTransform() {
    const { target } = getMapNodes();
    if (!target) {
      return;
    }

    const bounds = getPanBounds();
    mapState.panX = clamp(mapState.panX, bounds.minX, bounds.maxX);
    mapState.panY = clamp(mapState.panY, bounds.minY, bounds.maxY);
    target.style.transform = `translate(${mapState.panX}px, ${mapState.panY}px) scale(${mapState.zoom})`;
  }

  function updateZoom(nextZoom) {
    mapState.zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
    applyTransform();
  }

  function panBy(deltaX, deltaY) {
    const bounds = getPanBounds();
    mapState.panX = clamp(mapState.panX + deltaX, bounds.minX, bounds.maxX);
    mapState.panY = clamp(mapState.panY + deltaY, bounds.minY, bounds.maxY);
    applyTransform();
  }

  function hideTooltip() {
    const { tooltip } = getMapNodes();
    if (tooltip) {
      tooltip.hidden = true;
    }
  }

  function setTooltipContent(title, body, imageSrc = "", imageAlt = "") {
    const tooltipTitle = document.querySelector("[data-tooltip-title]");
    const tooltipBody = document.querySelector("[data-tooltip-body]");
    const tooltipImage = document.querySelector("[data-tooltip-image]");

    if (tooltipTitle) {
      tooltipTitle.textContent = title;
    }

    if (tooltipBody) {
      tooltipBody.textContent = body;
    }

    if (tooltipImage) {
      if (imageSrc) {
        tooltipImage.src = imageSrc;
        tooltipImage.alt = imageAlt || title;
        tooltipImage.hidden = false;
      } else {
        tooltipImage.removeAttribute("src");
        tooltipImage.alt = "";
        tooltipImage.hidden = true;
      }
    }
  }

  function clearSuppressTimer() {
    if (mapState.suppressTimer) {
      window.clearTimeout(mapState.suppressTimer);
      mapState.suppressTimer = null;
    }
  }

  function scheduleClickReset() {
    clearSuppressTimer();
    mapState.suppressTimer = window.setTimeout(() => {
      mapState.suppressClick = false;
      mapState.suppressTimer = null;
    }, CLICK_SUPPRESS_MS);
  }

  function startDragging(clientX, clientY) {
    clearSuppressTimer();
    mapState.isDragging = true;
    mapState.dragStartX = clientX;
    mapState.dragStartY = clientY;
    mapState.dragOriginX = mapState.panX;
    mapState.dragOriginY = mapState.panY;
    document.body.style.userSelect = "none";
    getMapNodes().stage?.classList.add("is-dragging");
    hideTooltip();
  }

  function moveDragging(clientX, clientY) {
    if (!mapState.isDragging) {
      return;
    }

    const deltaX = clientX - mapState.dragStartX;
    const deltaY = clientY - mapState.dragStartY;
    if (
      !mapState.suppressClick &&
      (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD)
    ) {
      mapState.suppressClick = true;
    }

    mapState.panX = mapState.dragOriginX + deltaX;
    mapState.panY = mapState.dragOriginY + deltaY;
    applyTransform();
  }

  function stopDragging() {
    if (!mapState.isDragging) {
      return;
    }

    mapState.isDragging = false;
    document.body.style.userSelect = "";
    getMapNodes().stage?.classList.remove("is-dragging");

    if (mapState.suppressClick) {
      scheduleClickReset();
    }
  }

  function shouldIgnoreClick(event) {
    if (!mapState.suppressClick) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();
    mapState.suppressClick = false;
    clearSuppressTimer();
    return true;
  }

  function setShapeColor(element, fill, opacity) {
    element.querySelectorAll("path, polygon").forEach((shape) => {
      shape.style.fill = fill;
      shape.style.opacity = opacity;
      shape.style.stroke = "#ffffff";
      shape.style.strokeWidth = "2";
      shape.style.transition = "fill .2s ease, opacity .2s ease";
    });
  }

  function attachMapInteractions(svgDocument) {
    const tooltip = document.querySelector("[data-map-tooltip]");
    const interactiveIds = new Set(window.SongkhlaData.districts.map((district) => district.svgId));

    window.SongkhlaData.districts.forEach((district) => {
      const group = svgDocument.getElementById(district.svgId);
      if (!group) {
        return;
      }

      const status = getDistrictStatus(district);
      const isComplete = status.className === "is-complete";
      const isInProgress = status.className === "is-in-progress";
      setShapeColor(
        group,
        isComplete || isInProgress ? district.accent : "#0f5da8",
        isComplete ? "1" : isInProgress ? "0.78" : "0.55"
      );
      group.style.cursor = "pointer";

      group.addEventListener("mouseenter", () => {
        if (mapState.isDragging) {
          return;
        }

        setShapeColor(group, "#f59f1a", "1");
        tooltip.hidden = false;
        setTooltipContent(
          district.districtName,
          `${status.label} ${status.progressPercent}% · GI ${status.total} รายการ · คะแนน ${status.scoreEarned}/${status.scorePossible}`,
          district.logo || "",
          district.districtName
        );
      });

      group.addEventListener("mousemove", (event) => {
        if (mapState.isDragging) {
          return;
        }

        tooltip.style.left = `${event.clientX + 18}px`;
        tooltip.style.top = `${event.clientY - 110}px`;
      });

      group.addEventListener("mouseleave", () => {
        tooltip.hidden = true;
        setShapeColor(
          group,
          isComplete || isInProgress ? district.accent : "#0f5da8",
          isComplete ? "1" : isInProgress ? "0.78" : "0.55"
        );
      });

      group.addEventListener("click", (event) => {
        if (shouldIgnoreClick(event)) {
          return;
        }

        window.location.href = `district.html?district=${district.slug}`;
      });
    });

    window.SongkhlaData.generalDistricts.forEach((district) => {
      if (interactiveIds.has(district.svgId)) {
        return;
      }

      const group = svgDocument.getElementById(district.svgId);
      if (!group) {
        return;
      }

      setShapeColor(group, "#6b7f9b", "0.25");
      group.style.cursor = "not-allowed";

      group.addEventListener("mouseenter", () => {
        if (mapState.isDragging) {
          return;
        }

        tooltip.hidden = false;
        setTooltipContent(district.districtName, "ไม่มีสินค้า GI");
      });

      group.addEventListener("mousemove", (event) => {
        if (mapState.isDragging) {
          return;
        }

        tooltip.style.left = `${event.clientX + 18}px`;
        tooltip.style.top = `${event.clientY - 90}px`;
      });

      group.addEventListener("mouseleave", () => {
        tooltip.hidden = true;
      });
    });
  }

  function bindMapControls() {
    if (mapState.controlsBound) {
      return;
    }

    const { stage, object } = getMapNodes();
    if (!stage || !object) {
      return;
    }

    const startPointerDrag = (event) => {
      if (event.button !== 0) {
        return;
      }

      if (typeof event.target.closest === "function" && event.target.closest(".zoom-controls")) {
        return;
      }

      startDragging(event.clientX, event.clientY);
    };

    const movePointerDrag = (event) => {
      moveDragging(event.clientX, event.clientY);
    };

    const handleWheelPan = (event) => {
      event.preventDefault();
      hideTooltip();

      const unit = event.deltaMode === 1 ? 18 : 1;
      if (event.ctrlKey || event.metaKey) {
        updateZoom(mapState.zoom + (event.deltaY < 0 ? 0.12 : -0.12));
        return;
      }

      const deltaX =
        event.shiftKey && Math.abs(event.deltaX) < 1 ? -event.deltaY * unit : -event.deltaX * unit;
      const deltaY =
        event.shiftKey && Math.abs(event.deltaX) < 1 ? 0 : -event.deltaY * unit;
      panBy(deltaX, deltaY);
    };

    stage.addEventListener("mousedown", startPointerDrag);
    object.addEventListener("mousedown", startPointerDrag);
    document.addEventListener("mousemove", movePointerDrag);
    document.addEventListener("mouseup", stopDragging);
    stage.addEventListener("wheel", handleWheelPan, { passive: false });
    object.addEventListener("wheel", handleWheelPan, { passive: false });
    window.addEventListener("blur", stopDragging);

    document.querySelector("[data-zoom-in]")?.addEventListener("click", () => {
      updateZoom(mapState.zoom + 0.2);
    });

    document.querySelector("[data-zoom-out]")?.addEventListener("click", () => {
      updateZoom(mapState.zoom - 0.2);
    });

    window.addEventListener("resize", applyTransform);
    mapState.controlsBound = true;
  }

  function bindSvgSurface(svgDocument) {
    if (mapState.activeSvgDocument === svgDocument && mapState.svgSurfaceBound) {
      return;
    }

    const startPointerDrag = (event) => {
      if (event.button !== 0) {
        return;
      }

      startDragging(event.clientX, event.clientY);
    };

    const movePointerDrag = (event) => {
      moveDragging(event.clientX, event.clientY);
    };

    const handleWheelPan = (event) => {
      event.preventDefault();
      hideTooltip();

      const unit = event.deltaMode === 1 ? 18 : 1;
      if (event.ctrlKey || event.metaKey) {
        updateZoom(mapState.zoom + (event.deltaY < 0 ? 0.12 : -0.12));
        return;
      }

      const deltaX =
        event.shiftKey && Math.abs(event.deltaX) < 1 ? -event.deltaY * unit : -event.deltaX * unit;
      const deltaY =
        event.shiftKey && Math.abs(event.deltaX) < 1 ? 0 : -event.deltaY * unit;
      panBy(deltaX, deltaY);
    };

    svgDocument.addEventListener("mousedown", startPointerDrag);
    svgDocument.addEventListener("mousemove", movePointerDrag);
    svgDocument.addEventListener("mouseup", stopDragging);
    svgDocument.addEventListener("wheel", handleWheelPan, { passive: false });

    mapState.activeSvgDocument = svgDocument;
    mapState.svgSurfaceBound = true;
  }

  function initMap() {
    const { object } = getMapNodes();
    if (!object) {
      return;
    }

    bindMapControls();
    applyTransform();

    const bindLoadedMap = () => {
      const svgDocument = object.contentDocument;
      if (!svgDocument || mapState.activeSvgDocument === svgDocument) {
        return;
      }

      attachMapInteractions(svgDocument);
      bindSvgSurface(svgDocument);
    };

    object.addEventListener("load", bindLoadedMap);
    if (object.contentDocument) {
      bindLoadedMap();
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const siteState = await window.SiteBoot;
    if (siteState?.redirected) {
      return;
    }

    await window.SongkhlaApp.ready;
    renderStats();
    renderProgressCards();
    bindOverlayLayout();
    initMap();
  });
})();
