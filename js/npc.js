(() => {
  function getGraphemes(text) {
    if (window.Intl && typeof window.Intl.Segmenter === "function") {
      const segmenter = new window.Intl.Segmenter("th", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (part) => part.segment);
    }

    return Array.from(text);
  }

  function initNpcBubble(bubble, delay = 760) {
    const textNode = bubble.querySelector("[data-npc-text]");
    if (!textNode) {
      return;
    }

    const message = bubble.dataset.npcMessage || "";
    if (!message) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      textNode.textContent = message;
      bubble.classList.add("is-complete");
      return;
    }

    const graphemes = getGraphemes(message);
    let index = 0;
    textNode.textContent = "";
    bubble.classList.add("is-typing");

    const typeNext = () => {
      textNode.textContent += graphemes[index];
      index += 1;

      if (index < graphemes.length) {
        window.setTimeout(typeNext, 38);
        return;
      }

      bubble.classList.remove("is-typing");
      bubble.classList.add("is-complete");
    };

    window.setTimeout(typeNext, delay);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-npc-message]").forEach((bubble) => {
      initNpcBubble(bubble);
    });
  });
})();
