// Shared layout elements

const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const sidebarClose = document.querySelector(".sidebar-close");
const sidebarOverlay = document.querySelector(".sidebar-overlay");

const dashboardDate = document.getElementById("dashboard-date");

const logoutButton = document.querySelector(".logout-button");

const waitingCount = document.getElementById("waiting-count");
const servingCount = document.getElementById("serving-count");
const completedCount = document.getElementById("completed-count");
const averageWaitTime = document.getElementById("average-wait-time");

const queueTableBody = document.getElementById("queue-table-body");
const queueTotalBadge = document.getElementById("queue-total-badge");

const serviceState = document.getElementById("service-state");
const currentServiceEmpty = document.getElementById("current-service-empty");
const currentServiceDetails = document.getElementById(
  "current-service-details",
);

const currentTokenNumber = document.getElementById("current-token-number");
const currentFarmerName = document.getElementById("current-farmer-name");
const currentBookingId = document.getElementById("current-booking-id");
const currentSlotTime = document.getElementById("current-slot-time");
const currentCrop = document.getElementById("current-crop");
const currentServiceTime = document.getElementById("current-service-time");

const completeServiceButton = document.getElementById(
  "complete-service-button",
);

lucide.createIcons();

const queueEntries = [
  {
    id: "QE-001",
    tokenNumber: 1,
    bookingId: "BK-1001",
    farmerName: "Ramesh Kumar",
    kisanId: "KISAN-WB-1001",
    slotTime: "09:00 AM – 11:00 AM",
    crop: "Wheat",
    checkedInAt: Date.now() - 55 * 60 * 1000,
    serviceStartedAt: Date.now() - 40 * 60 * 1000,
    completedAt: Date.now() - 25 * 60 * 1000,
    status: "completed",
  },
  {
    id: "QE-004",
    tokenNumber: 4,
    bookingId: "BK-1005",
    farmerName: "Bimal Ghosh",
    kisanId: "KISAN-WB-1005",
    slotTime: "11:00 AM – 01:00 PM",
    crop: "Rice",
    checkedInAt: Date.now() - 12 * 60 * 1000,
    serviceStartedAt: null,
    completedAt: null,
    status: "waiting",
  },
  {
    id: "QE-002",
    tokenNumber: 2,
    bookingId: "BK-1002",
    farmerName: "Sita Devi",
    kisanId: "KISAN-WB-1002",
    slotTime: "09:00 AM – 11:00 AM",
    crop: "Wheat",
    checkedInAt: Date.now() - 35 * 60 * 1000,
    serviceStartedAt: Date.now() - 8 * 60 * 1000,
    completedAt: null,
    status: "serving",
  },
  {
    id: "QE-003",
    tokenNumber: 3,
    bookingId: "BK-1003",
    farmerName: "Arjun Das",
    kisanId: "KISAN-WB-1003",
    slotTime: "09:00 AM – 11:00 AM",
    crop: "Wheat",
    checkedInAt: Date.now() - 20 * 60 * 1000,
    serviceStartedAt: null,
    completedAt: null,
    status: "waiting",
  },
];

//Read Waiting Entries Function

function getWaitingQueue() {
  const waitingEntries = queueEntries.filter((entry) => {
    return entry.status === "waiting";
  });

  waitingEntries.sort((firstEntry, secondEntry) => {
    return firstEntry.tokenNumber - secondEntry.tokenNumber;
  });
  return waitingEntries;
}

// Calculate Waiting Minutes
function calculateWaitingMinutes(checkedInAt) {
  const differenceInMilliseconds = Date.now() - checkedInAt;
  const minutes = differenceInMilliseconds / (1000 * 60);
  return Math.floor(minutes);
}

//Summary Update Function

function updateSummary() {
  const waitingEntries = getWaitingQueue();
  const waitingTotal = waitingEntries.length;

  //Read Serving Count
  const servingTotal = queueEntries.filter((entry) => {
    return entry.status === "serving";
  }).length;

  //Read Completed Count
  const completedTotal = queueEntries.filter((entry) => {
    return entry.status === "completed";
  }).length;

  // Update Inner Text
  waitingCount.textContent = waitingTotal;
  servingCount.textContent = servingTotal;
  completedCount.textContent = completedTotal;

  //Calculate Average Waiting time
  let totalWaitingMinutes = 0;

  waitingEntries.forEach((entry) => {
    totalWaitingMinutes += calculateWaitingMinutes(entry.checkedInAt);
  });
  const averageMinutes =
    waitingTotal === 0 ? 0 : Math.floor(totalWaitingMinutes / waitingTotal);
  averageWaitTime.textContent = averageMinutes;
}

