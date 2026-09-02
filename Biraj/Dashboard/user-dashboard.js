
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

    item.addEventListener("click", function () {

        navItems.forEach((nav) => {
            nav.classList.remove("active");
        });

        this.classList.add("active");

        /* -----------------------------------------
           CLOSE MOBILE SIDEBAR
        ----------------------------------------- */

        if (window.innerWidth <= 750 && sidebar) {

            sidebar.classList.remove("open");

        }

        /*
         IMPORTANT:

         No event.preventDefault() here.

         The <a href=""> element will now
         perform normal page navigation.
        */

    });

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
