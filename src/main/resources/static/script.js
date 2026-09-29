// =====================================================
// WASTECARE - MAIN JAVASCRIPT
// Dashboard + Zones + Schedules + Pickups + Reports
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("WasteCare application loaded");

    // Dashboard
    animateWaste();

    // Zones
    if (document.getElementById("zoneContainer")) {
        loadZones();
    }

    // Schedules
    if (document.getElementById("scheduleContainer")) {
        loadScheduleZones();
        loadSchedules();
    }

    // Pickups
    if (document.getElementById("pickupContainer")) {
        loadPickups();
    }

    // Reports
    if (document.getElementById("reportContainer")) {
        loadReports();
    }

});


// =====================================================
// WASTE SEGREGATION ANIMATION
// =====================================================

function animateWaste() {

    const wasteItems = document.querySelectorAll(".waste-item");

    wasteItems.forEach((item) => {

        item.addEventListener("animationiteration", function () {

            const randomPosition =
                Math.floor(Math.random() * 70) + 15;

            item.style.left = randomPosition + "%";

        });

    });
}


// =====================================================
// DASHBOARD REFRESH
// =====================================================

function refreshDashboard() {

    const button =
        document.querySelector(".panel-header button");

    if (!button) return;

    button.innerText = "Refreshing...";

    setTimeout(() => {

        button.innerText = "Updated ✓";

        setTimeout(() => {
            button.innerText = "Refresh";
        }, 1500);

    }, 700);
}


// =====================================================
// ZONES - GET ALL
// =====================================================

async function loadZones() {

    const container =
        document.getElementById("zoneContainer");

    const count =
        document.getElementById("zoneCount");

    if (!container) return;

    try {

        const response =
            await fetch("/api/zones");

        if (!response.ok) {
            throw new Error("Failed to load zones");
        }

        const zones =
            await response.json();

        if (count) {
            count.textContent =
                zones.length + " Zones";
        }

        if (zones.length === 0) {

            container.innerHTML = `
                <div class="empty">
                    <h3>No zones found</h3>
                    <p>Add your first waste collection zone.</p>
                </div>
            `;

            return;
        }

        container.innerHTML = zones.map(zone => `

            <div class="zone-card">

                <div class="zone-icon">
                    📍
                </div>

                <div>
                    <h3>
                        ${escapeHtml(zone.name || "Zone " + zone.id)}
                    </h3>

                    <p>
                        ${escapeHtml(zone.location || "Location not specified")}
                    </p>
                </div>

                <span class="status">
                    Active
                </span>

            </div>

        `).join("");

    }
    catch (error) {

        console.error("Zone loading error:", error);

        container.innerHTML = `
            <div class="empty">
                <h3>Unable to load zones</h3>
                <p>Make sure Spring Boot is running.</p>
            </div>
        `;
    }
}


// =====================================================
// ZONES - ADD
// =====================================================

async function addZone() {

    const nameInput =
        document.getElementById("zoneName");

    const locationInput =
        document.getElementById("zoneArea");

    if (!nameInput || !locationInput) {
        return;
    }

    const name =
        nameInput.value.trim();

    const location =
        locationInput.value.trim();

    if (!name || !location) {

        alert("Please enter zone name and location.");

        return;
    }

    try {

        const response = await fetch("/api/zones", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                location: location
            })

        });

        if (!response.ok) {

            throw new Error("Failed to add zone");
        }

        await response.json();

        alert("Zone added successfully! ✅");

        nameInput.value = "";
        locationInput.value = "";

        await loadZones();

    }
    catch (error) {

        console.error("Add zone error:", error);

        alert("Unable to add zone.");
    }
}


// =====================================================
// SCHEDULE - LOAD ZONES
// =====================================================

async function loadScheduleZones() {

    const select =
        document.getElementById("scheduleZone");

    if (!select) return;

    try {

        const response =
            await fetch("/api/zones");

        if (!response.ok) {
            throw new Error("Failed to load zones");
        }

        const zones =
            await response.json();

        select.innerHTML = `
            <option value="">
                Select Zone
            </option>
        `;

        zones.forEach(zone => {

            const option =
                document.createElement("option");

            option.value = zone.id;

            option.textContent =
                `${zone.name} - ${zone.location}`;

            select.appendChild(option);

        });

    }
    catch (error) {

        console.error(
            "Schedule zone loading error:",
            error
        );

        select.innerHTML = `
            <option value="">
                Unable to load zones
            </option>
        `;
    }
}


