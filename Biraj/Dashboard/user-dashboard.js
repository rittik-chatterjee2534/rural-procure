/* =========================================================
SIDEBAR
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {

menuToggle.addEventListener("click", (event) => {

    event.stopPropagation();

    sidebar.classList.toggle("open");

});

}

/* =========================================================
SIDEBAR NAVIGATION
========================================================= */

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((item) => {

    item.addEventListener("click", function (event) {

        event.preventDefault();

        navItems.forEach((nav) => {
            nav.classList.remove("active");
        });

        this.classList.add("active");

        // Close mobile sidebar
        if (window.innerWidth <= 750 && sidebar) {
            sidebar.classList.remove("open");
        }

        // Home → return to Dashboard
        if (this.id === "Home") {
            window.location.reload();
        }

    });

});


/* =========================================================
   MY BOOKINGS NAVIGATION
========================================================= */

document.addEventListener("click", function (event) {

    const myBookings =
        event.target.closest("#myBookings");

    if (!myBookings) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();


    /* -----------------------------------------
       ACTIVE SIDEBAR ITEM
    ----------------------------------------- */

    navItems.forEach((nav) => {
        nav.classList.remove("active");
    });

    myBookings.classList.add("active");


    /* -----------------------------------------
       CLOSE MOBILE SIDEBAR
    ----------------------------------------- */

    if (window.innerWidth <= 750 && sidebar) {
        sidebar.classList.remove("open");
    }


    /* -----------------------------------------
       SHOW BOOKINGS
    ----------------------------------------- */

    showMyBookings();

});


/* =========================================================
PROFILE DROPDOWN - DESKTOP
========================================================= */

const profileButton =
document.getElementById("profileButton");

const profileDropdown =
document.getElementById("profileDropdown");

if (profileButton && profileDropdown) {

profileButton.addEventListener("click", (event) => {

    event.stopPropagation();

    profileDropdown.classList.toggle("show");

    // Close notification dropdown
    if (notificationDropdown) {
        notificationDropdown.classList.remove("show");
    }

});

}

/* =========================================================
NOTIFICATION ELEMENTS
========================================================= */

const notificationButton =
document.getElementById("notificationButton");

const notificationDropdown =
document.getElementById("notificationDropdown");

const mobileNotificationButton =
document.getElementById("mobileNotificationButton");

const mobileNotificationDropdown =
document.getElementById("mobileNotificationDropdown");

const profileDropdownElement =
document.getElementById("profileDropdown");

const mobileProfileDropdown =
document.getElementById("mobileProfileDropdown");

/* =========================================================
NOTIFICATION STATE
========================================================= */

/*
These are the 3 actual notifications.

Desktop and mobile each contain a visual copy
of these notifications.

We keep their read/unread state here.

*/

const notificationState = {
1: true,
2: true,
3: true
};

/* =========================================================
GET UNREAD COUNT
========================================================= */

function getUnreadCount() {

return Object.values(notificationState)
    .filter(Boolean)
    .length;

}

/* =========================================================
UPDATE ALL NOTIFICATION ITEMS
========================================================= */

function updateNotificationItems() {

const notificationItems =
    document.querySelectorAll(".notification-item");

notificationItems.forEach((item) => {

    const id =
        item.dataset.notificationId;

    if (notificationState[id]) {

        // Unread
        item.classList.add("unread");
        item.classList.remove("read");

    } else {

        // Read
        item.classList.remove("unread");
        item.classList.add("read");

    }

});

}

/* =========================================================
UPDATE NOTIFICATION BADGES
========================================================= */

function updateNotificationBadges() {

const unreadCount =
    getUnreadCount();


const desktopBadge =
    document.getElementById(
        "desktopNotificationCount"
    );


const mobileBadge =
    document.getElementById(
        "mobileNotificationCount"
    );


const badges = [
    desktopBadge,
    mobileBadge
];


badges.forEach((badge) => {

    if (!badge) {
        return;
    }


    if (unreadCount === 0) {

        badge.style.display = "none";

    } else {

        badge.style.display = "flex";

        badge.textContent =
            unreadCount;

    }

});

}

/* =========================================================
UPDATE NOTIFICATION HEADER TEXT
========================================================= */

