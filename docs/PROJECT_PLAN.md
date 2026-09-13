# DailyScore — Project Plan

## 1. Project Overview

DailyScore is a personal daily tracking application designed to help users
record, evaluate, and monitor their daily activities and habits.

The application provides a daily scoring system while preserving historical
records for weekly and monthly analysis.

The project is intended as a personal-use application and as a practical
software development project demonstrating frontend development, data
persistence, application logic, and data aggregation.

---

## 2. Problem Statement

It is easy to track individual habits or tasks but difficult to maintain a
consistent record and understand long-term performance.

DailyScore addresses this by providing:

- A simple daily tracking interface
- A numerical score for daily performance
- Persistent historical records
- Weekly performance summaries
- Monthly performance summaries
- Customizable activities

The daily interface resets for a new day without deleting historical data.

---

## 3. Objectives

The primary objectives are:

1. Allow users to record their performance for different activities each day.
2. Calculate an overall daily score automatically.
3. Preserve historical daily records.
4. Calculate weekly performance scores.
5. Calculate monthly performance scores.
6. Allow activities to be added, renamed, or removed.
7. Provide a simple interface suitable for everyday personal use.
8. Maintain a clean and maintainable project structure.
9. Demonstrate practical use of JavaScript and browser-based data persistence.

---

## 4. Initial Activities

The initial version will contain the following activities:

- Study
- Coding
- Exercise
- Running
- Sleep
- Reading
- Football
- Personal Routine

Activities will not be permanently hard-coded into the application.
Users will be able to manage their own activity list.

---

## 5. Core Features

### 5.1 Daily Tracking

The application will:

- Automatically detect the current date.
- Display all currently active activities.
- Allow the user to assign a score to each activity.
- Calculate the total daily score.
- Display the daily score as both points and percentage.

Initial scoring range:

**0–10 points per activity**

---

### 5.2 Daily Reset

The application will present a fresh tracking interface when a new
calendar day begins.

Important:

The daily interface resets, but historical records are not deleted.

Each day's data will be stored separately using its date as an identifier.

Example:

```text
2026-09-13
2026-09-14
2026-09-15