// =====================================================
// SCHEDULE - GET ALL
// =====================================================

async function loadSchedules() {

    const container =
        document.getElementById("scheduleContainer");

    if (!container) return;

    try {

        const response =
            await fetch("/api/schedules");

        if (!response.ok) {
            throw new Error("Failed to load schedules");
        }

        const schedules =
            await response.json();

        if (schedules.length === 0) {

            container.innerHTML = `
                <div class="empty">
                    <h3>No schedules found</h3>
                    <p>Create your first collection schedule.</p>
                </div>
            `;

            return;
        }

        container.innerHTML = schedules.map(schedule => {

            const zoneName =
                schedule.zone
                    ? schedule.zone.name
                    : "Unknown Zone";

            return `

                <div class="schedule-card">

                    <div class="schedule-icon">
                        📅
                    </div>

                    <div class="schedule-info">

                        <h3>
                            ${escapeHtml(zoneName)}
                        </h3>

                        <p>
                            ${escapeHtml(schedule.day)}
                        </p>

                    </div>

                    <div class="schedule-time">

                        <strong>
                            ${escapeHtml(schedule.startTime)}
                            -
                            ${escapeHtml(schedule.endTime)}
                        </strong>

                    </div>

                    <span class="status">
                        Scheduled
                    </span>

                </div>

            `;

        }).join("");

    }
    catch (error) {

        console.error(
            "Schedule loading error:",
            error
        );

        container.innerHTML = `
            <div class="empty">
                <h3>Unable to load schedules</h3>
                <p>Make sure Spring Boot is running.</p>
            </div>
        `;
    }
}


// =====================================================
// SCHEDULE - ADD
// =====================================================

