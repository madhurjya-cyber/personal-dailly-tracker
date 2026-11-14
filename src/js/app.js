// ---------- Storage ----------

const SCORE_STORAGE_KEY = "dailyscore-data";
let dailyChart = null;
let selectedChartRange = "7";
const ACTIVITY_STORAGE_KEY = "dailyscore-activities";

function getTodayKey() {

    const date = new Date();

    return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
    );
}

let todayKey = getTodayKey();


// ---------- Storage Functions ----------

function loadScores() {
    const savedData = localStorage.getItem(SCORE_STORAGE_KEY);

    if (savedData === null) {
        return {};
    }

    return JSON.parse(savedData);
}

function saveScores(data) {
    localStorage.setItem(
        SCORE_STORAGE_KEY,
        JSON.stringify(data)
    );
}

function loadActivities() {
    const savedActivities =
        localStorage.getItem(ACTIVITY_STORAGE_KEY);

    if (savedActivities === null) {
        return [
            {
                id: "study",
                name: "Study",
                active: true
            },
            {
                id: "coding",
                name: "Coding",
                active: true
            },
            {
                id: "exercise",
                name: "Exercise",
                active: true
            },
            {
                id: "running",
                name: "Running",
                active: true
            },
            {
                id: "sleep",
                name: "Sleep",
                active: true
            },
            {
                id: "reading",
                name: "Reading",
                active: true
            },
            {
                id: "football",
                name: "Football",
                active: true
            },
            {
                id: "personal-routine",
                name: "Personal Routine",
                active: true
            }
        ];
    }

    return JSON.parse(savedActivities);
}

function saveActivities() {
    localStorage.setItem(
        ACTIVITY_STORAGE_KEY,
        JSON.stringify(activities)
    );
}


// ---------- Activities ----------

let activities = loadActivities();

const activityList =
    document.getElementById("activity-list");



function renderActivities() {

    // Clear existing activity rows
    activityList.innerHTML = "";

    const scores = loadScores();
    const todayScores = scores[todayKey] || {};

    activities
        .filter(function (activity) {
            return activity.active;
        })
        .forEach(function (activity) {

            const activityRow = document.createElement("div");
            activityRow.classList.add("activity-row");

            // Assign unique activity ID
            activityRow.dataset.activityId = activity.id;

            // Activity name
            const activityName = document.createElement("span");
            activityName.textContent = activity.name;
            activityName.classList.add("activity-name");

            // Checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("activity-checkbox");

            checkbox.checked = todayScores[activity.id] === true;

            // Apply completed styling
            if (checkbox.checked) {
                activityRow.classList.add("completed");
            }

            checkbox.addEventListener("change", function () {

                if (checkbox.checked) {
                    activityRow.classList.add("completed");
                } else {
                    activityRow.classList.remove("completed");
                }

                calculateDailyScore();
            });

            // Rename button
            const renameButton = document.createElement("button");
            renameButton.textContent = "Rename";
            renameButton.classList.add("rename-btn");

            renameButton.addEventListener("click", function () {

                const newName = prompt(
                    "Enter new activity name:",
                    activity.name
                );

                if (newName === null) return;

                const cleanedName = newName.trim();

                if (cleanedName === "") {
                    alert("Activity name cannot be empty.");
                    return;
                }

                activity.name = cleanedName;

                saveActivities();
                renderActivities();
                calculateDailyScore();
            });

            // Remove button
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.classList.add("remove-btn");

            removeButton.addEventListener("click", function () {

                const confirmed = confirm(
                    `Remove "${activity.name}" from your tracker?`
                );

                if (!confirmed) return;

                activity.active = false;

                saveActivities();
                renderActivities();
                calculateDailyScore();
            });

            // Assemble activity row
            activityRow.appendChild(checkbox);
            activityRow.appendChild(activityName);
            activityRow.appendChild(renameButton);
            activityRow.appendChild(removeButton);

            activityList.appendChild(activityRow);

        });
}




// ---------- Add Activity ----------

const addActivityButton =
    document.getElementById("add-activity-btn");

addActivityButton.addEventListener(
    "click",
    function () {

        const name =
            prompt("Enter activity name:");

        if (name === null) {
            return;
        }

        const cleanedName =
            name.trim();

        if (cleanedName === "") {
            alert("Activity name cannot be empty.");
            return;
        }

        const newActivity = {
            id: Date.now().toString(),
            name: cleanedName,
            active: true
        };

        activities.push(newActivity);

        saveActivities();

        renderActivities();

        calculateDailyScore();
    }
);


// ---------- Daily Score ----------




