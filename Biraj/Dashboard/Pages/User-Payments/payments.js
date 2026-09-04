/* =========================================================
   PAYMENTS - table data + filters + delete payment
   (sidebar/topbar/notifications handled by user-dashboard.js)
========================================================= */

const SEED_PAYMENTS = [
    { id: "BK-2026-00142", token: "A-42", centre: "Krishnanagar Centre", date: "16 May 2026 10:00 AM", iso: "2026-05-16", amount: 4400, type: "Bank Transfer", status: "Paid",    txn: "TXN1234567890" },
    { id: "BK-2026-00110", token: "A-38", centre: "Krishnanagar Centre", date: "10 May 2026 09:00 AM", iso: "2026-05-10", amount: 4200, type: "UPI",           status: "Paid",    txn: "TXN1234567888" },
    { id: "BK-2026-00098", token: "A-21", centre: "Ranaghat Centre",     date: "02 May 2026 11:00 AM", iso: "2026-05-02", amount: 3800, type: "UPI",           status: "Paid",    txn: "TXN1234567880" },
    { id: "BK-2026-00087", token: "A-15", centre: "Santipur Centre",     date: "28 Apr 2026 02:00 PM", iso: "2026-04-28", amount: 4000, type: "Bank Transfer", status: "Paid",    txn: "TXN1234567870" },
    { id: "BK-2026-00155", token: "B-07", centre: "Bardhaman Centre",    date: "18 May 2026 11:00 AM", iso: "2026-05-18", amount: 4400, type: "Cash",          status: "Pending", txn: "-" },
    { id: "BK-2026-00163", token: "B-12", centre: "Krishnanagar Centre", date: "20 May 2026 09:30 AM", iso: "2026-05-20", amount: 4400, type: "UPI",           status: "Failed",   txn: "TXN1234567999" },
    { id: "BK-2026-00075", token: "A-09", centre: "Ranaghat Centre",     date: "22 Apr 2026 10:00 AM", iso: "2026-04-22", amount: 3450, type: "Bank Transfer", status: "Paid",    txn: "TXN1234567866" }
];

const PAYMENTS_KEY = "ruralProcure_payments";

/* ---------- load / save (deletes survive refresh) ---------- */
let payments = loadPayments();

function loadPayments() {
    try {
        const stored = JSON.parse(localStorage.getItem(PAYMENTS_KEY));
        if (Array.isArray(stored) && stored.length) return stored;
    } catch (e) { /* fall through to seed */ }
    return SEED_PAYMENTS.slice();
}

function savePayments() {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
}

/* ---------- helpers ---------- */
const money = n => "₹" + n.toLocaleString("en-IN");

const tbody = document.getElementById("paymentsBody");
const info  = document.getElementById("tableInfo");

function badgeClass(status) {
    return status === "Paid" ? "badge-paid"
         : status === "Pending" ? "badge-pending"
         : "badge-failed";
}

function actionIcon(status) {
    return status === "Pending"
        ? '<i class="fa-regular fa-file-lines"></i>'
        : '<i class="fa-regular fa-eye"></i>';
}

/* ---------- render ---------- */
function render(list) {
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#999;padding:28px">No payments found</td></tr>';
        info.textContent = "Showing 0 of 0 entries";
        return;
    }

    tbody.innerHTML = list.map(p => `
        <tr>
            <td class="book-id">${p.id}</td>
            <td class="token">${p.token}</td>
            <td>${p.centre}</td>
            <td>${p.date}</td>
            <td>${money(p.amount)}</td>
            <td>${p.type}</td>
            <td><span class="badge ${badgeClass(p.status)}">${p.status}</span></td>
            <td>${p.txn}</td>
            <td class="pay-actions">
                <button class="pay-action" data-action="view" data-id="${p.id}" type="button" title="View details">${actionIcon(p.status)}</button>
                <button class="pay-action pay-action-delete" data-action="delete" data-id="${p.id}" type="button" title="Delete payment">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        </tr>`).join("");

    info.textContent = `Showing 1 to ${list.length} of ${list.length} entries`;
}

/* ---------- stats ---------- */
function updateStats() {
    const total   = payments.reduce((s, p) => s + p.amount, 0);
    const paid    = payments.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
    const pending = payments.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0);

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    set("totalPayments",      money(total));
    set("paidAmount",         money(paid));
    set("pendingAmount",      money(pending));
    set("totalTransactions",  payments.length);
}

/* ---------- delete ---------- */
function deletePayment(id) {
    if (!confirm("Delete this payment record?")) return;

    payments = payments.filter(p => p.id !== id);
    savePayments();
    updateStats();
    applyFilters();   /* re-render with current filters */
}

function viewPayment(id) {
    const p = payments.find(x => x.id === id);
    if (!p) return;

    alert(
        "Payment Details\n\n" +
        "Booking ID:   " + p.id + "\n" +
        "Token:        " + p.token + "\n" +
        "Centre:       " + p.centre + "\n" +
        "Date:         " + p.date + "\n" +
        "Amount:       " + money(p.amount) + "\n" +
        "Type:         " + p.type + "\n" +
        "Status:       " + p.status + "\n" +
        "Txn ID:       " + p.txn
    );
}

/* ---------- event delegation (one listener for all rows) ---------- */
tbody.addEventListener("click", (e) => {
    const btn = e.target.closest(".pay-action");
    if (!btn) return;

    const id = btn.dataset.id;
    if (btn.dataset.action === "delete") {
        deletePayment(id);
    } else if (btn.dataset.action === "view") {
        viewPayment(id);
    }
});

/* ---------- filters ---------- */
function applyFilters() {
    const q = document.getElementById("searchInput").value.trim().toLowerCase();
    const status = document.getElementById("statusFilter").value;
    const type   = document.getElementById("typeFilter").value;
    const from   = document.getElementById("fromDate").value;
    const to     = document.getElementById("toDate").value;

    const filtered = payments.filter(p => {
        const matchesSearch = !q ||
            p.id.toLowerCase().includes(q) || p.token.toLowerCase().includes(q) ||
            p.centre.toLowerCase().includes(q) || p.txn.toLowerCase().includes(q);
        const matchesStatus = status === "all" || p.status === status;
        const matchesType   = type === "all" || p.type === type;
        const matchesDate   = (!from || p.iso >= from) && (!to || p.iso <= to);
        return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    render(filtered);
}

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("statusFilter").addEventListener("change", applyFilters);
document.getElementById("typeFilter").addEventListener("change", applyFilters);
document.getElementById("fromDate").addEventListener("change", applyFilters);
document.getElementById("toDate").addEventListener("change", applyFilters);
document.getElementById("clearFilters").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("statusFilter").value = "all";
    document.getElementById("typeFilter").value = "all";
    document.getElementById("fromDate").value = "2026-04-22";
    document.getElementById("toDate").value = "2026-05-21";
    applyFilters();
});

/* ---------- kickoff ---------- */
updateStats();
applyFilters();
