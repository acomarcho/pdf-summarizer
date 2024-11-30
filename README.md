# PDF Summarizer

A full-stack application that generates concise summaries from PDF documents using AI, with support for both English and Bahasa Indonesia.

## Features

- 📄 PDF upload and preview
- 🔍 Selective page range summarization
- 🌐 Bilingual support (English and Bahasa Indonesia)
- ⚡ Real-time PDF preview
- 📝 Customizable summary length (minimum paragraphs)
- 🎯 Precise summarization using GPT-4
- 🔄 Multi-step summarization process for better coherence

# Demo

## Summary in English
![image](https://github.com/user-attachments/assets/8c43047c-1bd4-42c1-a8c3-81a75551159b)

## Summary in Bahasa Indonesia
![image](https://github.com/user-attachments/assets/cbce910e-628d-4cd5-a900-819631a6ba0d)

# Tech Stack

## Frontend
- React 18 with TypeScript
- Vite for build tooling
- CSS Modules for styling
- Modern ES2020+ features

## Backend
- Node.js with Express
- TypeScript for type safety
- OpenAI API for GPT-4 integration
- PDF processing libraries (pdf-lib, pdf-parse)
- Multer for file uploads

# Getting Started

## Prerequisites
- Node.js 18 or higher
- OpenAI API key
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies by running `npm i` at both `frontend` and `backend` directory
3. Create a `.env` file in the backend directory, follow the contents of `.env.example`
4. Start the development servers by running `npm run dev` at both `frontend` and `backend` directory
