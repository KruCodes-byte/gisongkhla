(() => {
  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function renderSummary() {
    const list = document.querySelector("[data-certificate-summary]");
    list.innerHTML = window.SongkhlaData.routes
      .map((route) => {
        const progress = window.SongkhlaApp.getRouteProgress(route.slug);
        return `
          <li>
            <strong>${route.giName}</strong>
            <span>${progress.quizScore !== null ? `${progress.quizScore}/${progress.quizTotal}` : "ยังไม่สอบ"}</span>
            <span>${progress.gameOpened ? "กดเข้าเกมแล้ว" : "ยังไม่กดเข้าเกม"}</span>
          </li>
        `;
      })
      .join("");
  }

  function renderCertificate(certificate) {
    const board = document.querySelector("[data-certificate-board]");
    const emptyState = document.querySelector("[data-certificate-empty]");
    const actions = document.querySelector("[data-certificate-actions]");
    const profile = window.SongkhlaApp.getProfile();

    if (!certificate) {
      board.hidden = true;
      emptyState.hidden = false;
      if (actions) {
        actions.hidden = true;
      }
      return;
    }

    board.hidden = false;
    emptyState.hidden = true;
    if (actions) {
      actions.hidden = false;
    }
    document.querySelector("[data-certificate-name]").textContent = profile.fullName || "ผู้เรียน";
    document.querySelector("[data-certificate-date]").textContent = new Date(certificate.issuedAt).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function buildPrintMarkup(name, dateText) {
    const safeName = escapeHtml(name);
    const safeDate = escapeHtml(dateText);
    const baseHref = escapeHtml(new URL(".", window.location.href).href);
    const backgroundSrc = escapeHtml(new URL("assets/เกียรติบัตรเว็บไซต์.jpg", window.location.href).href);

    return `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <base href="${baseHref}">
        <title>Certificate Print</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 landscape; margin: 0; }

          html, body {
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #ffffff;
          }

          body {
            font-family: "Kanit", sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .certificate-print-shell {
            position: relative;
            width: 100vw;
            height: 100vh;
          }

          .certificate-print-bg {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .certificate-print-name {
            position: absolute;
            top: 43.8%;
            left: 50%;
            width: min(54%, 880px);
            padding: 0 20px;
            transform: translate(-50%, -50%);
            text-align: center;
            font-size: clamp(2.15rem, 4.2vw, 4.35rem);
            line-height: 1.06;
            font-weight: 700;
            color: #ffffff;
            text-wrap: balance;
            text-shadow: 0 4px 14px rgba(18, 49, 74, 0.2);
          }

          .certificate-print-date {
            position: absolute;
            top: 69.2%;
            left: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
            font-size: clamp(1.15rem, 1.85vw, 1.9rem);
            line-height: 1.3;
            color: #243a86;
            white-space: nowrap;
            text-align: center;
            text-shadow: 0 2px 10px rgba(255, 255, 255, 0.35);
          }
        </style>
      </head>
      <body>
        <div class="certificate-print-shell">
          <img class="certificate-print-bg" src="${backgroundSrc}" alt="Certificate Background">
          <div class="certificate-print-name">${safeName}</div>
          <p class="certificate-print-date">ให้ไว้ ณ วันที่ ${safeDate}</p>
        </div>
        <script>
          const bg = document.querySelector(".certificate-print-bg");
          const runPrint = () => {
            setTimeout(() => {
              window.focus();
              window.print();
              window.close();
            }, 250);
          };

          if (bg && !bg.complete) {
            bg.addEventListener("load", runPrint, { once: true });
            bg.addEventListener("error", runPrint, { once: true });
          } else {
            window.addEventListener("load", runPrint, { once: true });
          }
        <\/script>
      </body>
      </html>
    `;
  }

  function downloadCertificate() {
    const board = document.querySelector("[data-certificate-board]");
    if (!board || board.hidden) {
      return;
    }

    const name = document.querySelector("[data-certificate-name]")?.textContent?.trim() || "ผู้เรียน";
    const dateText = document.querySelector("[data-certificate-date]")?.textContent?.trim() || "";
    const printWindow = window.open("", "_blank", "width=1400,height=990");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildPrintMarkup(name, dateText));
    printWindow.document.close();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const siteState = await window.SiteBoot;
    if (siteState?.redirected) {
      return;
    }
    await window.SongkhlaApp.ready;
    const certificate = await window.SongkhlaApp.maybeIssueCertificate();
    renderSummary();
    renderCertificate(certificate);

    document.querySelector("[data-download-certificate]")?.addEventListener("click", downloadCertificate);
  });
})();
