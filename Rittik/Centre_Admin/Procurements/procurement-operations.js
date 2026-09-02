const awaitingInspectionCount = document.getElementById(
  "awaiting-inspection-count",
);
const inProgressCount = document.getElementById("in-progress-count");
const completedProcurementCount = document.getElementById(
  "completed-procurement-count",
);
const totalProcuredQuantity = document.getElementById(
  "total-procured-quantity",
);

const procurementFilterForm = document.getElementById(
  "procurement-filter-form",
);
const procurementSearch = document.getElementById("procurement-search");
const procurementStatusFilter = document.getElementById(
  "procurement-status-filter",
);
const procurementCropFilter = document.getElementById(
  "procurement-crop-filter",
);

const procurementTableBody = document.getElementById("procurement-table-body");
const procurementTotalBadge = document.getElementById(
  "procurement-total-badge",
);
const exportProcurementsButton = document.getElementById(
  "export-procurements-button",
);

const procurementModal = document.getElementById("procurement-modal");
const closeProcurementModalButton = document.getElementById(
  "close-procurement-modal",
);
const cancelProcurementButton = document.getElementById(
  "cancel-procurement-button",
);

const procurementProcessForm = document.getElementById(
  "procurement-process-form",
);
const activeProcurementId = document.getElementById("active-procurement-id");

const procurementModalSubtitle = document.getElementById(
  "procurement-modal-subtitle",
);
const modalFarmerName = document.getElementById("modal-farmer-name");
const modalKisanId = document.getElementById("modal-kisan-id");
const modalBookingId = document.getElementById("modal-booking-id");
const modalCrop = document.getElementById("modal-crop");
const modalExpectedQuantity = document.getElementById(
  "modal-expected-quantity",
);

const actualQuantityInput = document.getElementById("actual-quantity");
const moisturePercentageInput = document.getElementById("moisture-percentage");
const foreignMatterPercentageInput = document.getElementById(
  "foreign-matter-percentage",
);
const qualityGradeSelect = document.getElementById("quality-grade");

const acceptedQuantityInput = document.getElementById("accepted-quantity");
const ratePerQuintalInput = document.getElementById("rate-per-quintal");
const calculatedTotalAmountInput = document.getElementById(
  "calculated-total-amount",
);

const procurementFormMessage = document.getElementById(
  "procurement-form-message",
);
const procurementModalTitle = document.getElementById(
  "procurement-modal-title",
);
const saveProcurementButton = procurementProcessForm.querySelector(
  ".save-procurement-button",
);
const exportRecordsButton = document.getElementById(
  "export-procurements-button",
);
const procurementRecords = [
  {
    id: "PR-1001",
    queueEntryId: "QE-002",
    bookingId: "BK-1002",

    farmerName: "Sita Devi",
    kisanId: "KISAN-WB-1002",

    crop: "Wheat",
    expectedQuantity: 18,

    actualQuantity: null,
    acceptedQuantity: null,
    moisturePercentage: null,
    foreignMatterPercentage: null,
    qualityGrade: null,

    ratePerQuintal: null,
    totalAmount: null,

    status: "awaiting-inspection",
    createdAt: Date.now() - 10 * 60 * 1000,
    completedAt: null,
  },
  {
    id: "PR-1002",
    queueEntryId: "QE-003",
    bookingId: "BK-1003",

    farmerName: "Arjun Das",
    kisanId: "KISAN-WB-1003",

    crop: "Wheat",
    expectedQuantity: 10,

    actualQuantity: 10.2,
    acceptedQuantity: null,
    moisturePercentage: 12.4,
    foreignMatterPercentage: 1.4,
    qualityGrade: null,

    ratePerQuintal: null,
    totalAmount: null,

    status: "in-progress",
    createdAt: Date.now() - 35 * 60 * 1000,
    completedAt: null,
  },
  {
    id: "PR-1003",
    queueEntryId: "QE-004",
    bookingId: "BK-1005",

    farmerName: "Bimal Ghosh",
    kisanId: "KISAN-WB-1005",

    crop: "Rice",
    expectedQuantity: 20,

    actualQuantity: 19.6,
    acceptedQuantity: 19.2,
    moisturePercentage: 13.1,
    foreignMatterPercentage: 0.8,
    qualityGrade: "A",

    ratePerQuintal: 2320,
    totalAmount: 44544,

    status: "completed",
    createdAt: Date.now() - 75 * 60 * 1000,
    completedAt: Date.now() - 25 * 60 * 1000,
  },
  {
    id: "PR-1004",
    queueEntryId: "QE-005",
    bookingId: "BK-1006",

    farmerName: "Meena Roy",
    kisanId: "KISAN-WB-1006",

    crop: "Mustard",
    expectedQuantity: 12,

    actualQuantity: 11.5,
    acceptedQuantity: 0,
    moisturePercentage: 21.3,
    foreignMatterPercentage: 5.6,
    qualityGrade: "Rejected",

    ratePerQuintal: 0,
    totalAmount: 0,

    status: "rejected",
    createdAt: Date.now() - 95 * 60 * 1000,
    completedAt: Date.now() - 40 * 60 * 1000,
  },
];

