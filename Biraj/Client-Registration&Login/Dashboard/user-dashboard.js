/* ================= SIDEBAR ================= */

const sidebar = document.getElementById("sidebar");

const menuBtn = document.getElementById("menuBtn");


menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});



/* ================= USER DROPDOWN ================= */

const userBtn = document.getElementById("userBtn");

const userMenu = document.getElementById("userMenu");


userBtn.addEventListener("click", (event) => {

    event.stopPropagation();

    userMenu.classList.toggle("show");

});


document.addEventListener("click", () => {

    userMenu.classList.remove("show");

});



/* ================= NAVIGATION ================= */

const navItems = document.querySelectorAll(".nav-item");


navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(nav => {

            nav.classList.remove("active");

        });


        item.classList.add("active");


        showToast(
            item.innerText.trim() + " selected"
        );


        /* Close mobile sidebar */

        if (window.innerWidth <= 800) {

            sidebar.classList.remove("open");

        }

    });

});



/* ================= BOOKING TABS ================= */

const tabs = document.querySelectorAll(".tab");


tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        const parent = tab.parentElement;


        parent
            .querySelectorAll(".tab")
            .forEach(button => {

                button.classList.remove("active");

            });


        tab.classList.add("active");


        showToast(
            tab.innerText + " bookings"
        );

    });

});



/* ================= BUTTONS ================= */

const buttons =
    document.querySelectorAll(".primary, .outline");


buttons.forEach(button => {

    button.addEventListener("click", () => {

        /*
        Ignore tab buttons because
        they have their own event.
        */

        if (!button.classList.contains("tab")) {

            showToast(
                button.innerText.trim() + " clicked"
            );

        }

    });

});



/* ================= NOTIFICATION ================= */

const notifyBtn =
    document.getElementById("notifyBtn");


notifyBtn.addEventListener("click", () => {

    showToast(
        "You have 3 new notifications"
    );

});



/* ================= TOAST ================= */

const toast =
    document.getElementById("toast");


function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(window.toastTimer);


    window.toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 1800);

}