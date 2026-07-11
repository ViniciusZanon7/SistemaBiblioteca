const API_DEFAULT = location.port === "" || location.port === "80"
  ? "/api"
  : "http://localhost:8080/api";
const CATALOG_PAGE_SIZE = 12;
const API_TIMEOUT_MS = 15000;
const LOGIN_TIMEOUT_MS = 9000;
const STORAGE = {
  admin: "bibliotecaAdminSession",
};
const DAY_MS = 24 * 60 * 60 * 1000;
const LOAN_DAYS = 14;
const DAILY_FINE = 2;

const state = {
  apiBase: API_DEFAULT,
  apiOnline: false,
  admin: null,
  books: [],
  users: [],
  loans: [],
  filters: {
    search: "",
    genre: "",
    status: "",
    sort: "title",
  },
  studentFilters: {
    search: "",
    sort: "az",
  },
  catalogPage: 1,
  selectedLoanId: null,
  selectedBookId: null,
  selectedUserId: null,
  rentalBookId: null,
  rentalUserId: null,
  rentalSearch: "",
  rentalMode: "select",
  studentLoansUserId: null,
  returnContext: null,
  bookEditReturnHash: null,
  loginFeedbackTimer: null,
  savingBook: false,
  savingUser: false,
  savingRental: false,
  savingRentalUser: false,
};

const elements = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  bindEvents();
  setTodayLabel();

  localStorage.removeItem(STORAGE.admin);
  state.admin = null;
  showLogin();

  if (location.hash !== "#login") {
    location.hash = "#login";
  }

  route();
}

function cacheElements() {
  elements.loginScreen = document.querySelector("#loginScreen");
  elements.appShell = document.querySelector("#appShell");
  elements.loginForm = document.querySelector("#loginForm");
  elements.loginError = document.querySelector("#loginError");
  elements.loginSubmitButton = document.querySelector("#loginSubmitButton");
  elements.loginSubmitText = document.querySelector("#loginSubmitText");
  elements.passwordInput = document.querySelector("#passwordInput");
  elements.togglePasswordButton = document.querySelector(
    "#togglePasswordButton",
  );
  elements.userMenuButton = document.querySelector("#userMenuButton");
  elements.userMenu = document.querySelector("#userMenu");
  elements.registrationMenuButton = document.querySelector(
    "#registrationMenuButton",
  );
  elements.registrationMenu = document.querySelector("#registrationMenu");
  elements.adminEmail = document.querySelector("#adminEmail");
  elements.logoutButton = document.querySelector("#logoutButton");
  elements.apiStatus = document.querySelector("#apiStatus");
  elements.todayLabel = document.querySelector("#todayLabel");

  elements.views = {
    home: document.querySelector("#homeView"),
    book: document.querySelector("#bookView"),
    student: document.querySelector("#studentCreateView"),
    students: document.querySelector("#studentsView"),
    bookCreate: document.querySelector("#bookCreateView"),
    debtors: document.querySelector("#debtorsView"),
  };

  elements.metricTotalBooks = document.querySelector("#metricTotalBooks");
  elements.metricRentedBooks = document.querySelector("#metricRentedBooks");
  elements.metricStockBooks = document.querySelector("#metricStockBooks");
  elements.metricDebtors = document.querySelector("#metricDebtors");
  elements.metricDebtorsHint = document.querySelector("#metricDebtorsHint");
  elements.debtMetricCard = document.querySelector("#debtMetricCard");

  elements.catalogSection = document.querySelector("#catalogSection");
  elements.catalogGrid = document.querySelector("#catalogGrid");
  elements.catalogEmpty = document.querySelector("#catalogEmpty");
  elements.catalogPagination = document.querySelector("#catalogPagination");
  elements.catalogSummary = document.querySelector("#catalogSummary");
  elements.searchInput = document.querySelector("#searchInput");
  elements.genreFilter = document.querySelector("#genreFilter");
  elements.availabilityFilter = document.querySelector("#availabilityFilter");
  elements.sortFilter = document.querySelector("#sortFilter");
  elements.clearFiltersButton = document.querySelector("#clearFiltersButton");

  elements.bookDetailContent = document.querySelector("#bookDetailContent");
  elements.studentForm = document.querySelector("#studentForm");
  elements.studentFormTitle = document.querySelector("#studentFormTitle");
  elements.studentFormSubtitle = document.querySelector("#studentFormSubtitle");
  elements.studentSubmitButton = document.querySelector("#studentSubmitButton");
  elements.clearStudentForm = document.querySelector("#clearStudentForm");
  elements.studentsTableWrap = document.querySelector("#studentsTableWrap");
  elements.studentsSummary = document.querySelector("#studentsSummary");
  elements.studentSearchInput = document.querySelector("#studentSearchInput");
  elements.studentSortFilter = document.querySelector("#studentSortFilter");
  elements.clearStudentFiltersButton = document.querySelector(
    "#clearStudentFiltersButton",
  );
  elements.bookForm = document.querySelector("#bookForm");
  elements.bookSubmitButton = document.querySelector("#bookSubmitButton");
  elements.clearBookForm = document.querySelector("#clearBookForm");
  elements.genreOptions = document.querySelector("#genreOptions");

  elements.debtorsTableWrap = document.querySelector("#debtorsTableWrap");
  elements.confirmModal = document.querySelector("#confirmModal");
  elements.confirmModalText = document.querySelector("#confirmModalText");
  elements.cancelModalButton = document.querySelector("#cancelModalButton");
  elements.confirmReturnButton = document.querySelector("#confirmReturnButton");
  elements.deleteBookModal = document.querySelector("#deleteBookModal");
  elements.deleteBookModalText = document.querySelector("#deleteBookModalText");
  elements.cancelDeleteBookButton = document.querySelector(
    "#cancelDeleteBookButton",
  );
  elements.confirmDeleteBookButton = document.querySelector(
    "#confirmDeleteBookButton",
  );
  elements.deleteUserModal = document.querySelector("#deleteUserModal");
  elements.deleteUserModalText = document.querySelector("#deleteUserModalText");
  elements.cancelDeleteUserButton = document.querySelector(
    "#cancelDeleteUserButton",
  );
  elements.confirmDeleteUserButton = document.querySelector(
    "#confirmDeleteUserButton",
  );
  elements.rentalModal = document.querySelector("#rentalModal");
  elements.rentalModalEyebrow = document.querySelector("#rentalModalEyebrow");
  elements.rentalModalTitle = document.querySelector("#rentalModalTitle");
  elements.rentalSelectStep = document.querySelector("#rentalSelectStep");
  elements.rentalBookSummary = document.querySelector("#rentalBookSummary");
  elements.rentalStudentSearchInput = document.querySelector(
    "#rentalStudentSearchInput",
  );
  elements.rentalSelectedStudent = document.querySelector("#rentalSelectedStudent");
  elements.rentalStudentResults = document.querySelector("#rentalStudentResults");
  elements.rentalStudentForm = document.querySelector("#rentalStudentForm");
  elements.rentalStudentSubmitButton = document.querySelector(
    "#rentalStudentSubmitButton",
  );
  elements.toggleRentalStudentFormButton = document.querySelector(
    "#toggleRentalStudentFormButton",
  );
  elements.cancelRentalStudentFormButton = document.querySelector(
    "#cancelRentalStudentFormButton",
  );
  elements.closeRentalModalButton = document.querySelector("#closeRentalModalButton");
  elements.cancelRentalButton = document.querySelector("#cancelRentalButton");
  elements.confirmRentalButton = document.querySelector("#confirmRentalButton");
  elements.rentalActions = document.querySelector("#rentalActions");
  elements.studentLoansModal = document.querySelector("#studentLoansModal");
  elements.studentLoansTitle = document.querySelector("#studentLoansTitle");
  elements.studentLoansContent = document.querySelector("#studentLoansContent");
  elements.closeStudentLoansModalButton = document.querySelector(
    "#closeStudentLoansModalButton",
  );
  elements.cancelStudentLoansModalButton = document.querySelector(
    "#cancelStudentLoansModalButton",
  );
  elements.loadingScreen = document.querySelector("#loadingScreen");
  elements.toast = document.querySelector("#toast");
}

