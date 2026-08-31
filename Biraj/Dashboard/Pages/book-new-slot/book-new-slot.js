/* =====================================================
   BOOK NEW SLOT
===================================================== */


/* =====================================================
   DATA
===================================================== */

let currentStep = 1;

let selectedCentre =
    "Krishnanagar Procurement Centre";

let selectedProduce = "Paddy";

let selectedDate =
    new Date(2026, 4, 15);

let selectedTime =
    "10:00 - 10:30";


let calendarMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
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


    // Back to Dashboard
    document.getElementById("backToDashboard")?.addEventListener("click", function(){
        if (typeof loadDashboard === "function"){
            loadDashboard();
        }
    });

}


/* =====================================================
   CENTRE SELECTION
===================================================== */

function setupCentreSelection() {

    const centres =
        document.querySelectorAll(
            'input[name="centre"]'
        );


    centres.forEach(radio => {

        radio.addEventListener(
            "change",
            function () {

                selectedCentre =
                    this.value;


                document
                    .querySelectorAll(".centre-card")
                    .forEach(card => {

                        card.classList.remove(
                            "selected"
                        );

                    });


                this
                    .closest(".centre-card")
                    .classList.add("selected");


                updateSelectedCentre();

            }
        );

    });


    /* SEARCH */

    const search =
        document.getElementById(
            "centreSearch"
        );


    if (search) {

        search.addEventListener(
            "input",
            function () {

                const value =
                    this.value.toLowerCase();


                document
                    .querySelectorAll(
                        ".centre-card"
                    )
                    .forEach(card => {

                        const text =
                            card.textContent
                                .toLowerCase();


                        if (
                            text.includes(value)
                        ) {

                            card.style.display =
                                "flex";

                        } else {

                            card.style.display =
                                "none";

                        }

                    });

            }
        );

    }

}


/* =====================================================
   UPDATE CENTRE
===================================================== */

function updateSelectedCentre() {

    const centre =
        document.getElementById(
            "selectedCentreName"
        );


    const summary =
        document.getElementById(
            "summaryCentre"
        );


    if (centre) {

        centre.textContent =
            selectedCentre;

    }


    if (summary) {

        summary.textContent =
            selectedCentre;

    }

}


/* =====================================================
   PRODUCE SELECTION
===================================================== */

function setupProduceSelection() {

    const produceCards =
        document.querySelectorAll(
            ".produce-card"
        );


    produceCards.forEach(card => {

        card.addEventListener(
            "click",
            function () {

                /* Remove previous selection */

                produceCards.forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                });


                /* Select clicked card */

                this.classList.add(
                    "selected"
                );


                /* Get radio */

                const radio =
                    this.querySelector(
                        'input[type="radio"]'
                    );


                if (radio) {

                    radio.checked = true;

                    selectedProduce =
                        radio.value;

                }


                /* Update summary if available */

                const summaryProduce =
                    document.getElementById(
                        "summaryProduce"
                    );


                if (summaryProduce) {

                    summaryProduce.textContent =
                        selectedProduce;

                }


                console.log(
                    "Selected Produce:",
                    selectedProduce
                );

            }
        );

    });

}


/* =====================================================
   NAVIGATION
===================================================== */

