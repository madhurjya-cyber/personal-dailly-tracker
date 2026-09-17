// ---------- Storage ----------

const SCORE_STORAGE_KEY = "dailyscore-data";
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

    // Clear the existing activity rows
    activityList.innerHTML = "";

    activities
        .filter(function (activity) {
            return activity.active;
        })
        .forEach(function (activity) {

            const activityRow =
                document.createElement("div");

            activityRow.classList.add("activity-row");

            activityRow.dataset.activityId =
                activity.id;

            const activityName =
                document.createElement("span");

            activityName.textContent =
                activity.name;

            const scoreInput =
                document.createElement("input");

            scoreInput.type = "number";
            scoreInput.min = "0";
            scoreInput.max = "10";

            // Load today's saved score
            const scores = loadScores();

            const savedScore =
                scores[todayKey]?.[activity.id];

            scoreInput.value =
                savedScore ?? 0;

            scoreInput.addEventListener(
                "input",
                calculateDailyScore
            );

           const maxScore =
    document.createElement("span");

maxScore.textContent = "/ 10";

// ---------- Rename Button ----------

const renameButton =
    document.createElement("button");

renameButton.textContent = "Rename";
renameButton.classList.add("rename-btn");

renameButton.addEventListener("click", function () {

    const newName =
        prompt("Enter new activity name:", activity.name);

    if (newName === null) {
        return;
    }

    const cleanedName =
        newName.trim();

    if (cleanedName === "") {
        alert("Activity name cannot be empty.");
        return;
    }

    // Change only the display name
    activity.name = cleanedName;

    // Keep the same activity ID
    saveActivities();

    // Redraw the activity list
    renderActivities();

    // Recalculate today's score
    calculateDailyScore();
});

// ---------- Remove Button ----------

const removeButton =
    document.createElement("button");

removeButton.textContent = "Remove";
removeButton.classList.add("remove-btn");

removeButton.addEventListener("click", function () {

    const confirmed =
        confirm(`Remove "${activity.name}" from your tracker?`);

    if (!confirmed) {
        return;
    }

    // Deactivate instead of deleting
    activity.active = false;

    // Save the updated activity configuration
    saveActivities();

    // Redraw the activity list
    renderActivities();

    // Recalculate today's score
    calculateDailyScore();
});


activityRow.appendChild(activityName);
activityRow.appendChild(scoreInput);
activityRow.appendChild(maxScore);
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

    const scoreInputs =
        document.querySelectorAll(
            ".activity-row input"
        );

    let totalScore = 0;

    const maximumScore =
        scoreInputs.length * 10;

    const scores = loadScores();

    if (!scores[todayKey]) {
        scores[todayKey] = {};
    }

    scoreInputs.forEach(function (input) {

        const activityId =
            input.parentElement.dataset.activityId;

        const score =
            Number(input.value);

        totalScore += score;

        scores[todayKey][activityId] =
            score;
    });

    saveScores(scores);

    const percentage =
        maximumScore > 0
            ? Math.round(
                (totalScore / maximumScore) * 100
            )
            : 0;

    document.getElementById("score").textContent =
        totalScore;

    document.getElementById("max-score").textContent =
        maximumScore;

    document.getElementById("score-percentage").textContent =
        percentage + "%";
}


// ---------- Today's Date ----------

const dateElement =
    document.getElementById("current-date");

dateElement.textContent =
    new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });


// ---------- Initial Load ----------

renderActivities();
calculateDailyScore();
// ---------- New Day Detection ----------

setInterval(function () {

    const currentKey = getTodayKey();

    if (currentKey !== todayKey) {

        todayKey = currentKey;

        // Update displayed date
        dateElement.textContent =
            new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });

        // Rebuild today's tracker
        renderActivities();

        // Calculate the new day's score
        calculateDailyScore();
    }

}, 60000);
// ---------- History ----------

// ---------- History ----------

