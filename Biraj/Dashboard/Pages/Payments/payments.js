/* =========================================================
   PAYMENTS - table data + filters
   (sidebar/topbar/notifications handled by user-dashboard.js)
========================================================= */

const payments = [
    { id: "BK-2026-00142", token: "A-42", centre: "Krishnanagar Centre", date: "16 May 2026 10:00 AM", iso: "2026-05-16", amount: 4400, type: "Bank Transfer", status: "Paid",    txn: "TXN1234567890" },
    { id: "BK-2026-00110", token: "A-38", centre: "Krishnanagar Centre", date: "10 May 2026 09:00 AM", iso: "2026-05-10", amount: 4200, type: "UPI",           status: "Paid",    txn: "TXN1234567888" },
    { id: "BK-2026-00098", token: "A-21", centre: "Ranaghat Centre",     date: "02 May 2026 11:00 AM", iso: "2026-05-02", amount: 3800, type: "UPI",           status: "Paid",    txn: "TXN1234567880" },
    { id: "BK-2026-00087", token: "A-15", centre: "Santipur Centre",     date: "28 Apr 2026 02:00 PM", iso: "2026-04-28", amount: 4000, type: "Bank Transfer", status: "Paid",    txn: "TXN1234567870" },
    { id: "BK-2026-00155", token: "B-07", centre: "Bardhaman Centre",    date: "18 May 2026 11:00 AM", iso: "2026-05-18", amount: 4400, type: "Cash",          status: "Pending", txn: "-" },
    { id: "BK-2026-00163", token: "B-12", centre: "Krishnanagar Centre", date: "20 May 2026 09:30 AM", iso: "2026-05-20", amount: 4400, type: "UPI",           status: "Failed",   txn: "TXN1234567999" },
    { id: "BK-2026-00075", token: "A-09", centre: "Ranaghat Centre",     date: "22 Apr 2026 10:00 AM", iso: "2026-04-22", amount: 3450, type: "Bank Transfer", status: "Paid",    txn: "TXN1234567866" }
];

const money = n => "₹" + n.toLocaleString("en-IN");
const tbody = document.getElementById("paymentsBody");
const info = document.getElementById("tableInfo");

function badgeClass(status) {
    return status === "Paid" ? "badge-paid" : status === "Pending" ? "badge-pending" : "badge-failed";
}
function actionIcon(status) {
    return status === "Pending"
        ? '<i class="fa-regular fa-file-lines"></i>'
        : '<i class="fa-regular fa-eye"></i>';
}

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
            <td><button class="pay-action" type="button" title="View details">${actionIcon(p.status)}</button></td>
        </tr>`).join("");
    info.textContent = `Showing 1 to ${list.length} of ${list.length} entries`;
}

function applyFilters() {
    const q = document.getElementById("searchInput").value.trim().toLowerCase();
    const status = document.getElementById("statusFilter").value;
    const type = document.getElementById("typeFilter").value;
    const from = document.getElementById("fromDate").value;
    const to = document.getElementById("toDate").value;

    const filtered = payments.filter(p => {
        const matchesSearch = !q ||
            p.id.toLowerCase().includes(q) || p.token.toLowerCase().includes(q) ||
            p.centre.toLowerCase().includes(q) || p.txn.toLowerCase().includes(q);
        const matchesStatus = status === "all" || p.status === status;
        const matchesType = type === "all" || p.type === type;
        const matchesDate = (!from || p.iso >= from) && (!to || p.iso <= to);
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

applyFilters();