function calculateDailyScore() {
    const checkboxes = document.querySelectorAll(".activity-checkbox");
    let completedActivities = 0;
    const totalActivities = checkboxes.length;

    const scores = loadScores();

    if (!scores[todayKey]) {
        scores[todayKey] = {};
    }

    checkboxes.forEach(function (checkbox) {
        const activityId = checkbox.closest(".activity-row").dataset.activityId;
        const isCompleted = checkbox.checked;

        scores[todayKey][activityId] = isCompleted;

        if (isCompleted) {
            completedActivities++;
        }
    });

    saveScores(scores);

    const percentage = totalActivities > 0
        ? Math.round((completedActivities / totalActivities) * 100)
        : 0;

    document.getElementById("score").textContent = completedActivities;
    document.getElementById("max-score").textContent = totalActivities;
    document.getElementById("score-percentage").textContent = percentage + "%";

    const progressRing = document.getElementById("progress-ring");
    const ringPercentage = document.getElementById("ring-percentage");

    if (progressRing && ringPercentage) {
        const start = Number(progressRing.dataset.progress || 0);
        const end = percentage * 3.6;
        const duration = 800;
        const startTime = performance.now();

        function animateRing(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth ease-out movement
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            const current = start + (end - start) * easedProgress;

            progressRing.style.setProperty("--progress", current + "deg");

            if (progress < 1) {
                requestAnimationFrame(animateRing);
            } else {
                progressRing.dataset.progress = end;
            }
        }

        requestAnimationFrame(animateRing);
        ringPercentage.textContent = percentage + "%";
    }

    renderDailyChart();
}


// ---------- History ----------




// ---------- History ----------

function renderHistory() {

    const historyList =
        document.getElementById("history-list");

    const scores = loadScores();

    const dates = Object.keys(scores)
        .filter(date => date !== todayKey)
        .sort()
        .reverse();

    historyList.innerHTML = "";

    if (dates.length === 0) {
        historyList.innerHTML =
            "<p>No previous days recorded yet.</p>";
        return;
    }

    dates.forEach(function (date) {

        const dailyScores = scores[date];

        const activityValues = Object.values(dailyScores);

        const completed = activityValues.filter(
            value => value === true
        ).length;

        const total = activityValues.length;

        const percentage = total > 0
            ? Math.round((completed / total) * 100)
            : 0;

        // ---------- History Row ----------

        const row = document.createElement("div");
        row.classList.add("history-row");

        const dateElement = document.createElement("span");
        dateElement.classList.add("history-date");

        const dateObject = new Date(date + "T00:00:00");

        dateElement.textContent =
            dateObject.toLocaleDateString("en-IN", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric"
            });

        const scoreElement = document.createElement("span");
        scoreElement.classList.add("history-score");

        scoreElement.textContent =
            `${completed} / ${total} (${percentage}%)`;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("history-edit-btn");

        row.appendChild(dateElement);
        row.appendChild(scoreElement);
        row.appendChild(editButton);

        // ---------- Activity Details ----------

        const details = document.createElement("div");
        details.classList.add("history-details");
        details.style.display = "none";

        const editInputs = [];

        activities.forEach(function (activity) {

            if (!Object.prototype.hasOwnProperty.call(
                dailyScores, activity.id
            )) {
                return;
            }

            const detailRow = document.createElement("div");
            detailRow.classList.add("history-detail-row");

            const name = document.createElement("span");
            name.textContent = activity.name;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = dailyScores[activity.id] === true;
            checkbox.disabled = true;

            editInputs.push({
                id: activity.id,
                checkbox: checkbox
            });

            detailRow.appendChild(name);
            detailRow.appendChild(checkbox);

            details.appendChild(detailRow);

        });

        // ---------- Save and Cancel Buttons ----------

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.style.display = "none";

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.style.display = "none";

        details.appendChild(saveButton);
        details.appendChild(cancelButton);

        // ---------- Expand / Collapse ----------

        row.addEventListener("click", function (event) {

            if (event.target === editButton) {
                return;
            }

            details.style.display =
                details.style.display === "none"
                    ? "block"
                    : "none";

        });

        // ---------- Enter Edit Mode ----------

        editButton.addEventListener("click", function (event) {

            event.stopPropagation();

            details.style.display = "block";

            editInputs.forEach(function (item) {
                item.checkbox.disabled = false;
            });

            editButton.style.display = "none";
            saveButton.style.display = "inline-block";
            cancelButton.style.display = "inline-block";

        });

        // ---------- Save Historical Changes ----------

        saveButton.addEventListener("click", function () {

            editInputs.forEach(function (item) {

                dailyScores[item.id] =
                    item.checkbox.checked;

            });

            saveScores(scores);

            // Refresh all analytics
            renderHistory();
            renderWeeklySummary();
            renderMonthlySummary();
            renderDailyChart();

        });

        // ---------- Cancel Editing ----------

        cancelButton.addEventListener("click", function () {

            renderHistory();

        });

        historyList.appendChild(row);
        historyList.appendChild(details);

    });

}


