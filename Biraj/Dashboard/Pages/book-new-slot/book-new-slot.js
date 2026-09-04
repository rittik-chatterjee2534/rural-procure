/* =====================================================
   BOOK NEW SLOT - LOGIC
   Wizard: Centre → Produce+Quantity → Date → Time → Review → Confirm
   Confirmed bookings are saved to localStorage so the
   My Bookings page can display them.
===================================================== */

/* =====================================================
   STATE
===================================================== */

let currentStep = 1;

let selectedCentre     = "Krishnanagar Procurement Centre";
let selectedProduce   = "Paddy";
let selectedQuantity  = 12;                    /* Quintal */
let selectedDate      = new Date(2026, 4, 15); /* default 15 May 2026 */
let selectedTime      = "10:00 - 10:30";

let calendarMonth =
    new Date(selectedDate.getFullYear(), selectedDate.getMonth());

/* localStorage key — MUST match my-bookings.js */
const BOOKINGS_KEY = "ruralProcure_bookings";

/* -----------------------------------------------------
   HELPER: localStorage
----------------------------------------------------- */
function getBookings() {
    try {
        return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveBookings(bookings) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

/* -----------------------------------------------------
   HELPER: centre -> location text
----------------------------------------------------- */
function getCentreLocation(centre) {
    const LOCATIONS = {
        "Krishnanagar Procurement Centre": "Krishnanagar, Nadia, West Bengal",
        "Shantipur Procurement Centre":    "Shantipur, Nadia, West Bengal",
        "Ranaghat Procurement Centre":      "Ranaghat, Nadia, West Bengal",
        "Haringhata Procurement Centre":    "Haringhata, Nadia, West Bengal"
    };
    return LOCATIONS[centre] || "";
}

function formatDate(d) {
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

/* -----------------------------------------------------
   TOKEN + BOOKING ID (unique per session)
----------------------------------------------------- */
function generateToken() {
    const used = new Set(getBookings().map(b => b.token).filter(Boolean));
    let n = 40;
    let token;
    do {
        token = "A-" + (n + 1);
        n++;
    } while (used.has(token));
    return token;
}

function generateBookingId() {
    const year = selectedDate.getFullYear();
    const seq  = String(142 + getBookings().length + 1).padStart(6, "0");
    return "RPC-" + year + "-" + seq;
}

/* =====================================================
   STEP DESCRIPTIONS (text under "Book New Slot" title)
===================================================== */
const STEP_DESCRIPTIONS = {
    1: "Select your preferred procurement centre",
    2: "Choose your produce and quantity",
    3: "Select your preferred date",
    4: "Select an available time slot"
};

/* =====================================================
   STEP SWITCHER
===================================================== */
function showStep(step) {
    currentStep = step;

    document.querySelectorAll(".booking-step")
        .forEach(sec => sec.classList.remove("active"));

    const stepMap = {
        1: "centreStep",
        2: "produceStep",
        3: "dateStep",
        4: "timeStep"
    };

    const target = document.getElementById(stepMap[step]);
    if (target) target.classList.add("active");

    updateProgress(step);

    const desc = document.getElementById("stepDescription");
    if (desc) desc.textContent = STEP_DESCRIPTIONS[step] || "";
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
   STEP 1 — CENTRE SELECTION + SEARCH FILTER
===================================================== */
function setupCentreSelection() {
    /* --- radio select --- */
    const centres = document.querySelectorAll('input[name="centre"]');

    centres.forEach((radio) => {
        radio.addEventListener("change", function () {
            selectedCentre = this.value;

            document.querySelectorAll(".centre-card")
                .forEach(card => card.classList.remove("selected"));

            this.closest(".centre-card").classList.add("selected");
            updateSelectedCentre();
        });
    });

    /* --- SEARCH FILTER: hide non-matching centre cards --- */
    const search  = document.getElementById("centreSearch");
    const noMatch = document.getElementById("noCentreMatch");

    if (search) {
        search.addEventListener("input", function () {
            const value = this.value.trim().toLowerCase();
            let visibleCount = 0;

            document.querySelectorAll(".centre-card").forEach((card) => {
                const cardText = card.textContent.toLowerCase();
                const isMatch = cardText.includes(value);

                card.style.display = isMatch ? "flex" : "none";
                if (isMatch) visibleCount++;
            });

            /* no-results message (optional HTML element) */
            if (noMatch) {
                noMatch.hidden = !(value !== "" && visibleCount === 0);
            }
        });
    }
}

function updateSelectedCentre() {
    document.querySelectorAll(".selected-centre-display")
        .forEach(el => { el.textContent = selectedCentre; });

    const summary = document.getElementById("summaryCentre");
    if (summary) summary.textContent = selectedCentre;
}

/* =====================================================
   STEP 2 — PRODUCE + QUANTITY
===================================================== */
function setupProduceSelection() {
    const produceCards = document.querySelectorAll(".produce-card");

    produceCards.forEach((card) => {
        card.addEventListener("click", function () {
            produceCards.forEach(c => c.classList.remove("selected"));
            this.classList.add("selected");

            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                selectedProduce = radio.value;
            }
        });
    });
}

function setupQuantity() {
    const qtyInput = document.getElementById("quantityInput");
    if (!qtyInput) return;                     /* skip if stepper isn't in HTML */

    const minus = document.getElementById("qtyMinus");
    const plus  = document.getElementById("qtyPlus");

    const clamp = () => {
        let v = parseInt(qtyInput.value, 10);
        if (isNaN(v) || v < 1)  v = 1;
        if (v > 500)           v = 500;
        qtyInput.value = v;
        selectedQuantity = v;
    };

    if (minus) { minus.addEventListener("click", () => { qtyInput.value = parseInt(qtyInput.value || 1, 10) - 1; clamp(); }); }
    if (plus)  { plus.addEventListener("click",  () => { qtyInput.value = parseInt(qtyInput.value || 1, 10) + 1; clamp(); }); }

    qtyInput.addEventListener("change", clamp);
    clamp();
}

/* =====================================================
   STEP 3 — CALENDAR
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

    const monthSelector  = document.querySelector(".month-selector");
    const monthTitle    = document.getElementById("monthTitle");
    const monthOptions  = document.querySelectorAll(".month-dropdown button");

    monthTitle?.addEventListener("click", (e) => {
        e.stopPropagation();
        monthSelector?.classList.toggle("open");
    });

    monthOptions.forEach((btn) => {
        btn.addEventListener("click", function () {
            calendarMonth.setMonth(parseInt(this.dataset.month, 10));
            renderCalendar();
            monthSelector?.classList.remove("open");
        });
    });

    document.addEventListener("click", () => {
        monthTitle?.closest(".month-selector")?.classList.remove("open");
    });
}

function renderCalendar() {
    const container = document.getElementById("calendarDays");
    const title     = document.getElementById("monthTitle");
    if (!container || !title) return;

    const year      = calendarMonth.getFullYear();
    const month     = calendarMonth.getMonth();
    const firstDay  = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const monthName = calendarMonth.toLocaleString("default", { month: "long" });

    title.innerHTML = `${monthName} ${year} <i class="fa-solid fa-chevron-down"></i>`;
    container.innerHTML = "";

    /* empty leading cells */
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-day empty";
        container.appendChild(empty);
    }

    /* day cells */
    for (let day = 1; day <= totalDays; day++) {
        const el = document.createElement("div");
        el.className = "calendar-day";
        el.textContent = day;

        if (selectedDate.getFullYear() === year &&
            selectedDate.getMonth()  === month &&
            selectedDate.getDate()   === day) {
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
    const formatted = formatDate(selectedDate);

    const selected = document.getElementById("selectedDate");
    const summary  = document.getElementById("summaryDate");

    if (selected) selected.textContent = formatted;
    if (summary)  summary.textContent  = formatted;
}

/* =====================================================
   STEP 4 — TIME SLOTS
===================================================== */
function setupTimeSlots() {
    const slots = document.querySelectorAll(".time-slot:not(.disabled)");

    slots.forEach((slot) => {
        slot.addEventListener("click", function () {
            slots.forEach((s) => {
                s.classList.remove("selected");
                const span = s.querySelector("span");
                if (span) span.textContent = span.dataset.original || span.textContent;
            });

            this.classList.add("selected");
            const timeEl = this.querySelector("strong");
            if (timeEl) selectedTime = timeEl.textContent;
        });
    });
}

/* =====================================================
   REVIEW
===================================================== */
function updateReviewDetails() {
    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    set("reviewCentre",    selectedCentre);
    set("reviewLocation",  getCentreLocation(selectedCentre));
    set("reviewProduce",   selectedProduce);
    set("reviewQuantity",  selectedQuantity);
    set("reviewDate",      formatDate(selectedDate));
    set("reviewTime",      selectedTime);
}

function showReview() {
    document.querySelectorAll(".booking-step")
        .forEach(s => s.classList.remove("active"));

    document.getElementById("reviewStep")?.classList.add("active");
    updateProgress(4);
    currentStep = 5;
}

/* =====================================================
   CONFIRM BOOKING → save + show token screen
===================================================== */
function confirmBooking() {
    const booking = {
        id:        generateBookingId(),
        token:     generateToken(),
        centre:    selectedCentre,
        location:  getCentreLocation(selectedCentre),
        produce:   selectedProduce,
        quantity:  selectedQuantity,
        date:      formatDate(selectedDate),
        time:      selectedTime,
        status:    "Confirmed",
        createdAt: new Date().toISOString()
    };

    const bookings = getBookings();
    bookings.push(booking);
    saveBookings(bookings);

    /* --- fill confirmation screen --- */
    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    set("tokenNumber",     booking.token);
    set("confirmedDate",   booking.date);
    set("confirmedTime",   booking.time);
    set("confirmedCentre", booking.centre);

    const idEl = document.querySelector(".booking-id strong");
    if (idEl) idEl.textContent = booking.id;

    /* --- switch view --- */
    document.querySelectorAll(".booking-step")
        .forEach(s => s.classList.remove("active"));

    document.getElementById("bookingConfirmed")?.classList.add("active");

    /* hide the wizard header + progress on the confirmed screen */
    const progress = document.querySelector(".booking-progress");
    const header   = document.querySelector(".booking-header");

    if (progress) progress.style.display = "none";
    if (header)   header.style.display   = "none";
}

/* =====================================================
   NAVIGATION WIRING
===================================================== */
function setupNavigation() {
    /* 1 → 2 */
    document.getElementById("centreNext")?.addEventListener("click", () => showStep(2));

    /* 2 → 1 / 2 → 3 */
    document.getElementById("produceBack")?.addEventListener("click", () => showStep(1));
    document.getElementById("produceNext")?.addEventListener("click", () => showStep(3));

    /* 3 → 2 / 3 → 4 */
    document.getElementById("dateBack")?.addEventListener("click", () => showStep(2));
    document.getElementById("dateNext")?.addEventListener("click", () => {
        updateSelectedDate();
        showStep(4);
    });

    /* 4 → 3 / 4 → review */
    document.getElementById("timeBack")?.addEventListener("click", () => showStep(3));
    document.getElementById("continueToReview")?.addEventListener("click", () => {
        updateReviewDetails();
        showReview();
    });

    /* review → 4 / confirm */
    document.getElementById("changeDetails")?.addEventListener("click", () => showStep(4));
    document.getElementById("finalConfirmBooking")?.addEventListener("click", confirmBooking);

    /* back-to-dashboard buttons */
    document.getElementById("backToDashboard")?.addEventListener("click", () => {
        window.location.href = "../../user-dashboard.html";
    });
    document.getElementById("backDashboard")?.addEventListener("click", () => {
        window.location.href = "../../user-dashboard.html";
    });
}

/* =====================================================
   INITIALIZE
===================================================== */
function initializeBookNewSlot() {
    setupCentreSelection();
    setupProduceSelection();
    setupQuantity();
    setupCalendar();
    setupTimeSlots();
    setupNavigation();

    renderCalendar();
    updateSelectedCentre();
    updateSelectedDate();
    updateNotificationUI?.();   /* safe no-op if chrome JS defines it */
}

/* Kickoff */
initializeBookNewSlot();
