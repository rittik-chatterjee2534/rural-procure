/* =========================================
   SIDEBAR
========================================= */

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});


/* =========================================
   SIDEBAR NAVIGATION
========================================= */

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {

    item.addEventListener("click", function (event) {

        event.preventDefault();

        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        this.classList.add("active");

        // Close mobile sidebar
        if (window.innerWidth <= 750) {
            sidebar.classList.remove("open");
        }

    });

});


/* =========================================
   PROFILE DROPDOWN
========================================= */

const profileButton =
    document.getElementById("profileButton");

const profileDropdown =
    document.getElementById("profileDropdown");


profileButton.addEventListener("click", (event) => {

    event.stopPropagation();

    profileDropdown.classList.toggle("show");

});


document.addEventListener("click", () => {

    profileDropdown.classList.remove("show");

});


/* =========================================
   NOTIFICATION DROPDOWN
========================================= */

const notificationButton =
    document.getElementById("notificationButton");

const notificationDropdown =
    document.getElementById("notificationDropdown");

const markAllRead =
    document.getElementById("markAllRead");

const viewAllNotifications =
    document.getElementById("viewAllNotifications");


/* Open / Close Notification Dropdown */

notificationButton.addEventListener("click", (event) => {

    event.stopPropagation();

    notificationDropdown.classList.toggle("show");

    // Close profile dropdown
    profileDropdown.classList.remove("show");

});


/* Prevent dropdown from closing when clicking inside */

notificationDropdown.addEventListener("click", (event) => {

    event.stopPropagation();

});


/* Mark all notifications as read */

markAllRead.addEventListener("click", () => {

    const notifications =
        document.querySelectorAll(".notification-item");

    notifications.forEach(notification => {

        notification.classList.remove("unread");

        notification.classList.add("read");

    });


    // Remove notification badge
    const badge =
        document.querySelector(".notification-count");

    badge.style.display = "none";


    // Change header text
    const headerText =
        document.querySelector(".notification-header span");

    headerText.textContent = "You're all caught up";

});


/* Individual notification click */

const notificationItems =
    document.querySelectorAll(".notification-item");


notificationItems.forEach(notification => {

    notification.addEventListener("click", () => {

        notification.classList.remove("unread");

        notification.classList.add("read");

        updateNotificationCount();

    });

});


/* Update notification count */

function updateNotificationCount() {

    const unread =
        document.querySelectorAll(
            ".notification-item.unread"
        ).length;


    const badge =
        document.querySelector(".notification-count");


    const headerText =
        document.querySelector(
            ".notification-header span"
        );


    if (unread === 0) {

        badge.style.display = "none";

        headerText.textContent =
            "You're all caught up";

    } else {

        badge.style.display = "flex";

        badge.textContent = unread;

        headerText.textContent =
            unread + " new notifications";

    }

}


/* View All Notifications */

viewAllNotifications.addEventListener("click", () => {

    alert("Opening all notifications...");

});


/* Close dropdown when clicking outside */

document.addEventListener("click", () => {

    notificationDropdown.classList.remove("show");

});




/* =========================================
   VIEW BOOKING
========================================= */

const viewBooking =
    document.getElementById("viewBooking");

viewBooking.addEventListener("click", () => {

    alert(
        "Booking Details\n\n" +
        "Crop: Paddy\n" +
        "Token: A-42\n" +
        "Date: 15 Sep 2026\n" +
        "Time: 10:00 AM – 10:30 AM\n" +
        "Centre: Krishnanagar Procurement Centre"
    );

});


/* =========================================
   LIVE QUEUE
========================================= */

const viewQueue =
    document.getElementById("viewQueue");

const queueButton =
    document.getElementById("queueButton");


function showQueueMessage() {

    alert(
        "Live Queue\n\n" +
        "Your Token: A-42\n" +
        "Currently Serving: A-39\n" +
        "People Ahead: 2\n" +
        "Estimated Wait: ~15 min"
    );

}


viewQueue.addEventListener("click", showQueueMessage);

queueButton.addEventListener("click", showQueueMessage);


/* =========================================
   QUICK ACTIONS
========================================= */

const quickCards =
    document.querySelectorAll(".quick-card");


quickCards.forEach(card => {

    card.addEventListener("click", () => {

        const title =
            card.querySelector("h3").textContent;

        alert(title + " selected.");

    });

});


/* =========================================
   LIVE QUEUE SIMULATION
========================================= */

let peopleAhead = 2;

setInterval(() => {

    if (peopleAhead > 0) {

        // Randomly simulate queue movement
        if (Math.random() > 0.7) {

            peopleAhead--;

            const queueRows =
                document.querySelectorAll(".queue-row");

            if (queueRows.length >= 3) {

                queueRows[2]
                    .querySelector("strong")
                    .textContent = peopleAhead;

            }

        }

    }

}, 5000);


/* =========================================
   NOTIFICATION BADGE
========================================= */

let notifications = 3;

setTimeout(() => {

    const badge =
        document.querySelector(".notification-count");

    if (notifications === 0) {

        badge.style.display = "none";

    }

}, 1000);


/* =========================================
   RESPONSIVE SIDEBAR
========================================= */

window.addEventListener("resize", () => {

    if (window.innerWidth > 750) {

        sidebar.classList.remove("open");

    }

});
