/* ===================================================== 
   BOOK NEW SLOT - LOGIC 
===================================================== */

let currentStep = 1;
let selectedCentre = "Krishnanagar Procurement Centre";
let selectedProduce = "Paddy";
let selectedDate = new Date(2026, 4, 15); // Default to 15 May 2026
let selectedTime = "10:00 - 10:30";

let calendarMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth()
);

/* ===================================================== 
   INITIALIZE 
===================================================== */
function initializeBookNewSlot() {
    setupCentreSelection();
    setupProduceSelection();
    setupNavigation();
    setupCalendar();
    setupTimeSlots();
    renderCalendar();
    updateSelectedCentre();
    updateSelectedDate();

    // Dashboard return redirection
    document.getElementById("backToDashboard")?.addEventListener("click", () => {
        window.location.href = "../../user-dashboard.html";
    });

    document.getElementById("backDashboard")?.addEventListener("click", () => {
        window.location.href = "../../user-dashboard.html";
    });
}

/* ===================================================== 
   CENTRE SELECTION 
===================================================== */
function setupCentreSelection() {
    const centres = document.querySelectorAll('input[name="centre"]');

    centres.forEach((radio) => {
        radio.addEventListener("change", function () {
            selectedCentre = this.value;

            document.querySelectorAll(".centre-card").forEach((card) => {
                card.classList.remove("selected");
            });

            this.closest(".centre-card").classList.add("selected");
            updateSelectedCentre();
        });
    });

    /* Search Filter */
    const search = document.getElementById("centreSearch");
    if (search) {
        search.addEventListener("input", function () {
            const value = this.value.toLowerCase();
            document.querySelectorAll(".centre-card").forEach((card) => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(value) ? "flex" : "none";
            });
        });
    }
}

function updateSelectedCentre() {
    document.querySelectorAll(".selected-centre-display").forEach((el) => {
        el.textContent = selectedCentre;
    });

    const summary = document.getElementById("summaryCentre");
    if (summary) summary.textContent = selectedCentre;
}

/* ===================================================== 
   PRODUCE SELECTION 
===================================================== */
function setupProduceSelection() {
    const produceCards = document.querySelectorAll(".produce-card");

    produceCards.forEach((card) => {
        card.addEventListener("click", function () {
            produceCards.forEach((item) => item.classList.remove("selected"));
            this.classList.add("selected");

            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                selectedProduce = radio.value;
            }
        });
    });
}

/* ===================================================== 
   NAVIGATION 
===================================================== */
function setupNavigation() {
    // 1 -> 2
    document.getElementById("centreNext")?.addEventListener("click", () => showStep(2));

    // 2 -> 1
    document.getElementById("produceBack")?.addEventListener("click", () => showStep(1));

    // 2 -> 3
    document.getElementById("produceNext")?.addEventListener("click", () => {
        if (!selectedProduce) selectedProduce = "Paddy";
        showStep(3);
    });

    // 3 -> 2
    document.getElementById("dateBack")?.addEventListener("click", () => showStep(2));

    // 3 -> 4
    document.getElementById("dateNext")?.addEventListener("click", () => {
        updateSelectedDate();
        showStep(4);
    });

    // 4 -> 3
    document.getElementById("timeBack")?.addEventListener("click", () => showStep(3));

    // 4 -> Review
    document.getElementById("continueToReview")?.addEventListener("click", () => {
        updateReviewDetails();
        showReview();
    });

    // Review -> 4
    document.getElementById("changeDetails")?.addEventListener("click", () => showStep(4));

    // Final Confirmation
    document.getElementById("finalConfirmBooking")?.addEventListener("click", confirmBooking);
}

/* ===================================================== 
   STEP SWITCHER 
===================================================== */
function showStep(step) {
    currentStep = step;

    document.querySelectorAll(".booking-step").forEach((sec) => sec.classList.remove("active"));

    const stepMap = {
        1: "centreStep",
        2: "produceStep",
        3: "dateStep",
        4: "timeStep"
    };

    const target = document.getElementById(stepMap[step]);
    if (target) target.classList.add("active");

    updateProgress(step);
}

function updateProgress(step) {
    const stepNumber = document.getElementById("stepNumber");
    if (stepNumber) stepNumber.textContent = step;

    const items = document.querySelectorAll(".booking-progress .progress-item");
    const lines = document.querySelectorAll(".booking-progress .progress-line");

    items.forEach((item, index) => {
        item.classList.remove("active", "completed");
        if (index + 1 < step) item.classList.add("completed");
        if (index + 1 === step) item.classList.add("active");
    });

    lines.forEach((line, index) => {
        line.classList.toggle("completed", index + 1 < step);
    });
}

