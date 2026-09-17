// ---------- Storage ----------

const STORAGE_KEY = "dailyscore-data";

const today = new Date();

const todayKey = today.toISOString().split("T")[0];


// Load saved data from localStorage

function loadData() {

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
        return {};
    }

    return JSON.parse(savedData);
}


// Save data to localStorage

function saveData(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


// ---------- Activities ----------

const activities = [
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

const activityList = document.getElementById("activity-list");


// Load all saved data once

const savedData = loadData();


// Create activity rows

activities
    .filter(function (activity) {
        return activity.active;
    })
    .forEach(function (activity) {

        const activityRow = document.createElement("div");

        activityRow.classList.add("activity-row");

        activityRow.dataset.activityId = activity.id;


        // Activity name

        const activityName = document.createElement("span");

        activityName.textContent = activity.name;


        // Score input

        const scoreInput = document.createElement("input");

        scoreInput.type = "number";

        scoreInput.min = "0";

        scoreInput.max = "10";


        // Load today's saved score

        const savedScore =
            savedData[todayKey]?.[activity.id];

        scoreInput.value = savedScore ?? 0;


        // Recalculate and save when score changes

        scoreInput.addEventListener(
            "input",
            calculateDailyScore
        );


        // Maximum score label

        const maxScore = document.createElement("span");

        maxScore.textContent = "/ 10";


        // Build the row

        activityRow.appendChild(activityName);

        activityRow.appendChild(scoreInput);

        activityRow.appendChild(maxScore);


        // Add row to page

        activityList.appendChild(activityRow);
    });


// ---------- Daily Score ----------

function calculateDailyScore() {

    const scoreInputs =
        document.querySelectorAll(".activity-row input");

    let totalScore = 0;

    const maximumScore =
        scoreInputs.length * 10;


    // Load current data

    const data = loadData();


    // Create today's record if it doesn't exist

    if (!data[todayKey]) {
        data[todayKey] = {};
    }


    // Process every activity

    scoreInputs.forEach(function (input) {

        const activityId =
            input.parentElement.dataset.activityId;

        const score =
            Number(input.value);

        totalScore += score;

        data[todayKey][activityId] = score;
    });


    // Save today's scores

    saveData(data);


    // Calculate percentage

    const percentage = maximumScore > 0
        ? Math.round(
            (totalScore / maximumScore) * 100
        )
        : 0;


    // Update score display

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


// ---------- Initial Score ----------

calculateDailyScore();