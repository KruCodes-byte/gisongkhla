(() => {
  document.addEventListener("DOMContentLoaded", async () => {
    const siteState = await window.SiteBoot;
    if (siteState?.redirected) {
      return;
    }
    await window.SongkhlaApp.ready;

    const routeGrid = document.querySelector("[data-about-routes]");
    routeGrid.innerHTML = window.SongkhlaData.routes
      .map(
        (route) => `
          <article class="about-route-card">
            <img class="about-route-logo" src="${route.logo}" alt="${route.giName}">
            <span class="eyebrow">${route.trackLabel}</span>
            <h3>${route.giName}</h3>
            <p>${route.areaLabel || route.districtName}</p>
          </article>
        `
      )
      .join("");

    const developers = document.querySelector("[data-about-developers]");
    developers.innerHTML = window.SongkhlaData.developers.map((name) => `<li>${name}</li>`).join("");
    document.querySelector("[data-about-advisor]").textContent = window.SongkhlaData.advisor;
    document.querySelector("[data-about-university]").textContent = window.SongkhlaData.university;
  });
})();
