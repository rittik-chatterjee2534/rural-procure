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

const skippedTableBody = document.getElementById("skipped-table-body");
const skippedTotalBadge = document.getElementById("skipped-total-badge");

const callNextButton = document.getElementById("call-next-button");

const queueToast = document.getElementById("queue-toast");
let toastTimer;

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

function getSkippedQueue() {
  // Filter queueEntries and keep entries whose status is "skipped"
  const skippedEntries = queueEntries.filter((entry) => {
    return entry.status === "skipped";
  });
  // Sort those entries by tokenNumber
  skippedEntries.sort((firstEntry, secondEntry) => {
    return firstEntry.tokenNumber - secondEntry.tokenNumber;
  });
  // Return the sorted array
  return skippedEntries;
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

function showToast(message) {
  // Cancel the previous timer
  clearTimeout(toastTimer);

  // Display the supplied message
  queueToast.textContent = message;
  queueToast.hidden = false;

  // Hide the toast after three seconds
  toastTimer = setTimeout(() => {
    queueToast.hidden = true;
  }, 3000);
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
    <span>Skip</span>
    </button>
  </td>
  `;
  return row;
}

//Skipped Row creation
function createSkippedRow(entry) {
  const row = document.createElement("tr");
  row.dataset.entryId = entry.id;

  row.innerHTML = `
  <td>${formatTokenNumber(entry.tokenNumber)}</td>

  <td>
    <strong>${entry.farmerName}</strong>
    <small>${entry.kisanId}</small>
  </td>

  <td>${entry.bookingId}</td>
  <td>
    ${entry.skippedAt ? formatTime(entry.skippedAt) : "--"}
  </td>

  <td>${entry.slotTime}</td>

  <td>
    <span class="queue-status skipped">Skipped</span>
  </td>

  <td>
    <button
      type="button"
      class="restore-queue-button"
      data-entry-id="${entry.id}"
      aria-label="Return ${entry.farmerName} to the waiting queue"
    >
      <i data-lucide="rotate-ccw" aria-hidden="true"></i>
      <span>Return to Queue</span>
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
  lucide.createIcons();
}

function renderSkippedQueue() {
  const skippedEntries = getSkippedQueue();
  skippedTableBody.innerHTML = "";
  skippedTotalBadge.textContent = `${skippedEntries.length} skipped`;

  if (skippedEntries.length === 0) {
    skippedTableBody.innerHTML = `
    <tr>
      <td colspan="7">
        <div class="queue-empty-state">
          <i data-lucide="users" aria-hidden="true"></i>
          <strong>No farmers were skipped</strong>
          <p>
            Skipped farmers will appear here.
          </p>
        </div>
      </td>
    </tr>
  `;
    lucide.createIcons();
    return;
  }
  skippedEntries.forEach((entry) => {
    const row = createSkippedRow(entry);
    skippedTableBody.appendChild(row);
  });

  lucide.createIcons();
}

function refreshQueueUI() {
  updateSummary();
  renderWaitingQueue();
  renderSkippedQueue();
  renderCurrentService();
}

//Render Current Service

function renderCurrentService() {
  const servingEntry = queueEntries.find((entry) => {
    return entry.status === "serving";
  });
  if (!servingEntry) {
    serviceState.textContent = "Idle";
    serviceState.classList.remove("serving");
    serviceState.classList.add("idle");
    currentServiceEmpty.hidden = false;
    currentServiceDetails.hidden = true;

    completeServiceButton.disabled = true;
    const hasWaitingFarmers = getWaitingQueue().length > 0;

    callNextButton.disabled = !hasWaitingFarmers;
    return;
  }
  serviceState.textContent = "Serving";
  serviceState.classList.remove("idle");
  serviceState.classList.add("serving");

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
  callNextButton.disabled = true;
}

//Call Next Farmer

function callNextFarmer() {
  // Check whether somebody is already being served
  const servingEntry = queueEntries.find((entry) => {
    return entry.status === "serving";
  });

  if (servingEntry) {
    return;
  }

  // Get the waiting farmers in token order
  const waitingEntries = getWaitingQueue();

  // Select the first farmer
  const nextEntry = waitingEntries[0];

  // Stop if the queue is empty
  if (!nextEntry) {
    return;
    qu;
  }

  // Change nextEntry's status to "serving"
  nextEntry.status = "serving";

  // Save the current timestamp in serviceStartedAt
  nextEntry.serviceStartedAt = Date.now();

  // Refresh summary, table, and current-service panel
  refreshQueueUI();
  showToast(
    `${formatTokenNumber(nextEntry.tokenNumber)} — ${nextEntry.farmerName} is now being served.`,
  );
}

//Complete Service Section
function completeCurrentService() {
  // Find the farmer currently being served
  const servingEntry = queueEntries.find((entry) => {
    return entry.status === "serving";
  });

  // Stop if nobody is being served
  if (!servingEntry) {
    return;
  }

  const shouldComplete = window.confirm(
    `Complete service for ${servingEntry.farmerName} (${formatTokenNumber(servingEntry.tokenNumber)})?`,
  );

  if (!shouldComplete) {
    return;
  }

  // Change the status to "completed"
  servingEntry.status = "completed";

  // Store the completion timestamp
  servingEntry.completedAt = Date.now();

  // Refresh all three UI sections
  refreshQueueUI();
  showToast(
    `${formatTokenNumber(servingEntry.tokenNumber)} — service completed for ${servingEntry.farmerName}.`,
  );
}

//Skip Queue Entry Section
function skipQueueEntry(entryId) {
  // Find the entry with the matching ID
  const queueEntry = queueEntries.find((entry) => {
    return entry.id === entryId;
  });

  // Stop if the entry doesn't exist or is not waiting
  if (!queueEntry || queueEntry.status !== "waiting") {
    return;
  }

  const shouldSkip = window.confirm(
    `Skip ${queueEntry.farmerName} (${formatTokenNumber(queueEntry.tokenNumber)})?`,
  );

  if (!shouldSkip) {
    return;
  }

  // Change its status to "skipped"
  queueEntry.status = "skipped";
  queueEntry.skippedAt = Date.now();

  // Refresh the summary and waiting table
  refreshQueueUI();
  showToast(
    `${formatTokenNumber(queueEntry.tokenNumber)} — ${queueEntry.farmerName} was skipped.`,
  );
}

//Restore Queue Entry Function
function restoreQueueEntry(entryId) {
  const queueEntry = queueEntries.find((entry) => {
    return entry.id === entryId;
  });

  if (!queueEntry || queueEntry.status !== "skipped") {
    return;
  }
  queueEntry.status = "waiting";
  queueEntry.skippedAt = null;
  queueEntry.checkedInAt = Date.now();

  refreshQueueUI();
  showToast(
    `${formatTokenNumber(queueEntry.tokenNumber)} — ${queueEntry.farmerName} returned to the waiting queue.`,
  );
}

refreshQueueUI();

const QUEUE_REFRESH_INTERVAL = 60 * 1000;

setInterval(() => {
  updateSummary();
  renderWaitingQueue();
}, QUEUE_REFRESH_INTERVAL);

callNextButton.addEventListener("click", callNextFarmer);
completeServiceButton.addEventListener("click", completeCurrentService);
queueTableBody.addEventListener("click", (event) => {
  const skipButton = event.target.closest(".skip-queue-button");

  if (!skipButton) {
    return;
  }

  const entryId = skipButton.dataset.entryId;

  skipQueueEntry(entryId);
});

skippedTableBody.addEventListener("click", (event) => {
  const restoreButton = event.target.closest(".restore-queue-button");

  if (!restoreButton) {
    return;
  }

  const entryId = restoreButton.dataset.entryId;

  restoreQueueEntry(entryId);
});

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