function setupNavigation() {

    /* =========================================
       CENTRE → PRODUCE
    ========================================= */

    document
        .getElementById("centreNext")
        ?.addEventListener("click", function () {

            showStep(2);

        });


    /* =========================================
       PRODUCE → CENTRE
    ========================================= */

    document
        .getElementById("produceBack")
        ?.addEventListener("click", function () {

            showStep(1);

        });


    /* =========================================
       PRODUCE → DATE
    ========================================= */

    document
        .getElementById("produceNext")
        ?.addEventListener("click", function () {

            if (!selectedProduce) {

                selectedProduce = "Paddy";

            }

            showStep(3);

        });


    /* =========================================
       DATE → PRODUCE
    ========================================= */

    document
        .getElementById("dateBack")
        ?.addEventListener("click", function () {

            showStep(2);

        });


    /* =========================================
       DATE → TIME
    ========================================= */

    document
        .getElementById("dateNext")
        ?.addEventListener("click", function () {

            updateSelectedDate();

            showStep(4);

        });


    /* =========================================
       TIME → DATE
    ========================================= */

    document
        .getElementById("timeBack")
        ?.addEventListener("click", function () {

            showStep(3);

        });


    /* =========================================
       TIME → REVIEW
    ========================================= */

    document
        .getElementById("continueToReview")
        ?.addEventListener("click", function () {

            console.log("Continue to Review clicked");

            updateReviewDetails();

            showReview();

        });


    /* =========================================
       REVIEW → TIME
    ========================================= */

    document
        .getElementById("changeDetails")
        ?.addEventListener("click", function () {

            showStep(4);

        });


    /* =========================================
       REVIEW → CONFIRM
    ========================================= */

    document
        .getElementById("finalConfirmBooking")
        ?.addEventListener("click", function () {

            confirmBooking();

        });

}


/* =====================================================
   SHOW STEP
===================================================== */

function showStep(step) {

    currentStep = step;


    /* Hide every step */

    document
        .querySelectorAll(".booking-step")
        .forEach(section => {

            section.classList.remove(
                "active"
            );

        });


    /* =========================================
       STEP 1 — CENTRE
    ========================================= */

    if (step === 1) {

        document
            .getElementById("centreStep")
            ?.classList.add("active");

    }


    /* =========================================
       STEP 2 — PRODUCE
    ========================================= */

    if (step === 2) {

        document
            .getElementById("produceStep")
            ?.classList.add("active");

    }


    /* =========================================
       STEP 3 — DATE
    ========================================= */

    if (step === 3) {

        document
            .getElementById("dateStep")
            ?.classList.add("active");

    }


    /* =========================================
       STEP 4 — TIME
    ========================================= */

    if (step === 4) {

        document
            .getElementById("timeStep")
            ?.classList.add("active");

    }


    updateProgress(step);

}


/* =====================================================
   PROGRESS
===================================================== */

function updateProgress(step) {

    const stepNumber =
        document.getElementById(
            "stepNumber"
        );


    if (stepNumber) {

        stepNumber.textContent =
            step;

    }


    const items =
        document.querySelectorAll(
            ".progress-item"
        );


    const lines =
        document.querySelectorAll(
            ".progress-line"
        );


    /* =========================================
       PROGRESS ITEMS
    ========================================= */

    items.forEach(
        (item, index) => {

            item.classList.remove(
                "active",
                "completed"
            );


            /* Completed */

            if (index + 1 < step) {

                item.classList.add(
                    "completed"
                );

            }


            /* Current */

            if (index + 1 === step) {

                item.classList.add(
                    "active"
                );

            }

        }
    );


    /* =========================================
       PROGRESS LINES
    ========================================= */

    lines.forEach(
        (line, index) => {

            line.classList.toggle(
                "completed",
                index + 1 < step
            );

        }
    );

}


/* =====================================================
   CALENDAR
===================================================== */

function setupCalendar() {

    /* =========================================
       PREVIOUS MONTH
    ========================================= */

    document
        .getElementById("previousMonth")
        ?.addEventListener(
            "click",
            function () {

                calendarMonth.setMonth(
                    calendarMonth.getMonth() - 1
                );

                renderCalendar();

            }
        );


    /* =========================================
       NEXT MONTH
    ========================================= */

    document
        .getElementById("nextMonth")
        ?.addEventListener(
            "click",
            function () {

                calendarMonth.setMonth(
                    calendarMonth.getMonth() + 1
                );

                renderCalendar();

            }
        );


    /* =========================================
       MONTH DROPDOWN
    ========================================= */

    const monthSelector =
        document.querySelector(".month-selector");

    const monthTitle =
        document.getElementById("monthTitle");

    const monthOptions =
        document.querySelectorAll(
            ".month-dropdown button"
        );


    /* Open / close dropdown */

    monthTitle?.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            monthSelector.classList.toggle("open");

        }
    );


    /* Select month */

    monthOptions.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const selectedMonth =
                    parseInt(
                        this.dataset.month
                    );


                calendarMonth.setMonth(
                    selectedMonth
                );


                renderCalendar();


                monthSelector.classList.remove(
                    "open"
                );

            }
        );

    });


    /* Close when clicking outside */

    document.addEventListener(
        "click",
        function () {

            monthSelector?.classList.remove(
                "open"
            );

        }
    );

}