function bindEvents() {
  elements.loginForm.addEventListener("submit", handleLogin);
  elements.togglePasswordButton.addEventListener(
    "click",
    togglePasswordVisibility,
  );
  elements.userMenuButton.addEventListener("click", toggleUserMenu);
  elements.registrationMenuButton.addEventListener(
    "click",
    toggleRegistrationMenu,
  );
  elements.logoutButton.addEventListener("click", logout);

  elements.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value.trim();
    state.catalogPage = 1;
    renderCatalog();
  });

  elements.genreFilter.addEventListener("change", (event) => {
    state.filters.genre = event.target.value;
    state.catalogPage = 1;
    renderCatalog();
  });

  elements.availabilityFilter.addEventListener("change", (event) => {
    state.filters.status = event.target.value;
    state.catalogPage = 1;
    renderCatalog();
  });

  elements.sortFilter.addEventListener("change", (event) => {
    state.filters.sort = event.target.value;
    state.catalogPage = 1;
    renderCatalog();
  });

  elements.clearFiltersButton.addEventListener("click", clearFilters);
  elements.studentForm.addEventListener("submit", handleStudentSubmit);
  elements.clearStudentForm.addEventListener("click", clearStudentForm);
  elements.studentSearchInput.addEventListener("input", (event) => {
    state.studentFilters.search = event.target.value.trim();
    renderStudentsTable();
  });
  elements.studentSortFilter.addEventListener("change", (event) => {
    state.studentFilters.sort = event.target.value;
    renderStudentsTable();
  });
  elements.clearStudentFiltersButton.addEventListener(
    "click",
    clearStudentFilters,
  );
  elements.bookForm.addEventListener("submit", handleBookSubmit);
  elements.clearBookForm.addEventListener("click", clearBookForm);
  elements.cancelModalButton.addEventListener("click", closeReturnModal);
  elements.confirmReturnButton.addEventListener("click", confirmReturnLoan);
  elements.cancelDeleteBookButton.addEventListener(
    "click",
    closeDeleteBookModal,
  );
  elements.confirmDeleteBookButton.addEventListener("click", confirmDeleteBook);
  elements.cancelDeleteUserButton.addEventListener(
    "click",
    closeDeleteUserModal,
  );
  elements.confirmDeleteUserButton.addEventListener("click", confirmDeleteUser);
  elements.closeRentalModalButton.addEventListener("click", closeRentalModal);
  elements.cancelRentalButton.addEventListener("click", closeRentalModal);
  elements.confirmRentalButton.addEventListener("click", confirmRental);
  elements.toggleRentalStudentFormButton.addEventListener("click", openRentalStudentForm);
  elements.cancelRentalStudentFormButton.addEventListener("click", closeRentalStudentForm);
  elements.rentalStudentForm.addEventListener("submit", handleRentalStudentSubmit);
  elements.rentalStudentSearchInput.addEventListener("input", (event) => {
    state.rentalSearch = event.target.value.trim();
    state.rentalUserId = null;
    renderRentalModal();
  });
  elements.closeStudentLoansModalButton.addEventListener("click", closeStudentLoansModal);
  elements.cancelStudentLoansModalButton.addEventListener("click", closeStudentLoansModal);
  elements.catalogPagination.addEventListener("click", handlePaginationClick);

  document.querySelectorAll("[data-card-action]").forEach((card) => {
    card.addEventListener("click", () =>
      handleMetricAction(card.dataset.cardAction),
    );
  });

  document.addEventListener("click", (event) => {
    if (
      !elements.userMenuButton.contains(event.target) &&
      !elements.userMenu.contains(event.target)
    ) {
      closeUserMenu();
    }

    const dropdown = elements.registrationMenuButton.closest(".nav-dropdown");
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("is-open");
      elements.registrationMenuButton.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) return;

    const id = Number(action.dataset.id);
    if (action.dataset.action === "edit-book") {
      prepareBookEdit(id);
    }
    if (action.dataset.action === "delete-book") {
      openDeleteBookModal(id);
    }
    if (action.dataset.action === "edit-user") {
      prepareUserEdit(id);
    }
    if (action.dataset.action === "delete-user") {
      openDeleteUserModal(id);
    }
    if (action.dataset.action === "return-loan") {
      openReturnModal(id);
    }
    if (action.dataset.action === "open-rental") {
      openRentalModal(id);
    }
    if (action.dataset.action === "select-rental-user") {
      selectRentalUser(id);
    }
    if (action.dataset.action === "view-user-loans") {
      openStudentLoansModal(id);
    }
  });

  document.querySelectorAll("[data-menu-link]").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.getAttribute("href") === "#cadastro-aluno") {
        clearStudentForm();
      }
      closeUserMenu();
      elements.registrationMenuButton
        .closest(".nav-dropdown")
        .classList.remove("is-open");
      elements.registrationMenuButton.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("hashchange", route);
}

async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(elements.loginForm);
  const username = normalizeLoginEmail(formData.get("email"));
  const password = String(formData.get("password") || "").trim();

  setLoginError("");

  if (!username || !password) {
    setLoginError("Informe login e senha para acessar o sistema.");
    return;
  }

  startLoginFeedback();

  try {
    const admin = await authenticateAdmin(username, password);

    if (!admin) {
      setLoginError("Login ou senha inválidos.");
      return;
    }

    state.admin = {
      username: admin.username || username,
      name: "Administrador",
      validated: true,
    };

    if (elements.adminEmail) {
      elements.adminEmail.textContent = state.admin.username;
    }
    showApp();
    location.hash = "#home";
    loadData();
  } catch (error) {
    setLoginError("Não foi possível validar o administrador no momento.");
  } finally {
    stopLoginFeedback();
  }
}

async function authenticateAdmin(username, password) {
  const [localUsername] = adminUsernameCandidates(username).slice(-1);
  const loginPayload = {
    username,
    login: localUsername,
    email: username,
    password,
  };

  const data = await requestLoginJson("/admins/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginPayload),
  });

  return data ? normalizeAdminLoginResponse(data, username) : null;
}

async function requestLoginJson(path, options = {}) {
  try {
    const response = await fetchWithTimeout(buildApiUrl(path), options, LOGIN_TIMEOUT_MS);
    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    return null;
  }
}

function normalizeAdminLoginResponse(data, username) {
  const admin = data.admin || data.usuario || data.user || data;
  return {
    username: admin.username || admin.login || admin.email || username,
  };
}

function adminUsernameCandidates(username) {
  const login = String(username || "").trim();
  const localPart = login.includes("@") ? login.split("@")[0] : login;
  return [...new Set([login, localPart].filter(Boolean))];
}

function setLoginError(message) {
  if (!elements.loginError) {
    return;
  }

  elements.loginError.textContent = message;
  elements.loginError.hidden = !message;
}

function startLoginFeedback() {
  const texts = [
    "Entrando no sistema.",
    "Entrando no sistema..",
    "Entrando no sistema...",
  ];
  let index = 0;

  elements.loginForm.classList.add("is-submitting");
  elements.loginSubmitButton.disabled = true;
  elements.loginSubmitText.textContent = texts[index];

  clearInterval(state.loginFeedbackTimer);
  state.loginFeedbackTimer = setInterval(() => {
    index = (index + 1) % texts.length;
    elements.loginSubmitText.textContent = texts[index];
  }, 420);
}

function stopLoginFeedback() {
  clearInterval(state.loginFeedbackTimer);
  state.loginFeedbackTimer = null;
  elements.loginForm.classList.remove("is-submitting");
  elements.loginSubmitButton.disabled = false;
  elements.loginSubmitText.textContent = "Entrar no sistema";
}

function togglePasswordVisibility() {
  const isPassword = elements.passwordInput.type === "password";
  elements.passwordInput.type = isPassword ? "text" : "password";
  elements.togglePasswordButton.setAttribute(
    "aria-label",
    isPassword ? "Ocultar senha" : "Mostrar senha",
  );
}

function toggleUserMenu() {
  const next = elements.userMenu.hidden;
  elements.userMenu.hidden = !next;
  elements.userMenuButton.setAttribute("aria-expanded", String(next));
}

function closeUserMenu() {
  elements.userMenu.hidden = true;
  elements.userMenuButton.setAttribute("aria-expanded", "false");
}

function toggleRegistrationMenu() {
  const dropdown = elements.registrationMenuButton.closest(".nav-dropdown");
  const next = !dropdown.classList.contains("is-open");
  dropdown.classList.toggle("is-open", next);
  elements.registrationMenuButton.setAttribute("aria-expanded", String(next));
}

function logout() {
  localStorage.removeItem(STORAGE.admin);
  state.admin = null;
  showLogin();
  location.hash = "#login";
}

function showLogin() {
  elements.loginScreen.classList.remove("is-hidden");
  elements.appShell.classList.add("is-hidden");
  setLoginError("");
}

function showApp() {
  elements.loginScreen.classList.add("is-hidden");
  elements.appShell.classList.remove("is-hidden");
  if (elements.adminEmail) {
    elements.adminEmail.textContent = state.admin?.username || "ADM";
  }
}

async function loadData() {
  showLoading();

  try {
    await refreshResources(["books", "users", "loans"], {
      render: false,
      resetCatalogPage: true,
    });
  } catch (error) {
    state.books = createDemoBooks();
    state.users = createDemoUsers();
    state.loans = createDemoLoans();
    state.apiOnline = false;
    setApiStatus(false);
  }

  state.catalogPage = 1;
  renderAll();
  hideLoading();
}