/* ===================================================== 
   CALENDAR 
===================================================== */
function setupCalendar() {
    document.getElementById("previousMonth")?.addEventListener("click", () => {
        calendarMonth.setMonth(calendarMonth.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById("nextMonth")?.addEventListener("click", () => {
        calendarMonth.setMonth(calendarMonth.getMonth() + 1);
        renderCalendar();
    });

    const monthSelector = document.querySelector(".month-selector");
    const monthTitle = document.getElementById("monthTitle");
    const monthOptions = document.querySelectorAll(".month-dropdown button");

    monthTitle?.addEventListener("click", (e) => {
        e.stopPropagation();
        monthSelector.classList.toggle("open");
    });

    monthOptions.forEach((btn) => {
        btn.addEventListener("click", function () {
            const selectedMonth = parseInt(this.dataset.month, 10);
            calendarMonth.setMonth(selectedMonth);
            renderCalendar();
            monthSelector.classList.remove("open");
        });
    });

    document.addEventListener("click", () => {
        monthSelector?.classList.remove("open");
    });
}

function renderCalendar() {
    const container = document.getElementById("calendarDays");
    const title = document.getElementById("monthTitle");
    if (!container || !title) return;

    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const monthName = calendarMonth.toLocaleString("default", { month: "long" });

    title.innerHTML = `${monthName} ${year} <i class="fa-solid fa-chevron-down"></i>`;
    container.innerHTML = "";

    // Empty start cells
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-day empty";
        container.appendChild(empty);
    }

    // Days
    for (let day = 1; day <= totalDays; day++) {
        const el = document.createElement("div");
        el.className = "calendar-day";
        el.textContent = day;

        if (
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === day
        ) {
            el.classList.add("selected");
        }

        el.addEventListener("click", () => {
            selectedDate = new Date(year, month, day);
            renderCalendar();
            updateSelectedDate();
        });

        container.appendChild(el);
    }
}

function updateSelectedDate() {
    const formatted = selectedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    const selected = document.getElementById("selectedDate");
    const summary = document.getElementById("summaryDate");

    if (selected) selected.textContent = formatted;
    if (summary) summary.textContent = formatted;
}

/* ===================================================== 
   TIME SLOTS 
===================================================== */
function setupTimeSlots() {
    const slots = document.querySelectorAll(".time-slot:not(.disabled)");

    slots.forEach((slot) => {
        slot.addEventListener("click", function () {
            slots.forEach((s) => {
                s.classList.remove("selected");
                const span = s.querySelector("span");
                if (span && span.dataset.original) span.textContent = span.dataset.original;
            });

            this.classList.add("selected");
            const time = this.querySelector("strong");
            if (time) selectedTime = time.textContent;
        });
    });
}

/* ===================================================== 
   REVIEW DETAILS 
===================================================== */
function updateReviewDetails() {
    const formattedDate = selectedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    const elReviewCentre = document.getElementById("reviewCentre");
    const elReviewProduce = document.getElementById("reviewProduce");
    const elReviewDate = document.getElementById("reviewDate");
    const elReviewTime = document.getElementById("reviewTime");

    if (elReviewCentre) elReviewCentre.textContent = selectedCentre;
    if (elReviewProduce) elReviewProduce.textContent = selectedProduce;
    if (elReviewDate) elReviewDate.textContent = formattedDate;
    if (elReviewTime) elReviewTime.textContent = selectedTime;
}

function showReview() {
    document.querySelectorAll(".booking-step").forEach((s) => s.classList.remove("active"));
    document.getElementById("reviewStep")?.classList.add("active");
    updateProgress(4);
}

/* ===================================================== 
   CONFIRMATION (WITHOUT REDIRECTING TO MY BOOKINGS)
===================================================== */
function confirmBooking() {
    const formattedDate = selectedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    // Populate Confirmation Card
    const elDate = document.getElementById("confirmedDate");
    const elTime = document.getElementById("confirmedTime");
    const elCentre = document.getElementById("confirmedCentre");

    if (elDate) elDate.textContent = formattedDate;
    if (elTime) elTime.textContent = selectedTime;
    if (elCentre) elCentre.textContent = selectedCentre;

    // Switch to confirmed view
    document.querySelectorAll(".booking-step").forEach((s) => s.classList.remove("active"));
    document.getElementById("bookingConfirmed")?.classList.add("active");

    // Hide progress bar and header on confirmed screen
    document.querySelector(".booking-progress").style.display = "none";
    document.querySelector(".booking-header").style.display = "none";
}

// Kickoff
initializeBookNewSlot();