/* =====================================================
   RENDER CALENDAR
===================================================== */

function renderCalendar() {

    const container =
        document.getElementById(
            "calendarDays"
        );


    const title =
        document.getElementById(
            "monthTitle"
        );


    if (!container || !title) {

        return;

    }


    const year =
        calendarMonth.getFullYear();


    const month =
        calendarMonth.getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const totalDays =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const monthName =
        calendarMonth.toLocaleString(
            "default",
            {
                month: "long"
            }
        );


    title.textContent =
        `${monthName} ${year}`;


    container.innerHTML = "";


    /* =========================================
       EMPTY CELLS
    ========================================= */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "calendar-day empty";


        container.appendChild(
            empty
        );

    }


    /* =========================================
       DAYS
    ========================================= */

    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.className =
            "calendar-day";


        element.textContent =
            day;


        /* Selected date */

        if (
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === day
        ) {

            element.classList.add(
                "selected"
            );

        }


        /* Date click */

        element.addEventListener(
            "click",
            function () {

                selectedDate =
                    new Date(
                        year,
                        month,
                        day
                    );


                renderCalendar();

                updateSelectedDate();

            }
        );


        container.appendChild(
            element
        );

    }

}


/* =====================================================
   UPDATE DATE
===================================================== */

function updateSelectedDate() {

    const formatted =
        selectedDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    const selected =
        document.getElementById(
            "selectedDate"
        );


    const summary =
        document.getElementById(
            "summaryDate"
        );


    if (selected) {

        selected.textContent =
            formatted;

    }


    if (summary) {

        summary.textContent =
            formatted;

    }

}


/* =====================================================
   TIME SLOTS
===================================================== */

function setupTimeSlots() {

    const slots =
        document.querySelectorAll(
            ".time-slot:not(.disabled)"
        );


    slots.forEach(slot => {

        slot.addEventListener(
            "click",
            function () {

                slots.forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                });


                this.classList.add(
                    "selected"
                );


                const time =
                    this.querySelector(
                        "strong"
                    );


                if (time) {

                    selectedTime =
                        time.textContent;

                }

            }
        );

    });

}

/* =====================================================
   UPDATE REVIEW DETAILS
===================================================== */

function updateReviewDetails() {

    const date =
        selectedDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    /* Centre */

    const reviewCentre =
        document.getElementById("reviewCentre");

    if (reviewCentre) {

        reviewCentre.textContent =
            selectedCentre;

    }


    /* Produce */

    const reviewProduce =
        document.getElementById("reviewProduce");

    if (reviewProduce) {

        reviewProduce.textContent =
            selectedProduce || "Paddy";

    }


    /* Date */

    const reviewDate =
        document.getElementById("reviewDate");

    if (reviewDate) {

        reviewDate.textContent =
            date;

    }


    /* Time */

    const reviewTime =
        document.getElementById("reviewTime");

    if (reviewTime) {

        reviewTime.textContent =
            selectedTime;

    }


    /* Quantity */

    const reviewQuantity =
        document.getElementById("reviewQuantity");

    if (reviewQuantity) {

        reviewQuantity.textContent = "12";

    }

}


/* =====================================================
   SHOW REVIEW PAGE
===================================================== */

function showReview() {

    console.log("Opening Review Page");

    /* Hide all booking steps */

    document
        .querySelectorAll(".booking-step")
        .forEach(function (step) {

            step.classList.remove("active");

        });


    /* Show review page */

    const review =
        document.getElementById("reviewStep");

    if (review) {

        review.classList.add("active");

    } else {

        console.error(
            "ERROR: reviewStep element not found!"
        );

        return;

    }


    /* Keep progress at Step 4 */

    updateProgress(4);

}


/* =====================================================
   CONFIRM BOOKING
===================================================== */

