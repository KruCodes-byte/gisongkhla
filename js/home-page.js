(function () {
  const developersNode = document.querySelector("[data-home-developers]");
  const advisorNode = document.querySelector("[data-home-advisor]");
  const universityNode = document.querySelector("[data-home-university]");
  const npcBubble = document.querySelector("[data-npc-message]");
  const npcTextNode = document.querySelector("[data-npc-text]");

  function getGraphemes(text) {
    if (window.Intl && typeof window.Intl.Segmenter === "function") {
      const segmenter = new window.Intl.Segmenter("th", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (part) => part.segment);
    }

    return Array.from(text);
  }

  function initNpcTyping() {
    if (!npcBubble || !npcTextNode) {
      return;
    }

    const message = npcBubble.dataset.npcMessage || "";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!message) {
      return;
    }

    if (reduceMotion) {
      npcTextNode.textContent = message;
      npcBubble.classList.add("is-complete");
      return;
    }

    const graphemes = getGraphemes(message);
    let index = 0;

    npcTextNode.textContent = "";
    npcBubble.classList.add("is-typing");

    const typeNext = () => {
      npcTextNode.textContent += graphemes[index];
      index += 1;

      if (index < graphemes.length) {
        window.setTimeout(typeNext, 38);
        return;
      }

      npcBubble.classList.remove("is-typing");
      npcBubble.classList.add("is-complete");
    };

    window.setTimeout(typeNext, 940);
  }

  function animateScoreCount(node, endValue) {
    if (!node) {
      return;
    }

    const startValue = 0;
    const duration = 1100;
    const startTime = performance.now();

    const formatNumber = (value) => value.toLocaleString("th-TH");

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.round(startValue + (endValue - startValue) * progress);
      node.textContent = formatNumber(currentValue);

      if (progress < 1) {
        window.requestAnimationFrame(update);
      }
    };

    window.requestAnimationFrame(update);
  }

  async function getHomeStats() {
    const visitorsNode = document.querySelector("[data-home-visitors]");
    const learnersNode = document.querySelector("[data-home-learners]");
    const shopsNode = document.querySelector("[data-home-shops]");
    const categoriesNode = document.querySelector("[data-home-categories]");
    const defaultShops = 28;
    const defaultCategories = 4;

    if (!window.SupabaseService?.configured) {
      if (visitorsNode) visitorsNode.textContent = "00";
      if (learnersNode) learnersNode.textContent = "00";
      if (shopsNode) shopsNode.textContent = "00";
      if (categoriesNode) categoriesNode.textContent = "00";
      return;
    }

    const visitorIdKey = "gi-songkhla-visitor-id";
    let visitorId = window.localStorage.getItem(visitorIdKey);
    if (!visitorId) {
      visitorId = window.crypto?.randomUUID ? window.crypto.randomUUID() : `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(visitorIdKey, visitorId);
    }

    try {
      await window.SupabaseService.recordSiteVisit(visitorId, window.location.pathname);
    } catch (error) {
      console.warn("Unable to record site visit.", error);
    }

    try {
      const stats = await window.SupabaseService.getSiteStats();
      if (!stats) {
        throw new Error("No stats returned");
      }

      if (visitorsNode) animateScoreCount(visitorsNode, stats.visitors);
      if (learnersNode) animateScoreCount(learnersNode, stats.learners);
      if (shopsNode) animateScoreCount(shopsNode, defaultShops);
      if (categoriesNode) animateScoreCount(categoriesNode, defaultCategories);
    } catch (error) {
      console.warn("Unable to fetch home statistics.", error);
      if (visitorsNode) visitorsNode.textContent = "00";
      if (learnersNode) learnersNode.textContent = "00";
      if (shopsNode) shopsNode.textContent = "00";
      if (categoriesNode) categoriesNode.textContent = "00";
    }
  }

  initNpcTyping();
  getHomeStats();

  if (!window.SongkhlaData) {
    return;
  }

  if (developersNode) {
    developersNode.innerHTML = window.SongkhlaData.developers
      .map((name) => `<li>${name}</li>`)
      .join("");
  }

  if (advisorNode) {
    advisorNode.textContent = window.SongkhlaData.advisor;
  }

  if (universityNode) {
    universityNode.textContent = window.SongkhlaData.university;
  }
})();