function renderHistory() {
    const historyList = document.getElementById("history-list");

    const scores = loadScores();

    const dates = Object.keys(scores)
        .filter(function (date) {
            return date !== todayKey;
        })
        .sort()
        .reverse();

    historyList.innerHTML = "";

    if (dates.length === 0) {
        historyList.innerHTML = "<p>No previous days recorded yet.</p>";
        return;
    }

    dates.forEach(function (date) {

        const dailyScores = scores[date];

        let totalScore = 0;
        let maximumScore = 0;

        Object.values(dailyScores).forEach(function (score) {
            totalScore += Number(score);
            maximumScore += 10;
        });

        const percentage = maximumScore > 0
            ? Math.round((totalScore / maximumScore) * 100)
            : 0;


        // ---------- History row ----------

        const row = document.createElement("div");

        row.classList.add("history-row");


        // Date

        const dateElement = document.createElement("span");

        dateElement.classList.add("history-date");

        const dateObject = new Date(date + "T00:00:00");

        dateElement.textContent = dateObject.toLocaleDateString("en-IN", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"
        });


        // Score

        const scoreElement = document.createElement("span");

        scoreElement.classList.add("history-score");

        scoreElement.textContent =
            `${totalScore} / ${maximumScore} (${percentage}%)`;


        row.appendChild(dateElement);
        row.appendChild(scoreElement);


        // ---------- Details ----------

        const details = document.createElement("div");

        details.classList.add("history-details");

        details.style.display = "none";


        // Add activity scores

        activities
            .filter(function (activity) {
                return activity.active;
            })
            .forEach(function (activity) {

                const activityScore = dailyScores[activity.id];

                if (activityScore === undefined) {
                    return;
                }

                const detailRow = document.createElement("div");

                detailRow.classList.add("history-detail-row");


                const name = document.createElement("span");

                name.textContent = activity.name;


                const score = document.createElement("span");

                score.textContent = `${activityScore} / 10`;


                detailRow.appendChild(name);
                detailRow.appendChild(score);

                details.appendChild(detailRow);
            });


        // ---------- Expand / Collapse ----------

        row.addEventListener("click", function () {

            if (details.style.display === "none") {
                details.style.display = "block";
            } else {
                details.style.display = "none";
            }

        });


        historyList.appendChild(row);
        historyList.appendChild(details);

    });
}
renderHistory()
// ---------- Weekly Summary ----------

function renderWeeklySummary() {

    const weeklySummary =
        document.getElementById("weekly-summary");

    const scores =
        loadScores();

    const today =
        new Date();

    // Find Monday of the current week

    const day =
        today.getDay();

    const difference =
        day === 0 ? 6 : day - 1;

    const monday =
        new Date(today);

    monday.setDate(
        today.getDate() - difference
    );

    monday.setHours(0, 0, 0, 0);


    // Find Sunday of the current week

    const sunday =
        new Date(monday);

    sunday.setDate(
        monday.getDate() + 6
    );

    sunday.setHours(23, 59, 59, 999);


    let totalScore = 0;
    let maximumScore = 0;
    let daysRecorded = 0;


    // Check every stored date

    Object.keys(scores).forEach(function (date) {

        const dateObject =
            new Date(date + "T00:00:00");

        if (
            dateObject >= monday &&
            dateObject <= sunday
        ) {

            const dailyScores =
                scores[date];

            Object.values(dailyScores).forEach(
                function (score) {

                    totalScore +=
                        Number(score);

                    maximumScore += 10;

                }
            );

            daysRecorded++;

        }

    });


    const percentage =
        maximumScore > 0
            ? Math.round(
                (totalScore / maximumScore) * 100
            )
            : 0;


    // Format dates

    const startDate =
        monday.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
        });

    const endDate =
        sunday.toLocaleDateString("en-IN", {
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
            <span>Total Score</span>
            <strong>
                ${totalScore} / ${maximumScore}
            </strong>
        </div>

        <div class="weekly-row">
            <span>Completion</span>
            <strong>
                ${percentage}%
            </strong>
        </div>

        <div class="weekly-row">
            <span>Days Recorded</span>
            <strong>
                ${daysRecorded} / 7
            </strong>
        </div>

    `;
}

renderWeeklySummary();
// ---------- Monthly Summary ----------

function renderMonthlySummary() {

    const monthlySummary =
        document.getElementById("monthly-summary");

    const scores =
        loadScores();

    const today =
        new Date();

    const currentYear =
        today.getFullYear();

    const currentMonth =
        today.getMonth();


    let totalScore = 0;
    let maximumScore = 0;
    let daysRecorded = 0;


    // Check every stored date

    Object.keys(scores).forEach(function (date) {

        const dateObject =
            new Date(date + "T00:00:00");

        const sameYear =
            dateObject.getFullYear() === currentYear;

        const sameMonth =
            dateObject.getMonth() === currentMonth;


        if (sameYear && sameMonth) {

            const dailyScores =
                scores[date];

            Object.values(dailyScores).forEach(
                function (score) {

                    totalScore +=
                        Number(score);

                    maximumScore += 10;

                }
            );

            daysRecorded++;
        }

    });


    const percentage =
        maximumScore > 0
            ? Math.round(
                (totalScore / maximumScore) * 100
            )
            : 0;


    const monthName =
        today.toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric"
        });


    monthlySummary.innerHTML = `

        <div class="monthly-row">
            <span>Month</span>
            <strong>${monthName}</strong>
        </div>

        <div class="monthly-row">
            <span>Total Score</span>
            <strong>
                ${totalScore} / ${maximumScore}
            </strong>
        </div>

        <div class="monthly-row">
            <span>Completion</span>
            <strong>
                ${percentage}%
            </strong>
        </div>

        <div class="monthly-row">
            <span>Days Recorded</span>
            <strong>
                ${daysRecorded}
            </strong>
        </div>

    `;
}

renderMonthlySummary();