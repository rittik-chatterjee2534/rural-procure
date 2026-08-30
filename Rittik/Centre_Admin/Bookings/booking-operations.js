/* Shared page elements */

const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const sidebarClose = document.querySelector(".sidebar-close");
const sidebarOverlay = document.querySelector(".sidebar-overlay");

const dashboardDate = document.getElementById("dashboard-date");

const navbarProfile = document.querySelector(".navbar-profile");
const profileMenu = document.getElementById("profile-menu");
const logoutButton = document.querySelector(".logout-button");

const notificationButton = document.querySelector(".notification-button");

const notificationPanel = document.getElementById("notification-panel");

const notificationBadge = document.querySelector(".notification-badge");

const markReadButton = document.querySelector(".mark-read-button");

const bookingDetailsModal = document.getElementById("booking-details-modal");

const bookingModalId = document.getElementById("booking-modal-id");

const bookingModalContent = document.getElementById("booking-modal-content");

const bookingModalCloseButtons = document.querySelectorAll(
  "[data-booking-modal-close]",
);

let lastFocusedBookingElement = null;

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

/* Dropdown helpers */

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

/* Mark notifications as read */

markReadButton.addEventListener("click", () => {
  const unreadNotifications = notificationPanel.querySelectorAll(
    ".notification-item.unread",
  );

  unreadNotifications.forEach((notification) => {
    notification.classList.remove("unread");
  });

  notificationBadge.textContent = "0";
  notificationBadge.hidden = true;

  notificationButton.setAttribute("aria-label", "View notifications");
});

/* Close menus outside */

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

/* Keyboard support */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (!bookingDetailsModal.hidden) {
    closeBookingDetailsModal();
    return;
  }

  if (sidebar.classList.contains("open")) {
    closeSidebar();
  }

  setProfileMenu(false);
  setNotificationPanel(false);
});

/* Reset sidebar on desktop */

window.addEventListener("resize", () => {
  if (window.innerWidth > 1100) {
    closeSidebar();
  }
});

/* Logout */

logoutButton.addEventListener("click", () => {
  window.location.href = "../../Admin_Login/admin-login.html";
});

/* Booking page elements */

const bookingFilterForm = document.getElementById("booking-filter-form");

const bookingSearch = document.getElementById("booking-search");

const bookingDateFilter = document.getElementById("booking-date-filter");

const bookingSlotFilter = document.getElementById("booking-slot-filter");

const bookingStatusFilter = document.getElementById("booking-status-filter");

const bookingsTableBody = document.getElementById("bookings-table-body");

const bookingResultsCount = document.getElementById("booking-results-count");

const totalBookingsCount = document.getElementById("total-bookings-count");

const scheduledBookingsCount = document.getElementById(
  "scheduled-bookings-count",
);

const checkedInBookingsCount = document.getElementById(
  "checked-in-bookings-count",
);

const completedBookingsCount = document.getElementById(
  "completed-bookings-count",
);

const exportBookingsButton = document.getElementById("export-bookings-button");

/* Current date */

const today = new Date();
const todayISO = today.toISOString().split("T")[0];

dashboardDate.dateTime = todayISO;

