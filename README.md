# 🍌 Serfry Banana – Smart Google Drive Batch Downloader

**Extract, rename, and download multiple files from Google Drive folders with precision and speed.**

Serfry Banana is a modern, privacy-focused web application that simplifies bulk file management from Google Drive. Instead of downloading files one by one, simply paste a shared folder link, preview all contents, apply smart bulk renaming patterns, and start parallel downloads with real-time progress tracking. Built with a sleek glassmorphism UI, full RTL support, and optimized for both desktop and mobile, it turns tedious file management into a seamless experience.

## ✨ Key Features
- 🔍 **Real-time Folder Scanning** via Google Drive API v3
- 🏷️ **Smart Bulk Renaming** with dynamic episode patterns (`#`, `0#`, `00#`)
- 📊 **Live Download Progress** with speed, ETA, and queue management
- 🔄 **Retry Failed Downloads** directly from the queue
- 🌙 **Dark/Light Mode** & full Arabic/English RTL support
- 📱 **Fully Responsive** & PWA-ready for desktop & mobile
- 🔒 **100% Client-Side Processing** – no files stored on external servers
- 🧹 **Auto-Cleanup** of old logs & queues (30-day retention)

## 🛠 Tech Stack
`React` • `Vite` • `Google Drive API v3` • `Modern CSS (Glassmorphism)` • `Context API` • `Service Worker (PWA Ready)`

## 📖 How to Use
1. Go to **Settings** and paste your Google Drive API Key
2. Paste a shared Google Drive folder link
3. Click **Load Files** → Select episodes → Apply bulk rename (optional)
4. Click **Download Selected** and monitor progress in real-time

## ⚠️ Important Notes
- This is a client-side tool designed for personal & educational use.
- Downloads are subject to Google Drive's free-tier quotas & CORS limitations.
- For large-scale or production usage, a backend proxy is recommended to bypass HTML warning pages.

---
**Built with 🍌 by [Your Name/Handle] | Open for contributions & feedback**# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