async function refreshResources(resources, options = {}) {
  const uniqueResources = [...new Set(resources)];

  await Promise.all(
    uniqueResources.map(async (resource) => {
      if (resource === "books") {
        state.books = (await apiGet("/livros")).map(normalizeBook);
      }

      if (resource === "users") {
        state.users = (await apiGet("/usuarios")).map(normalizeUser);
      }

      if (resource === "loans") {
        state.loans = (await apiGet("/emprestimos")).map(normalizeLoan);
      }
    }),
  );

  state.apiOnline = true;
  setApiStatus(true);

  if (options.resetCatalogPage) {
    state.catalogPage = 1;
  }

  if (options.render !== false) {
    renderAll();
  }
}

async function apiGet(path) {
  const response = await fetchWithTimeout(
    buildApiUrl(path),
    {},
    API_TIMEOUT_MS,
  );
  if (!response.ok) {
    throw new Error(`GET ${path} ${response.status}`);
  }
  return response.json();
}

async function apiSend(path, method, body) {
  const response = await fetchWithTimeout(
    buildApiUrl(path),
    {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    },
    API_TIMEOUT_MS + 2200,
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `${method} ${path} ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function buildApiUrl(path) {
  return `${state.apiBase.replace(/\/$/, "")}${path}`;
}

async function fetchWithTimeout(url, options = {}, timeout = API_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function showLoading() {
  elements.loadingScreen.classList.remove("is-hidden");
}

function hideLoading() {
  elements.loadingScreen.classList.add("is-hidden");
}

function setApiStatus(online) {
  if (!elements.apiStatus) {
    return;
  }

  elements.apiStatus.textContent = online ? "API conectada" : "Dados locais";
  elements.apiStatus.classList.toggle("online", online);
  elements.apiStatus.classList.toggle("offline", !online);
}

function renderAll() {
  renderMetrics();
  renderGenreControls();
  renderCatalog();
  renderStudentsTable();
  renderDebtorsTable();

  const bookId = getBookIdFromHash();
  if (bookId) {
    renderBookDetail(bookId);
  }

  if (state.rentalBookId && !elements.rentalModal.classList.contains("is-hidden")) {
    renderRentalModal();
  }

  if (state.studentLoansUserId && !elements.studentLoansModal.classList.contains("is-hidden")) {
    renderStudentLoansModal();
  }
}

function renderMetrics() {
  const active = activeLoans();
  const stockTotal = state.books.reduce(
    (total, book) => total + Number(book.quantidade || 0),
    0,
  );
  const totalCopies = stockTotal + active.length;
  const debtors = uniqueBy(overdueLoans(), (loan) => loan.usuarioId);

  elements.metricTotalBooks.textContent = totalCopies;
  elements.metricRentedBooks.textContent = active.length;
  elements.metricStockBooks.textContent = stockTotal;
  elements.metricDebtors.textContent = debtors.length;
  elements.metricDebtorsHint.textContent = debtors.length
    ? "Ver pendências"
    : "Nenhuma pendência";
  elements.debtMetricCard.classList.toggle(
    "balance-danger",
    debtors.length > 0,
  );
  elements.debtMetricCard.classList.toggle("balance-ok", debtors.length === 0);
}

function renderGenreControls() {
  const genres = uniqueSorted(
    state.books.map((book) => book.genero).filter(Boolean),
  );
  const selected = state.filters.genre;

  elements.genreFilter.innerHTML = `
    <option value="">Todos os gêneros</option>
    ${genres.map((genre) => `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`).join("")}
  `;
  elements.genreFilter.value = selected;

  elements.genreOptions.innerHTML = genres
    .map((genre) => `<option value="${escapeHtml(genre)}"></option>`)
    .join("");
}

function renderCatalog() {
  const books = filteredBooks();
  const stock = books.reduce(
    (total, book) => total + Number(book.quantidade || 0),
    0,
  );
  const totalPages = Math.max(1, Math.ceil(books.length / CATALOG_PAGE_SIZE));
  state.catalogPage = Math.min(Math.max(state.catalogPage, 1), totalPages);
  const start = (state.catalogPage - 1) * CATALOG_PAGE_SIZE;
  const visibleBooks = books.slice(start, start + CATALOG_PAGE_SIZE);

  elements.catalogSummary.textContent = `${books.length} título(s) encontrados - ${stock} exemplar(es) em estoque`;
  elements.catalogEmpty.hidden = books.length > 0;
  elements.catalogGrid.innerHTML = visibleBooks.map(renderBookCard).join("");
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    elements.catalogPagination.innerHTML = "";
    return;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  elements.catalogPagination.innerHTML = `
    <button type="button" data-page="prev" ${state.catalogPage === 1 ? "disabled" : ""}>Anterior</button>
    ${pages
      .map(
        (page) => `
          <button
            type="button"
            class="${page === state.catalogPage ? "is-active" : ""}"
            data-page="${page}"
            aria-current="${page === state.catalogPage ? "page" : "false"}"
          >
            ${page}
          </button>
        `,
      )
      .join("")}
    <button type="button" data-page="next" ${state.catalogPage === totalPages ? "disabled" : ""}>Próximo</button>
  `;
}

function handlePaginationClick(event) {
  const button = event.target.closest("[data-page]");
  if (!button || button.disabled) return;

  const books = filteredBooks();
  const totalPages = Math.max(1, Math.ceil(books.length / CATALOG_PAGE_SIZE));
  const action = button.dataset.page;

  if (action === "prev") {
    state.catalogPage = Math.max(1, state.catalogPage - 1);
  } else if (action === "next") {
    state.catalogPage = Math.min(totalPages, state.catalogPage + 1);
  } else {
    state.catalogPage = Number(action);
  }

  renderCatalog();
  elements.catalogSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function renderBookCard(book) {
  const rented = activeLoanCount(book.id);
  const stockClass = book.quantidade > 0 ? "available" : "unavailable";
  const rentalDisabled = book.quantidade <= 0 ? "disabled" : "";

  return `
    <article class="book-card">
      ${renderBookCover(book)}
      <div class="book-card-content">
        <h3>${escapeHtml(book.titulo)}</h3>
        <p>${escapeHtml(book.autor || "Autor não informado")}</p>
        <div class="tag-row">
          <span class="tag">${escapeHtml(book.genero || "Sem gênero")}</span>
          <span class="stock-counter ${stockClass}">Estoque: ${Number(book.quantidade || 0)}</span>
          <span class="status-pill neutral">Alugados: ${rented}</span>
        </div>
        <div class="book-card-actions">
          <a class="small-button primary" href="#livro-${book.id}">Ver detalhes</a>
          <button class="small-button" type="button" data-action="open-rental" data-id="${book.id}" ${rentalDisabled}>
            Alugar
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderBookDetail(bookId) {
  const book = state.books.find((item) => item.id === Number(bookId));

  if (!book) {
    elements.bookDetailContent.innerHTML = `<p class="empty-state">Livro não encontrado.</p>`;
    return;
  }

  const loans = state.loans
    .filter((loan) => loan.livroId === book.id)
    .sort(
      (a, b) =>
        Number(isLoanActive(b)) - Number(isLoanActive(a)) ||
        compareDates(b.dataEmprestimo, a.dataEmprestimo),
    );
  const active = loans.filter(isLoanActive);
  const activeRented = active.length;
  const totalCopies = Number(book.quantidade || 0) + activeRented;

  elements.bookDetailContent.innerHTML = `
    <article class="book-main-card book-detail">
      ${renderBookCover(book)}
      <div>
        <span class="eyebrow">Detalhes do livro</span>
        <h1>${escapeHtml(book.titulo)}</h1>
        <p>${escapeHtml(book.autor || "Autor não informado")}</p>
        <div class="detail-facts">
          <span>Editora<strong>${escapeHtml(book.editora || "Não informada")}</strong></span>
          <span>Gênero<strong>${escapeHtml(book.genero || "Não informado")}</strong></span>
          <span>Estoque atual<strong>${Number(book.quantidade || 0)}</strong></span>
          <span>Alugados<strong>${activeRented} de ${totalCopies}</strong></span>
        </div>
        <div class="detail-actions">
          <button class="small-button" type="button" data-action="edit-book" data-id="${book.id}">
            Editar cadastro
          </button>
          <button class="small-button primary" type="button" data-action="open-rental" data-id="${book.id}" ${book.quantidade <= 0 ? "disabled" : ""}>
            Alugar livro
          </button>
          <button class="small-button danger" type="button" data-action="delete-book" data-id="${book.id}">
            Excluir livro
          </button>
        </div>
      </div>
    </article>
    <section class="table-section">
      <h2>Empréstimos do livro</h2>
      ${renderLoansTable(loans)}
    </section>
  `;
}

function renderLoansTable(loans) {
  if (!loans.length) {
    return `<p class="empty-state">Nenhum empréstimo registrado para este livro.</p>`;
  }

  return `
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Aluno</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Retirada</th>
            <th>Dias com livro</th>
            <th>Devolução prevista</th>
            <th>Status</th>
            <th>Multa</th>
          </tr>
        </thead>
        <tbody>
          ${loans.map(renderLoanRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderLoanRow(loan) {
  const user = findUser(loan.usuarioId);
  const dueDate = getDueDate(loan);
  const lateDays = getDaysLate(loan);
  const status = isLoanActive(loan)
    ? lateDays > 0
      ? "Atrasado"
      : "Emprestado"
    : "Devolvido";

  return `
    <tr>
      <td><strong>${escapeHtml(user.nome)}</strong><small>${escapeHtml(user.email || "")}</small></td>
      <td>${escapeHtml(formatCpf(user.cpf))}</td>
      <td>${escapeHtml(user.telefone || "Não informado")}</td>
      <td>${formatDate(loan.dataEmprestimo)}</td>
      <td>${getDaysWithBook(loan)} dia(s)</td>
      <td>${formatDate(dueDate)}</td>
      <td>${renderStatus(status)}</td>
      <td><span class="fine-value">${formatMoney(getLoanFine(loan))}</span></td>
    </tr>
  `;
}

function renderDebtorsTable() {
  const loans = overdueLoans().sort((a, b) => getDaysLate(b) - getDaysLate(a));

  if (!loans.length) {
    elements.debtorsTableWrap.innerHTML = `<p class="empty-state">Nenhuma pendência encontrada.</p>`;
    return;
  }

  elements.debtorsTableWrap.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Aluno</th>
          <th>CPF</th>
          <th>Telefone</th>
          <th>Livro</th>
          <th>Atraso</th>
          <th>Multa</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        ${loans.map(renderDebtorRow).join("")}
      </tbody>
    </table>
  `;
}

function renderDebtorRow(loan) {
  const user = findUser(loan.usuarioId);
  const book = findBook(loan.livroId);
  const lateDays = getDaysLate(loan);

  return `
    <tr>
      <td><strong>${escapeHtml(user.nome)}</strong><small>${escapeHtml(user.email || "")}</small></td>
      <td>${escapeHtml(formatCpf(user.cpf))}</td>
      <td>${escapeHtml(user.telefone || "Não informado")}</td>
      <td>${escapeHtml(book.titulo)}</td>
      <td>${lateDays} dia(s)</td>
      <td><span class="fine-value">${formatMoney(getLoanFine(loan))}</span></td>
      <td>
        <button class="small-button danger" type="button" data-action="return-loan" data-id="${loan.id}">
          Anular multa
        </button>
      </td>
    </tr>
  `;
}

function renderStudentsTable() {
  const users = filteredUsers();
  const debtors = users.filter((user) => getUserBalance(user.id) > 0).length;

  elements.studentsSummary.textContent = `${users.length} aluno(s) encontrados - ${debtors} com saldo devedor`;

  if (!users.length) {
    elements.studentsTableWrap.innerHTML = `<p class="empty-state">Nenhum aluno encontrado.</p>`;
    return;
  }

  elements.studentsTableWrap.innerHTML = `
    <table class="data-table students-table">
      <thead>
        <tr>
          <th>Aluno</th>
          <th>CPF</th>
          <th>E-mail</th>
          <th>Telefone</th>
          <th>Empréstimos ativos</th>
          <th>Saldo</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(renderStudentRow).join("")}
      </tbody>
    </table>
  `;
}

function renderStudentRow(user) {
  const balance = getUserBalance(user.id);
  const balanceClass = balance > 0 ? "fine-value" : "balance-zero";

  return `
    <tr>
      <td><strong>${escapeHtml(user.nome)}</strong></td>
      <td>${escapeHtml(formatCpf(user.cpf))}</td>
      <td>${escapeHtml(user.email || "Não informado")}</td>
      <td>${escapeHtml(user.telefone || "Não informado")}</td>
      <td>${userActiveLoanCount(user.id)}</td>
      <td><span class="${balanceClass}">${formatMoney(balance)}</span></td>
      <td>
        <div class="row-actions">
          <button class="small-button primary" type="button" data-action="view-user-loans" data-id="${user.id}">
            Ver empréstimos
          </button>
          <button class="small-button" type="button" data-action="edit-user" data-id="${user.id}">
            Editar cadastro
          </button>
          <button class="small-button danger" type="button" data-action="delete-user" data-id="${user.id}">
            Excluir aluno
          </button>
        </div>
      </td>
    </tr>
  `;
}

function renderStatus(status) {
  const className =
    status === "Atrasado"
      ? "unavailable"
      : status === "Emprestado"
        ? "neutral"
        : "available";
  return `<span class="status-pill ${className}">${escapeHtml(status)}</span>`;
}

function renderBookCover(book) {
  const initials = String(book.titulo || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return `
    <div class="book-cover" aria-hidden="true">
      <span>${escapeHtml(initials || "?")}</span>
      <small>${escapeHtml(String(book.anoPublicacao || "S/A"))}</small>
    </div>
  `;
}

function filteredBooks() {
  const search = normalize(state.filters.search);
  const genre = state.filters.genre;
  const status = state.filters.status;

  const books = state.books.filter((book) => {
    const text = normalize(
      `${book.titulo} ${book.autor} ${book.genero} ${book.editora}`,
    );
    const matchesSearch = !search || text.includes(search);
    const matchesGenre = !genre || book.genero === genre;
    const matchesStatus =
      !status ||
      (status === "available" && book.quantidade > 0) ||
      (status === "unavailable" && book.quantidade <= 0) ||
      (status === "rented" && activeLoanCount(book.id) > 0);

    return matchesSearch && matchesGenre && matchesStatus;
  });

  return sortBooks(books);
}

function sortBooks(books) {
  return [...books].sort((a, b) => {
    if (state.filters.sort === "stock") {
      return (
        Number(b.quantidade || 0) - Number(a.quantidade || 0) ||
        a.titulo.localeCompare(b.titulo)
      );
    }

    if (state.filters.sort === "rented") {
      return (
        activeLoanCount(b.id) - activeLoanCount(a.id) ||
        a.titulo.localeCompare(b.titulo)
      );
    }

    if (state.filters.sort === "year") {
      return (
        Number(b.anoPublicacao || 0) - Number(a.anoPublicacao || 0) ||
        a.titulo.localeCompare(b.titulo)
      );
    }

    return a.titulo.localeCompare(b.titulo);
  });
}

function clearFilters() {
  state.filters.search = "";
  state.filters.genre = "";
  state.filters.status = "";
  state.filters.sort = "title";
  elements.searchInput.value = "";
  elements.genreFilter.value = "";
  elements.availabilityFilter.value = "";
  elements.sortFilter.value = "title";
  state.catalogPage = 1;
  renderCatalog();
}

function filteredUsers() {
  const search = normalize(state.studentFilters.search);
  const users = state.users.filter((user) => {
    const text = normalize(
      `${user.nome} ${user.cpf} ${user.CPF} ${user.email} ${user.telefone}`,
    );
    return !search || text.includes(search);
  });

  return sortUsers(users);
}

function rentalUserMatches() {
  const search = normalize(state.rentalSearch);
  const searchDigits = onlyDigits(state.rentalSearch);

  if (!search && !searchDigits) {
    return [];
  }

  return state.users
    .map((user) => ({
      user,
      score: getRentalUserMatchScore(user, search, searchDigits),
    }))
    .filter((item) => item.score < 99)
    .sort((a, b) => a.score - b.score || a.user.nome.localeCompare(b.user.nome))
    .map((item) => item.user);
}

function getRentalUserMatchScore(user, search, searchDigits) {
  const name = normalize(user.nome);
  const email = normalize(user.email);
  const cpf = onlyDigits(user.cpf || user.CPF);
  const phone = onlyDigits(user.telefone);
  let score = 99;

  if (search && name === search) score = Math.min(score, 0);
  if (search && name.startsWith(search)) score = Math.min(score, 1);
  if (searchDigits && cpf.startsWith(searchDigits)) score = Math.min(score, 1);
  if (search && email.startsWith(search)) score = Math.min(score, 2);
  if (searchDigits && phone.startsWith(searchDigits)) score = Math.min(score, 3);
  if (search && name.includes(search)) score = Math.min(score, 4);
  if (search && email.includes(search)) score = Math.min(score, 5);
  if (searchDigits && (cpf.includes(searchDigits) || phone.includes(searchDigits))) {
    score = Math.min(score, 5);
  }

  return score;
}

function sortUsers(users) {
  return [...users].sort((a, b) => {
    if (state.studentFilters.sort === "za") {
      return b.nome.localeCompare(a.nome);
    }

    if (state.studentFilters.sort === "balance") {
      return (
        getUserBalance(b.id) - getUserBalance(a.id) ||
        a.nome.localeCompare(b.nome)
      );
    }

    return a.nome.localeCompare(b.nome);
  });
}

function clearStudentFilters() {
  state.studentFilters.search = "";
  state.studentFilters.sort = "az";
  elements.studentSearchInput.value = "";
  elements.studentSortFilter.value = "az";
  renderStudentsTable();
}

async function handleStudentSubmit(event) {
  event.preventDefault();

  if (state.savingUser) {
    return;
  }

  const formData = new FormData(elements.studentForm);
  const id = Number(formData.get("id"));
  const payload = {
    nome: String(formData.get("nome") || "").trim(),
    email: normalizeLoginEmail(formData.get("email")),
    telefone: String(formData.get("telefone") || "").trim(),
    CPF: String(formData.get("CPF") || "").trim(),
  };

  state.savingUser = true;
  elements.studentSubmitButton.disabled = true;

  try {
    if (id) {
      await apiSend(`/usuarios/${id}`, "PUT", payload);
      upsertLocalUser({ id, ...payload });
      setApiStatus(true);
      renderAll();
      showToast("Aluno atualizado na API.");
    } else {
      await apiSend("/usuarios", "POST", payload);
      await refreshResources(["users"]);
      showToast("Aluno cadastrado na API.");
    }
  } catch (error) {
    upsertLocalUser({ id, ...payload });
    setApiStatus(false);
    showToast(
      id
        ? "Aluno atualizado nos dados locais."
        : "Aluno cadastrado nos dados locais.",
    );
    renderAll();
  }

  clearStudentForm();
  location.hash = "#alunos";
  state.savingUser = false;
  elements.studentSubmitButton.disabled = false;
}

async function handleBookSubmit(event) {
  event.preventDefault();

  if (state.savingBook) {
    return;
  }

  const formData = new FormData(elements.bookForm);
  const id = Number(formData.get("id"));
  const payload = {
    titulo: String(formData.get("titulo") || "").trim(),
    autor: String(formData.get("autor") || "").trim(),
    editora: String(formData.get("editora") || "").trim(),
    quantidade: Number(formData.get("quantidade") || 0),
    anoPublicacao: Number(formData.get("anoPublicacao") || 0),
    genero: String(formData.get("genero") || "").trim(),
  };

  state.savingBook = true;
  elements.bookSubmitButton.disabled = true;

  try {
    if (id) {
      await apiSend(`/livros/${id}`, "PUT", payload);
      upsertLocalBook({ id, ...payload });
      setApiStatus(true);
      renderAll();
      showToast("Livro atualizado na API.");
    } else {
      await apiSend("/livros", "POST", payload);
      await refreshResources(["books"]);
      showToast("Livro cadastrado na API.");
    }
  } catch (error) {
    console.error(error);
    upsertLocalBook({ id, ...payload });
    setApiStatus(false);
    showToast("Erro na API — usando modo local.");
    renderAll();
  }

  if (!id) {
    focusCatalogOnBook(payload.titulo);
  }

  const returnHash = id ? state.bookEditReturnHash || `#livro-${id}` : "#catalogo";
  clearBookForm();
  state.bookEditReturnHash = null;

  location.hash = returnHash;
  if (!id && location.hash === "#catalogo") {
    scrollToCatalog();
  }

  state.savingBook = false;
  elements.bookSubmitButton.disabled = false;
}

function prepareBookEdit(bookId) {
  const book = findBook(bookId);
  if (!book.id) return;

  elements.bookForm.elements.id.value = book.id;
  elements.bookForm.elements.titulo.value = book.titulo;
  elements.bookForm.elements.autor.value = book.autor;
  elements.bookForm.elements.editora.value = book.editora || "";
  elements.bookForm.elements.genero.value = book.genero || "";
  elements.bookForm.elements.quantidade.value = book.quantidade || 0;
  elements.bookForm.elements.anoPublicacao.value = book.anoPublicacao || "";
  elements.bookSubmitButton.textContent = "Atualizar livro";
  state.bookEditReturnHash = `#livro-${book.id}`;
  location.hash = "#cadastro-livro";
}

function clearBookForm() {
  elements.bookForm.reset();
  elements.bookForm.elements.id.value = "";
  elements.bookSubmitButton.textContent = "Salvar livro";
  state.bookEditReturnHash = null;
}

function focusCatalogOnBook(title) {
  state.filters.search = title;
  state.filters.genre = "";
  state.filters.status = "";
  state.filters.sort = "title";
  state.catalogPage = 1;

  elements.searchInput.value = title;
  elements.genreFilter.value = "";
  elements.availabilityFilter.value = "";
  elements.sortFilter.value = "title";
  renderCatalog();
}

function prepareUserEdit(userId) {
  const user = findUser(userId);
  if (!user.id) return;

  elements.studentForm.elements.id.value = user.id;
  elements.studentForm.elements.nome.value = user.nome || "";
  elements.studentForm.elements.email.value = user.email || "";
  elements.studentForm.elements.CPF.value = user.cpf || user.CPF || "";
  elements.studentForm.elements.telefone.value = user.telefone || "";
  elements.studentFormTitle.textContent = "Editar aluno";
  elements.studentFormSubtitle.textContent =
    "Atualize os dados cadastrais do aluno.";
  elements.studentSubmitButton.textContent = "Atualizar aluno";
  location.hash = "#cadastro-aluno";
}

function clearStudentForm() {
  elements.studentForm.reset();
  elements.studentForm.elements.id.value = "";
  elements.studentFormTitle.textContent = "Cadastrar aluno";
  elements.studentFormSubtitle.textContent =
    "Registre os dados do aluno para liberar operações no acervo.";
  elements.studentSubmitButton.textContent = "Cadastrar aluno";
}

function openReturnModal(loanId) {
  const loan = state.loans.find((item) => item.id === Number(loanId));
  if (!loan) return;

  const user = findUser(loan.usuarioId);
  const book = findBook(loan.livroId);
  state.selectedLoanId = loan.id;
  state.returnContext = !elements.studentLoansModal.classList.contains("is-hidden") ? "student-loans" : "default";
  elements.confirmModalText.textContent = `Confirme se "${book.titulo}" foi devolvido por ${user.nome}. A multa será encerrada no sistema.`;
  elements.confirmModal.classList.remove("is-hidden");
}

function closeReturnModal() {
  state.selectedLoanId = null;
  state.returnContext = null;
  elements.confirmModal.classList.add("is-hidden");
}

function openDeleteBookModal(bookId) {
  const book = findBook(bookId);
  if (!book.id) return;

  state.selectedBookId = book.id;
  elements.deleteBookModalText.textContent = `Tem certeza que deseja excluir "${book.titulo}" do acervo?`;
  elements.deleteBookModal.classList.remove("is-hidden");
}

function closeDeleteBookModal() {
  state.selectedBookId = null;
  elements.deleteBookModal.classList.add("is-hidden");
}

function openDeleteUserModal(userId) {
  const user = findUser(userId);
  if (!user.id) return;

  state.selectedUserId = user.id;
  elements.deleteUserModalText.textContent = `Tem certeza que deseja excluir "${user.nome}" do sistema? Empréstimos vinculados a este aluno também serão removidos.`;
  elements.deleteUserModal.classList.remove("is-hidden");
}

function closeDeleteUserModal() {
  state.selectedUserId = null;
  elements.deleteUserModal.classList.add("is-hidden");
}

function openStudentLoansModal(userId) {
  const user = findUser(userId);
  if (!user.id) return;

  state.studentLoansUserId = user.id;
  renderStudentLoansModal();
  elements.studentLoansModal.classList.remove("is-hidden");
}

function closeStudentLoansModal() {
  state.studentLoansUserId = null;
  elements.studentLoansModal.classList.add("is-hidden");
}

function renderStudentLoansModal() {
  const user = findUser(state.studentLoansUserId);
  if (!user.id) return;

  const loans = state.loans
    .filter((loan) => loan.usuarioId === user.id)
    .sort((a, b) => Number(isLoanActive(b)) - Number(isLoanActive(a)) || compareDates(b.dataEmprestimo, a.dataEmprestimo));

  elements.studentLoansTitle.textContent = user.nome;

  if (!loans.length) {
    elements.studentLoansContent.innerHTML = `<p class="empty-state">Nenhum empréstimo registrado.</p>`;
    return;
  }

  elements.studentLoansContent.innerHTML = `
    <div class="student-loan-summary">
      <span>Ativos<strong>${userActiveLoanCount(user.id)}</strong></span>
      <span>Saldo<strong>${formatMoney(getUserBalance(user.id))}</strong></span>
    </div>
    <div class="table-card">
      <table class="data-table student-loans-table">
        <thead>
          <tr>
            <th>Livro</th>
            <th>Retirada</th>
            <th>Prevista</th>
            <th>Status</th>
            <th>Multa</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          ${loans.map(renderStudentLoanRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderStudentLoanRow(loan) {
  const book = findBook(loan.livroId);
  const lateDays = getDaysLate(loan);
  const status = isLoanActive(loan)
    ? lateDays > 0
      ? "Atrasado"
      : "Emprestado"
    : "Devolvido";
  const fine = getLoanFine(loan);
  const actionLabel = fine > 0 ? "Anular multa" : "Tirar vínculo";

  return `
    <tr>
      <td><strong>${escapeHtml(book.titulo)}</strong><small>${escapeHtml(book.autor || "")}</small></td>
      <td>${formatDate(loan.dataEmprestimo)}</td>
      <td>${formatDate(getDueDate(loan))}</td>
      <td>${renderStatus(status)}</td>
      <td><span class="${fine > 0 ? "fine-value" : "balance-zero"}">${formatMoney(fine)}</span></td>
      <td>
        ${isLoanActive(loan)
          ? `<button class="small-button ${fine > 0 ? "danger" : ""}" type="button" data-action="return-loan" data-id="${loan.id}">${actionLabel}</button>`
          : `<span class="status-pill available">Encerrado</span>`}
      </td>
    </tr>
  `;
}

function openRentalModal(bookId) {
  const book = findBook(bookId);
  if (!book.id) return;

  if (Number(book.quantidade || 0) <= 0) {
    showToast("Livro sem estoque disponível para empréstimo.");
    return;
  }

  state.rentalBookId = book.id;
  state.rentalUserId = null;
  state.rentalSearch = "";
  elements.rentalModal.classList.remove("is-anchored");
  elements.rentalModal.style.removeProperty("--rental-modal-top");
  elements.rentalStudentSearchInput.value = "";
  closeRentalStudentForm();
  elements.rentalModal.classList.remove("is-hidden");
  renderRentalModal();
  requestAnimationFrame(() => {
    anchorRentalModal();
    elements.rentalStudentSearchInput.focus();
  });
}

function closeRentalModal() {
  state.rentalBookId = null;
  state.rentalUserId = null;
  state.rentalSearch = "";
  state.rentalMode = "select";
  state.savingRental = false;
  state.savingRentalUser = false;
  elements.rentalStudentSearchInput.value = "";
  elements.confirmRentalButton.disabled = false;
  elements.confirmRentalButton.textContent = "Confirmar empréstimo";
  closeRentalStudentForm();
  elements.rentalModal.classList.remove("is-anchored");
  elements.rentalModal.style.removeProperty("--rental-modal-top");
  elements.rentalModal.classList.add("is-hidden");
}

function anchorRentalModal() {
  const card = elements.rentalModal.querySelector(".rental-modal-card");

  if (!card || elements.rentalModal.classList.contains("is-hidden")) {
    return;
  }

  const top = Math.max(20, Math.round(card.getBoundingClientRect().top));
  elements.rentalModal.style.setProperty("--rental-modal-top", `${top}px`);
  elements.rentalModal.classList.add("is-anchored");
}

function renderRentalModal() {
  if (!state.rentalBookId || elements.rentalModal.classList.contains("is-hidden")) {
    return;
  }

  const book = findBook(state.rentalBookId);
  const stock = Number(book.quantidade || 0);
  const active = activeLoans().filter((loan) => loan.livroId === book.id);
  const selected = state.rentalUserId ? findUser(state.rentalUserId) : null;
  const blockedLoan = selected?.id ? getUserActiveLoan(selected.id) : null;

  setRentalMode(state.rentalMode);
  elements.rentalBookSummary.innerHTML = renderRentalBookSummary(book, active);
  elements.rentalSelectedStudent.innerHTML = renderRentalSelectedStudent(selected, blockedLoan);
  elements.rentalStudentResults.innerHTML = renderRentalStudentResults();

  elements.confirmRentalButton.disabled = state.savingRental || stock <= 0 || !selected?.id || Boolean(blockedLoan);
  elements.confirmRentalButton.textContent = state.savingRental ? "Registrando..." : "Confirmar empréstimo";
}

function renderRentalBookSummary(book, activeLoansForBook) {
  const stock = Number(book.quantidade || 0);
  const rented = activeLoansForBook.length;

  return `
    <div class="rental-book-card">
      ${renderBookCover(book)}
      <div>
        <h3>${escapeHtml(book.titulo)}</h3>
        <p>${escapeHtml(book.autor || "Autor não informado")}</p>
        <div class="rental-book-stats">
          <span>Estoque<strong>${stock}</strong></span>
          <span>Alugados<strong>${rented}</strong></span>
        </div>
      </div>
    </div>
  `;
}

function renderRentalSelectedStudent(user, blockedLoan) {
  if (!user?.id) {
    return `<div class="rental-placeholder">Nenhum aluno selecionado</div>`;
  }

  const activeBook = blockedLoan ? findBook(blockedLoan.livroId) : null;

  return `
    <div class="rental-selected-card ${blockedLoan ? "has-warning" : ""}">
      <div>
        <strong>${escapeHtml(user.nome)}</strong>
        <span>${escapeHtml(formatCpf(user.cpf))}</span>
      </div>
      <small>${blockedLoan ? `Com: ${escapeHtml(activeBook.titulo)}` : "Disponível"}</small>
    </div>
  `;
}

function renderRentalStudentResults() {
  if (!state.rentalSearch) {
    return `<p class="rental-inline-hint">Busque um aluno.</p>`;
  }

  const users = rentalUserMatches();

  if (!users.length) {
    return `<p class="empty-state compact-empty">Nenhum aluno encontrado.</p>`;
  }

  return users
    .slice(0, 5)
    .map((user) => {
      const activeLoan = getUserActiveLoan(user.id);
      const selected = state.rentalUserId === user.id;
      const activeBook = activeLoan ? findBook(activeLoan.livroId) : null;

      return `
        <button
          class="rental-student-option ${selected ? "is-selected" : ""}"
          type="button"
          data-action="select-rental-user"
          data-id="${user.id}"
          ${activeLoan ? "disabled" : ""}
        >
          <span>
            <strong>${escapeHtml(user.nome)}</strong>
            <small>${escapeHtml(formatCpf(user.cpf))}</small>
          </span>
          <span class="rental-student-meta">
            ${activeLoan ? `<em>${escapeHtml(activeBook.titulo)}</em>` : `<small>Disponível</small>`}
          </span>
        </button>
      `;
    })
    .join("");
}

function selectRentalUser(userId) {
  const user = findUser(userId);
  const book = findBook(state.rentalBookId);
  if (!user.id || !book.id) return;

  const activeLoan = getUserActiveLoan(user.id);
  if (activeLoan) {
    const activeBook = findBook(activeLoan.livroId);
    showToast(`${user.nome} já está com "${activeBook.titulo}".`);
    return;
  }

  state.rentalUserId = user.id;
  state.rentalSearch = user.nome;
  elements.rentalStudentSearchInput.value = user.nome;
  closeRentalStudentForm();
  renderRentalModal();
}

function openRentalStudentForm() {
  state.rentalMode = "create";
  setRentalMode("create");
  requestAnimationFrame(() => elements.rentalStudentForm.elements.nome.focus());
}

function closeRentalStudentForm() {
  state.savingRentalUser = false;
  state.rentalMode = "select";
  elements.rentalStudentForm.reset();
  elements.rentalStudentSubmitButton.disabled = false;
  elements.rentalStudentSubmitButton.textContent = "Cadastrar";
  setRentalMode("select");
}

function setRentalMode(mode) {
  const creating = mode === "create";
  state.rentalMode = creating ? "create" : "select";
  elements.rentalModalEyebrow.textContent = creating ? "Aluno" : "Empréstimo";
  elements.rentalModalTitle.textContent = creating ? "Cadastrar aluno" : "Registrar aluguel";
  elements.rentalSelectStep.classList.toggle("is-hidden", creating);
  elements.rentalStudentForm.classList.toggle("is-hidden", !creating);
  elements.rentalActions.classList.toggle("is-hidden", creating);
}

async function handleRentalStudentSubmit(event) {
  event.preventDefault();

  if (state.savingRentalUser) {
    return;
  }

  const formData = new FormData(elements.rentalStudentForm);
  const payload = {
    nome: String(formData.get("nome") || "").trim(),
    email: normalizeLoginEmail(formData.get("email")),
    telefone: String(formData.get("telefone") || "").trim(),
    CPF: String(formData.get("CPF") || "").trim(),
  };
  const existing = findUserByCpfOrEmail(payload.CPF, payload.email);

  if (existing) {
    state.rentalUserId = existing.id;
    state.rentalSearch = existing.nome;
    elements.rentalStudentSearchInput.value = existing.nome;
    closeRentalStudentForm();
    renderRentalModal();
    showToast("Aluno já cadastrado selecionado.");
    return;
  }

  state.savingRentalUser = true;
  elements.rentalStudentSubmitButton.disabled = true;
  elements.rentalStudentSubmitButton.textContent = "Salvando...";

  try {
    await apiSend("/usuarios", "POST", payload);
    await refreshResources(["users"]);
    showToast("Aluno cadastrado na API.");
  } catch (error) {
    upsertLocalUser(payload);
    setApiStatus(false);
    renderAll();
    showToast("Aluno cadastrado nos dados locais.");
  } finally {
    state.savingRentalUser = false;
  }

  const created = findUserByCpfOrEmail(payload.CPF, payload.email);
  if (created) {
    state.rentalUserId = created.id;
    state.rentalSearch = created.nome;
    elements.rentalStudentSearchInput.value = created.nome;
  }

  closeRentalStudentForm();
  renderRentalModal();
}

async function confirmRental() {
  if (state.savingRental) {
    return;
  }

  const book = findBook(state.rentalBookId);
  const user = findUser(state.rentalUserId);

  if (!book.id || !user.id) {
    showToast("Selecione um livro e um aluno para registrar o empréstimo.");
    return;
  }

  if (Number(book.quantidade || 0) <= 0) {
    showToast("Livro sem estoque disponível para empréstimo.");
    return;
  }

  const activeLoan = getUserActiveLoan(user.id);
  if (activeLoan) {
    const activeBook = findBook(activeLoan.livroId);
    showToast(`${user.nome} já está com "${activeBook.titulo}".`);
    renderRentalModal();
    return;
  }

  state.savingRental = true;
  renderRentalModal();

  try {
    await apiSend("/emprestimos", "POST", {
      usuarioId: user.id,
      livroId: book.id,
    });
    showToast("Empréstimo registrado na API.");
    await refreshResources(["books", "loans"]);
    closeRentalModal();
  } catch (error) {
    const message = String(error.message || "");

    if (message.includes("emprestimo ativo") || message.includes("empréstimo ativo")) {
      showToast("Aluno já possui empréstimo ativo.");
      await refreshResources(["loans"]);
      state.savingRental = false;
      renderRentalModal();
      return;
    }

    if (message.includes("indisponivel") || message.includes("indisponível")) {
      showToast("Livro indisponível para empréstimo.");
      await refreshResources(["books", "loans"]);
      state.savingRental = false;
      renderRentalModal();
      return;
    }

    try {
      registerLocalLoan(user.id, book.id);
      setApiStatus(false);
      showToast("Empréstimo registrado nos dados locais.");
      renderAll();
      closeRentalModal();
    } catch (localError) {
      showToast(localError.message || "Não foi possível registrar o empréstimo.");
      state.savingRental = false;
      renderRentalModal();
    }
  }
}

async function confirmDeleteBook() {
  const bookId = state.selectedBookId;
  if (!bookId) return;

  try {
    await apiSend(`/livros/${bookId}`, "DELETE");
    removeLocalBook(bookId);
    setApiStatus(true);
    renderAll();
    showToast("Livro excluído da API.");
  } catch (error) {
    removeLocalBook(bookId);
    setApiStatus(false);
    showToast("Livro removido dos dados locais.");
    renderAll();
  }

  closeDeleteBookModal();
  location.hash = "#home";
  scrollToCatalog();
}

async function confirmDeleteUser() {
  const userId = state.selectedUserId;
  if (!userId) return;

  try {
    await apiSend(`/usuarios/${userId}`, "DELETE");
    removeLocalUser(userId);
    setApiStatus(true);
    renderAll();
    showToast("Aluno excluído da API.");
  } catch (error) {
    removeLocalUser(userId);
    setApiStatus(false);
    showToast("Aluno removido dos dados locais.");
    renderAll();
  }

  closeDeleteUserModal();
  location.hash = "#alunos";
}

async function confirmReturnLoan() {
  const loanId = state.selectedLoanId;
  if (!loanId) return;
  const returnContext = state.returnContext;

  try {
    await apiSend(`/emprestimos/${loanId}/devolver`, "PUT");
    markLoanReturnedLocally(loanId);
    setApiStatus(true);
    renderAll();
    showToast("Devolução registrada na API.");
  } catch (error) {
    markLoanReturnedLocally(loanId);
    setApiStatus(false);
    showToast("Pendência encerrada nos dados locais.");
    renderAll();
  }

  closeReturnModal();
  if (returnContext === "student-loans") {
    renderStudentLoansModal();
    return;
  }

  if (location.hash !== "#atrasos") {
    location.hash = "#atrasos";
  }
}

function markLoanReturnedLocally(loanId) {
  const loan = state.loans.find((item) => item.id === Number(loanId));
  if (!loan) return;

  loan.status = "devolvido";
  loan.dataDevolucao = todayIso();
  loan.multa = 0;

  const book = state.books.find((item) => item.id === loan.livroId);
  if (book) {
    book.quantidade = Number(book.quantidade || 0) + 1;
  }
}

function registerLocalLoan(userId, bookId) {
  const book = state.books.find((item) => item.id === Number(bookId));
  if (!book || Number(book.quantidade || 0) <= 0) {
    throw new Error("Livro sem estoque disponível para empréstimo.");
  }

  if (getUserActiveLoan(userId)) {
    throw new Error("Este aluno já possui um empréstimo ativo.");
  }

  book.quantidade = Number(book.quantidade || 0) - 1;
  state.loans.push(
    normalizeLoan({
      id: nextId(state.loans),
      usuarioId: userId,
      livroId: bookId,
      dataEmprestimo: todayIso(),
      dataPrevistaDevolucao: addDaysIso(todayIso(), LOAN_DAYS),
      status: "emprestado",
      multa: 0,
    })
  );
}

function handleMetricAction(action) {
  if (action === "debtors") {
    location.hash = "#atrasos";
    return;
  }

  if (action === "rented") {
    state.filters.sort = "rented";
    elements.sortFilter.value = "rented";
    renderCatalog();
  }

  if (action === "catalog" || action === "stock" || action === "rented") {
    location.hash = "#catalogo";
    scrollToCatalog();
  }
}

function route() {
  const hash = location.hash || "#login";

  if (!state.admin && hash !== "#login") {
    showLogin();
    return;
  }

  if (hash === "#login") {
    if (state.admin) {
      location.hash = "#home";
    } else {
      showLogin();
    }
    return;
  }

  showApp();
  setActiveMenu(hash);

  const bookId = getBookIdFromHash();
  if (bookId) {
    showView("book");
    renderBookDetail(bookId);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (hash === "#cadastro-aluno") {
    showView("student");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (hash === "#cadastro-livro") {
    showView("bookCreate");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (hash === "#alunos") {
    showView("students");
    renderStudentsTable();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (hash === "#atrasos") {
    showView("debtors");
    renderDebtorsTable();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  showView("home");
  if (hash === "#catalogo") {
    scrollToCatalog();
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function showView(name) {
  Object.values(elements.views).forEach((view) =>
    view.classList.add("is-hidden"),
  );
  elements.views[name].classList.remove("is-hidden");
}

function setActiveMenu(hash) {
  document.querySelectorAll("[data-menu-link]").forEach((link) => {
    const href = link.getAttribute("href");
    const active =
      href === hash ||
      (href === "#home" &&
        (hash === "#catalogo" || hash.startsWith("#livro-")));
    link.classList.toggle("is-active", active);
  });
}

function scrollToCatalog() {
  requestAnimationFrame(() => {
    elements.catalogSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function getBookIdFromHash() {
  const match = (location.hash || "").match(/^#livro-(\d+)$/);
  return match ? Number(match[1]) : null;
}

function activeLoans() {
  return state.loans.filter(isLoanActive);
}

function overdueLoans() {
  return activeLoans().filter((loan) => getDaysLate(loan) > 0);
}

function isLoanActive(loan) {
  return (
    normalize(loan.status || "emprestado") === "emprestado" &&
    !loan.dataDevolucao
  );
}

function activeLoanCount(bookId) {
  return activeLoans().filter((loan) => loan.livroId === Number(bookId)).length;
}

function userActiveLoanCount(userId) {
  return activeLoans().filter((loan) => loan.usuarioId === Number(userId))
    .length;
}

function getUserActiveLoan(userId) {
  return activeLoans().find((loan) => loan.usuarioId === Number(userId)) || null;
}

function getUserBalance(userId) {
  return activeLoans()
    .filter((loan) => loan.usuarioId === Number(userId))
    .reduce((total, loan) => total + getLoanFine(loan), 0);
}

function findBook(bookId) {
  return (
    state.books.find((book) => book.id === Number(bookId)) || {
      id: Number(bookId),
      titulo: "Livro não encontrado",
      autor: "",
      quantidade: 0,
    }
  );
}

function findUser(userId) {
  return (
    state.users.find((user) => user.id === Number(userId)) || {
      id: Number(userId),
      nome: "Aluno não encontrado",
      email: "",
      telefone: "",
      cpf: "",
    }
  );
}

function findUserByCpfOrEmail(cpf, email) {
  const cpfDigits = onlyDigits(cpf);
  const normalizedEmail = normalize(email);

  return state.users.find((user) => {
    const userCpf = onlyDigits(user.cpf || user.CPF);
    const userEmail = normalize(user.email);
    return Boolean(
      (cpfDigits && userCpf === cpfDigits) ||
      (normalizedEmail && userEmail === normalizedEmail)
    );
  });
}

function getDueDate(loan) {
  return (
    loan.dataPrevistaDevolucao || addDaysIso(loan.dataEmprestimo, LOAN_DAYS)
  );
}

function getDaysWithBook(loan) {
  const endDate = loan.dataDevolucao || todayIso();
  return Math.max(daysBetween(loan.dataEmprestimo, endDate), 0);
}

function getDaysLate(loan) {
  if (!isLoanActive(loan)) return 0;
  return Math.max(daysBetween(getDueDate(loan), todayIso()), 0);
}

function getLoanFine(loan) {
  if (!isLoanActive(loan)) return 0;
  const backendFine = Number(loan.multa);
  if (Number.isFinite(backendFine) && backendFine > 0) {
    return backendFine;
  }
  return getDaysLate(loan) * DAILY_FINE;
}

function normalizeBook(raw) {
  return {
    id: Number(raw.id || raw.livroId || nextId(state.books)),
    titulo: String(
      raw.titulo || raw.tituloLivro || raw.titulo_livro || "Sem título",
    ).trim(),
    autor: String(raw.autor || raw.nomeAutor || raw.nome_autor || "").trim(),
    editora: String(raw.editora || "").trim(),
    quantidade: Number(raw.quantidade || 0),
    anoPublicacao: Number(raw.anoPublicacao || raw.ano_publicacao || 0),
    genero: String(raw.genero || "").trim(),
  };
}

function normalizeUser(raw) {
  const id = Number(raw.id || raw.usuarioId || nextId(state.users));
  const cpf = String(raw.CPF || raw.cpf || "").trim();

  return {
    id,
    nome: String(raw.nome || "Aluno sem nome").trim(),
    email: String(raw.email || "").trim(),
    telefone: String(raw.telefone || "").trim(),
    cpf,
    CPF: cpf,
  };
}

function normalizeLoan(raw) {
  return {
    id: Number(raw.id || nextId(state.loans)),
    usuarioId: Number(raw.usuarioId || raw.usuario_id || raw.userId || 0),
    livroId: Number(raw.livroId || raw.livro_id || raw.bookId || 0),
    dataEmprestimo:
      normalizeDate(raw.dataEmprestimo || raw.data_emprestimo) || todayIso(),
    dataPrevistaDevolucao: normalizeDate(
      raw.dataPrevistaDevolucao ||
        raw.data_prevista_devolucao ||
        raw.dataPrevista,
    ),
    dataDevolucao: normalizeDate(raw.dataDevolucao || raw.data_devolucao),
    status: String(raw.status || "emprestado")
      .trim()
      .toLowerCase(),
    multa: raw.multa ?? raw.valorDevedor ?? raw.valor_devedor ?? null,
  };
}

function upsertLocalUser(raw) {
  const user = normalizeUser({ id: raw.id || nextId(state.users), ...raw });
  const existingIndex = state.users.findIndex(
    (item) =>
      item.id === user.id || normalize(item.email) === normalize(user.email),
  );

  if (existingIndex >= 0) {
    state.users[existingIndex] = { ...state.users[existingIndex], ...user };
  } else {
    state.users.push(user);
  }
}

function upsertLocalBook(raw) {
  const book = normalizeBook({ id: raw.id || nextId(state.books), ...raw });
  const existingIndex = state.books.findIndex((item) => item.id === book.id);

  if (existingIndex >= 0) {
    state.books[existingIndex] = book;
  } else {
    state.books.push(book);
  }
}

function removeLocalBook(bookId) {
  state.books = state.books.filter((book) => book.id !== Number(bookId));
  state.loans = state.loans.filter((loan) => loan.livroId !== Number(bookId));
}

function removeLocalUser(userId) {
  const id = Number(userId);

  state.loans
    .filter((loan) => loan.usuarioId === id && isLoanActive(loan))
    .forEach((loan) => {
      const book = state.books.find((item) => item.id === loan.livroId);
      if (book) {
        book.quantidade = Number(book.quantidade || 0) + 1;
      }
    });

  state.users = state.users.filter((user) => user.id !== id);
  state.loans = state.loans.filter((loan) => loan.usuarioId !== id);
}

function createDemoBooks() {
  return [
    {
      id: 1,
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      editora: "Editora Brasil",
      quantidade: 3,
      anoPublicacao: 1899,
      genero: "Romance",
    },
    {
      id: 2,
      titulo: "1984",
      autor: "George Orwell",
      editora: "Companhia das Letras",
      quantidade: 5,
      anoPublicacao: 1949,
      genero: "Distopia",
    },
    {
      id: 3,
      titulo: "Harry Potter e a Pedra Filosofal",
      autor: "J. K. Rowling",
      editora: "Rocco",
      quantidade: 4,
      anoPublicacao: 1997,
      genero: "Fantasia",
    },
    {
      id: 4,
      titulo: "Sapiens",
      autor: "Yuval Noah Harari",
      editora: "Objetiva",
      quantidade: 2,
      anoPublicacao: 2011,
      genero: "História",
    },
    {
      id: 5,
      titulo: "A Hora da Estrela",
      autor: "Clarice Lispector",
      editora: "Rocco",
      quantidade: 1,
      anoPublicacao: 1977,
      genero: "Ficção",
    },
  ];
}

function createDemoUsers() {
  return [
    {
      id: 1,
      nome: "Ana Silva",
      email: "ana.silva@example.com",
      telefone: "11987654321",
      CPF: "20560053606",
    },
    {
      id: 2,
      nome: "Carlos Souza",
      email: "carlos.souza@example.com",
      telefone: "21998765432",
      CPF: "40206301600",
    },
    {
      id: 3,
      nome: "Mariana Lima",
      email: "mariana.lima@example.com",
      telefone: "31976543210",
      CPF: "27157562324",
    },
  ];
}

function createDemoLoans() {
  const loans = [
    {
      id: 1,
      usuarioId: 1,
      livroId: 1,
      dataEmprestimo: "2026-06-01",
      dataPrevistaDevolucao: "2026-06-08",
      status: "emprestado",
      multa: 0,
    },
    {
      id: 2,
      usuarioId: 2,
      livroId: 2,
      dataEmprestimo: "2026-05-28",
      dataPrevistaDevolucao: "2026-06-04",
      dataDevolucao: "2026-06-04",
      status: "devolvido",
      multa: 0,
    },
    {
      id: 3,
      usuarioId: 3,
      livroId: 3,
      dataEmprestimo: "2026-06-02",
      dataPrevistaDevolucao: "2026-06-09",
      status: "emprestado",
      multa: 0,
    },
    {
      id: 4,
      usuarioId: 1,
      livroId: 4,
      dataEmprestimo: "2026-05-20",
      dataPrevistaDevolucao: "2026-05-27",
      dataDevolucao: "2026-05-27",
      status: "devolvido",
      multa: 0,
    },
  ];

  return loans.map((loan) => normalizeLoan(loan));
}

function nextId(items) {
  return (
    items.reduce((max, item) => Math.max(max, Number(item.id || 0)), 0) + 1
  );
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function uniqueBy(items, getKey) {
  const seen = new Set();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function compareDates(a, b) {
  return parseDate(a).getTime() - parseDate(b).getTime();
}

function formatDate(value) {
  if (!value) return "Não informado";
  return parseDate(value).toLocaleDateString("pt-BR");
}

function formatCpf(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length !== 11) {
    return value || "Não informado";
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function setTodayLabel() {
  elements.todayLabel.textContent = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function normalizeLoginEmail(value) {
  const login = String(value || "").trim();
  if (!login) return "";
  return login.includes("@") ? login : `${login}@ulife.com.br`;
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizeDate(value) {
  if (!value || value === "null") return null;
  const text = String(value).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

function parseDate(value) {
  const normalized = normalizeDate(value) || todayIso();
  const [year, month, day] = normalized.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function todayIso() {
  return dateToIso(new Date());
}

function addDaysIso(value, days) {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return dateToIso(date);
}

function daysBetween(start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  return Math.floor((endDate - startDate) / DAY_MS);
}

function dateToIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2600);
}
