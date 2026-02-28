# Running KeywordExtract Locally

Follow these instructions to run the application on your own machine. This avoids the "auto-restart" behavior of the cloud preview environment and gives you a persistent local setup.

## Prerequisites

1.  **Node.js**: You need Node.js installed (version 18 or higher).
    *   Download: [https://nodejs.org/](https://nodejs.org/)
2.  **Git**: (Optional) To manage the code versioning.

## Installation

1.  **Download the Code**:
    *   Download the project zip file from AI Studio (or clone the repository if you pushed it to GitHub).
    *   Extract the zip file to a folder on your computer.

2.  **Open Terminal**:
    *   Open your terminal (Command Prompt, PowerShell, or Terminal).
    *   Navigate to the project folder:
        ```bash
        cd path/to/keywordextract
        ```

3.  **Install Dependencies**:
    *   Run the following command to install the required libraries:
        ```bash
        npm install
        ```

## Configuration

1.  **Get an API Key**:
    *   Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and get a Gemini API key.

2.  **Set up Environment Variables**:
    *   Create a new file named `.env` in the root folder (next to `package.json`).
    *   Add your API key to it:
        ```env
        GEMINI_API_KEY=your_actual_api_key_starts_with_AIza...
        ```
    *   (You can copy `.env.example` to `.env` and edit it).

## Running the App

1.  **Start the Development Server**:
    *   Run:
        ```bash
        npm run dev
        ```

2.  **Open in Browser**:
    *   The terminal will show a local URL, usually `http://localhost:5173`.
    *   Open that link in your browser.

## Usage Notes

*   **Persistence**: The app still stores data in browser memory by default. If you refresh the page, data resets.
*   **No Timeouts**: The server will keep running as long as the terminal window is open.