// Update procurement summary cards
function updateProcurementSummary() {
  const awaitingTotal = procurementRecords.filter((record) => {
    return record.status === "awaiting-inspection";
  }).length;

  const inProgressTotal = procurementRecords.filter((record) => {
    return record.status === "in-progress";
  }).length;

  const completedRecords = procurementRecords.filter((record) => {
    return record.status === "completed";
  });

  const completedTotal = completedRecords.length;

  const totalQuantity = completedRecords.reduce((sum, record) => {
    return sum + Number(record.acceptedQuantity ?? 0);
  }, 0);

  awaitingInspectionCount.textContent = awaitingTotal;
  inProgressCount.textContent = inProgressTotal;
  completedProcurementCount.textContent = completedTotal;
  totalProcuredQuantity.textContent = Number(totalQuantity.toFixed(2));
}

// Helper function
function getProcurementStatusLabel(status) {
  const statusLabels = {
    "awaiting-inspection": "Awaiting Inspection",
    "in-progress": "In Progress",
    completed: "Completed",
    rejected: "Rejected",
  };

  return statusLabels[status] ?? "Unknown";
}

// Find procurement by its ID
function findProcurementRecord(recordId) {
  return procurementRecords.find((record) => {
    return record.id === recordId;
  });
}

updateProcurementSummary();

//Create Record
function createProcurementRow(record) {
  const row = document.createElement("tr");

  row.dataset.recordId = record.id;

  const canProcess =
    record.status === "awaiting-inspection" || record.status === "in-progress";

  const actionLabel = canProcess ? "Process" : "View";
  const actionIcon = canProcess ? "clipboard-check" : "eye";

  row.innerHTML = `
    <td>
      <strong class="procurement-id">${record.id}</strong>
    </td>

    <td>
      <div class="farmer-cell">
        <strong>${record.farmerName}</strong>
        <small>${record.kisanId}</small>
      </div>
    </td>

    <td>${record.bookingId}</td>
    <td>${record.crop}</td>
    <td>${record.expectedQuantity} q</td>

<td>
  ${record.actualQuantity === null ? "--" : `${record.actualQuantity} q`}
</td>

<td>${record.qualityGrade ?? "--"}</td>

<td>
  <span class="procurement-status ${record.status}">
    ${getProcurementStatusLabel(record.status)}
  </span>
</td>

<td>
  <button
    type="button"
    class="procurement-action-button ${canProcess ? "process" : "view"}"
    data-record-id="${record.id}"
    aria-label="${actionLabel} procurement ${record.id}"
  >
    <i data-lucide="${actionIcon}" aria-hidden="true"></i>
    <span>${actionLabel}</span>
  </button>
</td>
  `;

  return row;
}

//Render Procurement Records

function renderProcurementRecords(records) {
  // Clear procurementTableBody
  procurementTableBody.innerHTML = "";

  // Update procurementTotalBadge
  procurementTotalBadge.textContent = `${records.length} ${records.length === 1 ? "record" : "records"}`;
  // Use "1 record" for one item and "2 records" for multiple items

  // If records.length is 0:
  if (records.length === 0) {
    procurementTableBody.innerHTML = `
    <tr>
      <td colspan="9">
        <div class="procurement-empty-state">
          <i data-lucide="package-search" aria-hidden="true"></i>
          <strong>No procurement records found</strong>
          <p>Completed queue services will appear here for inspection.</p>
        </div>
      </td>
    </tr>
  `;

    lucide.createIcons();
    return;
  }
  // insert the empty-state row with colspan="9"
  records.forEach((record) => {
    const row = createProcurementRow(record);
    procurementTableBody.appendChild(row);
  });

  // call lucide.createIcons()
  lucide.createIcons();
}
renderProcurementRecords(procurementRecords);

