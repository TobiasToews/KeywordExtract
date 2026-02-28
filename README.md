# KeywordExtract: Academic Extraction Pipeline

KeywordExtract is a specialized research tool designed to ingest academic PDF papers and extract structured data regarding **object affordances**, **robotics**, **LLMs/VLMs**, and **safety** using Google's Gemini 3 Flash model.

It automates the literature review process by running versioned prompt templates against uploaded papers to answer specific research questions (RQs).

## Key Features

-   **PDF Ingestion**: Drag-and-drop support for uploading multiple academic papers (PDF format).
-   **Gemini 3 Flash Integration**: Uses the latest multimodal models to parse complex academic text and extract semantic concepts.
-   **Structured Extraction**: Runs defined "Prompt Templates" corresponding to specific Research Questions (e.g., "RQ2: Planning Role", "RQ3: Datasets", "RQ4: Safety Measures").
-   **Batch Processing**: Analyze multiple papers against a selected prompt in parallel.
-   **Export Data**: Download extraction results as **JSONL** (for programmatic use) or **CSV** (for spreadsheet analysis).
-   **Prompt Library**: A curated list of extraction prompts tuned for affordance learning and embodied AI research.

## Workflow

1.  **Upload**: Go to the **Paper Vault** and upload your PDF collection.
2.  **Select Prompt**: Navigate to the **Prompt Library** to choose a specific extraction goal (e.g., "Extract Dataset Limitations").
3.  **Run Analysis**: The system processes the text of each paper through the Gemini API.
4.  **Review & Export**: View the extracted keywords, quotes, and confidence scores in the **Results** view, then export to CSV/JSONL.

## Running Locally

To run this application on your own machine (to avoid cloud timeouts), see [README_LOCAL.md](./README_LOCAL.md).

## Research Scope

The tool is currently configured to extract information related to:
-   **RQ1**: Definitions of Affordance.
-   **RQ2**: Role of affordances in Planning, Decision Making, and Imitation Learning.
-   **RQ3**: Architectures, Datasets (construction & limitations), and Prompting Strategies for VLMs.
-   **RQ4**: Hallucinations, Error Detection, and Safety Measures in affordance-based systems.