dashboardDate.textContent = today.toLocaleDateString("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

bookingDateFilter.value = todayISO;
bookingDateFilter.defaultValue = todayISO;

/* Mock booking data */

const bookings = [
  {
    id: "BK-1001",
    date: todayISO,
    farmerName: "Ramesh Kumar",
    registrationNumber: "FR-201",
    kisanId: "KISAN-WB-1001",
    aadhaarNumber: "123456784821",
    phone: "9876543210",
    slotId: "SL-001",
    slotTime: "09:00 AM – 11:00 AM",
    crop: "Wheat",
    quantity: 12,
    status: "scheduled",
  },
  {
    id: "BK-1002",
    date: todayISO,
    farmerName: "Sita Devi",
    registrationNumber: "FR-202",
    kisanId: "KISAN-WB-1002",
    aadhaarNumber: "123456785934",
    phone: "9876543211",
    slotId: "SL-001",
    slotTime: "09:00 AM – 11:00 AM",
    crop: "Wheat",
    quantity: 18,
    status: "checked-in",
  },
  {
    id: "BK-1003",
    date: todayISO,
    farmerName: "Arjun Das",
    registrationNumber: "FR-203",
    kisanId: "KISAN-WB-1003",
    aadhaarNumber: "123456786178",
    phone: "9876543212",
    slotId: "SL-001",
    slotTime: "09:00 AM – 11:00 AM",
    crop: "Wheat",
    quantity: 10,
    status: "in-queue",
  },
  {
    id: "BK-1004",
    date: todayISO,
    farmerName: "Meena Roy",
    registrationNumber: "FR-204",
    kisanId: "KISAN-WB-1004",
    aadhaarNumber: "123456787246",
    phone: "9876543213",
    slotId: "SL-002",
    slotTime: "11:00 AM – 01:00 PM",
    crop: "Rice",
    quantity: 20,
    status: "completed",
  },
  {
    id: "BK-1005",
    date: todayISO,
    farmerName: "Bimal Ghosh",
    registrationNumber: "FR-205",
    kisanId: "KISAN-WB-1005",
    aadhaarNumber: "123456788359",
    phone: "9876543214",
    slotId: "SL-002",
    slotTime: "11:00 AM – 01:00 PM",
    crop: "Rice",
    quantity: 16,
    status: "scheduled",
  },
  {
    id: "BK-1006",
    date: todayISO,
    farmerName: "Kavita Paul",
    registrationNumber: "FR-206",
    kisanId: "KISAN-WB-1006",
    aadhaarNumber: "123456789462",
    phone: "9876543215",
    slotId: "SL-003",
    slotTime: "02:00 PM – 04:00 PM",
    crop: "Mixed Crops",
    quantity: 14,
    status: "checked-in",
  },
  {
    id: "BK-1007",
    date: todayISO,
    farmerName: "Mohan Ali",
    registrationNumber: "FR-207",
    kisanId: "KISAN-WB-1007",
    aadhaarNumber: "123456781573",
    phone: "9876543216",
    slotId: "SL-003",
    slotTime: "02:00 PM – 04:00 PM",
    crop: "Mixed Crops",
    quantity: 9,
    status: "missed",
  },
  {
    id: "BK-1008",
    date: todayISO,
    farmerName: "Anita Sarkar",
    registrationNumber: "FR-208",
    kisanId: "KISAN-WB-1008",
    aadhaarNumber: "123456782684",
    phone: "9876543217",
    slotId: "SL-003",
    slotTime: "02:00 PM – 04:00 PM",
    crop: "Mixed Crops",
    quantity: 11,
    status: "scheduled",
  },
];

/* Booking helpers */

function formatBookingStatus(status) {
  return status
    .split("-")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

let activeModalBooking = null;

function getMaskedAadhaar(aadhaarNumber) {
  const value = String(aadhaarNumber || "");

  if (value.length !== 12) {
    return "Aadhaar unavailable";
  }

  return `XXXX XXXX ${value.slice(-4)}`;
}

function openBookingDetailsModal(booking) {
  lastFocusedBookingElement = document.activeElement;
  activeModalBooking = booking;

  bookingModalId.textContent = booking.id;

  bookingModalContent.innerHTML = `
    <section class="booking-detail-section">
      <h3>Farmer Information</h3>

      <dl class="booking-detail-grid">
        <div class="booking-detail-item">
          <dt>Farmer Name</dt>
          <dd>${booking.farmerName}</dd>
        </div>

        <div class="booking-detail-item">
          <dt>Registration Number</dt>
          <dd>${booking.registrationNumber}</dd>
        </div>

        <div class="booking-detail-item">
          <dt>Kisan ID</dt>
          <dd>${booking.kisanId}</dd>
        </div>

        <div class="booking-detail-item">
          <dt>Aadhaar Number</dt>

          <dd class="aadhaar-value-row">
            <strong id="modal-aadhaar-number">
              ${getMaskedAadhaar(booking.aadhaarNumber)}
            </strong>

            <button
              type="button"
              class="aadhaar-toggle-button"
              id="aadhaar-toggle-button"
              aria-pressed="false"
            >
              Show
            </button>
          </dd>
        </div>

        <div class="booking-detail-item">
          <dt>Phone Number</dt>
          <dd>${booking.phone}</dd>
        </div>
      </dl>
    </section>

    <section class="booking-detail-section">
      <h3>Booking Information</h3>

      <dl class="booking-detail-grid">
        <div class="booking-detail-item">
          <dt>Booking Date</dt>
          <dd>${booking.date}</dd>
        </div>

        <div class="booking-detail-item">
          <dt>Time Slot</dt>
          <dd>${booking.slotTime}</dd>
        </div>

        <div class="booking-detail-item">
          <dt>Crop</dt>
          <dd>${booking.crop}</dd>
        </div>

        <div class="booking-detail-item">
          <dt>Expected Quantity</dt>
          <dd>${booking.quantity} quintal</dd>
        </div>

        <div class="booking-detail-item">
          <dt>Booking Status</dt>
          <dd>
            <span class="booking-status ${booking.status}">
              ${formatBookingStatus(booking.status)}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  `;

  bookingDetailsModal.hidden = false;
  document.body.classList.add("booking-modal-open");

  const closeButton = bookingDetailsModal.querySelector(".booking-modal-close");

  closeButton.focus();

  if (window.lucide) {
    lucide.createIcons();
  }
}

function closeBookingDetailsModal() {
  bookingDetailsModal.hidden = true;
  document.body.classList.remove("booking-modal-open");

  bookingModalContent.innerHTML = "";
  activeModalBooking = null;

  if (lastFocusedBookingElement) {
    lastFocusedBookingElement.focus();
  }
}

function formatAadhaarNumber(aadhaarNumber) {
  return String(aadhaarNumber).replace(/(\d{4})(?=\d)/g, "$1 ");
}

bookingModalContent.addEventListener("click", (event) => {
  const toggleButton = event.target.closest("#aadhaar-toggle-button");

  if (!toggleButton || !activeModalBooking) {
    return;
  }

  const aadhaarDisplay = document.getElementById(
    "modal-aadhaar-number",
  );

  const aadhaarIsVisible =
    toggleButton.getAttribute("aria-pressed") === "true";

  if (aadhaarIsVisible) {
    aadhaarDisplay.textContent = getMaskedAadhaar(
      activeModalBooking.aadhaarNumber,
    );

    toggleButton.textContent = "Show";
    toggleButton.setAttribute("aria-pressed", "false");
  } else {
    aadhaarDisplay.textContent = formatAadhaarNumber(
      activeModalBooking.aadhaarNumber,
    );

    toggleButton.textContent = "Hide";
    toggleButton.setAttribute("aria-pressed", "true");
  }
});

bookingModalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeBookingDetailsModal);
});

function getFarmerInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* Create booking row */

function createBookingRow(booking) {
  const checkInDisabled = booking.status !== "scheduled";

  const cancelDisabled = ["completed", "cancelled", "missed"].includes(
    booking.status,
  );

  return `
    <tr data-booking-id="${booking.id}">
      <td>
        <span class="booking-id">${booking.id}</span>
      </td>

      <td>
        <div class="booking-farmer">
          <span class="booking-farmer-avatar">
            ${getFarmerInitials(booking.farmerName)}
          </span>

          <div>
            <strong>${booking.farmerName}</strong>
            <span>Kisan ID: ${booking.kisanId}</span>
          </div>
        </div>
      </td>

      <td>
        <span class="booking-phone">
          ${booking.phone}
        </span>
      </td>

      <td>
        <span class="booking-time">
          ${booking.slotTime}
        </span>
      </td>

      <td>${booking.crop}</td>

      <td>${booking.quantity} quintal</td>

      <td>
        <span class="booking-status ${booking.status}">
          ${formatBookingStatus(booking.status)}
        </span>
      </td>

      <td>
        <div class="booking-actions">
          <button
            type="button"
            class="booking-action-button"
            data-action="view"
            data-booking-id="${booking.id}"
            aria-label="View ${booking.id}"
            title="View booking"
          >
            <i data-lucide="eye" aria-hidden="true"></i>
          </button>

          <button
            type="button"
            class="booking-action-button"
            data-action="check-in"
            data-booking-id="${booking.id}"
            aria-label="Check in ${booking.id}"
            title="Check in farmer"
            ${checkInDisabled ? "disabled" : ""}
          >
            <i data-lucide="user-check" aria-hidden="true"></i>
          </button>

          <button
            type="button"
            class="booking-action-button danger"
            data-action="cancel"
            data-booking-id="${booking.id}"
            aria-label="Cancel ${booking.id}"
            title="Cancel booking"
            ${cancelDisabled ? "disabled" : ""}
          >
            <i data-lucide="circle-x" aria-hidden="true"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

/* Render booking table */

function renderBookings(data) {
  if (data.length === 0) {
    bookingsTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="booking-empty-state">
            <i data-lucide="calendar-x" aria-hidden="true"></i>
            <strong>No bookings found</strong>
            <p>Try changing the selected filters.</p>
          </div>
        </td>
      </tr>
    `;
  } else {
    bookingsTableBody.innerHTML = data
      .map((booking) => createBookingRow(booking))
      .join("");
  }

  bookingResultsCount.textContent = `${data.length} ${
    data.length === 1 ? "booking" : "bookings"
  }`;

  if (window.lucide) {
    lucide.createIcons();
  }
}

