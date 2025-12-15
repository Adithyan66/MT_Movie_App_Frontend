# 🎬 Movie Mania App – Frontend

A React-based frontend application for searching movies using the OMDB API and managing favourite movies. Built with performance, clarity, and real-world MERN practices in mind.

🌐 **Live URL**: [https://movie.koodecode.online/](https://movie.koodecode.online/)

---

## 👤 Author

**Adithyan Binu**

---

## 🧠 Overview

This frontend allows users to:

* Search for movies with a **debounced input**
* View paginated results
* Add or remove movies from favourites
* Persist favourites using **Google Login**

All external API communication is routed through the backend for security.

---

## 🔧 Tech Stack

* React (Vite)
* Redux (Global state management)
* JavaScript
* Custom React Hooks

---

## ✨ Features

* 🔍 Debounced movie search
* ❤️ Add / Remove favourite movies
* 🔐 Google Login integration
* 💾 Persist favourites across sessions
* 📄 Pagination support
* ⏳ Loading states
* ⚠️ Graceful error handling

---

## 🧩 Key Highlights

* Custom **debounce hook** to optimize API calls
* Reusable and modular components
* Clean and scalable folder structure
* Backend API proxying (OMDB key never exposed)
* Performance-focused rendering

---

## 📁 Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
```

---

## 🚀 Running the Frontend Locally

```
npm install
npm run dev
```

---

## 🧪 Error Handling

* Empty search results handled gracefully
* User-friendly messages for API failures
* Disabled actions during loading states

---

## 📌 Notes

* Styling kept minimal to prioritize functionality
* Designed for easy extension (profiles, watchlists, ratings)

---

## 🏁 Final Thoughts

This frontend demonstrates practical React and Redux usage with real-world concerns like debouncing, API security, authentication, and performance optimization.

Thanks for reviewing 🚀
