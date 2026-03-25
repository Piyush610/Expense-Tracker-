<div align="center">
  <img src="https://media.giphy.com/media/dWavwf9mgTR9zOin1A/giphy.gif" alt="Rocket Animation" width="100"/>
  <h1>ExpenseIQ - Premium Financial Command Center</h1>
  <p>A full-stack modern SaaS application for advanced personal finance management.</p>

  <!-- Badges -->
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge"/></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/></a>
  <a href="#-security"><img src="https://img.shields.io/badge/Security-2FA_Enabled-E34F26?style=for-the-badge&logo=auth0&logoColor=white"/></a>
</div>

<br />

> **Welcome to ExpenseIQ!** This full-stack application brings high-level balance overviews, interactive analytical charts, and premium glassmorphism styling to personal finance tracking. Completely responsive, dynamically themed, and highly secure.

---

## ✨ Features

- 🔐 **Military-Grade Security**: Secure JWT authentication paired with robust **Two-Factor Authentication (2FA)** options.
- 🎨 **Studio-Grade UI/UX**: Built with Framer Motion and modern glassmorphism aesthetics.
- 🌗 **Vibe Customization**: Real-time theme switching (Dark, Light, Neon, Blue, Purple, Green), dynamic accent color picker, and UI density toggle. 
- 📊 **Advanced Analytics**: Beautifully animated data visualizations (Recharts) showing monthly trends and category breakdowns.
- 🔍 **Smart Transactions**: Advanced filtering (type, category, date) with a highly optimized debounced search engine.
- 📥 **Fast Exporting**: Instantly export your entire transaction history to CSV.

---

## 🛠️ Tech Stack

### Frontend Architecture
- **Framework**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS, [TailwindCSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide-React](https://lucide.dev/)

### Backend Architecture
- **Runtime**: [Node.js](https://nodejs.org/)
- **Server Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via Mongoose ODM
- **Security Protocols**: JWT, BcryptJS, Two-Factor Auth 
- **Utilities**: JSON2CSV

---

## 🚀 Setup Instructions

Follow these instructions to run the project locally. 

### 1. Database & Backend Setup (`/server`)

Ensure you have **Node.js** and **MongoDB** installed and running on your active machine.

1. Open a new terminal and navigate to the `server` directory.
2. Initialize environment variables in a `.env` file based on your local configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=YOUR_SUPER_SECRET_KEY
   ```
3. Install dependencies and spin up the development server:
   ```bash
   npm install
   npm run dev
   ```

### 2. Frontend Setup (`/client`)

1. Open an independent terminal instance and navigate to the `client` folder.
2. Configure the client `.env` variables to hook up with the new API instance:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
3. Install the UI dependencies and start the Vite dev engine:
   ```bash
   npm install
   npm run dev
   ```
4. Access the command center via your browser at **http://localhost:5173**.

---

## 🛡️ License

> **&copy; 2026 Piyush Kumar. All Rights Reserved.**

This project was carefully crafted by [Piyush Kumar](https://github.com/Piyush610). Contact me if you have any questions or feedback! Enjoy navigating your finances in style! 🚀
