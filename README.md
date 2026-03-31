# AI-Powered Interview Preparation Platform

A full-stack AI-driven application designed to help job seekers practice technical interviews tailored to their specific roles and experience levels. Built with Next.js 14 App Router, NextAuth, MongoDB, and the OpenAI API.

## Features
- **📝 Role-Specific Questions**: AI-generated questions based on role and experience.
- **🎙️ Mock Interview Mode**: Responsive UI for practicing answers.
- **🤖 AI Evaluation**: Score, strengths, weaknesses, and improved answers for each question.
- **📊 Performance History**: Track your past interviews and growth.
- **Micro-animations**: Modern, smooth user experience.

## Tech Stack
- Frontend: Next.js 14 (App Router), Tailwind CSS
- Backend: Next.js API routes
- Database: MongoDB (using Mongoose)
- Authentication: NextAuth.js
- AI Integration: OpenAI API (GPT-3.5)

## Prerequisites
- Node.js 18+
- MongoDB instance (e.g., MongoDB Atlas)
- OpenAI API Key

## Setup Guide

1.  **Duplicate the Environment File**:
    ```bash
    cp .env.example .env.local
    ```
2.  **Fill in `.env.local`**:
    - `MONGODB_URI`: Your MongoDB connection string.
    - `OPENAI_API_KEY`: Your OpenAI API key.
    - `NEXTAUTH_SECRET`: A secret for session encryption.
    - `NEXTAUTH_URL`: `http://localhost:3000` (for local development).

3.  **Install dependencies**:
    ```bash
    npm install
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Deployment
This application is fully compatible with Vercel:
1. Connect your GitHub repository to Vercel.
2. Add the environment variables from `.env.local` to your Vercel project settings.
3. Click deploy!