//Search & Filter

function getFilteredProcurements() {
  const searchTerm = procurementSearch.value.trim().toLowerCase();
  const selectedStatus = procurementStatusFilter.value;
  const selectedCrop = procurementCropFilter.value;

  const filteredRecords = procurementRecords.filter((record) => {
    const searchableText = [
      record.id,
      record.bookingId,
      record.farmerName,
      record.kisanId,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      searchTerm === "" || searchableText.includes(searchTerm);

    const matchesStatus =
      selectedStatus === "all" || record.status === selectedStatus;

    const normalizedCrop = record.crop.toLowerCase().replace(/\s+/g, "-");

    const matchesCrop =
      selectedCrop === "all" || normalizedCrop === selectedCrop;

    return matchesSearch && matchesStatus && matchesCrop;
  });

  return filteredRecords;
}

function applyProcurementFilters() {
  const filteredRecords = getFilteredProcurements();
  renderProcurementRecords(filteredRecords);
}

procurementSearch.addEventListener("input", applyProcurementFilters);

procurementStatusFilter.addEventListener("change", applyProcurementFilters);

procurementCropFilter.addEventListener("change", applyProcurementFilters);

procurementFilterForm.addEventListener("reset", () => {
  setTimeout(applyProcurementFilters, 0);
});

//View Procurement Details
function openProcurementModal(recordId) {
  const record = findProcurementRecord(recordId);

  if (!record) {
    return;
  }

  procurementProcessForm.reset();
  procurementFormMessage.textContent = "";

  activeProcurementId.value = record.id;
  procurementModalSubtitle.textContent = record.id;

  modalFarmerName.textContent = record.farmerName;
  modalKisanId.textContent = record.kisanId;
  modalBookingId.textContent = record.bookingId;
  modalCrop.textContent = record.crop;
  modalExpectedQuantity.textContent = `${record.expectedQuantity} quintal`;
  actualQuantityInput.value = record.actualQuantity ?? "";
  moisturePercentageInput.value = record.moisturePercentage ?? "";
  foreignMatterPercentageInput.value = record.foreignMatterPercentage ?? "";
  qualityGradeSelect.value = record.qualityGrade ?? "";

  acceptedQuantityInput.value = record.acceptedQuantity ?? "";
  ratePerQuintalInput.value = record.ratePerQuintal ?? "";

  calculatedTotalAmountInput.value =
    record.totalAmount === null ? "0.00" : record.totalAmount.toFixed(2);
  procurementModal.hidden = false;
  document.body.classList.add("procurement-modal-open");

  const isViewMode =
    record.status === "completed" || record.status === "rejected";

  const editableFields = [
    actualQuantityInput,
    moisturePercentageInput,
    foreignMatterPercentageInput,
    qualityGradeSelect,
    acceptedQuantityInput,
    ratePerQuintalInput,
  ];

  editableFields.forEach((field) => {
    field.disabled = isViewMode;
  });

  procurementModalTitle.textContent = isViewMode
    ? "Procurement Details"
    : "Process Procurement";

  saveProcurementButton.hidden = isViewMode;

  cancelProcurementButton.textContent = isViewMode ? "Close" : "Cancel";

  lucide.createIcons();
}

//Close Modal Function
function closeProcurementModal() {
  procurementModal.hidden = true;
  document.body.classList.remove("procurement-modal-open");

  procurementFormMessage.textContent = "";
  activeProcurementId.value = "";
}

closeProcurementModalButton.addEventListener("click", closeProcurementModal);

cancelProcurementButton.addEventListener("click", closeProcurementModal);

procurementModal.addEventListener("click", (event) => {
  if (event.target === procurementModal) {
    closeProcurementModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !procurementModal.hidden) {
    closeProcurementModal();
  }
});

//Connect the table buttons

procurementTableBody.addEventListener("click", (event) => {
  const actionButton = event.target.closest(".procurement-action-button");

  if (!actionButton) {
    return;
  }

  const recordId = actionButton.dataset.recordId;

  openProcurementModal(recordId);
});

//Automatic Total Amout Calculation

function calculateProcurementAmount() {
  const acceptedQuantity = Number(acceptedQuantityInput.value) || 0;

  const ratePerQuintal = Number(ratePerQuintalInput.value) || 0;

  const totalAmount = acceptedQuantity * ratePerQuintal;

  calculatedTotalAmountInput.value = totalAmount.toFixed(2);
}

acceptedQuantityInput.addEventListener("input", calculateProcurementAmount);

ratePerQuintalInput.addEventListener("input", calculateProcurementAmount);

//Reusable validation helper
function showProcurementFormError(message, field) {
  procurementFormMessage.textContent = message;
  field.focus();
}

//Form Submission Handler
procurementProcessForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const record = findProcurementRecord(activeProcurementId.value);

  if (!record) {
    procurementFormMessage.textContent =
      "The selected procurement record could not be found.";
    return;
  }

  const actualQuantity = Number(actualQuantityInput.value);
  const moisturePercentage = Number(moisturePercentageInput.value);
  const foreignMatterPercentage =
    foreignMatterPercentageInput.value === ""
      ? null
      : Number(foreignMatterPercentageInput.value);

  const qualityGrade = qualityGradeSelect.value;
  const acceptedQuantity = Number(acceptedQuantityInput.value);
  const ratePerQuintal = Number(ratePerQuintalInput.value);

  procurementFormMessage.textContent = "";

  if (!Number.isFinite(actualQuantity) || actualQuantity <= 0) {
    showProcurementFormError(
      "Enter a valid actual quantity greater than zero.",
      actualQuantityInput,
    );
    return;
  }

  if (
    moisturePercentageInput.value === "" ||
    !Number.isFinite(moisturePercentage) ||
    moisturePercentage < 0 ||
    moisturePercentage > 100
  ) {
    showProcurementFormError(
      "Moisture percentage must be between 0 and 100.",
      moisturePercentageInput,
    );
    return;
  }
  if (
    foreignMatterPercentage !== null &&
    (!Number.isFinite(foreignMatterPercentage) ||
      foreignMatterPercentage < 0 ||
      foreignMatterPercentage > 100)
  ) {
    showProcurementFormError(
      "Foreign matter percentage must be between 0 and 100.",
      foreignMatterPercentageInput,
    );
    return;
  }

  if (qualityGrade === "") {
    showProcurementFormError("Select a quality grade.", qualityGradeSelect);
    return;
  }
  const isRejected = qualityGrade === "Rejected";

  if (
    !Number.isFinite(acceptedQuantity) ||
    acceptedQuantity < 0 ||
    acceptedQuantity > actualQuantity
  ) {
    showProcurementFormError(
      "Accepted quantity must be between 0 and the actual quantity.",
      acceptedQuantityInput,
    );
    return;
  }

  if (!isRejected && acceptedQuantity <= 0) {
    showProcurementFormError(
      "Accepted quantity must be greater than zero.",
      acceptedQuantityInput,
    );
    return;
  }

  if (isRejected && acceptedQuantity !== 0) {
    showProcurementFormError(
      "Accepted quantity must be zero for a rejected procurement.",
      acceptedQuantityInput,
    );
    return;
  }

  if (!Number.isFinite(ratePerQuintal) || ratePerQuintal < 0) {
    showProcurementFormError(
      "Enter a valid non-negative rate.",
      ratePerQuintalInput,
    );
    return;
  }

  if (!isRejected && ratePerQuintal <= 0) {
    showProcurementFormError(
      "Rate per quintal must be greater than zero.",
      ratePerQuintalInput,
    );
    return;
  }

  if (isRejected && ratePerQuintal !== 0) {
    showProcurementFormError(
      "Rate must be zero for a rejected procurement.",
      ratePerQuintalInput,
    );
    return;
  }
  const shouldComplete = window.confirm(
    isRejected
      ? `Reject procurement ${record.id} for ${record.farmerName}?`
      : `Complete procurement ${record.id} for ${record.farmerName}?`,
  );

  if (!shouldComplete) {
    return;
  }

  const totalAmount = acceptedQuantity * ratePerQuintal;

  record.actualQuantity = actualQuantity;
  record.moisturePercentage = moisturePercentage;
  record.foreignMatterPercentage = foreignMatterPercentage;
  record.qualityGrade = qualityGrade;

  record.acceptedQuantity = acceptedQuantity;
  record.ratePerQuintal = ratePerQuintal;
  record.totalAmount = Number(totalAmount.toFixed(2));

  record.status = isRejected ? "rejected" : "completed";
  record.completedAt = Date.now();

  updateProcurementSummary();
  applyProcurementFilters();
  closeProcurementModal();
});