// ---------- Weekly Summary ----------




function renderWeeklySummary() {

    const weeklySummary =
        document.getElementById("weekly-summary");

    const scores = loadScores();

    const today = new Date();

    // Find Monday of the current week
    const day = today.getDay();

    const difference = day === 0 ? 6 : day - 1;

    const monday = new Date(today);

    monday.setDate(today.getDate() - difference);
    monday.setHours(0, 0, 0, 0);

    // Find Sunday
    const sunday = new Date(monday);

    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    let totalCompleted = 0;
    let totalActivities = 0;
    let daysRecorded = 0;

    let bestDay = "N/A";
    let bestDayPercentage = -1;

    const dailyPercentages = [];

    Object.keys(scores).forEach(function (date) {

        const dateObject = new Date(date + "T00:00:00");

        if (dateObject < monday || dateObject > sunday) {
            return;
        }

        const dailyScores = scores[date];
        const activityValues = Object.values(dailyScores);

        const completed = activityValues.filter(
            value => value === true
        ).length;

        const maximum = activityValues.length;

        if (maximum === 0) return;

        const dayPercentage =
            Math.round((completed / maximum) * 100);

        totalCompleted += completed;
        totalActivities += maximum;

        daysRecorded++;

        dailyPercentages.push(dayPercentage);

        if (dayPercentage > bestDayPercentage) {

            bestDayPercentage = dayPercentage;

            bestDay = dateObject.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short"
            });

        }

    });

    const completion =
        totalActivities > 0
            ? Math.round((totalCompleted / totalActivities) * 100)
            : 0;

    const averagePerformance =
        dailyPercentages.length > 0
            ? Math.round(
                dailyPercentages.reduce(
                    (sum, value) => sum + value, 0
                ) / dailyPercentages.length
            )
            : 0;

    const startDate = monday.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
    });

    const endDate = sunday.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    weeklySummary.innerHTML = `

        <div class="weekly-row">
            <span>Week</span>
            <strong>${startDate} – ${endDate}</strong>
        </div>

        <div class="weekly-row">
            <span>Activities Completed</span>
            <strong>${totalCompleted} / ${totalActivities}</strong>
        </div>

        <div class="weekly-row">
            <span>Completion</span>
            <strong>${completion}%</strong>
        </div>

        <div class="weekly-row">
            <span>Days Recorded</span>
            <strong>${daysRecorded} / 7</strong>
        </div>

        <div class="weekly-row">
            <span>Average Performance</span>
            <strong>${averagePerformance}%</strong>
        </div>

        <div class="weekly-row">
            <span>Best Day</span>
            <strong>
                ${bestDay} (${bestDayPercentage < 0 ? 0 : bestDayPercentage}%)
            </strong>
        </div>

    `;

}

// ---------- Monthly Summary ----------



function renderMonthlySummary() {

    const monthlySummary =
        document.getElementById("monthly-summary");

    const scores = loadScores();

    const today = new Date();

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let totalCompleted = 0;
    let totalActivities = 0;
    let daysRecorded = 0;

    let bestDay = "N/A";
    let bestDayPercentage = -1;

    const dailyPercentages = [];

    Object.keys(scores).forEach(function (date) {

        const dateObject = new Date(date + "T00:00:00");

        if (
            dateObject.getMonth() !== currentMonth ||
            dateObject.getFullYear() !== currentYear
        ) {
            return;
        }

        const dailyScores = scores[date];
        const activityValues = Object.values(dailyScores);

        const completed = activityValues.filter(
            value => value === true
        ).length;

        const maximum = activityValues.length;

        if (maximum === 0) return;

        const dayPercentage =
            Math.round((completed / maximum) * 100);

        totalCompleted += completed;
        totalActivities += maximum;

        daysRecorded++;

        dailyPercentages.push(dayPercentage);

        if (dayPercentage > bestDayPercentage) {

            bestDayPercentage = dayPercentage;

            bestDay = dateObject.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short"
            });

        }

    });

    const completion =
        totalActivities > 0
            ? Math.round((totalCompleted / totalActivities) * 100)
            : 0;

    const averagePerformance =
        dailyPercentages.length > 0
            ? Math.round(
                dailyPercentages.reduce(
                    (sum, value) => sum + value, 0
                ) / dailyPercentages.length
            )
            : 0;

    const monthName = today.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });

    monthlySummary.innerHTML = `

        <div class="monthly-row">
            <span>Month</span>
            <strong>${monthName}</strong>
        </div>

        <div class="monthly-row">
            <span>Activities Completed</span>
            <strong>${totalCompleted} / ${totalActivities}</strong>
        </div>

        <div class="monthly-row">
            <span>Completion</span>
            <strong>${completion}%</strong>
        </div>

        <div class="monthly-row">
            <span>Days Recorded</span>
            <strong>${daysRecorded}</strong>
        </div>

        <div class="monthly-row">
            <span>Average Performance</span>
            <strong>${averagePerformance}%</strong>
        </div>

        <div class="monthly-row">
            <span>Best Day</span>
            <strong>
                ${bestDay} (${bestDayPercentage < 0 ? 0 : bestDayPercentage}%)
            </strong>
        </div>

    `;

}



