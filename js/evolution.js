(() => {
  function getLearningPercent(progress) {
    if (typeof progress.quizScore === "number" && progress.quizTotal > 0) {
      return Math.round((progress.quizScore / progress.quizTotal) * 100);
    }

    return 0;
  }

  function getStage(percent) {
    if (percent >= 80) {
      return {
        key: "final",
        label: "\u0e2a\u0e21\u0e1a\u0e39\u0e23\u0e13\u0e4c",
      };
    }

    if (percent >= 40) {
      return {
        key: "mature",
        label: "\u0e1e\u0e31\u0e12\u0e19\u0e32\u0e41\u0e25\u0e49\u0e27",
      };
    }

    if (percent >= 20) {
      return {
        key: "young",
        label: "\u0e40\u0e23\u0e34\u0e48\u0e21\u0e40\u0e15\u0e34\u0e1a\u0e42\u0e15",
      };
    }

    return {
      key: "seed",
      label: "\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e40\u0e23\u0e34\u0e48\u0e21",
    };
  }

  function getStatus(percent) {
    if (percent >= 80) {
      return {
        label: "\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08\u0e41\u0e25\u0e49\u0e27",
        className: "is-complete",
      };
    }

    if (percent > 0) {
      return {
        label: "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e40\u0e23\u0e35\u0e22\u0e19\u0e23\u0e39\u0e49",
        className: "is-in-progress",
      };
    }

    return {
      label: "\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e40\u0e23\u0e34\u0e48\u0e21",
      className: "is-pending",
    };
  }

  function getProgressState(progress) {
    const percent = getLearningPercent(progress);
    return {
      percent,
      stage: getStage(percent),
      status: getStatus(percent),
    };
  }

  function renderFish(stageKey) {
    if (stageKey === "final") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <ellipse cx="58" cy="40" rx="28" ry="18" fill="#a9d8ef"/>
          <path d="M81 40 108 20v40Z" fill="#5d94c7"/>
          <path d="M42 29c8-10 16-13 27-13" fill="none" stroke="#6b8aa6" stroke-width="3" stroke-linecap="round"/>
          <path d="M41 51c8 10 16 13 27 13" fill="none" stroke="#6b8aa6" stroke-width="3" stroke-linecap="round"/>
          <circle cx="48" cy="36" r="3.2" fill="#163a63"/>
          <path d="M29 41c-6-3-11-4-17-4" fill="none" stroke="#5d94c7" stroke-width="4" stroke-linecap="round"/>
        </svg>
      `;
    }

    if (stageKey === "mature") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <ellipse cx="60" cy="40" rx="24" ry="15" fill="#b9e3f3"/>
          <path d="M80 40 100 25v30Z" fill="#7bacd2"/>
          <circle cx="50" cy="36" r="3" fill="#163a63"/>
          <path d="M37 29c7-7 13-9 21-9" fill="none" stroke="#7b97b3" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `;
    }

    if (stageKey === "young") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <ellipse cx="61" cy="41" rx="17" ry="10" fill="#c8ecf7"/>
          <path d="M76 41 91 30v22Z" fill="#8dbcdc"/>
          <circle cx="55" cy="39" r="2.4" fill="#163a63"/>
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 120 80" aria-hidden="true">
        <circle cx="48" cy="42" r="8" fill="#f2cfe0"/>
        <circle cx="64" cy="42" r="8" fill="#f0d7e5"/>
        <circle cx="56" cy="30" r="8" fill="#f4ddea"/>
      </svg>
    `;
  }

  function renderPomelo(stageKey) {
    if (stageKey === "final") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <path d="M60 24c10 0 20 8 20 21S70 67 60 67 40 58 40 45s10-21 20-21Z" fill="#f7db7b"/>
          <path d="M59 23c0-7 4-12 10-14" fill="none" stroke="#567c3f" stroke-width="4" stroke-linecap="round"/>
          <path d="M69 10c8 1 14 6 18 12-8 1-15 1-21-3Z" fill="#7bb26b"/>
          <path d="M60 32c7 0 13 5 13 13H47c0-8 6-13 13-13Z" fill="#ffd98f" opacity=".9"/>
        </svg>
      `;
    }

    if (stageKey === "mature") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <path d="M60 28c9 0 17 7 17 18S69 64 60 64 43 57 43 46s8-18 17-18Z" fill="#f8e08d"/>
          <path d="M60 28c0-6 4-10 8-12" fill="none" stroke="#567c3f" stroke-width="4" stroke-linecap="round"/>
          <path d="M67 17c6 0 11 3 15 8-6 2-12 2-18-1Z" fill="#84b86e"/>
        </svg>
      `;
    }

    if (stageKey === "young") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <path d="M59 36c7 0 12 5 12 12s-5 12-12 12-12-5-12-12 5-12 12-12Z" fill="#cfe39a"/>
          <path d="M59 36c0-7 3-11 8-14" fill="none" stroke="#598245" stroke-width="4" stroke-linecap="round"/>
          <path d="M67 22c5 1 9 4 11 8-5 1-9 1-14-1Z" fill="#8fc475"/>
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 120 80" aria-hidden="true">
        <ellipse cx="60" cy="48" rx="10" ry="14" fill="#9f7b4c"/>
        <path d="M60 35c0-7 3-11 8-14" fill="none" stroke="#6a944c" stroke-width="4" stroke-linecap="round"/>
        <path d="M69 22c5 1 9 4 11 8-5 1-9 1-14-1Z" fill="#92c873"/>
      </svg>
    `;
  }

  function renderOrange(stageKey) {
    if (stageKey === "final") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <circle cx="60" cy="46" r="20" fill="#f4a93d"/>
          <path d="M57 24c0-6 2-10 7-13" fill="none" stroke="#5f8a43" stroke-width="4" stroke-linecap="round"/>
          <path d="M64 12c7 1 12 5 15 10-6 2-12 2-18-1Z" fill="#79b365"/>
          <path d="M60 30c6 0 11 2 15 6" fill="none" stroke="#ffd9a4" stroke-width="3" stroke-linecap="round" opacity=".8"/>
        </svg>
      `;
    }

    if (stageKey === "mature") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <circle cx="60" cy="47" r="17" fill="#f1bf58"/>
          <path d="M58 31c0-6 2-9 6-12" fill="none" stroke="#5f8a43" stroke-width="4" stroke-linecap="round"/>
          <path d="M64 20c6 1 10 4 13 8-5 1-10 1-15-1Z" fill="#84bb6d"/>
        </svg>
      `;
    }

    if (stageKey === "young") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <circle cx="60" cy="48" r="12" fill="#cfe090"/>
          <path d="M59 37c0-5 2-8 6-11" fill="none" stroke="#668f48" stroke-width="4" stroke-linecap="round"/>
          <path d="M65 26c4 1 8 4 10 7-4 1-8 1-12-1Z" fill="#91c977"/>
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 120 80" aria-hidden="true">
        <ellipse cx="60" cy="50" rx="9" ry="12" fill="#9f7b4c"/>
        <path d="M60 38c0-5 2-8 6-11" fill="none" stroke="#6a944c" stroke-width="4" stroke-linecap="round"/>
        <path d="M66 27c4 1 8 4 10 7-4 1-8 1-12-1Z" fill="#92c873"/>
      </svg>
    `;
  }

  function renderMango(stageKey) {
    if (stageKey === "final") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <path d="M63 22c8 0 16 7 16 18 0 14-10 24-21 24-9 0-17-6-17-17 0-14 11-25 22-25Z" fill="#f3d04d"/>
          <path d="M60 22c0-7 4-12 11-15" fill="none" stroke="#5f8a43" stroke-width="4" stroke-linecap="round"/>
          <path d="M71 9c7 2 12 6 16 12-7 1-13 1-19-3Z" fill="#79b264"/>
        </svg>
      `;
    }

    if (stageKey === "mature") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <path d="M62 28c7 0 13 5 13 15 0 12-9 20-19 20-8 0-14-5-14-14 0-12 9-21 20-21Z" fill="#b6d27a"/>
          <path d="M60 27c0-6 3-10 9-13" fill="none" stroke="#5f8a43" stroke-width="4" stroke-linecap="round"/>
          <path d="M69 16c6 2 10 5 13 10-6 1-11 1-16-2Z" fill="#84bc6c"/>
        </svg>
      `;
    }

    if (stageKey === "young") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <path d="M61 36c6 0 10 4 10 11 0 10-7 16-15 16-7 0-12-4-12-11 0-9 7-16 17-16Z" fill="#cfe39c"/>
          <path d="M60 35c0-5 3-9 8-12" fill="none" stroke="#668f48" stroke-width="4" stroke-linecap="round"/>
          <path d="M68 24c5 1 8 4 11 8-5 1-9 1-13-1Z" fill="#92c874"/>
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 120 80" aria-hidden="true">
        <ellipse cx="58" cy="49" rx="10" ry="13" fill="#9f7b4c"/>
        <path d="M58 36c0-5 2-8 7-11" fill="none" stroke="#6a944c" stroke-width="4" stroke-linecap="round"/>
        <path d="M66 25c4 1 8 4 10 7-4 1-8 1-12-1Z" fill="#92c873"/>
      </svg>
    `;
  }

  function renderEgg(stageKey) {
    if (stageKey === "final") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <path d="M37 28c8 0 16 7 16 17S45 64 37 64 21 55 21 45s8-17 16-17Z" fill="#fff7ed" stroke="#d8c5af" stroke-width="3"/>
          <path d="M83 28c8 0 16 7 16 17S91 64 83 64 67 55 67 45s8-17 16-17Z" fill="#fff7ed" stroke="#d8c5af" stroke-width="3"/>
          <circle cx="37" cy="47" r="8" fill="#f29a38"/>
          <circle cx="83" cy="47" r="8" fill="#f29a38"/>
        </svg>
      `;
    }

    if (stageKey === "mature") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <path d="M60 24c11 0 20 10 20 22S71 66 60 66 40 58 40 46s9-22 20-22Z" fill="#fff8f1" stroke="#dccbb7" stroke-width="3"/>
          <circle cx="60" cy="49" r="10" fill="#f6ae47"/>
        </svg>
      `;
    }

    if (stageKey === "young") {
      return `
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <path d="M60 30c8 0 14 7 14 16S68 62 60 62 46 55 46 46s6-16 14-16Z" fill="#fdf7ef" stroke="#ddcdb9" stroke-width="3"/>
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 120 80" aria-hidden="true">
        <ellipse cx="60" cy="50" rx="12" ry="15" fill="#f7fbff" stroke="#dbe5f0" stroke-width="3"/>
      </svg>
    `;
  }

  function getAssetFolder(type) {
    if (type === "orange") {
      return "ส้มจุก";
    }

    if (type === "pomelo") {
      return "ส้มโอ";
    }

    if (type === "mango") {
      return "มะม่วง";
    }

    return "";
  }

  function getStageAssetScore(stageKey) {
    if (stageKey === "final") {
      return "80";
    }

    if (stageKey === "mature") {
      return "40";
    }

    if (stageKey === "young") {
      return "20";
    }

    return "0";
  }

  function getConfiguredAssetFolder(type) {
    if (type === "orange") {
      return "a";
    }

    if (type === "pomelo") {
      return "b";
    }

    if (type === "mango") {
      return "c";
    }

    return "";
  }

  function getFallbackSvg(type, stageKey) {
    if (type === "fish") {
      return renderFish(stageKey);
    }

    if (type === "pomelo") {
      return renderPomelo(stageKey);
    }

    if (type === "orange") {
      return renderOrange(stageKey);
    }

    if (type === "mango") {
      return renderMango(stageKey);
    }

    if (type === "egg") {
      return renderEgg(stageKey);
    }

    return renderMango(stageKey);
  }

  function renderSvg(type, stageKey) {
    const assetFolder = getConfiguredAssetFolder(type);
    const fallbackSvg = getFallbackSvg(type, stageKey);

    if (!assetFolder) {
      return fallbackSvg;
    }

    const assetSrc = `${encodeURI(assetFolder)}/${getStageAssetScore(stageKey)}.png`;

    return `
      <div class="evolution-asset-shell is-${stageKey}">
        <img
          class="evolution-asset-image"
          src="${assetSrc}"
          alt=""
          loading="lazy"
          decoding="async"
          onerror="this.hidden=true;this.nextElementSibling.hidden=false;"
        >
        <span class="evolution-asset-fallback" hidden>${fallbackSvg}</span>
      </div>
    `;
  }

  window.SongkhlaEvolution = {
    getLearningPercent,
    getStage,
    getStatus,
    getProgressState,
    renderSvg,
  };
})();
