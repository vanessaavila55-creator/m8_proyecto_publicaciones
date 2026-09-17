const tokenKey = "blogToken";
const getToken = () => localStorage.getItem(tokenKey);
const getUser = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
        );
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem(tokenKey);
            return null;
        }
        return payload;
    } catch {
        localStorage.removeItem(tokenKey);
        return null;
    }
};
const api = async (url, options = {}) => {
    const headers = new Headers(options.headers || {}),
        token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (options.body && !(options.body instanceof FormData))
        headers.set("Content-Type", "application/json");
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok)
        throw new Error(
            data.message || "No fue posible completar la solicitud.",
        );
    return data;
};
const escapeHtml = (value = "") =>
    String(value).replace(
        /[&<>'"]/g,
        (character) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;",
            })[character],
    );
const formatDate = (value) =>
    value
        ? new Intl.DateTimeFormat("es-CL", { dateStyle: "long" }).format(
              new Date(value),
          )
        : "Fecha no disponible";
const excerpt = (value) =>
    String(value || "").length > 180
        ? `${String(value).slice(0, 180).trim()}...`
        : String(value || "");
const renderNav = (active = "") => {
    const user = getUser(),
        nav = document.querySelector("#site-nav");
    if (!nav) return;
    nav.innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark"><div class="container"><a class="navbar-brand fw-bold" href="/index.html">TRAZOS</a><button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#main-nav"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="main-nav"><div class="navbar-nav ms-auto align-items-lg-center gap-lg-2"><a class="nav-link ${active === "home" ? "active" : ""}" href="/index.html">Lecturas</a>${user ? `<a class="nav-link ${active === "new" ? "active" : ""}" href="/nueva-publicacion.html">Escribir</a><span class="nav-link text-white">Hola, ${escapeHtml(user.nombre || "lector")}</span><button class="btn btn-sm btn-outline-light" id="logout">Salir</button>` : `<a class="nav-link ${active === "login" ? "active" : ""}" href="/login.html">Ingresar</a><a class="btn btn-sm btn-accent ms-lg-2" href="/registro.html">Crear cuenta</a>`}</div></div></div></nav>`;
    document.querySelector("#logout")?.addEventListener("click", () => {
        localStorage.removeItem(tokenKey);
        window.location.href = "/index.html";
    });
};
const showMessage = (element, message, type = "danger") => {
    element.className = `alert alert-${type}`;
    element.textContent = message;
    element.classList.remove("d-none");
};
