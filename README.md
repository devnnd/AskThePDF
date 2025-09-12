# AskThePDF

An AI-powered application to have conversations with your PDF documents.

## How It Works

This project uses a **Retrieval-Augmented Generation (RAG)** architecture. When you upload a PDF, it's processed into smaller chunks, converted into vector embeddings, and stored in a Pinecone database. When you ask a question, the system retrieves the most relevant document chunks to provide the AI with the context it needs to give a precise, accurate answer.

**Tech Stack:** Next.js | TypeScript | RAG | Pinecone | AWS S3 | Tailwind CSS

## 🚧 Status: In Development

This project is under active development and is not yet ready for production use.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/askthepdf.git](https://github.com/your-username/askthepdf.git)
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy the example file to create your local environment configuration.
    ```bash
    cp .env.example .env
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```