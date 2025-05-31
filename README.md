# Focus Guard App

Focus Guard is a web application designed to help users minimize distractions and improve focus by managing website access and providing intervention mechanisms. It includes a PWA for mobile use and a Chrome extension for desktop browsing.

## Features

*   **App/Website Blocking:** Allows users to block distracting websites.
*   **Intervention Mechanisms:** Integrates breathing exercises or other mindful interventions when a blocked site is accessed.
*   **Focus Sessions:** Tools to start timed focus sessions.
*   **Analytics:** Tracks app usage, blocked attempts, and time saved.
*   **PWA:** Progressive Web App for a native-like experience on mobile devices.
*   **Chrome Extension:** For website blocking functionality in the Chrome browser.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [pnpm](https://pnpm.io/installation)

### Setup & Installation

1.  **Clone the repository (or download the source if you haven't pushed to GitHub yet):**
    ```bash
    # If you've set up a GitHub repo:
    # git clone https://github.com/your-username/focus-guard-app.git
    # cd focus-guard-app
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### Running the Development Server

To run the web application locally:

```bash
pnpm dev
```
The application will typically be available at `http://localhost:3000`.

### Building and Using the Chrome Extension

1.  **Build the extension:**
    ```bash
    node scripts/build-extension.js
    ```
    This will create a `chrome-extension.zip` file in the project root.

2.  **Install the extension in Chrome:**
    *   Open Chrome and navigate to `chrome://extensions`.
    *   Enable "Developer mode" (usually a toggle in the top right).
    *   Click "Load unpacked".
    *   Select the `chrome-extension/public` directory from the project.
    *   Alternatively, you can drag and drop the `chrome-extension.zip` (if you prefer to install the packed version, though for development, loading unpacked is easier).

## API Documentation & Further Docs

*(To be added: Details about any API endpoints if you build them, and more in-depth documentation about components, services, and a development guide.)*

---

This README provides a starting point. You should expand it with more details as the project grows, including:
*   More detailed feature descriptions.
*   Troubleshooting common issues.
*   Contribution guidelines (if applicable).
*   Deployment instructions.
*   License information. 