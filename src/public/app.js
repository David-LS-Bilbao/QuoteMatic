(function () {
  const quoteCard = document.querySelector("#quote-card");
  const randomForm = document.querySelector("#random-quote-form");
  const dashboardMessage = document.querySelector("#dashboard-message");
  const favoritesMessage = document.querySelector("#favorites-message");

  const escapeHtml = (str) => {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  const setMessage = (element, message, type) => {
    if (!element) return;
    element.textContent = message;
    element.dataset.type = type || "";
  };

  const renderQuote = (quote, isAuthenticated) => {
    if (!quoteCard) return;

    quoteCard.dataset.quoteId = quote._id;

    const saveSection = isAuthenticated
      ? `<button class="button primary" id="save-favorite-button" type="button">Guardar favorito</button>`
      : `<p class="auth-hint"><a href="/auth/login">Inicia sesión</a> o <a href="/auth/register">regístrate</a> para guardar esta frase.</p>`;

    quoteCard.innerHTML = `
      <blockquote>"${escapeHtml(quote.text)}"</blockquote>
      <p class="quote-meta">
        ${escapeHtml(quote.author?.name || "Autor desconocido")} &middot;
        ${escapeHtml(quote.quoteType?.name || "Tipo desconocido")} &middot;
        ${escapeHtml(quote.situation?.name || "Situación desconocida")}
      </p>
      ${saveSection}
    `;
  };

  randomForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(dashboardMessage, "Buscando frase...", "");

    const isAuthenticated = quoteCard?.dataset.authenticated === "true";
    const formData = new FormData(randomForm);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string" && value) {
        params.set(key, value);
      }
    }

    const query = params.toString();

    try {
      const response = await fetch(`/api/quotes/random${query ? `?${query}` : ""}`);
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        setMessage(dashboardMessage, payload.message || "No se pudo obtener una frase.", "error");
        return;
      }

      renderQuote(payload.data, isAuthenticated);
      setMessage(dashboardMessage, "", "");
    } catch {
      setMessage(dashboardMessage, "Error de conexión. Inténtalo de nuevo.", "error");
    }
  });

  quoteCard?.addEventListener("click", async (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement) || target.id !== "save-favorite-button") {
      return;
    }

    const quoteId = quoteCard.dataset.quoteId;

    if (!quoteId) {
      setMessage(dashboardMessage, "Primero pide una frase.", "error");
      return;
    }

    try {
      const response = await fetch(`/api/favorites/${quoteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const payload = await response.json();

      if (response.status === 401) {
        setMessage(dashboardMessage, "Necesitas iniciar sesión para guardar favoritos.", "error");
        return;
      }

      if (!response.ok || !payload.success) {
        setMessage(dashboardMessage, payload.message || "No se pudo guardar el favorito.", "error");
        return;
      }

      setMessage(dashboardMessage, payload.message || "Favorito guardado.", "success");
    } catch {
      setMessage(dashboardMessage, "Error de conexión al guardar el favorito.", "error");
    }
  });

  document.querySelectorAll(".remove-favorite-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const item = button.closest(".favorite-item");
      const quoteId = item?.getAttribute("data-quote-id");

      if (!quoteId) {
        setMessage(favoritesMessage, "No se pudo identificar el favorito.", "error");
        return;
      }

      try {
        const response = await fetch(`/api/favorites/${quoteId}`, { method: "DELETE" });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          setMessage(favoritesMessage, payload.message || "No se pudo quitar el favorito.", "error");
          return;
        }

        item?.remove();
        setMessage(favoritesMessage, "Favorito quitado.", "success");
      } catch {
        setMessage(favoritesMessage, "Error de conexión al quitar el favorito.", "error");
      }
    });
  });
})();
