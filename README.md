# Simple News Portal 📰

A dynamic news application built with **React (Vite)** and **JSON-Server**. This project demonstrates full CRUD capabilities, a comment system, and simulated user authentication.

## 🚀 Features

* **Simulated Authentication:** Login as different users to manage content.
* **Create News:** Authors can publish new articles.
* **Read News:** View a feed of all news items and detailed views for specific posts.
* **Update & Delete:** Authors can edit or delete their own posts (permissions handling).
* **Comments:** Users can add comments to any news post.
* **Validation:** Prevents empty titles and ensures content meets length requirements.
* **Responsive Design:** Modern UI with hover effects and mobile-friendly layout.

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite)
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **Mock Backend:** JSON-Server
* **Styling:** CSS3 (Custom Grid & Flexbox)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/news-portal.git](https://github.com/YOUR_USERNAME/news-portal.git)
    cd news-portal
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## 🖥️ How to Run

This application requires **two separate terminals** running simultaneously (one for the database, one for the frontend).

### Terminal 1: Start the Backend
Runs the mock JSON database on port 3000.
```bash
npx json-server --watch db.json --port 3000
