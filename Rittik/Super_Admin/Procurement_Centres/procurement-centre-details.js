/* Procurement centre data */

const centres = [
  {
    code: "PS-01",
    name: "Krishnanagar Centre",
    location: "Krishnanagar, Nadia",
    state: "West Bengal",
    district: "Nadia",
    officer: "Amit Roy",
    officerId: "OFF-101",
    phone: "+91 98765 43210",
    email: "amit.roy@ruralprocure.in",
    capacity: 100,
    bookings: 74,
    queue: 18,
    status: "active",
  },
  {
    code: "PS-02",
    name: "Bardhaman Centre",
    location: "Bardhaman, Bardhaman",
    state: "West Bengal",
    district: "Bardhaman",
    officer: "S. Das",
    officerId: "OFF-102",
    phone: "+91 98765 43211",
    email: "s.das@ruralprocure.in",
    capacity: 80,
    bookings: 80,
    queue: 24,
    status: "full",
  },
  {
    code: "PS-03",
    name: "Malda Centre",
    location: "Malda, Malda",
    state: "West Bengal",
    district: "Malda",
    officer: "R. Ali",
    officerId: "OFF-103",
    phone: "+91 98765 43212",
    email: "r.ali@ruralprocure.in",
    capacity: 120,
    bookings: 43,
    queue: 11,
    status: "active",
  },
  {
    code: "PS-04",
    name: "Murshidabad Centre",
    location: "Berhampore, Murshidabad",
    state: "West Bengal",
    district: "Murshidabad",
    officer: "P. Sarkar",
    officerId: "OFF-104",
    phone: "+91 98765 43213",
    email: "p.sarkar@ruralprocure.in",
    capacity: 90,
    bookings: 32,
    queue: 9,
    status: "active",
  },
  {
    code: "PS-05",
    name: "Jalpaiguri Centre",
    location: "Jalpaiguri, Jalpaiguri",
    state: "West Bengal",
    district: "Jalpaiguri",
    officer: "D. Barman",
    officerId: "OFF-105",
    phone: "+91 98765 43214",
    email: "d.barman@ruralprocure.in",
    capacity: 110,
    bookings: 96,
    queue: 21,
    status: "busy",
  },
  {
    code: "PS-06",
    name: "Cooch Behar Centre",
    location: "Cooch Behar, Cooch Behar",
    state: "West Bengal",
    district: "Cooch Behar",
    officer: "M. Islam",
    officerId: "OFF-106",
    phone: "+91 98765 43215",
    email: "m.islam@ruralprocure.in",
    capacity: 70,
    bookings: 18,
    queue: 6,
    status: "active",
  },
  {
    code: "PS-07",
    name: "Purulia Centre",
    location: "Purulia, Purulia",
    state: "West Bengal",
    district: "Purulia",
    officer: "K. Mahato",
    officerId: "OFF-107",
    phone: "+91 98765 43216",
    email: "k.mahato@ruralprocure.in",
    capacity: 60,
    bookings: 12,
    queue: 0,
    status: "inactive",
  },
  {
    code: "PS-08",
    name: "Birbhum Centre",
    location: "Suri, Birbhum",
    state: "West Bengal",
    district: "Birbhum",
    officer: "S. Karmakar",
    officerId: "OFF-108",
    phone: "+91 98765 43217",
    email: "s.karmakar@ruralprocure.in",
    capacity: 80,
    bookings: 65,
    queue: 16,
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

  const mergedCentre = {
    bookings: 0,
    queue: 0,
    phone: "Not assigned",
    email: "Not assigned",
    ...(existingCentreIndex >= 0 ? centres[existingCentreIndex] : {}),
    ...savedCentre,
    state: savedCentre.stateName || savedCentre.state,
    district: savedCentre.districtName || savedCentre.district,
  };

  if (existingCentreIndex >= 0) {
    centres[existingCentreIndex] = mergedCentre;
  } else {
    centres.push(mergedCentre);
  }
});

/* Helper functions */