function confirmBooking() {

    const date = selectedDate.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

    const booking = {
        centre: selectedCentre,
        produce: selectedProduce,
        date: date,
        time: selectedTime,
        token: "A-42",
        status: "Confirmed"
    };

    // Save booking ONLY when Confirm Booking is clicked
    sessionStorage.setItem(
        "myBooking",
        JSON.stringify(booking)
    );

    // Show receipt
    showBookingReceipt(booking);
}


function showBookingReceipt(booking) {

    const page =
        document.querySelector(".book-slot-page");

    if (!page) return;

    /* =====================================================
       CREATE DUMMY QR CODE
    ===================================================== */

    let qrCells = "";

    for (let i = 0; i < 441; i++) {

        let row = Math.floor(i / 21);
        let col = i % 21;

        let filled = false;

        /* Random-looking dummy QR pattern */
        if (Math.random() > 0.55) {
            filled = true;
        }

        /* Finder pattern */
        function finderPattern(r, c) {

            if (
                row >= r &&
                row < r + 7 &&
                col >= c &&
                col < c + 7
            ) {

                const rr = row - r;
                const cc = col - c;

                return (
                    rr === 0 ||
                    rr === 6 ||
                    cc === 0 ||
                    cc === 6 ||
                    (
                        rr >= 2 &&
                        rr <= 4 &&
                        cc >= 2 &&
                        cc <= 4
                    )
                );
            }

            return false;
        }

        if (
            finderPattern(0, 0) ||
            finderPattern(0, 14) ||
            finderPattern(14, 0)
        ) {
            filled = true;
        }

        qrCells += `
            <span class="${filled ? "qr-black" : "qr-white"}"></span>
        `;
    }


    /* =====================================================
       RECEIPT
    ===================================================== */

    page.innerHTML = `

        <div class="booking-receipt">

            <!-- LEFT SIDE -->

            <div class="receipt-left">

                <div class="receipt-success-icon">
                    <i class="fa-solid fa-check"></i>
                </div>

                <h1>
                    Booking Confirmed!
                </h1>

                <p class="receipt-message">
                    Your procurement slot has been
                    successfully booked.
                </p>


                <div class="receipt-details">

                    <div class="receipt-detail">
                        <span>Token Number</span>
                        <strong>${booking.token}</strong>
                    </div>

                    <div class="receipt-detail">
                        <span>Procurement Centre</span>
                        <strong>${booking.centre}</strong>
                    </div>

                    <div class="receipt-detail">
                        <span>Produce</span>
                        <strong>${booking.produce}</strong>
                    </div>

                    <div class="receipt-detail">
                        <span>Date</span>
                        <strong>${booking.date}</strong>
                    </div>

                    <div class="receipt-detail">
                        <span>Time</span>
                        <strong>${booking.time}</strong>
                    </div>

                </div>


                <div class="receipt-status">

                    <i class="fa-solid fa-circle-check"></i>

                    <span>
                        Booking Confirmed
                    </span>

                </div>

            </div>


            <!-- RIGHT SIDE : QR -->

            <div class="receipt-right">

                <div class="qr-wrapper">

                    <div class="dummy-qr">
                        ${qrCells}
                    </div>

                </div>

                <h3>
                    Scan QR Code
                </h3>

                <p>
                    Show this QR at the
                    procurement centre
                </p>

                <div class="qr-token">
                    ${booking.token}
                </div>

            </div>

        </div>

    `;
}

/* =====================================================
   START
===================================================== */

initializeBookNewSlot();

const backDashboard = document.getElementById("backToDashboard");

/* =========================================================
   BACK TO HOME - MOBILE ONLY
========================================================= */

document.addEventListener("click", function (event) {

    const backButton =
        event.target.closest("#backDashboard");

    if (!backButton) {
        return;
    }

    /* -----------------------------------------
       MOBILE ONLY
    ----------------------------------------- */

    if (window.innerWidth > 750) {
        return;
    }

    /* -----------------------------------------
       RETURN TO HOME
    ----------------------------------------- */

    event.preventDefault();

    window.location.reload();

});