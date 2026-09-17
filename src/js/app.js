// ---------- Storage ----------

const SCORE_STORAGE_KEY = "dailyscore-data";
const ACTIVITY_STORAGE_KEY = "dailyscore-activities";

const today = new Date();
const todayKey = today.toISOString().split("T")[0];


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
    today.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });


// ---------- Initial Load ----------

renderActivities();
calculateDailyScore();