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

/* Slot page elements */

const slotFilterForm = document.getElementById("slot-filter-form");

const slotDateFilter = document.getElementById("slot-date-filter");

const cropFilter = document.getElementById("crop-filter");

const slotStatusFilter = document.getElementById("slot-status-filter");

const slotsTableBody = document.getElementById("slots-table-body");

const slotResultsCount = document.getElementById("slot-results-count");

const createSlotButton = document.getElementById("create-slot-button");

const totalSlotsCount = document.getElementById("total-slots-count");

const totalCapacityCount = document.getElementById("total-capacity-count");

const bookedSlotsCount = document.getElementById("booked-slots-count");

const availableSlotsCount = document.getElementById("available-slots-count");

/* Create Slot modal elements */

const slotModal = document.getElementById("slot-modal");
const createSlotForm = document.getElementById("create-slot-form");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");

const newSlotDate = document.getElementById("new-slot-date");
const newSlotStartTime = document.getElementById("new-slot-start-time");
const newSlotEndTime = document.getElementById("new-slot-end-time");
const newSlotCrop = document.getElementById("new-slot-crop");
const newSlotCapacity = document.getElementById("new-slot-capacity");
const newSlotStatus = document.getElementById("new-slot-status");
const slotFormMessage = document.getElementById("slot-form-message");

const slotModalTitle = document.getElementById("slot-modal-title");

const slotModalSubmitText = document.querySelector(".slot-modal-submit span");

let editingSlotId = null;

let lastFocusedElement = null;

/* Current date */

const today = new Date();

const todayISO = today.toISOString().split("T")[0];

dashboardDate.dateTime = todayISO;

dashboardDate.textContent = today.toLocaleDateString("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

slotDateFilter.value = todayISO;
slotDateFilter.defaultValue = todayISO;

/* Slot data */

const slots = [
  {
    id: "SL-001",
    date: todayISO,
    startTime: "09:00",
    endTime: "11:00",
    crop: "wheat",
    cropName: "Wheat",
    capacity: 35,
    booked: 30,
    status: "available",
  },
  {
    id: "SL-002",
    date: todayISO,
    startTime: "11:00",
    endTime: "13:00",
    crop: "rice",
    cropName: "Rice",
    capacity: 35,
    booked: 35,
    status: "full",
  },
  {
    id: "SL-003",
    date: todayISO,
    startTime: "14:00",
    endTime: "16:00",
    crop: "mixed-crops",
    cropName: "Mixed Crops",
    capacity: 30,
    booked: 9,
    status: "available",
  },
];

/* Slot localStorage */

const slotsStorageKey = "ruralProcureCentreSlots";

function loadSavedSlots() {
  try {
    const savedSlots = JSON.parse(localStorage.getItem(slotsStorageKey));

    if (Array.isArray(savedSlots)) {
      slots.splice(0, slots.length, ...savedSlots);
    }
  } catch (error) {
    console.error("Could not load saved slots:", error);
  }
}

function saveSlots() {
  try {
    localStorage.setItem(slotsStorageKey, JSON.stringify(slots));
  } catch (error) {
    console.error("Could not save slots:", error);
  }
}

loadSavedSlots();

/* Create Slot modal controls */

function clearSlotFormMessage() {
  slotFormMessage.textContent = "";
  slotFormMessage.classList.remove("success");
}

function openCreateSlotModal() {
  lastFocusedElement = document.activeElement;
  editingSlotId = null;
  createSlotForm.reset();
  clearSlotFormMessage();

  slotModalTitle.textContent = "Create New Slot";
  slotModalSubmitText.textContent = "Create Slot";

  newSlotDate.value = todayISO;
  newSlotDate.min = todayISO;

  slotModal.hidden = false;
  document.body.classList.add("modal-open");

  setTimeout(() => {
    newSlotDate.focus();
  }, 0);
}

function openEditSlotModal(slot) {
  lastFocusedElement = document.activeElement;
  editingSlotId = slot.id;

  clearSlotFormMessage();

  slotModalTitle.textContent = `Edit ${slot.id}`;
  slotModalSubmitText.textContent = "Save Changes";

  newSlotDate.value = slot.date;
  newSlotDate.min = todayISO;
  newSlotStartTime.value = slot.startTime;
  newSlotEndTime.value = slot.endTime;
  newSlotCrop.value = slot.crop;
  newSlotCapacity.value = slot.capacity;

  newSlotStatus.value = slot.status === "closed" ? "closed" : "available";

  slotModal.hidden = false;
  document.body.classList.add("modal-open");

  setTimeout(() => {
    newSlotDate.focus();
  }, 0);
}

function closeCreateSlotModal() {
  slotModal.hidden = true;
  document.body.classList.remove("modal-open");

  createSlotForm.reset();
  clearSlotFormMessage();

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeCreateSlotModal);
});

