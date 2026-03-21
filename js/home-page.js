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

  initNpcTyping();

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
