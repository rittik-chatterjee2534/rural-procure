/* =========================================================
   MY BOOKINGS - render list + Download PDF receipt
========================================================= */

const BOOKINGS_KEY = "ruralProcure_bookings";

const FARMER = {
    name: "Ramesh Kumar",
    mobile: "98XXXXXX10"
};

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

function formatDate(isoString) {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

/* ---------------- create one booking card ---------------- */
function createBookingCard(booking) {
    const card = document.createElement("article");
    card.className = "book-card";

    /* head */
    const head = document.createElement("div");
    head.className = "book-card-head";

    const icon = document.createElement("div");
    icon.className = "book-crop-icon";
    icon.innerHTML = '<i class="fa-solid fa-seedling"></i>';

    const info = document.createElement("div");
    info.className = "book-card-info";

    const status = document.createElement("span");
    status.className = "book-status";
    status.textContent = booking.status || "Confirmed";

    const centre = document.createElement("h3");
    centre.textContent = booking.centre || "Procurement Centre";

    const location = document.createElement("p");
    location.className = "book-location";
    location.textContent = booking.location || "";

    info.append(status, centre, location);

    const token = document.createElement("div");
    token.className = "book-token";
    token.textContent = booking.token || "—";

    head.append(icon, info, token);

    /* meta */
    const meta = document.createElement("div");
    meta.className = "book-meta";

    const makeRow = (iconClass, text) => {
        const row = document.createElement("span");
        const i = document.createElement("i");
        i.className = iconClass;
        row.appendChild(i);
        row.appendChild(document.createTextNode(text));
        return row;
    };

    meta.appendChild(makeRow("fa-solid fa-seedling",
        (booking.produce || "—") + " · " + (booking.quantity || 0) + " Quintal"));
    meta.appendChild(makeRow("fa-regular fa-calendar", booking.date || ""));
    meta.appendChild(makeRow("fa-regular fa-clock", booking.time || ""));

    /* foot: booking id + download button */
    const foot = document.createElement("div");
    foot.className = "book-card-foot";

    const small = document.createElement("small");
    const idText = "Booking ID: " + (booking.id || "—");
    const bookedOn = booking.createdAt ? "  ·  " + formatDate(booking.createdAt) : "";
    small.textContent = idText + bookedOn;

    const actions = document.createElement("div");
    actions.className = "book-actions";

    const dlBtn = document.createElement("button");
    dlBtn.type = "button";
    dlBtn.className = "download-btn";
    dlBtn.innerHTML = '<i class="fa-solid fa-file-arrow-down"></i> Download PDF';
    dlBtn.addEventListener("click", () => downloadBookingPdf(booking.id));

    actions.appendChild(dlBtn);
    foot.append(small, actions);

    card.append(head, meta, foot);
    return card;
}

/* ---------------- render list or empty state ---------------- */
function renderBookings() {
    const bookings = getBookings().sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const list = document.getElementById("bookingsList");
    const empty = document.getElementById("emptyState");
    const toolbar = document.getElementById("bookingsToolbar");
    const count = document.getElementById("bookingsCount");
    const subtitle = document.getElementById("bookingsSubtitle");

    if (bookings.length === 0) {
        list.innerHTML = "";
        list.style.display = "none";
        if (empty) empty.style.display = "flex";
        if (toolbar) toolbar.style.display = "none";
        if (subtitle) subtitle.textContent = "No bookings yet — book your first slot";
        return;
    }

    list.innerHTML = "";
    bookings.forEach(b => list.appendChild(createBookingCard(b)));

    list.style.display = "grid";
    if (empty) empty.style.display = "none";
    if (toolbar) toolbar.style.display = "flex";
    if (subtitle) subtitle.textContent = "All your booked procurement slots";
    if (count) {
        count.textContent = bookings.length +
            (bookings.length === 1 ? " booking" : " bookings");
    }
}

/* ---------------- Download PDF (jsPDF) ---------------- */
function ensureJspdf(callback) {
    if (window.jspdf) { callback(); return; }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => callback();
    script.onerror = () => alert("Could not load the PDF library. Please check your internet connection.");
    document.head.appendChild(script);
}

function downloadBookingPdf(id) {
    const booking = getBookings().find(b => b.id === id);
    if (!booking) { alert("Booking not found."); return; }

    ensureJspdf(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", "a4");
        const W = 210;

        const GREEN = [39, 139, 50];
        const DARK = [7, 95, 27];
        const GREY = [110, 110, 110];

        /* ---- header band ---- */
        doc.setFillColor(...GREEN);
        doc.rect(0, 0, W, 40, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("RuralProcure", 14, 18);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Farmer Portal  |  Better Price. Better Future.", 14, 26);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("SLOT BOOKING RECEIPT", W - 14, 18, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Booking " + (booking.status || "Confirmed"), W - 14, 26, { align: "right" });

        /* ---- body: title + token ---- */
        doc.setTextColor(...DARK);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("Procurement Slot Booking", 14, 58);

        doc.setFontSize(9);
        doc.setTextColor(...GREY);
        doc.text("KEEP THIS RECEIPT SAFE - SHOW IT AT THE PROCUREMENT CENTRE", 14, 64);

        /* token box */
        doc.setDrawColor(...GREEN);
        doc.setLineWidth(0.6);
        doc.roundedRect(14, 72, 74, 30, 3, 3);
        doc.setFontSize(8);
        doc.setTextColor(...GREY);
        doc.text("TOKEN NUMBER", 51, 80, { align: "center" });
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(...GREEN);
        doc.text(booking.token || "—", 51, 96, { align: "center" });

        /* ---- detail rows ---- */
        const rows = [
            ["Booking ID", booking.id || "—"],
            ["Procurement Centre", booking.centre || "—"],
            ["Centre Location", booking.location || "—"],
            ["Produce", booking.produce + "  (" + (booking.quantity || 0) + " Quintal)"],
            ["Slot Date", booking.date || "—"],
            ["Slot Time", booking.time || "—"],
            ["Farmer Name", FARMER.name],
            ["Mobile Number", FARMER.mobile],
            ["Booking Status", booking.status || "Confirmed"]
        ];

        let y = 118;
        doc.setFont("helvetica", "normal");
        rows.forEach(([label, value], index) => {
            if (index % 2 === 1) {
                doc.setFillColor(244, 249, 245);
                doc.rect(14, y - 5.5, W - 28, 8.5, "F");
            }
            doc.setFontSize(9.5);
            doc.setTextColor(...GREY);
            doc.text(label, 18, y);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(30, 30, 30);
            doc.text(String(value), W - 18, y, { align: "right" });
            y += 9;
        });

        /* ---- note box ---- */
        y += 6;
        doc.setDrawColor(...GREEN);
        doc.setLineWidth(0.4);
        doc.roundedRect(14, y, W - 28, 26, 3, 3);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...DARK);
        doc.text("Important", 20, y + 8);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...GREY);
        doc.text("• Arrive 15 minutes before your slot time.", 20, y + 15);
        doc.text("• Carry a valid ID proof and your produce in clean bags.", 20, y + 21);

        /* ---- footer ---- */
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Generated by RuralProcure Farmer Portal", W / 2, 290, { align: "center" });

        doc.save("RuralProcure_Booking_" + (booking.token || "") + ".pdf");
    });
}

/* ---------------- clear all (demo helper) ---------------- */
document.getElementById("clearAllBtn")?.addEventListener("click", () => {
    saveBookings([]);
    renderBookings();
});

/* ---------------- kickoff ---------------- */
renderBookings();