/* Update summary */

function updateBookingSummary(dateBookings) {
  const scheduled = dateBookings.filter((booking) => {
    return booking.status === "scheduled";
  }).length;

  const checkedIn = dateBookings.filter((booking) => {
    return ["checked-in", "in-queue"].includes(booking.status);
  }).length;

  const completed = dateBookings.filter((booking) => {
    return booking.status === "completed";
  }).length;

  totalBookingsCount.textContent = dateBookings.length;
  scheduledBookingsCount.textContent = scheduled;
  checkedInBookingsCount.textContent = checkedIn;
  completedBookingsCount.textContent = completed;
}

/* Search and filters */

function applyBookingFilters() {
  const searchTerm = bookingSearch.value.trim().toLowerCase();

  const selectedDate = bookingDateFilter.value;
  const selectedSlot = bookingSlotFilter.value;
  const selectedStatus = bookingStatusFilter.value;

  const dateBookings = bookings.filter((booking) => {
    return selectedDate === "" || booking.date === selectedDate;
  });

  const filteredBookings = dateBookings.filter((booking) => {
    const searchableText = [
      booking.id,
      booking.farmerName,
      booking.registrationNumber,
      booking.kisanId,
      booking.phone,
      booking.crop,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      searchTerm === "" || searchableText.includes(searchTerm);

    const matchesSlot =
      selectedSlot === "all" || booking.slotId === selectedSlot;

    const matchesStatus =
      selectedStatus === "all" || booking.status === selectedStatus;

    return matchesSearch && matchesSlot && matchesStatus;
  });

  updateBookingSummary(dateBookings);
  renderBookings(filteredBookings);
}

bookingSearch.addEventListener("input", applyBookingFilters);
bookingDateFilter.addEventListener("change", applyBookingFilters);
bookingSlotFilter.addEventListener("change", applyBookingFilters);
bookingStatusFilter.addEventListener("change", applyBookingFilters);

bookingFilterForm.addEventListener("reset", () => {
  setTimeout(() => {
    bookingDateFilter.value = todayISO;
    applyBookingFilters();
  }, 0);
});

/* Temporary action handlers */

bookingsTableBody.addEventListener("click", (event) => {
  const actionButton = event.target.closest(".booking-action-button");

  if (!actionButton || actionButton.disabled) {
    return;
  }

  const selectedBooking = bookings.find((booking) => {
    return booking.id === actionButton.dataset.bookingId;
  });

  if (!selectedBooking) {
    return;
  }

  const action = actionButton.dataset.action;

  if (action === "view") {
    openBookingDetailsModal(selectedBooking);
    return;
  }

  console.log(action, selectedBooking);
});

exportBookingsButton.addEventListener("click", () => {
  console.log("Export bookings");
});

applyBookingFilters();