function formatStatus(status) {
  return status
    .split("-")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/* Generate slots using centre capacity and bookings */

function createCentreSlots(centre) {
  const firstCapacity = Math.ceil(centre.capacity / 3);

  const secondCapacity = Math.ceil((centre.capacity - firstCapacity) / 2);

  const thirdCapacity = centre.capacity - firstCapacity - secondCapacity;

  const capacities = [firstCapacity, secondCapacity, thirdCapacity];

  let remainingBookings = centre.bookings;

  const cropsByCentre = {
    "PS-01": ["Wheat", "Rice", "Mixed crops"],
    "PS-02": ["Rice", "Wheat", "Mustard"],
    "PS-03": ["Maize", "Rice", "Mixed crops"],
    "PS-04": ["Jute", "Rice", "Wheat"],
    "PS-05": ["Tea leaves", "Rice", "Mixed crops"],
    "PS-06": ["Rice", "Jute", "Vegetables"],
    "PS-07": ["Wheat", "Mustard", "Mixed crops"],
    "PS-08": ["Rice", "Wheat", "Vegetables"],
  };

  const crops = cropsByCentre[centre.code] || ["Wheat", "Rice", "Mixed crops"];

  const slotInformation = [
    {
      time: "09:00 – 11:00",
      name: "Morning Slot",
    },
    {
      time: "11:00 – 01:00",
      name: "Midday Slot",
    },
    {
      time: "02:00 – 04:00",
      name: "Afternoon Slot",
    },
  ];

  return slotInformation.map((slot, index) => {
    const capacity = capacities[index];

    let booked;

    if (index === slotInformation.length - 1) {
      booked = Math.min(capacity, remainingBookings);
    } else {
      booked = Math.min(
        capacity,
        Math.round(centre.bookings * (capacity / centre.capacity)),
      );
    }

    remainingBookings = Math.max(0, remainingBookings - booked);

    return {
      ...slot,
      crop: crops[index],
      booked,
      capacity,
      status: booked >= capacity ? "full" : "available",
    };
  });
}

/* Render slot activity */

function renderSlotActivity(centre) {
  const slotActivityList = document.getElementById("slot-activity-list");

  const slots = createCentreSlots(centre);

  slotActivityList.innerHTML = slots
    .map((slot) => {
      const statusText = slot.status === "full" ? "Full" : "Available";

      return `
        <div class="slot-activity-item">
          <span class="slot-time">
            ${slot.time}
          </span>

          <div class="slot-booking-info">
            <strong>${slot.name}</strong>
            <span>${slot.crop} procurement</span>
          </div>

          <span class="slot-count">
            ${slot.booked} / ${slot.capacity}
          </span>

          <span class="slot-status ${slot.status}">
            ${statusText}
          </span>
        </div>
      `;
    })
    .join("");
}

/* Load selected centre */

function loadCentreDetails() {
  const urlParameters = new URLSearchParams(window.location.search);

  const selectedCode = urlParameters.get("id");

  const selectedCentre = centres.find((centre) => {
    return centre.code === selectedCode;
  });

  if (!selectedCentre) {
    document.getElementById("centre-name").textContent = "Centre not found";

    document.getElementById("centre-code").textContent =
      selectedCode || "Unknown";

    return;
  }

  const availableSlots = Math.max(
    0,
    selectedCentre.capacity - selectedCentre.bookings,
  );

  const capacityPercentage =
    selectedCentre.capacity === 0
      ? 0
      : Math.round((selectedCentre.bookings / selectedCentre.capacity) * 100);

  document.title = `${selectedCentre.name} | RuralProcure`;

  /* Centre heading */

  document.getElementById("centre-name").textContent = selectedCentre.name;

  document.getElementById("centre-code").textContent = selectedCentre.code;

  document.getElementById("breadcrumb-centre-code").textContent =
    selectedCentre.code;

  const centreStatus = document.getElementById("centre-status");

  centreStatus.textContent = formatStatus(selectedCentre.status);

  centreStatus.className = `status-badge ${selectedCentre.status}`;

  /* Statistics */

  document.getElementById("daily-capacity").textContent =
    selectedCentre.capacity;

  document.getElementById("today-bookings").textContent =
    selectedCentre.bookings;

  document.getElementById("available-slots").textContent = availableSlots;

  document.getElementById("current-queue").textContent = selectedCentre.queue;

  /* Centre information */

  document.getElementById("details-centre-name").textContent =
    selectedCentre.name;

  document.getElementById("details-centre-code").textContent =
    selectedCentre.code;

  document.getElementById("centre-location").textContent =
    selectedCentre.location;

  document.getElementById("centre-state").textContent = selectedCentre.state;

  document.getElementById("centre-district").textContent =
    selectedCentre.district;

  document.getElementById("operational-status").textContent = formatStatus(
    selectedCentre.status,
  );

  /* Officer information */

  document.getElementById("officer-name").textContent = selectedCentre.officer;

  document.getElementById("officer-id").textContent = selectedCentre.officerId;

  document.getElementById("officer-phone").textContent = selectedCentre.phone;

  document.getElementById("officer-email").textContent = selectedCentre.email;

  /* Page action links */

  const editCentreLink = document.getElementById("edit-centre-link");

  editCentreLink.href = `./edit-procurement-centre.html?id=${encodeURIComponent(
    selectedCentre.code,
  )}`;

  const manageSlotsLink = document.getElementById("manage-slots-link");

  manageSlotsLink.href = `./slot-management.html?centre=${encodeURIComponent(
    selectedCentre.code,
  )}`;

  const viewAllSlotsLink = document.getElementById("view-all-slots-link");

  viewAllSlotsLink.href = `./slot-management.html?centre=${encodeURIComponent(
    selectedCentre.code,
  )}`;

  /* Capacity utilization */

  const capacityProgress = document.getElementById("capacity-progress");

  const capacityProgressBar = document.getElementById("capacity-progress-bar");

  const capacityDescription = document.getElementById("capacity-description");

  document.getElementById("capacity-percentage").textContent =
    `${capacityPercentage}%`;

  document.getElementById("capacity-booked").textContent =
    selectedCentre.bookings;

  document.getElementById("capacity-available").textContent = availableSlots;

  capacityProgress.setAttribute(
    "aria-valuenow",
    String(Math.min(capacityPercentage, 100)),
  );

  capacityProgressBar.style.width = `${Math.min(capacityPercentage, 100)}%`;

  capacityProgressBar.classList.remove("warning", "danger");

  if (capacityPercentage >= 100) {
    capacityProgressBar.classList.add("danger");

    capacityDescription.textContent = "Centre has reached full capacity";
  } else if (capacityPercentage >= 80) {
    capacityProgressBar.classList.add("warning");

    capacityDescription.textContent = "Centre is nearing full capacity";
  } else {
    capacityDescription.textContent = "Capacity is available today";
  }

  /* Render the selected centre's slots */

  renderSlotActivity(selectedCentre);
}

loadCentreDetails();

/* Shared dashboard controls */

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

/* Mark notifications as read */

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

/* Close menus after clicking outside */

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

/* Escape key */

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