function exportProcurementRecords() {
  const recordsToExport = getFilteredProcurements();

  if (recordsToExport.length === 0) {
    window.alert("No procurement records are available to export.");
    return;
  }

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Calculate PDF summary
  const completedRecords = recordsToExport.filter((record) => {
    return record.status === "completed";
  });

  const rejectedRecords = recordsToExport.filter((record) => {
    return record.status === "rejected";
  });

  const totalAcceptedQuantity = completedRecords.reduce((total, record) => {
    return total + Number(record.acceptedQuantity ?? 0);
  }, 0);

  const totalProcurementAmount = completedRecords.reduce((total, record) => {
    return total + Number(record.totalAmount ?? 0);
  }, 0);

  // PDF heading
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(18);
  pdf.text("RuralProcure - Procurement Records", 14, 15);

  pdf.setTextColor(100);
  pdf.setFontSize(9);
  pdf.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 22);

  // First summary row
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(10);

  pdf.text(`Records: ${recordsToExport.length}`, 14, 30);
  pdf.text(`Completed: ${completedRecords.length}`, 65, 30);
  pdf.text(`Rejected: ${rejectedRecords.length}`, 120, 30);

  // Second summary row
  pdf.text(
    `Accepted Quantity: ${totalAcceptedQuantity.toFixed(2)} quintal`,
    14,
    36,
  );

  pdf.text(`Total Amount: INR ${totalProcurementAmount.toFixed(2)}`, 120, 36);

  // Convert records into table rows
  const tableRows = recordsToExport.map((record) => {
    const actualQuantity =
      record.actualQuantity === null || record.actualQuantity === undefined
        ? "--"
        : `${record.actualQuantity} q`;

    const acceptedQuantity =
      record.acceptedQuantity === null || record.acceptedQuantity === undefined
        ? "--"
        : `${record.acceptedQuantity} q`;

    const totalAmount =
      record.totalAmount === null || record.totalAmount === undefined
        ? "--"
        : `INR ${Number(record.totalAmount).toFixed(2)}`;

    return [
      record.id,
      record.farmerName,
      record.kisanId,
      record.bookingId,
      record.crop,
      `${record.expectedQuantity} q`,
      actualQuantity,
      acceptedQuantity,
      record.qualityGrade ?? "--",
      getProcurementStatusLabel(record.status),
      totalAmount,
    ];
  });

  // Create the PDF table
  pdf.autoTable({
    startY: 42,

    head: [
      [
        "Procurement ID",
        "Farmer",
        "Kisan ID",
        "Booking ID",
        "Crop",
        "Expected",
        "Actual",
        "Accepted",
        "Grade",
        "Status",
        "Amount",
      ],
    ],

    body: tableRows,
    theme: "grid",

    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      valign: "middle",
    },

    headStyles: {
      fillColor: [21, 128, 61],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: [240, 249, 244],
    },

    margin: {
      left: 10,
      right: 10,
      bottom: 16,
    },

    didDrawPage: (data) => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.setDrawColor(210, 220, 214);
      pdf.line(10, pageHeight - 13, pageWidth - 10, pageHeight - 13);

      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);

      pdf.text(
        "RuralProcure Centre Admin - Procurement Report",
        10,
        pageHeight - 8,
      );

      pdf.text(`Page ${data.pageNumber}`, pageWidth - 10, pageHeight - 8, {
        align: "right",
      });
    },
  });

  const exportDate = new Date().toISOString().split("T")[0];

  pdf.save(`procurement-records-${exportDate}.pdf`);
}

