# CareConnect: Mini Healthcare Support Web App

CareConnect is a concept-level web application designed to connect individuals in need of healthcare support with volunteers and resources. It features AI-driven tools to streamline patient assistance and NGO operations.

## 🚀 Live Demo
**Hosted Link:** [https://care-connect-tu0r.onrender.com](https://care-connect-tu0r.onrender.com)

## 🛠 Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Lucide React, Shadcn UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Deployment:** Render (Unified deployment for Frontend and Backend)

## 🤖 AI & Automation Features
The application includes two primary AI/Automation concepts:

1.  **CareBot (AI Chatbot Concept):**
    -   An interactive chatbot that provides immediate answers to frequently asked questions (FAQs).
    -   Guides users on how to submit support requests, register as volunteers, and access emergency help.
    -   Improves user engagement and reduces the burden on manual support staff.

2.  **Smart Priority Detection & Summarization:**
    -   In the Patient Support form, the system uses keyword analysis to automatically detect the priority level (NORMAL vs. HIGH) of a request.
    -   It identifies high-risk keywords like "emergency", "critical", or "bleeding" to flag urgent cases immediately for NGO administrators.
    -   Automatically generates a concise summary of the patient's problem for quick review by healthcare providers.

## 🏥 NGO Use-Case
CareConnect serves as a digital bridge for NGOs involved in community healthcare.
-   **Patient Support Form:** Allows patients to request general medical aid, blood support, or emergency help.
-   **Volunteer Registration:** Enables community members to sign up with their specific skills and availability periods.
-   **Admin Dashboard:** Provides NGO coordinators with a centralized view of all requests, sorted by priority, allowing them to manage resources effectively.

## 📦 How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account (for database)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone <your-repo-link>
    cd healthcare
    ```

2.  **Install dependencies (Root):**
    ```bash
    npm run install-all
    ```

3.  **Setup Environment Variables:**
    -   In the `server` folder, create a `.env` file:
        ```env
        PORT=5000
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        ```

4.  **Run in Development Mode:**
    ```bash
    npm run dev
    ```

---
*Built as a concept-level healthcare support prototype.*