//Format token number

function formatTokenNumber(tokenNumber) {
  const tokenText = String(tokenNumber);
  const paddedToken = tokenText.padStart(3, "0");
  return `T-${paddedToken}`;
}

// Initialize Lucide icons

lucide.createIcons();

// Display the current date

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

dashboardDate.dateTime = `${year}-${month}-${day}`;

dashboardDate.textContent = today.toLocaleDateString("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

//Helper Function to convert timestamp into a readable format
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

//Queue Row Creation

function createQueueRow(entry) {
  const row = document.createElement("tr");

  row.dataset.entryId = entry.id;
  row.innerHTML = `
  <td>${formatTokenNumber(entry.tokenNumber)}</td>
  <td>
  <strong>${entry.farmerName}</strong>
  <small>${entry.kisanId}</small>
  </td>
  <td>${entry.bookingId}</td>
  <td>${formatTime(entry.checkedInAt)}</td>
  <td>${entry.slotTime}</td>
  <td>${entry.crop}</td>
  <td>${calculateWaitingMinutes(entry.checkedInAt)} min</td>

  <td>
    <span class="queue-status waiting">Waiting</span>
  </td>

  <td>
    <button
      type="button"
      class="skip-queue-button"
      data-entry-id="${entry.id}"
      aria-label="Skip ${entry.farmerName}"
    >
    <i data-lucide="skip-forward" aria-hidden="true"></i>
    </button>
  </td>
  `;
  return row;
}

//Show Waiting Queue
function renderWaitingQueue() {
  const waitingEntries = getWaitingQueue();
  queueTableBody.innerHTML = "";
  queueTotalBadge.textContent = `${waitingEntries.length} waiting`;

  if (waitingEntries.length === 0) {
    queueTableBody.innerHTML = `
    <tr>
      <td colspan="9">
        <div class="queue-empty-state">
          <i data-lucide="users" aria-hidden="true"></i>
          <strong>No farmers are waiting</strong>
          <p>
            Checked-in farmers will appear here with a queue token.
          </p>
        </div>
      </td>
    </tr>
  `;
    lucide.createIcons();
    return;
  }

  waitingEntries.forEach((entry) => {
    const row = createQueueRow(entry);
    queueTableBody.appendChild(row);
  });
}

//Render Current Service

function renderCurrentService() {
  const servingEntry = queueEntries.find((entry) => {
    return entry.status === "serving";
  });
  if (!servingEntry) {
    serviceState.textContent = "Idle";

    currentServiceEmpty.hidden = false;
    currentServiceDetails.hidden = true;

    completeServiceButton.disabled = true;
    return;
  }
  serviceState.textContent = "Serving";

  currentServiceEmpty.hidden = true;
  currentServiceDetails.hidden = false;

  currentTokenNumber.textContent = formatTokenNumber(servingEntry.tokenNumber);
  currentFarmerName.textContent = servingEntry.farmerName;
  currentBookingId.textContent = servingEntry.bookingId;
  currentSlotTime.textContent = servingEntry.slotTime;
  currentCrop.textContent = servingEntry.crop;

  currentServiceTime.textContent = servingEntry.serviceStartedAt
    ? formatTime(servingEntry.serviceStartedAt)
    : "--";

  completeServiceButton.disabled = false;
}

renderCurrentService();

updateSummary();
renderWaitingQueue();

// Sidebar functions

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

// Sidebar events

sidebarToggle.addEventListener("click", openSidebar);
sidebarClose.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);

// Reset the mobile sidebar when returning to desktop

window.addEventListener("resize", () => {
  if (window.innerWidth > 1100) {
    closeSidebar();
  }
});

/* Logout */

logoutButton.addEventListener("click", () => {
  window.location.href = "../../Admin_Login/admin-login.html";
});