// ---------- Daily Performance Chart ----------




function renderDailyChart() {

    const scores = loadScores();

    let dates = Object.keys(scores).sort();

    const today = new Date();
    const cutoff = new Date(today);

    cutoff.setHours(0, 0, 0, 0);

    if (selectedChartRange !== "all") {

        cutoff.setDate(
            cutoff.getDate() - (Number(selectedChartRange) - 1)
        );

        dates = dates.filter(function (date) {
            return new Date(date + "T00:00:00") >= cutoff;
        });

    }

    const labels = [];
    const dailyPercentages = [];

    dates.forEach(function (date) {

        const dailyScores = scores[date];
        const activityIds = Object.keys(dailyScores);

        if (activityIds.length === 0) return;

        let totalScore = 0;

        activityIds.forEach(function (id) {

            if (dailyScores[id] === true) {
                totalScore++;
            }

        });

        const maximumScore = activityIds.length;

        const percentage = Math.round(
            (totalScore / maximumScore) * 100
        );

        const dateObject = new Date(date + "T00:00:00");

        const formattedDate = dateObject.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
        });

        labels.push(formattedDate);
        dailyPercentages.push(percentage);

    });

    const ctx = document.getElementById("daily-chart");

    if (!ctx || typeof Chart === "undefined") {
        return;
    }

    if (dailyChart !== null) {
        dailyChart.destroy();
    }

    dailyChart = new Chart(ctx, {

        type: "line",

        data: {
            labels: labels,

            datasets: [{
                label: "Daily Completion (%)",
                data: dailyPercentages,

                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.1)",

                borderWidth: 2,
                tension: 0,
                fill: true
            }]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            scales: {

                y: {
                    beginAtZero: true,
                    max: 100,

                    title: {
                        display: true,
                        text: "Completion (%)"
                    }
                },

                x: {
                    title: {
                        display: true,
                        text: "Date"
                    }
                }

            }

        }

    });

}

document.querySelectorAll(".chart-filter").forEach(function(button) {

    button.addEventListener("click", function() {

        selectedChartRange = button.dataset.range;

        document.querySelectorAll(".chart-filter").forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderDailyChart();

    });

});



 // ---------- Application Initialization ----------

const dateElement = document.getElementById("current-date");

function updateDisplayedDate() {

    dateElement.textContent = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

}

// Initial application load
updateDisplayedDate();

renderActivities();
calculateDailyScore();

renderHistory();
renderWeeklySummary();
renderMonthlySummary();

// ---------- New Day Detection ----------

setInterval(function () {

    const currentKey = getTodayKey();

    if (currentKey !== todayKey) {

        todayKey = currentKey;

        updateDisplayedDate();

        renderActivities();
        calculateDailyScore();

        renderHistory();
        renderWeeklySummary();
        renderMonthlySummary();

    }

}, 60000);

// ---------- Dashboard Dropdown Functionality ----------

const dashboardSelect =
    document.getElementById("dashboard-view-select");

const dashboardPanels = {
    analytics: document.getElementById("analytics-panel"),
    weekly: document.getElementById("weekly-panel"),
    monthly: document.getElementById("monthly-panel"),
    history: document.getElementById("history-panel")
};

dashboardSelect.addEventListener("change", function () {

    const selectedView = dashboardSelect.value;

    // Hide all dashboard panels
    Object.values(dashboardPanels).forEach(function (panel) {
        panel.hidden = true;
    });

    // Display the selected panel
    if (selectedView && dashboardPanels[selectedView]) {

        const selectedPanel = dashboardPanels[selectedView];

        selectedPanel.hidden = false;

        // Refresh the selected section
        if (selectedView === "analytics") {
            renderDailyChart();
        }

        if (selectedView === "weekly") {
            renderWeeklySummary();
        }

        if (selectedView === "monthly") {
            renderMonthlySummary();
        }

        if (selectedView === "history") {
            renderHistory();
        }

    }

});

/* Register Progressive Web App Service Worker */

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then((registration) => {
                console.log(
                    "DailyScore service worker registered:",
                    registration.scope
                );
            })
            .catch((error) => {
                console.error(
                    "Service worker registration failed:",
                    error
                );
            });
    });
}

