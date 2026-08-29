// DOM elements
const overviewChartCanvas = document.getElementById("booking-overview-chart");
const statusChartCanvas = document.getElementById("request-status-chart");
const overviewRange = document.getElementById("overview-range");
const dashboardDate = document.getElementById("dashboard-date");

const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const sidebarClose = document.querySelector(".sidebar-close");
const sidebarOverlay = document.querySelector(".sidebar-overlay");

const navbarProfile = document.querySelector(".navbar-profile");
const profileMenu = document.getElementById("profile-menu");
const logoutButton = document.querySelector(".logout-button");

const notificationButton = document.querySelector(".notification-button");
const notificationPanel = document.getElementById("notification-panel");
const notificationBadge = document.querySelector(".notification-badge");
const markReadButton = document.querySelector(".mark-read-button");

// Dynamic navbar date
const today = new Date();

dashboardDate.dateTime = today.toISOString().split("T")[0];

dashboardDate.textContent = today.toLocaleDateString("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

// Chart data
const overviewLabels = [
  "Aug 24",
  "Aug 25",
  "Aug 26",
  "Aug 27",
  "Aug 28",
  "Aug 29",
  "Aug 30",
];

const bookingData = [62, 68, 65, 70, 69, 72, 74];

const procurementData = [34, 38, 36, 40, 39, 42, 43];

const requestStatusLabels = ["Scheduled", "Checked In", "Completed", "Missed"];

const requestStatusData = [13, 16, 43, 2];

const overviewDataByRange = {
  7: {
    labels: overviewLabels,
    bookings: bookingData,
    procurements: procurementData,
  },

  30: {
    labels: [
      "Aug 1",
      "Aug 6",
      "Aug 11",
      "Aug 16",
      "Aug 21",
      "Aug 30",
    ],
    bookings: [51, 56, 60, 65, 69, 74],
    procurements: [27, 30, 33, 36, 40, 43],
  },

  90: {
    labels: ["June", "July", "August"],
    bookings: [1410, 1585, 1760],
    procurements: [820, 960, 1120],
  },
};


// Booking and procurement line chart
const overviewChart = new Chart(overviewChartCanvas, {
  type: "line",

  data: {
    labels: overviewLabels,

    datasets: [
      {
        label: "Bookings",
        data: bookingData,
        borderColor: "#15803d",
        backgroundColor: "rgba(21, 128, 61, 0.12)",
        borderWidth: 2,
        tension: 0.35,
        fill: true,
      },
      {
        label: "Procurements",
        data: procurementData,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.08)",
        borderWidth: 2,
        tension: 0.35,
        fill: false,
      },
    ],
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

        grid: {
          color: "#eef2ee",
        },
      },
    },
  },
});

// Update line chart from selected range
overviewRange.addEventListener("change", (event) => {
  const selectedRange = event.target.value;
  const selectedData = overviewDataByRange[selectedRange];

  overviewChart.data.labels = selectedData.labels;
  overviewChart.data.datasets[0].data = selectedData.bookings;
  overviewChart.data.datasets[1].data = selectedData.procurements;

  overviewChart.update();
});

// Request-status doughnut chart
const requestStatusChart = new Chart(statusChartCanvas, {
  type: "doughnut",

  data: {
    labels: requestStatusLabels,

    datasets: [
      {
        label: "Bookings",
        data: requestStatusData,
        backgroundColor: ["#f59e0b", "#3b82f6", "#22a447", "#dc2626"],
        borderWidth: 0,
      },
    ],
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          color: "#334155",

          font: {
            family: "Poppins",
            size: 12,
          },
        },
      },
    },
  },
});

// Sidebar controls
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

// Dropdown helpers
function setProfileMenu(open) {
  profileMenu.hidden = !open;
  navbarProfile.setAttribute("aria-expanded", String(open));
}

function setNotificationPanel(open) {
  notificationPanel.hidden = !open;
  notificationButton.setAttribute("aria-expanded", String(open));
}

// Profile dropdown
navbarProfile.addEventListener("click", (event) => {
  event.stopPropagation();

  const shouldOpenProfile = profileMenu.hidden;

  setNotificationPanel(false);
  setProfileMenu(shouldOpenProfile);
});

// Notification dropdown
notificationButton.addEventListener("click", (event) => {
  event.stopPropagation();

  const shouldOpenNotifications = notificationPanel.hidden;

  setProfileMenu(false);
  setNotificationPanel(shouldOpenNotifications);
});

// Close dropdowns when clicking elsewhere
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

// Mark all notifications as read
markReadButton.addEventListener("click", () => {
  const unreadNotifications = document.querySelectorAll(
    ".notification-item.unread",
  );

  unreadNotifications.forEach((notification) => {
    notification.classList.remove("unread");
  });

  notificationBadge.textContent = "0";
  notificationBadge.hidden = true;

  notificationButton.setAttribute("aria-label", "View notifications");
});

// Escape-key support
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

// Reset mobile sidebar when returning to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 1100) {
    closeSidebar();
  }
});

// Logout
logoutButton.addEventListener("click", () => {
  window.location.href = "../../Admin_Login/admin-login.html";
});
