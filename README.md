# 🔋 Battery Tracker

A minimal, modern web app to monitor your device's battery level and status in real time — with notifications, theming, and cross-device support.  
Built with **Next.js**, **Tailwind CSS**, and more.

---

## 🧩 Features

- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="24" alt="JavaScript" /> **Real-Time Battery Monitoring:**  
  Instantly view your device's battery level, charging status, and estimated time left.

- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="24" alt="Next.js" /> **Minimal UI & Theming:**  
  Sleek black-and-white interface, with one-click toggle for dark/light mode.

- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="24" alt="Tailwind CSS" /> **Cross-Platform:**  
  Works on any browser/device that supports the [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API).

- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="24" alt="TypeScript" /> **Smart Notifications:**  
  Get toast notifications and sound/vibration alerts as your battery drops.

- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="24" alt="React" /> **Device Info:**  
  See your OS and partial user agent for easy device diagnostics.

---

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/Krishprajapati15/battery-tracker.git
   cd battery-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

| Tool           | Use                                       |
|:---------------|:------------------------------------------|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="28" alt="Next.js" /> [Next.js]      | React framework for SSR/SSG    |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="28" alt="React" /> [React]        | UI components                  |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="28" alt="Tailwind CSS" /> [Tailwind CSS] | Utility-first CSS styling      |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="28" alt="JavaScript" /> JavaScript     | App logic & Battery API        |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" width="28" alt="ESLint" /> ESLint        | Linting & code quality         |

---

## ⚡ How It Works

- Uses the **Battery Status API** to read your device's battery info.
- Displays a live indicator, percent, charge time left, and OS details.
- Sends browser notifications, sound, and vibration alerts on low battery.
- Supports dark/light theme via a simple toggle.

> ℹ️ Some browsers/devices may not support the Battery API.  
> You'll see a notice if unsupported.

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!  
Feel free to open an issue or pull request.

---

## 📄 License

[MIT](LICENSE)

---

> Crafted with ❤️ by [Krishprajapati15](https://github.com/Krishprajapati15)
