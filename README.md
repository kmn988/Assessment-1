# Expense Tracker

A full-stack personal finance web application for tracking, categorising, and visualising monthly expenses. It provides a structured logbook with real-time filtering, sorting, and visual breakdowns.

---

## Tech Stack

| Layer       | Technology                                            |
| ----------- | ----------------------------------------------------- |
| Frontend    | React 19 + TypeScript                                 |
| Styling     | Tailwind CSS                                          |
| Charts      | Chart.js + react-chartjs-2, chartjs-plugin-annotation |
| HTTP Client | Axios                                                 |
| Backend     | FastAPI (Python)                                      |
| ORM         | SQLModel + SQLAlchemy                                 |
| Database    | MySQL                                                 |
| Pagination  | fastapi-pagination                                    |

---

## Features

- **Monthly expense logbook** — add, edit, and delete expense records with title, category, amount, date, and description
- **Server-side pagination** — browse large datasets 10 records at a time with ellipsis-aware page controls
- **Column sorting** — click any table header to sort ascending or descending
- **Category and search filtering** — filter by category dropdown and free-text search
- **Category chart & breakdown panel** — visualises spending distribution by category for the selected month
- **Trend chart** — yearly spending trend with a dynamic average line annotation
- **Responsive layout** — adapts from single-column mobile to multi-column desktop grid

---

## Folder Structure

```
src/
├── config/
│   ├── axios.ts              # Axios base URL configuration
│   └── value.ts              # Shared constants (categories, etc.)
├── logbook/
│   ├── CategoryBreakdown.tsx # Ranked category breakdown list
│   ├── CategorySelector.tsx  # Category filter dropdown
│   ├── ChangeAction.tsx      # Add / edit expense modal form
│   ├── DeleteAction.tsx      # Delete confirmation modal
│   ├── DonutChart.tsx        # Category donut chart
│   ├── ExpenseTable.tsx      # Main logbook view with table, filters, pagination
│   └── MonthSelector.tsx     # Month/year picker dropdown
├── menu/
│   └── Menu.tsx              # Sidebar navigation
├── trend/
│   ├── BarChart.tsx          # Yearly trend bar chart with average line
│   ├── Trend.tsx             # Trend tab view
│   └── YearSelector.tsx      # Year picker with 3x3 grid
├── assets/                   # Static assets
├── App.css                   # App-level styles
├── App.tsx                   # Root component, tab-based navigation
├── index.css                 # Global styles and Tailwind import
├── main.tsx                  # React entry point
└── Modal.tsx                 # Reusable portal modal shell

backend/
├── expense_tracker.py        # FastAPI route definitions
├── expense_tracker_crud.py   # SQLModel models and database operations
└── requirement.txt           # Python dependencies
```

---

## Challenges Overcome

Building this project involved several technical challenges that I resolved through research and experimentation. Column sorting and pagination required managing multiple states on the frontend and also handling query parameters on the backend. However, this challenge was fairly easy since the documentation for fastapi was plenty. I also had some challenge integrating Chart.js, since the documentation for react-chartjs was sparse, and I overcomed it through trial and error.

# Installation Guide

## Prerequisites

Make sure the following are installed on your machine before proceeding:

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.10+
- [MySQL](https://www.mysql.com/) 8.0+
- [Git](https://git-scm.com/)

---

## 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-name>
```

## 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python -m venv .venv
source .venv/bin/activate

# or
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirement.txt
```

Create .env file with database credentials:

```properties
db_username='your_username'
db_password='your_password'
db_host='your_localhost'
db_port='your_port'
db_name ='your_db_name'
SECRET_KEY = 'your_secret_key'
ALGORITHM = 'your_algorithm'
```

Start the backend server:

```bash
uvicorn expense_tracker:app --reload
```

The API will be available at `http://127.0.0.1:8000`. You can view the auto-generated docs at `http://127.0.0.1:8000/docs`.

Create an ADMIN account: go to `http://127.0.0.1:8000/docs#/default/register_register_post` and modify request body

```json
{
  "email": "admin@gmail.com",
  "password": "Abc1234@",
  "name": "Admin",
  "role": "ADMIN"
}
```

---

## 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
yarn install
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`. Register an account and start tracking your expenses.

---

## 4. Verify Everything is Running

| Service     | URL                        |
| ----------- | -------------------------- |
| Frontend    | http://localhost:5173      |
| Backend API | http://127.0.0.1:8000      |
| API Docs    | http://127.0.0.1:8000/docs |

---

## Link to github repository

https://github.com/kmn988/Assessment-1