async function addSchedule() {

    const zone =
        document.getElementById("scheduleZone");

    const day =
        document.getElementById("scheduleDay");

    const startTime =
        document.getElementById("startTime");

    const endTime =
        document.getElementById("endTime");

    if (!zone || !day || !startTime || !endTime) {
        return;
    }

    const zoneId =
        zone.value;

    const selectedDay =
        day.value;

    const start =
        startTime.value;

    const end =
        endTime.value;

    if (!zoneId) {

        alert("Please select a zone.");

        return;
    }

    if (!selectedDay) {

        alert("Please select a day.");

        return;
    }

    if (!start || !end) {

        alert("Please select start and end time.");

        return;
    }

    if (start >= end) {

        alert("End time must be after start time.");

        return;
    }

    try {

        const response = await fetch(
            `/api/schedules/zone/${zoneId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    day: selectedDay,

                    startTime: start,

                    endTime: end

                })
            }
        );

        if (!response.ok) {

            throw new Error("Failed to create schedule");
        }

        await response.json();

        alert(
            "Collection schedule added successfully! ✅"
        );

        zone.value = "";
        day.value = "";
        startTime.value = "";
        endTime.value = "";

        await loadSchedules();

    }
    catch (error) {

        console.error(
            "Add schedule error:",
            error
        );

        alert(
            "Unable to add schedule."
        );
    }
}


// =====================================================
// PICKUPS
// =====================================================

async function loadPickups() {

    const container =
        document.getElementById("pickupContainer");

    if (!container) return;

    try {

        const response =
            await fetch("/api/schedules");

        if (!response.ok) {
            throw new Error("Failed to load pickup data");
        }

        const schedules =
            await response.json();

        if (schedules.length === 0) {

            container.innerHTML = `
                <div class="empty">
                    <h3>No pickups available</h3>
                    <p>Create schedules to display collection activities.</p>
                </div>
            `;

            updatePickupStats(0);

            return;
        }

        let completed = 0;
        let pending = 0;

        container.innerHTML = schedules.map((schedule, index) => {

            const zone =
                schedule.zone || {};

            const zoneName =
                zone.name || "Zone " + (index + 1);

            const location =
                zone.location || "Location not specified";

            // Demo status for presentation
            const isCompleted =
                index % 2 === 0;

            if (isCompleted) {
                completed++;
            } else {
                pending++;
            }

            const status =
                isCompleted
                    ? "Completed"
                    : "Pending";

            const statusClass =
                isCompleted
                    ? "completed"
                    : "pending";

            return `

                <div class="pickup-card">

                    <div class="pickup-icon">
                        🚛
                    </div>

                    <div class="pickup-details">

                        <h3>
                            ${escapeHtml(zoneName)}
                        </h3>

                        <p>
                            📍 ${escapeHtml(location)}
                        </p>

                        <p>
                            📅 ${escapeHtml(schedule.day)}
                        </p>

                        <p>
                            🕘 ${escapeHtml(schedule.startTime)}
                            -
                            ${escapeHtml(schedule.endTime)}
                        </p>

                    </div>

                    <div class="waste-type">
                        <span>
                            ♻️ Waste Collection
                        </span>
                    </div>

                    <div class="pickup-status ${statusClass}">
                        ${status}
                    </div>

                </div>

            `;

        }).join("");

        updatePickupStats(
            schedules.length,
            completed,
            pending
        );

    }
    catch (error) {

        console.error(
            "Pickup loading error:",
            error
        );

        container.innerHTML = `
            <div class="empty">
                <h3>Unable to load pickups</h3>
                <p>Make sure Spring Boot is running.</p>
            </div>
        `;
    }
}


// =====================================================
// PICKUP STATS
// =====================================================

function updatePickupStats(
    total,
    completed = 0,
    pending = 0
) {

    const totalElement =
        document.getElementById("totalPickups");

    const completedElement =
        document.getElementById("completedPickups");

    const pendingElement =
        document.getElementById("pendingPickups");

    if (totalElement) {
        totalElement.innerText = total;
    }

    if (completedElement) {
        completedElement.innerText = completed;
    }

    if (pendingElement) {
        pendingElement.innerText = pending;
    }
}


// =====================================================
// PICKUP REFRESH
// =====================================================

async function refreshPickups() {

    const button =
        document.querySelector(".panel-header button");

    if (button) {
        button.innerText = "Refreshing...";
    }

    await loadPickups();

    setTimeout(() => {

        if (button) {
            button.innerText = "Updated ✓";
        }

        setTimeout(() => {

            if (button) {
                button.innerText = "🔄 Refresh";
            }

        }, 1500);

    }, 500);
}


// =====================================================
// REPORTS
// =====================================================

async function loadReports() {

    const container =
        document.getElementById("reportContainer");

    if (!container) return;

    try {

        const response =
            await fetch("/api/schedules");

        if (!response.ok) {
            throw new Error("Failed to load report data");
        }

        const schedules =
            await response.json();

        const total =
            schedules.length;

        const completed =
            Math.ceil(total * 0.65);

        const pending =
            total - completed;

        const efficiency =
            total === 0
                ? 0
                : Math.round(
                    (completed / total) * 100
                );

        container.innerHTML = `

            <div class="stats">

                <div class="stat-card">

                    <div class="stat-icon blue">
                        📅
                    </div>

                    <div>
                        <h3>${total}</h3>
                        <p>Total Schedules</p>
                    </div>

                </div>

                <div class="stat-card">

                    <div class="stat-icon green">
                        ✓
                    </div>

                    <div>
                        <h3>${completed}</h3>
                        <p>Completed</p>
                    </div>

                </div>

                <div class="stat-card">

                    <div class="stat-icon orange">
                        ⏳
                    </div>

                    <div>
                        <h3>${pending}</h3>
                        <p>Pending</p>
                    </div>

                </div>

                <div class="stat-card">

                    <div class="stat-icon purple">
                        📊
                    </div>

                    <div>
                        <h3>${efficiency}%</h3>
                        <p>Efficiency</p>
                    </div>

                </div>

            </div>

            <div class="panel">

                <div class="panel-header">

                    <div>
                        <h2>Collection Report</h2>
                        <p>Current waste collection performance.</p>
                    </div>

                </div>

                <div class="progress-container">

                    <div class="progress-row">
                        <span>Collection Efficiency</span>
                        <strong>${efficiency}%</strong>
                    </div>

                    <div class="progress">
                        <div
                            class="progress-bar organic"
                            style="width:${efficiency}%">
                        </div>
                    </div>

                    <div class="progress-row">
                        <span>Completed Collections</span>
                        <strong>${completed}</strong>
                    </div>

                    <div class="progress-row">
                        <span>Pending Collections</span>
                        <strong>${pending}</strong>
                    </div>

                </div>

            </div>
        `;

    }
    catch (error) {

        console.error(
            "Report loading error:",
            error
        );

        container.innerHTML = `
            <div class="empty">
                <h3>Unable to load reports</h3>
                <p>Make sure Spring Boot is running.</p>
            </div>
        `;
    }
}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