/* Slot helpers */

function formatTime(time) {
  const [hours, minutes] = time.split(":");
  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatStatus(status) {
  return status
    .split("-")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function getAvailableCapacity(slot) {
  if (slot.status === "closed") {
    return 0;
  }

  return Math.max(0, slot.capacity - slot.booked);
}

function getUtilization(slot) {
  if (slot.capacity === 0) {
    return 0;
  }

  return Math.round((slot.booked / slot.capacity) * 100);
}

function getProgressClass(utilization) {
  if (utilization >= 100) {
    return "danger";
  }

  if (utilization >= 80) {
    return "warning";
  }

  return "";
}

/* Render slot table */

function createSlotRow(slot) {
  const available = getAvailableCapacity(slot);
  const utilization = getUtilization(slot);
  const progressClass = getProgressClass(utilization);

  const toggleIcon = slot.status === "closed" ? "play" : "circle-pause";

  const toggleLabel =
    slot.status === "closed" ? `Open ${slot.id}` : `Close ${slot.id}`;

  return `
    <tr data-slot-id="${slot.id}">
      <td>
        <strong class="slot-time-value">
          ${formatTime(slot.startTime)}
          –
          ${formatTime(slot.endTime)}
        </strong>
      </td>

      <td>
        <span class="slot-crop-value">
          ${slot.cropName}
        </span>
      </td>

      <td>${slot.capacity}</td>
      <td>${slot.booked}</td>
      <td>${available}</td>

      <td>
        <div class="slot-utilization">
          <div class="slot-progress">
            <span
              class="${progressClass}"
              style="width: ${Math.min(utilization, 100)}%"
            ></span>
          </div>

          <strong>${utilization}%</strong>
        </div>
      </td>

      <td>
        <span class="slot-status-badge ${slot.status}">
          ${formatStatus(slot.status)}
        </span>
      </td>

      <td>
        <div class="slot-actions">
          <button
            type="button"
            class="slot-action-button"
            data-action="edit"
            data-slot-id="${slot.id}"
            aria-label="Edit ${slot.id}"
            title="Edit slot"
          >
            <i data-lucide="pencil" aria-hidden="true"></i>
          </button>

          <button
            type="button"
            class="slot-action-button"
            data-action="toggle"
            data-slot-id="${slot.id}"
            aria-label="${toggleLabel}"
            title="${toggleLabel}"
          >
            <i
              data-lucide="${toggleIcon}"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function renderSlots(data) {
  if (data.length === 0) {
    slotsTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="slot-empty-state">
            <i data-lucide="calendar-x" aria-hidden="true"></i>
            <strong>No slots found</strong>
            <p>Try changing the selected filters.</p>
          </div>
        </td>
      </tr>
    `;
  } else {
    slotsTableBody.innerHTML = data.map((slot) => createSlotRow(slot)).join("");
  }

  slotResultsCount.textContent = `${data.length} ${data.length === 1 ? "slot" : "slots"}`;

  if (window.lucide) {
    lucide.createIcons();
  }
}

/* Update summary cards */

function updateSlotSummary(data) {
  const totalCapacity = data.reduce((total, slot) => {
    return total + slot.capacity;
  }, 0);

  const totalBooked = data.reduce((total, slot) => {
    return total + slot.booked;
  }, 0);

  const totalAvailable = data.reduce((total, slot) => {
    return total + getAvailableCapacity(slot);
  }, 0);

  totalSlotsCount.textContent = data.length;
  totalCapacityCount.textContent = totalCapacity;
  bookedSlotsCount.textContent = totalBooked;
  availableSlotsCount.textContent = totalAvailable;
}

/* Filters */

function applySlotFilters() {
  const selectedDate = slotDateFilter.value;
  const selectedCrop = cropFilter.value;
  const selectedStatus = slotStatusFilter.value;

  const dateSlots = slots.filter((slot) => {
    return selectedDate === "" || slot.date === selectedDate;
  });

  const filteredSlots = dateSlots.filter((slot) => {
    const matchesCrop = selectedCrop === "all" || slot.crop === selectedCrop;

    const matchesStatus =
      selectedStatus === "all" || slot.status === selectedStatus;

    return matchesCrop && matchesStatus;
  });

  updateSlotSummary(dateSlots);
  renderSlots(filteredSlots);
}

slotDateFilter.addEventListener("change", applySlotFilters);

cropFilter.addEventListener("change", applySlotFilters);

slotStatusFilter.addEventListener("change", applySlotFilters);

slotFilterForm.addEventListener("reset", () => {
  setTimeout(() => {
    slotDateFilter.value = todayISO;
    applySlotFilters();
  }, 0);
});

/* Slot actions */

slotsTableBody.addEventListener("click", (event) => {
  const actionButton = event.target.closest(".slot-action-button");

  if (!actionButton) {
    return;
  }

  const selectedSlot = slots.find((slot) => {
    return slot.id === actionButton.dataset.slotId;
  });

  if (!selectedSlot) {
    return;
  }

  const action = actionButton.dataset.action;

  if (action === "toggle") {
    if (selectedSlot.status === "closed") {
      selectedSlot.status =
        selectedSlot.booked >= selectedSlot.capacity ? "full" : "available";
    } else {
      selectedSlot.status = "closed";
    }

    saveSlots();
    applySlotFilters();
  }

  if (action === "edit") {
    openEditSlotModal(selectedSlot);
  }
});

createSlotButton.addEventListener("click", openCreateSlotModal);

/* Create a new slot */

createSlotForm.addEventListener("submit", (event) => {
  event.preventDefault();

  clearSlotFormMessage();

  const date = newSlotDate.value;
  const startTime = newSlotStartTime.value;
  const endTime = newSlotEndTime.value;
  const crop = newSlotCrop.value;
  const capacity = Number(newSlotCapacity.value);
  const selectedStatus = newSlotStatus.value;

  if (!date || !startTime || !endTime || !crop || !capacity) {
    slotFormMessage.textContent = "Please complete all the required fields.";
    return;
  }

  if (endTime <= startTime) {
    slotFormMessage.textContent = "End time must be later than the start time.";

    newSlotEndTime.focus();
    return;
  }

  if (capacity < 1 || capacity > 500) {
    slotFormMessage.textContent = "Capacity must be between 1 and 500.";

    newSlotCapacity.focus();
    return;
  }

  const slotBeingEdited = editingSlotId
    ? slots.find((slot) => slot.id === editingSlotId)
    : null;

  if (slotBeingEdited && capacity < slotBeingEdited.booked) {
    slotFormMessage.textContent = `Capacity cannot be lower than the ${slotBeingEdited.booked} existing bookings.`;

    newSlotCapacity.focus();
    return;
  }

  const overlappingSlot = slots.find((slot) => {
    const isDifferentSlot = slot.id !== editingSlotId;
    const sameDate = slot.date === date;

    const timesOverlap = startTime < slot.endTime && endTime > slot.startTime;

    return isDifferentSlot && sameDate && timesOverlap;
  });

  if (overlappingSlot) {
    slotFormMessage.textContent = `This time overlaps with ${overlappingSlot.id}.`;

    newSlotStartTime.focus();
    return;
  }

  const cropName = newSlotCrop.options[newSlotCrop.selectedIndex].textContent;

  if (slotBeingEdited) {
    slotBeingEdited.date = date;
    slotBeingEdited.startTime = startTime;
    slotBeingEdited.endTime = endTime;
    slotBeingEdited.crop = crop;
    slotBeingEdited.cropName = cropName;
    slotBeingEdited.capacity = capacity;

    if (selectedStatus === "closed") {
      slotBeingEdited.status = "closed";
    } else {
      slotBeingEdited.status =
        slotBeingEdited.booked >= capacity ? "full" : "available";
    }
  } else {
    const highestSlotNumber = slots.reduce((highest, slot) => {
      const slotNumber = Number(slot.id.replace(/\D/g, ""));

      return Math.max(highest, slotNumber || 0);
    }, 0);

    const slotId = `SL-${String(highestSlotNumber + 1).padStart(3, "0")}`;

    slots.push({
      id: slotId,
      date,
      startTime,
      endTime,
      crop,
      cropName,
      capacity,
      booked: 0,
      status: selectedStatus,
    });
  }

  saveSlots();

  slotDateFilter.value = date;
  cropFilter.value = "all";
  slotStatusFilter.value = "all";

  applySlotFilters();
  closeCreateSlotModal();
});

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
  if (!slotModal.hidden) {
    closeCreateSlotModal();
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

/* Initial render */

applySlotFilters();