function updateNotificationHeaders() {

const unreadCount =
    getUnreadCount();


const headerTexts =
    document.querySelectorAll(
        ".notification-header-text"
    );


headerTexts.forEach((text) => {

    if (unreadCount === 0) {

        text.textContent =
            "You're all caught up";

    } else {

        text.textContent =
            unreadCount +
            (
                unreadCount === 1
                    ? " new notification"
                    : " new notifications"
            );

    }

});

}

/* =========================================================
UPDATE COMPLETE NOTIFICATION UI
========================================================= */

function updateNotificationUI() {

updateNotificationItems();

updateNotificationBadges();

updateNotificationHeaders();

}

/* =========================================================
MARK ONE NOTIFICATION AS READ
========================================================= */

function markNotificationAsRead(id) {

if (!notificationState.hasOwnProperty(id)) {
    return;
}

notificationState[id] = false;

updateNotificationUI();

}

/* =========================================================
MARK ALL NOTIFICATIONS AS READ
========================================================= */

function markAllNotificationsAsRead() {

Object.keys(notificationState).forEach((id) => {

    notificationState[id] = false;

});

updateNotificationUI();

}

/* =========================================================
DESKTOP NOTIFICATION DROPDOWN
========================================================= */

if (
notificationButton &&
notificationDropdown
) {

notificationButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        notificationDropdown.classList.toggle(
            "show"
        );


        // Close profile dropdown

        if (profileDropdownElement) {

            profileDropdownElement.classList.remove(
                "show"
            );

        }

    }
);


notificationDropdown.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

    }
);

}

/* =========================================================
MOBILE NOTIFICATION DROPDOWN
========================================================= */

if (
mobileNotificationButton &&
mobileNotificationDropdown
) {

mobileNotificationButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        mobileNotificationDropdown.classList.toggle(
            "show"
        );


        // Close mobile profile dropdown

        if (mobileProfileDropdown) {

            mobileProfileDropdown.classList.remove(
                "show"
            );

        }

    }
);


mobileNotificationDropdown.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

    }
);

}

/* =========================================================
MARK ALL AS READ - DESKTOP
========================================================= */

const markAllRead =
document.getElementById("markAllRead");

if (markAllRead) {

markAllRead.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        markAllNotificationsAsRead();

    }
);

}

/* =========================================================
MARK ALL AS READ - MOBILE
========================================================= */

const mobileMarkAllRead =
document.getElementById(
"mobileMarkAllRead"
);

if (mobileMarkAllRead) {


mobileMarkAllRead.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        markAllNotificationsAsRead();

    }
);

}

/* =========================================================
INDIVIDUAL NOTIFICATION CLICK
========================================================= */

const notificationItems =
document.querySelectorAll(
".notification-item"
);

notificationItems.forEach((notification) => {

notification.addEventListener(
    "click",
    () => {

        const id =
            notification.dataset.notificationId;

        markNotificationAsRead(id);

    }
);

});

/* =========================================================
VIEW ALL NOTIFICATIONS
========================================================= */

const viewAllNotifications =
document.getElementById(
"viewAllNotifications"
);

const mobileViewAllNotifications =
document.querySelector(
".mobile-header .view-all-notifications"
);

function showAllNotificationsMessage() {

alert(
    "Opening all notifications..."
);

}

if (viewAllNotifications) {

viewAllNotifications.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        showAllNotificationsMessage();

    }
);

}

if (mobileViewAllNotifications) {

mobileViewAllNotifications.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        showAllNotificationsMessage();

    }
);

}

/* =========================================================
MOBILE PROFILE
========================================================= */

const mobileProfileButton =
document.getElementById(
"mobileProfileButton"
);

if (
mobileProfileButton &&
mobileProfileDropdown
) {

mobileProfileButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        mobileProfileDropdown.classList.toggle(
            "show"
        );


        // Close mobile notification dropdown

        if (mobileNotificationDropdown) {

            mobileNotificationDropdown.classList.remove(
                "show"
            );

        }

    }
);


mobileProfileDropdown.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

    }
);

}

