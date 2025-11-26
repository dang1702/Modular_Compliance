# 🛡️ Modular Compliance Dashboard

> A scalable, microfrontend-based dashboard designed for modern compliance management. Built with **React**, **Vite**, **Nx**, and **Module Federation**.

![Status](https://img.shields.io/badge/Status-Prototype-blue)
![Tech](https://img.shields.io/badge/Stack-React_18_•_Vite_•_Nx_•_Tailwind-teal)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [System Diagram](#-system-diagram)
- [Project Structure](#-project-structure)
- [Features & Modules](#-features--modules)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Testing Strategy](#-testing-strategy)
- [AWS Cognito Integration](#-aws-cognito-integration)
- [Design Decisions](#-design-decisions)

---

## 🚀 Architecture Overview

This project adopts a **Microfrontend Architecture** managed by [Nx](https://nx.dev). It decomposes a monolithic dashboard into independent, deployable applications that are composed at runtime by a **Shell Application**.

### Key Benefits
*   **Independent Deployment:** Each team can deploy their module without affecting others.
*   **Scalability:** Easy to add new modules (e.g., AI Chat, Reporting) in the future.
*   **Isolation:** Failure in one module does not crash the entire dashboard.

---

## 🧩 System Diagram

The following diagram illustrates how the Shell App aggregates remote modules and shares common dependencies.

```mermaid
graph TD
    subgraph "Browser Runtime"
        Shell[🛡️ Shell (Host App)]
        style Shell fill:#eff6ff,stroke:#1d4ed8,stroke-width:2px
        
        TO[📋 Task Overview]
        style TO fill:#f0fdf4,stroke:#15803d,stroke-width:2px
        
        CS[📊 Compliance Status]
        style CS fill:#fefce8,stroke:#a16207,stroke-width:2px
        
        RA[🔔 Recent Activity]
        style RA fill:#faf5ff,stroke:#7e22ce,stroke-width:2px
        
        UI[🎨 Shared UI Lib]
        Store[🧠 Local Stores]
    end

    Shell -->|Federated Import| TO
    Shell -->|Federated Import| CS
    Shell -->|Federated Import| RA
    
    TO -->|Uses| UI
    CS -->|Uses| UI
    RA -->|Uses| UI
    Shell -->|Uses| UI
    
    TO -->|Manage State| Store
```

---

## 📂 Project Structure

```text
compliance-dashboard/
├── apps/
│   ├── shell/              # (Host) Container App, Auth, Layout
│   ├── task-overview/      # (Remote) Data Grid, Filtering logic
│   ├── compliance-status/  # (Remote) Charts & Visualizations
│   └── recent-activity/    # (Remote) Real-time Event Log
├── libs/
│   └── shared/
│       └── ui/             # (Lib) Design System, Reusable Components
├── tools/                  # Nx Generators & Scripts
└── README.md               # You are here
```

---

## ✨ Features & Modules

### 1. Shell Application (Host)
*   **Role:** The orchestrator. It handles routing, authentication, and global layout (Sidebar, Header).
*   **Auth:** Integrated with **AWS Cognito** (via Amplify) to secure access.
*   **Lazy Loading:** Remote modules are loaded only when needed to improve initial load time.

### 2. Task Overview (Remote)
*   **Function:** Manage compliance tasks.
*   **Key Features:**
    *   Sortable/Filterable Data Table.
    *   "Mark as Complete" action with optimistic UI updates.
    *   State managed locally via **Zustand**.

### 3. Compliance Status (Remote)
*   **Function:** Visual health check of the system.
*   **Visualization:** Interactive Pie Charts using `Recharts`.
*   **Metrics:** Real-time calculation of completion percentages.

### 4. Recent Activity (Remote)
*   **Function:** Audit log of system events.
*   **Design:** Timeline view with distinct icons for different event types (Alerts, Updates, User Actions).

---

## 🛠 Tech Stack

| Category | Technology | Reason |
| :--- | :--- | :--- |
| **Framework** | React 18 + TypeScript | Industry standard, strong type safety. |
| **Build Tool** | Vite | Instant server start, fast HMR, efficient bundling. |
| **Architecture** | Nx + Module Federation | Best-in-class Monorepo & MFE tooling. |
| **State** | Zustand | Minimalist, hook-based, no boilerplate (vs Redux). |
| **Styling** | TailwindCSS | Utility-first, rapid UI development. |
| **UI Lib** | Shadcn/ui | Accessible, customizable, copy-paste components. |
| **Testing** | Vitest | Jest-compatible, built for Vite speed. |

---

## 🏃‍♂️ Getting Started

### Prerequisites
*   Node.js >= 18
*   npm >= 9

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd compliance-dashboard
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Dashboard

For the most stable Microfrontend experience (avoiding CORS/404 issues with local dev servers), we recommend running the **Production Build**.

1.  **Build all applications:**
    ```bash
    npx nx run-many -t build
    ```

2.  **Serve built artifacts:**
    (Requires `serve` package: `npm install -D serve`)

    ```bash
    # Run this command to start all 4 static servers in parallel
    (npx serve dist/apps/shell -l 4200 --cors -s & npx serve dist/apps/task-overview -l 4201 --cors & npx serve dist/apps/compliance-status -l 4202 --cors & npx serve dist/apps/recent-activity -l 4203 --cors)
    ```

*   **Shell (Host):** [http://localhost:4200](http://localhost:4200)
*   **Task Overview:** [http://localhost:4201](http://localhost:4201)
*   **Compliance Status:** [http://localhost:4202](http://localhost:4202)
*   **Recent Activity:** [http://localhost:4203](http://localhost:4203)

> **Note:** Click **"Login (Mock)"** to access the dashboard.

### Development Mode (Optional)
You can also run in dev mode with hot-reload, but might encounter Federation routing issues depending on browser config:
```bash
npx nx run-many -t serve
```

---

## 🧪 Testing Strategy

We use **Vitest** for unit and integration testing.

Run all tests across the monorepo:
```bash
npx nx run-many -t test
```

**Key Test Cases Implemented:**
*   **Task Filtering:** Verifies that selecting a status correctly filters the task list.
*   **State Updates:** Ensures marking a task as complete updates the store and UI.
*   **Component Rendering:** Checks if charts and cards render without crashing.

---

## 🔐 AWS Cognito Integration

To enable real authentication with AWS Cognito:

1.  **Configure Amplify:**
    Create `apps/shell/src/aws-exports.js` with your User Pool ID and Client ID.
    
    ```tsx
    const awsConfig = {
      Auth: {
        region: 'us-east-1', // Replace with region 
        userPoolId: 'us-east-1_xxxxxxxxx', // TReplace with ID
        userPoolWebClientId: 'xxxxxxxxxxxxxxxxx', // Replace with Client ID 
      }
    };
    export default awsConfig;

2.  **Enable Authenticator:**
    At `apps/shell/src/main.tsx` 

    ```tsx
    // apps/shell/src/main.tsx

    import { Amplify } from 'aws-amplify';
    import config from './aws-exports'; 

    // Connect with Cognito
    Amplify.configure(config);
    ```

    Uncomment the `<Authenticator>` block in `apps/shell/src/app/app.tsx`.

    ```tsx
    // apps/shell/src/app/app.tsx
    import { Authenticator } from '@aws-amplify/ui-react';
    
    export function App() {
      return (
        <Authenticator>
          {({ signOut, user }) => (
            <DashboardLayout user={user} signOut={signOut} />
          )}
        </Authenticator>
      );
    }
    ```

---

## 🧩 Design Decisions (Why I chose this?)

### Why Nx over standard Lerna/Yarn Workspaces?
Nx offers superior **computation caching**. If you only change the "Task Overview" app, Nx knows to only rebuild/retest that specific app, saving significant CI/CD time as the project scales.

### Why Zustand over Redux Toolkit?
Microfrontends should be loosely coupled. Sharing a single global Redux store creates a "Distributed Monolith". Zustand allows each MFE to have its own isolated store, which aligns perfectly with the **Shared Nothing Architecture** principle of Microservices.

### Why Module Federation?
It allows us to share dependencies (like `React`, `Lodash`) between apps to reduce bundle size, while still deploying apps independently. It is the gold standard for MFE implementation today.

---

## 🔮 Future Improvements & Scalability

This architecture is designed to be "Evolutionary," allowing easy integration of advanced features:

1.  **Real-time Updates (WebSockets):**
    *   Integrate `socket.io-client` into the **Recent Activity** module.
    *   Update Zustand store on incoming events to reflect changes instantly across the dashboard without affecting other modules.

2.  **AWS S3 Integration (Document Management):**
    *   Create a new MFE `apps/document-manager` (or extend Task Overview).
    *   Use AWS Amplify Storage to upload and retrieve compliance documents securely directly from the frontend.

3.  **Serverless Backend (AWS Lambda):**
    *   Replace hardcoded data with API calls to AWS API Gateway + Lambda.
    *   Use Shell's Cognito token to authenticate requests automatically, ensuring enterprise-grade security.

---

<div align="center">
  <sub>Built with ❤️ for the Modular Compliance Project</sub>
</div>

---

# PR Summary
<!-- Briefly describe what this PR does. E.g., Add Task Overview module -->

# Changes
- <!-- List key changes introduced in this PR -->

# Testing
- <!-- Steps to test this PR -->
1. Pull the branch
2. Run the app
3. Verify main functionality

# Notes
- <!-- Any additional notes for reviewers -->