exportRecordsButton.addEventListener("click", exportProcurementRecords);


// SHARED LAYOUT: DATE, SIDEBAR, NOTIFICATIONS AND PROFILE

// Sidebar elements
const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const sidebarClose = document.querySelector(".sidebar-close");
const sidebarOverlay = document.querySelector(".sidebar-overlay");

// Navbar date
const dashboardDate = document.getElementById("dashboard-date");

// Notification elements
const notificationButton = document.querySelector(
  ".notification-button",
);

const notificationPanel = document.getElementById(
  "notification-panel",
);

const notificationBadge = document.querySelector(
  ".notification-badge",
);

const markReadButton = document.querySelector(
  ".mark-read-button",
);

// Profile elements
const navbarProfile = document.querySelector(".navbar-profile");
const profileMenu = document.getElementById("profile-menu");
const logoutButton = document.querySelector(".logout-button");

// CURRENT DATE
function displayCurrentDate() {
  if (!dashboardDate) {
    return;
  }

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
}

displayCurrentDate();


// MOBILE SIDEBAR

function openSidebar() {
  if (!sidebar || !sidebarOverlay || !sidebarToggle) {
    return;
  }

  sidebar.classList.add("open");
  sidebarOverlay.classList.add("active");
  document.body.classList.add("sidebar-open");

  sidebarToggle.setAttribute("aria-expanded", "true");
  sidebarOverlay.setAttribute("aria-hidden", "false");
}