/* =========================================================
CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
"click",
() => {

    // Desktop profile

    if (profileDropdownElement) {

        profileDropdownElement.classList.remove(
            "show"
        );

    }


    // Desktop notification

    if (notificationDropdown) {

        notificationDropdown.classList.remove(
            "show"
        );

    }


    // Mobile notification

    if (mobileNotificationDropdown) {

        mobileNotificationDropdown.classList.remove(
            "show"
        );

    }


    // Mobile profile

    if (mobileProfileDropdown) {

        mobileProfileDropdown.classList.remove(
            "show"
        );

    }

}

);

/* =========================================================
VIEW BOOKING
========================================================= */

const viewBooking =
document.getElementById(
"viewBooking"
);

if (viewBooking) {

viewBooking.addEventListener(
    "click",
    () => {

        alert(
            "Booking Details\n\n" +
            "Crop: Paddy\n" +
            "Token: A-42\n" +
            "Date: 15 Sep 2026\n" +
            "Time: 10:00 AM – 10:30 AM\n" +
            "Centre: Krishnanagar Procurement Centre"
        );

    }
);

}

/* =========================================================
LIVE QUEUE
========================================================= */

const viewQueue =
document.getElementById(
"viewQueue"
);

const queueButton =
document.getElementById(
"queueButton"
);

function showQueueMessage() {

alert(
    "Live Queue\n\n" +
    "Your Token: A-42\n" +
    "Currently Serving: A-39\n" +
    "People Ahead: 2\n" +
    "Estimated Wait: ~15 min"
);

}

if (viewQueue) {

viewQueue.addEventListener(
    "click",
    showQueueMessage
);

}

if (queueButton) {

queueButton.addEventListener(
    "click",
    showQueueMessage
);

}

/* =========================================================
QUICK ACTIONS
========================================================= */

/* =========================================================
   QUICK ACTIONS
========================================================= */

const quickCards =
    document.querySelectorAll(".quick-card");


quickCards.forEach((card) => {

    card.addEventListener("click", function (event) {

        event.preventDefault();


        const title =
            card.querySelector("h3");


        if (!title) {
            return;
        }


        const action =
            title.textContent.trim().toLowerCase();


        /* =========================================
           BOOK NEW SLOT
        ========================================= */

        if (action.includes("book new slot")) {

            loadBookNewSlot();

            return;

        }


        /* =========================================
           MY BOOKINGS
        ========================================= */

        if (action.includes("my booking")) {

            showMyBookings();

            return;

        }

    });

});


/* =========================================================
LIVE QUEUE SIMULATION
========================================================= */

let peopleAhead = 2;

const peopleAheadValue =
document.getElementById(
"peopleAheadValue"
);

setInterval(() => {

if (peopleAhead > 0) {

    /*
        Randomly simulate queue movement.
        There is a 30% chance every 5 seconds.
    */

    if (Math.random() > 0.7) {

        peopleAhead--;

        if (peopleAheadValue) {

            peopleAheadValue.textContent =
                peopleAhead;

        }

    }

}

}, 5000);

/* =========================================================
RESPONSIVE SIDEBAR
========================================================= */

window.addEventListener(
"resize",
() => {

    if (
        window.innerWidth > 750 &&
        sidebar
    ) {

        sidebar.classList.remove(
            "open"
        );

    }

}

);

/* =========================================================
INITIALIZE NOTIFICATION UI
========================================================= */

updateNotificationUI();


/* To Dynamically show the book new slot */
/* =========================================================
   LOAD BOOK NEW SLOT
========================================================= */

const bookNewSlot =
    document.getElementById("bookNewSlot");

const mainContent =
    document.getElementById("main-content");



