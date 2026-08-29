const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const sidebarClose = document.querySelector(".sidebar-close");
const sidebarOverlay = document.querySelector(".sidebar-overlay");

const dashboardDate = document.getElementById("dashboard-date");

const notificationButton = document.querySelector(".notification-button");
const notificationPanel = document.getElementById("notification-panel");
const notificationBadge = document.querySelector(".notification-badge");
const markReadButton = document.querySelector(".mark-read-button");

const navbarProfile = document.querySelector(".navbar-profile");
const profileMenu = document.getElementById("profile-menu");
const logoutButton = document.querySelector(".logout-button");

/* Sidebar */

function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("active");
  document.body.classList.add("sidebar-open");

  sidebarToggle.setAttribute("aria-expanded", "true");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("active");
  document.body.classList.remove("sidebar-open");

  sidebarToggle.setAttribute("aria-expanded", "false");
}

sidebarToggle.addEventListener("click", openSidebar);
sidebarClose.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);

/* Current date */

const today = new Date();

dashboardDate.dateTime = today.toISOString().split("T")[0];

dashboardDate.textContent = today.toLocaleDateString("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/* Profile and notification menus */

function setProfileMenu(open) {
  profileMenu.hidden = !open;
  navbarProfile.setAttribute("aria-expanded", String(open));
}

function setNotificationPanel(open) {
  notificationPanel.hidden = !open;
  notificationButton.setAttribute("aria-expanded", String(open));
}

navbarProfile.addEventListener("click", (event) => {
  event.stopPropagation();

  const shouldOpenProfile = profileMenu.hidden;

  setNotificationPanel(false);
  setProfileMenu(shouldOpenProfile);
});

notificationButton.addEventListener("click", (event) => {
  event.stopPropagation();

  const shouldOpenNotifications = notificationPanel.hidden;

  setProfileMenu(false);
  setNotificationPanel(shouldOpenNotifications);
});

markReadButton.addEventListener("click", (event) => {
  event.stopPropagation();

  const unreadNotifications = notificationPanel.querySelectorAll(
    ".notification-item.unread",
  );

  unreadNotifications.forEach((notification) => {
    notification.classList.remove("unread");
  });

  notificationBadge.textContent = "0";
  notificationBadge.classList.add("is-hidden");

  notificationButton.setAttribute(
    "aria-label",
    "View notifications: no unread notifications",
  );
});

document.addEventListener("click", (event) => {
  const clickedOutsideProfile =
    !profileMenu.contains(event.target) &&
    !navbarProfile.contains(event.target);

  const clickedOutsideNotifications =
    !notificationPanel.contains(event.target) &&
    !notificationButton.contains(event.target);

  if (clickedOutsideProfile) {
    setProfileMenu(false);
  }

  if (clickedOutsideNotifications) {
    setNotificationPanel(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (sidebar.classList.contains("open")) {
    closeSidebar();
  }

  setProfileMenu(false);
  setNotificationPanel(false);
});

/* Logout */

logoutButton.addEventListener("click", () => {
  window.location.href = "../../Admin_Login/admin-login.html";
});

/* Procurement centre data */

const centres = [
  {
    code: "PS-01",
    name: "Krishnanagar Centre",
    location: "Krishnanagar, Nadia",
    state: "west-bengal",
    district: "nadia",
    officer: "Amit Roy",
    capacity: 100,
    bookings: 74,
    status: "active",
  },
  {
    code: "PS-02",
    name: "Bardhaman Centre",
    location: "Bardhaman, Bardhaman",
    state: "west-bengal",
    district: "bardhaman",
    officer: "S. Das",
    capacity: 80,
    bookings: 80,
    status: "full",
  },
  {
    code: "PS-03",
    name: "Malda Centre",
    location: "Malda, Malda",
    state: "west-bengal",
    district: "malda",
    officer: "R. Ali",
    capacity: 120,
    bookings: 43,
    status: "active",
  },
  {
    code: "PS-04",
    name: "Murshidabad Centre",
    location: "Berhampore, Murshidabad",
    state: "west-bengal",
    district: "murshidabad",
    officer: "P. Sarkar",
    capacity: 90,
    bookings: 32,
    status: "active",
  },
  {
    code: "PS-05",
    name: "Jalpaiguri Centre",
    location: "Jalpaiguri, Jalpaiguri",
    state: "west-bengal",
    district: "jalpaiguri",
    officer: "D. Barman",
    capacity: 110,
    bookings: 96,
    status: "busy",
  },
  {
    code: "PS-06",
    name: "Cooch Behar Centre",
    location: "Cooch Behar, Cooch Behar",
    state: "west-bengal",
    district: "cooch-behar",
    officer: "M. Islam",
    capacity: 70,
    bookings: 18,
    status: "active",
  },
  {
    code: "PS-07",
    name: "Purulia Centre",
    location: "Purulia, Purulia",
    state: "west-bengal",
    district: "purulia",
    officer: "K. Mahato",
    capacity: 60,
    bookings: 12,
    status: "inactive",
  },
  {
    code: "PS-08",
    name: "Birbhum Centre",
    location: "Suri, Birbhum",
    state: "west-bengal",
    district: "birbhum",
    officer: "S. Karmakar",
    capacity: 80,
    bookings: 65,
    status: "busy",
  },
];

function getSavedCentres() {
  try {
    const savedData = localStorage.getItem("ruralProcureCentres");

    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.error("Could not load saved centres:", error);
    return [];
  }
}

const savedCentres = getSavedCentres();

savedCentres.forEach((savedCentre) => {
  const existingCentreIndex = centres.findIndex((centre) => {
    return centre.code === savedCentre.code;
  });

  if (existingCentreIndex >= 0) {
    centres[existingCentreIndex] = {
      ...centres[existingCentreIndex],
      ...savedCentre,
    };
  } else {
    centres.push(savedCentre);
  }
});

function updateCentreSummary() {
  const totalCentres = centres.length;

  const operationalCentres = centres.filter((centre) => {
    return centre.status !== "inactive";
  }).length;

  const inactiveCentres = centres.filter((centre) => {
    return centre.status === "inactive";
  }).length;

  const availableSlots = centres.reduce((total, centre) => {
    if (centre.status === "inactive") {
      return total;
    }

    const centreAvailableSlots = Math.max(
      0,
      Number(centre.capacity) - Number(centre.bookings),
    );

    return total + centreAvailableSlots;
  }, 0);

  document.getElementById("total-centres-count").textContent = totalCentres;

  document.getElementById("active-centres-count").textContent =
    operationalCentres;

  document.getElementById("inactive-centres-count").textContent =
    inactiveCentres;

  document.getElementById("available-slots-count").textContent = availableSlots;
}

updateCentreSummary();

/* Centre row helpers */

function getAvailableSlots(centre) {
  return Math.max(0, centre.capacity - centre.bookings);
}

function formatStatus(status) {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function createCentreRow(centre) {
  const availableSlots = getAvailableSlots(centre);
  const statusText = formatStatus(centre.status);
  const centreId = encodeURIComponent(centre.code);

  return `
    <tr
      data-code="${centre.code}"
      data-name="${centre.name}"
      data-location="${centre.location}"
      data-state="${centre.state}"
      data-district="${centre.district}"
      data-status="${centre.status}"
    >
      <td>
        <span class="centre-code">${centre.code}</span>
      </td>

      <td>
        <strong class="centre-name">${centre.name}</strong>
      </td>

      <td>${centre.location}</td>
      <td>${centre.officer}</td>
      <td>${centre.capacity}</td>
      <td>${centre.bookings}</td>
      <td>${availableSlots}</td>

      <td>
        <span class="status-badge ${centre.status}">
          ${statusText}
        </span>
      </td>

      <td>
        <div class="table-actions">
          <a
            href="./procurement-centre-details.html?id=${centreId}"
            class="table-action"
            aria-label="View ${centre.name}"
            title="View centre"
          >
            <i data-lucide="eye" aria-hidden="true"></i>
          </a>

          <a
            href="./edit-procurement-centre.html?id=${centreId}"
            class="table-action"
            aria-label="Edit ${centre.name}"
            title="Edit centre"
          >
            <i data-lucide="pencil" aria-hidden="true"></i>
          </a>

          <button
            type="button"
            class="table-action manage-slots-button"
            aria-label="Manage slots for ${centre.name}"
            data-centre-id="${centre.code}"
            title="Manage slots"
          >
            <i data-lucide="calendar-days" aria-hidden="true"></i>
          </button>

          <button
            type="button"
            class="table-action centre-menu-button"
            aria-label="More actions for ${centre.name}"
            aria-expanded="false"
            data-centre-id="${centre.code}"
            title="More actions"
          >
            <i data-lucide="ellipsis-vertical" aria-hidden="true"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

// Search, Filter and Pagination

const centreFilterForm = document.getElementById("centre-filter-form");
const centreSearch = document.getElementById("centre-search");
const stateFilter = document.getElementById("state-filter");
const districtFilter = document.getElementById("district-filter");
const statusFilter = document.getElementById("status-filter");

const centresTableBody = document.getElementById("centres-table-body");
const entriesSummary = document.getElementById("entries-summary");

const previousPageButton = document.querySelector(".previous-page");
const nextPageButton = document.querySelector(".next-page");

const pageButtons = document.querySelectorAll(".pagination-button[data-page]");

const rowsPerPage = 4;
let currentPage = 1;
let filteredCentres = [...centres];

function renderCurrentPage() {
  const totalPages = Math.ceil(filteredCentres.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const centresForCurrentPage = filteredCentres.slice(startIndex, endIndex);

  if (centresForCurrentPage.length === 0) {
    centresTableBody.innerHTML = `
      <tr id="no-results-row">
        <td colspan="9">
          <div class="table-empty-state">
            <i data-lucide="search-x" aria-hidden="true"></i>
            <strong>No procurement centres found</strong>
            <p>Try changing your search term or selected filters.</p>
          </div>
        </td>
      </tr>
    `;

    entriesSummary.textContent = "No procurement centres found";
  } else {
    centresTableBody.innerHTML = centresForCurrentPage
      .map((centre) => createCentreRow(centre))
      .join("");

    const firstEntry = startIndex + 1;
    const lastEntry = Math.min(endIndex, filteredCentres.length);

    entriesSummary.textContent =
      `Showing ${firstEntry} to ${lastEntry} ` +
      `of ${filteredCentres.length} centres`;
  }

  previousPageButton.disabled = currentPage === 1;

  nextPageButton.disabled = totalPages === 0 || currentPage === totalPages;

  pageButtons.forEach((button) => {
    const pageNumber = Number(button.dataset.page);

    button.hidden = pageNumber > totalPages;
    button.classList.toggle("active", pageNumber === currentPage);

    if (pageNumber === currentPage) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

function filterCentres() {
  const searchTerm = centreSearch.value.trim().toLowerCase();

  const selectedState = stateFilter.value;
  const selectedDistrict = districtFilter.value;
  const selectedStatus = statusFilter.value;

  filteredCentres = centres.filter((centre) => {
    const searchableText = [centre.code, centre.name, centre.location]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      searchTerm === "" || searchableText.includes(searchTerm);

    const matchesState =
      selectedState === "all" || centre.state === selectedState;

    const matchesDistrict =
      selectedDistrict === "all" || centre.district === selectedDistrict;

    const matchesStatus =
      selectedStatus === "all" || centre.status === selectedStatus;

    return matchesSearch && matchesState && matchesDistrict && matchesStatus;
  });

  currentPage = 1;
  renderCurrentPage();
}

// Numbered page buttons

pageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedPage = Number(button.dataset.page);
    const totalPages = Math.ceil(filteredCentres.length / rowsPerPage);

    if (selectedPage >= 1 && selectedPage <= totalPages) {
      currentPage = selectedPage;
      renderCurrentPage();
    }
  });
});

// Previous button

previousPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderCurrentPage();
  }
});

// Next button

nextPageButton.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredCentres.length / rowsPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    renderCurrentPage();
  }
});

// Filter listeners

centreSearch.addEventListener("input", filterCentres);
stateFilter.addEventListener("change", filterCentres);
districtFilter.addEventListener("change", filterCentres);
statusFilter.addEventListener("change", filterCentres);

centreFilterForm.addEventListener("reset", () => {
  setTimeout(filterCentres, 0);
});

// Initial table render

renderCurrentPage();
