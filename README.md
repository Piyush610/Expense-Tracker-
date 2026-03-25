# ExpenseIQ – Premium MERN Expense Tracker

A modern, glassmorphism-styled SaaS financial dashboard built with **MongoDB, Express, React, and Node.js**.

## ✨ Key Features
- **Modern Dashboard**: High-level balance overview with interactive charts.
- **Vibe Customization**: Real-time theme switching (Dark, Light, Neon, Blue, Purple, Green), accent color picker, and UI density toggle.
- **Advanced Transactions**: Filter by type, category, date, and debounced search.
- **Analytics**: Beautifully animated charts showing monthly trends and category breakdowns.
- **Security**: JWT authentication with path shielding and middleware validation.
- **CSV Export**: One-click download of all transaction data.
- **Premium UI**: Glass effects, smooth transitions, and high-quality iconography.

---

## 🚀 Setup Instructions

### 1. Backend Setup (/server)
1. Open a terminal in the `server` folder.
2. Ensure you have **Node.js** and **MongoDB** installed and running locally.
3. Check and update the `.env` file if necessary:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your_super_secret_key
   ```
4. Run the following commands:
   ```bash
   npm install
   npm run dev
   ```

### 2. Frontend Setup (/client)
1. Open a new terminal in the `client` folder.
2. Check the `.env` file to ensure the API URL matches your backend:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
3. Run the following commands:
   ```bash
   npm install
   npm run dev
   ```

---

## 🛠 Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Mongoose, JWT, BcryptJS, JSON2CSV.
- **Tools**: Vite, PostCSS, React Hot Toast.

Enjoy managing your finances in style! 🚀