function closeSidebar() {
  if (!sidebar || !sidebarOverlay || !sidebarToggle) {
    return;
  }

  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("active");
  document.body.classList.remove("sidebar-open");

  sidebarToggle.setAttribute("aria-expanded", "false");
  sidebarOverlay.setAttribute("aria-hidden", "true");
}

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", openSidebar);
}

if (sidebarClose) {
  sidebarClose.addEventListener("click", closeSidebar);
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", closeSidebar);
}

// Close the sidebar after selecting a navigation link on mobile
if (sidebar) {
  const sidebarLinks = sidebar.querySelectorAll("a");

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1100) {
        closeSidebar();
      }
    });
  });
}

// Reset mobile sidebar when returning to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 1100) {
    closeSidebar();
  }
});


// PROFILE MENU

function setProfileMenu(open) {
  if (!profileMenu || !navbarProfile) {
    return;
  }

  profileMenu.hidden = !open;

  navbarProfile.setAttribute(
    "aria-expanded",
    String(open),
  );
}

if (navbarProfile) {
  navbarProfile.addEventListener("click", (event) => {
    event.stopPropagation();

    const shouldOpenProfile = profileMenu.hidden;

    setNotificationPanel(false);
    setProfileMenu(shouldOpenProfile);
  });
}

// Prevent clicks inside the menu from immediately closing it
if (profileMenu) {
  profileMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

// NOTIFICATION PANEL

function setNotificationPanel(open) {
  if (!notificationPanel || !notificationButton) {
    return;
  }

  notificationPanel.hidden = !open;

  notificationButton.setAttribute(
    "aria-expanded",
    String(open),
  );
}

if (notificationButton) {
  notificationButton.addEventListener("click", (event) => {
    event.stopPropagation();

    const shouldOpenNotifications =
      notificationPanel.hidden;

    setProfileMenu(false);
    setNotificationPanel(shouldOpenNotifications);
  });
}

// Prevent clicks inside the notification panel from closing it
if (notificationPanel) {
  notificationPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

// MARK ALL NOTIFICATIONS AS READ

if (markReadButton) {
  markReadButton.addEventListener("click", (event) => {
    event.stopPropagation();

    const unreadNotifications =
      notificationPanel.querySelectorAll(
        ".notification-item.unread",
      );

    unreadNotifications.forEach((notification) => {
      notification.classList.remove("unread");
    });

    if (notificationBadge) {
      notificationBadge.textContent = "0";
      notificationBadge.hidden = true;
    }

    notificationButton.setAttribute(
      "aria-label",
      "View notifications: no unread notifications",
    );
  });
}


// CLOSE MENUS WHEN CLICKING OUTSIDE
document.addEventListener("click", (event) => {
  const clickedElement = event.target;

  if (
    profileMenu &&
    navbarProfile &&
    !profileMenu.contains(clickedElement) &&
    !navbarProfile.contains(clickedElement)
  ) {
    setProfileMenu(false);
  }

  if (
    notificationPanel &&
    notificationButton &&
    !notificationPanel.contains(clickedElement) &&
    !notificationButton.contains(clickedElement)
  ) {
    setNotificationPanel(false);
  }
});

// ESCAPE KEY

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (sidebar && sidebar.classList.contains("open")) {
    closeSidebar();
  }

  setProfileMenu(false);
  setNotificationPanel(false);
});

//logout 

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    window.location.href =
      "../../Admin_Login/admin-login.html";
  });
}


if (typeof lucide !== "undefined") {
  lucide.createIcons();
}