async function loadBookNewSlot() {

    if (!mainContent) {
        return;
    }


    try {

        const response = await fetch(
            "Pages/book-new-slot/book-new-slot.html"
        );


        if (!response.ok) {

            throw new Error(
                "Book New Slot HTML not found"
            );

        }


        const html =
            await response.text();


        /* =========================================
           LOAD HTML
        ========================================= */

        mainContent.innerHTML =
            html;


        /* =========================================
           LOAD CSS
        ========================================= */

        const css =
            document.createElement("link");

        css.rel =
            "stylesheet";

        css.href =
            "Pages/book-new-slot/book-new-slot.css";

        document.head.appendChild(css);


        /* =========================================
           LOAD JAVASCRIPT
        ========================================= */

        const script =
            document.createElement("script");

        script.src =
            "Pages/book-new-slot/book-new-slot.js";


        script.onload = function () {

            console.log(
                "Book New Slot JS loaded successfully"
            );

        };


        script.onerror = function () {

            console.error(
                "Book New Slot JS could not be loaded"
            );

        };


        document.body.appendChild(script);


    } catch (error) {

        console.error(error);


        mainContent.innerHTML = `

            <div style="
                padding:40px;
                text-align:center;
            ">

                <h2>
                    Unable to load Book New Slot
                </h2>

                <p>
                    Please check the file path.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   SIDEBAR → BOOK NEW SLOT
========================================================= */

if (bookNewSlot) {

    bookNewSlot.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            loadBookNewSlot();

        }
    );

}

/* =========================================================
   SHOW MY BOOKINGS
========================================================= */

function showMyBookings() {

    if (!mainContent) {
        console.error("main-content not found");
        return;
    }


    /* =========================================
       GET SAVED BOOKING
    ========================================= */

    const savedBooking =
        sessionStorage.getItem("myBooking");


    /* =========================================
       NO BOOKING
    ========================================= */

    if (!savedBooking) {

        mainContent.innerHTML = `

            <div class="my-bookings-page">

                <div class="booking-page-header">

                    <div>

                        <h1>
                            My Bookings
                        </h1>

                        <p>
                            Your confirmed procurement bookings
                        </p>

                    </div>

                </div>


                <div class="no-booking">

                    <i class="fa-regular fa-calendar-xmark"></i>

                    <h2>
                        No bookings yet
                    </h2>

                    <p>
                        You don't have any confirmed
                        bookings.
                    </p>

                </div>

            </div>

        `;

        return;
    }


    /* =========================================
       READ BOOKING DATA
    ========================================= */

    let booking;

    try {

        booking =
            JSON.parse(savedBooking);

    } catch (error) {

        console.error(
            "Error reading booking:",
            error
        );

        return;
    }


    /* =========================================
       SHOW MY BOOKING
    ========================================= */

    mainContent.innerHTML = `

        <div class="my-bookings-page">


            <!-- PAGE HEADER -->

            <div class="booking-page-header">

                <div>
                    <button class="back-dashboard" id="backDashboard">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <h1>
                        My Bookings
                    </h1>

                    <p>
                        View your confirmed procurement slot.
                    </p>

                </div>

            </div>


            <!-- BOOKING CARD -->

            <div class="my-booking-card">


                <!-- BOOKING HEADER -->

                <div class="booking-card-header">

                    <div>

                        <span>
                            Booking Status
                        </span>

                        <strong>
                            ${booking.status || "Confirmed"}
                        </strong>

                    </div>


                    <div class="booking-token">

                        <small>
                            Token
                        </small>

                        <strong>
                            ${booking.token || "A-42"}
                        </strong>

                    </div>

                </div>


                <!-- BOOKING DETAILS -->

                <div class="booking-card-body">


                    <!-- CENTRE -->

                    <div class="booking-detail">

                        <i class="fa-solid fa-location-dot"></i>

                        <div>

                            <small>
                                Procurement Centre
                            </small>

                            <strong>
                                ${booking.centre || "-"}
                            </strong>

                        </div>

                    </div>


                    <!-- PRODUCE -->

                    <div class="booking-detail">

                        <i class="fa-solid fa-seedling"></i>

                        <div>

                            <small>
                                Produce
                            </small>

                            <strong>
                                ${booking.produce || "-"}
                            </strong>

                        </div>

                    </div>


                    <!-- DATE -->

                    <div class="booking-detail">

                        <i class="fa-regular fa-calendar"></i>

                        <div>

                            <small>
                                Date
                            </small>

                            <strong>
                                ${booking.date || "-"}
                            </strong>

                        </div>

                    </div>


                    <!-- TIME -->

                    <div class="booking-detail">

                        <i class="fa-regular fa-clock"></i>

                        <div>

                            <small>
                                Time Slot
                            </small>

                            <strong>
                                ${booking.time || "-"}
                            </strong>

                        </div>

                    </div>


                </div>


                <!-- FOOTER -->

                <div class="booking-card-footer">

                    <span>

                        <i class="fa-solid fa-circle-check"></i>

                        Booking Confirmed

                    </span>

                </div>


            </div>

        </div>

    `;

}
window.showMyBookings = showMyBookings;