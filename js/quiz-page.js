(() => {
  function getRouteFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("district") || window.SongkhlaData.routes[0].slug;
    return window.SongkhlaApp.getRouteBySlug(slug) || window.SongkhlaData.routes[0];
  }

  function renderIntro(route, progress) {
    document.querySelector("[data-quiz-title]").textContent = `Quiz ความรู้ ${route.giName}`;
    document.querySelector("[data-quiz-subtitle]").textContent = `${route.districtName} · ${window.SongkhlaData.quizPerRoute} ข้อ`;
    document.querySelector("[data-last-score]").textContent =
      progress.quizScore !== null ? `${progress.quizScore}/${progress.quizTotal}` : "ยังไม่มีคะแนน";
  }

  function renderQuestions(route) {
    const questions = window.SongkhlaApp.getQuizForRoute(route.slug);
    const wrapper = document.querySelector("[data-quiz-questions]");

    wrapper.innerHTML = questions
      .map(
        (question) => `
          <article class="question-card">
            <div class="question-head">
              <span class="eyebrow">ข้อ ${question.order}</span>
              <h3>${question.text}</h3>
            </div>
            <div class="choice-list">
              ${question.options
                .map(
                  (option, index) => `
                    <label class="choice-item">
                      <input type="radio" name="${question.id}" value="${option}">
                      <span>${String.fromCharCode(65 + index)}. ${option}</span>
                    </label>
                  `
                )
                .join("")}
            </div>
          </article>
        `
      )
      .join("");

    return questions;
  }

  function collectAnswers(questions) {
    let score = 0;
    let answered = 0;

    questions.forEach((question) => {
      const selected = document.querySelector(`input[name="${question.id}"]:checked`);
      if (selected) {
        answered += 1;
        if (selected.value === question.correctAnswer) {
          score += 1;
        }
      }
    });

    return {
      score,
      answered,
      total: questions.length,
      percent: Math.round((score / questions.length) * 100),
    };
  }

  function renderResult(result) {
    const panel = document.querySelector("[data-quiz-result]");
    panel.hidden = false;
    panel.innerHTML = `
      <div class="result-badge ${result.percent >= 80 ? "is-pass" : "is-fail"}">
        <strong>${result.score}/${result.total}</strong>
        <span>${result.percent}%</span>
      </div>
      <p>ตอบทั้งหมด ${result.answered} ข้อจาก ${result.total} ข้อ</p>
      <p>${result.percent >= 80 ? "ผ่านเกณฑ์คะแนนสำหรับเกียรติบัตร" : "ยังไม่ถึงเกณฑ์ 80% สามารถทำใหม่ได้"}</p>
      <div class="inline-actions">
        <a class="button button-secondary" href="map.html">กลับหน้าแผนที่</a>
      </div>
    `;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const siteState = await window.SiteBoot;
    if (siteState?.redirected) {
      return;
    }
    await window.SongkhlaApp.ready;
    const route = getRouteFromQuery();
    const progress = window.SongkhlaApp.getRouteProgress(route.slug);
    const questions = renderQuestions(route);
    renderIntro(route, progress);

    document.querySelector("[data-quiz-form]").addEventListener("submit", async (event) => {
      event.preventDefault();
      const result = collectAnswers(questions);
      await window.SongkhlaApp.saveQuizResult(route.slug, result.score, result.total);
      document.querySelector("[data-last-score]").textContent = `${result.score}/${result.total}`;
      renderResult(result);
    });
  });
})();
