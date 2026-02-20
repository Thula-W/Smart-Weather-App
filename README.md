# 🌤️ SkyCast AI

SkyCast AI is a **smart weather application** that provides real-time weather information for any location and offers an interactive chat experience using AI powered assistants. The application integrates weather APIs, geolocation, and OpenAI LLMs to deliver a seamless and personalized weather experience.

🔗 **Live Demo:** [https://skycast-ai.onrender.com](https://skycast-ai.onrender.com)

---

## 🚀 Features

- **Location-based Weather Retrieval**  
  Automatically detects the user's location using geolocation and fetches the current weather.

- **Weather Information**  
  Displays current weather conditions, future weather forecast ,  goverment issued alerts and more.

- **Interactive Chat Agents**  
  Ask weather related questions and receive intelligent responses using OpenAI GPT-4o-mini:  
  1. **Breeze (Default)** – Personal weather assistant for current and upcoming weather.  
     *“Hey there! I’m Breeze, your personal weather assistant. I can help you with current and upcoming weather.”*
     
  3. **Sunny (Historian)** – Provides historical weather data from January 2, 1979, onward.  
     *“Hi, I’m Sunny! I was born on a crisp morning of January 2, 1979, and ever since, I’ve been faithfully recording the weather for every single day. You can ask me about the weather in any city on any date after my birthday!”*

- **Weather-sensitive Themes**  
  The app dynamically changes its background based on the current weather conditions.

- **Local Storage Caching**  
  Weather data is cached for 10 minutes to reduce API calls and improve performance.

- **Rate Limiting**  
  Requests are rate-limited using `express-rate-limit` to prevent abuse.

- **Tool-Enabled Chat Agents**  
  Chat agents can fetch weather data for new locations or specific dates when asked.

---

## 🛠️ Technologies Used

- **Frontend:** React, TailwindCSS  
- **Backend:** Node.js, Express.js  
- **APIs:** OpenWeather One Call API 3.0, OpenAI GPT-4o-mini  
- **Hosting:** Render  
- **Other:** LocalStorage caching, Express rate limiting, Geolocation API

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Thula-W/Smart-Weather-App.git
cd Smart-Weather-App
```

---

## 🔹 Backend Setup

The backend is built with **Node.js, Express, and TypeScript**.

### Install Dependencies

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key
WEATHER_API_KEY=your_openweather_api_key
```

### Run Backend (Development Mode)

```bash
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

### Build for Production

```bash
npm run build
npm start
```

## 🔹 Frontend Setup

The frontend is built with **React + Vite**.

### Install Dependencies

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file inside the `frontend/` folder:

```env
VITE_CHAT_ENDPOINT = "http://localhost:5000/api/chat"
VITE_WEATHER_ENDPOINT = "http://localhost:5000/api/weather"
```

### Run Frontend (Development Mode)

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📈 Usage

- On page load, the app automatically fetches weather data based on your current location using geolocation.
- Enter a **city name** , **ZIP code** , **Coordinates** to retrieve weather data for a different location.
- Choose between **Breeze** (default assistant) or **Sunny** (historian assistant) and ask weather-related questions.
- Experience dynamic background themes that change according to the current weather conditions.

---

### 💬 Example Chat Queries

Breeze -
- “Is this suitable weather for cricket in Gampaha?”
- “Should I water the plants?”
- “What clothes should I wear tommorow?”

Sunny-
- “weather on london march 15 , 2022”



