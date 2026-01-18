# 📡 CableScope
### AI-Powered TDR Fault Detection System

**CableScope** is a high-precision diagnostic tool designed to detect cable faults, open circuits, and breakouts using **Time Domain Reflectometry (TDR)**. By leveraging the high-speed signal processing of an **STM32** and the computational power of a **Raspberry Pi 5**, it provides real-time waveform analysis to pinpoint cable issues within centimeters.

---

## 🖥️ User Interface
![CableScope UI Dashboard](UIPNG)
*Real-time TDR analysis dashboard showing fault detection at 47.3m.*

---

## ✨ Features
* **Real-time Waveform Analysis:** Visualizes signal reflections to identify the exact nature of cable faults.
* **Multi-Cable Support:** Includes a persistent library for Cat5e, Cat6, Coaxial, and custom cable types.
* **Custom VoP Management:** User-definable Velocity of Propagation (VoP) settings for precise distance calculation.
* **Hardware Health Monitoring:** Live tracking of Raspberry Pi 5 CPU temperature, IP status, and pulse generation count.
* **Automated Reports:** Generate diagnostic reports for site compliance and maintenance logs.

---

## 🛠️ Hardware Architecture
* **Raspberry Pi 5:** Acts as the host system, running the Next.js web interface and handling complex AI analysis.
* **STM32 Microcontroller:** Responsible for high-speed pulse generation and capturing the reflected signals with nanosecond precision.
* **Communication:** SPI/UART bridge between the STM32 and Raspberry Pi for high-speed data transfer.

---

## 🚀 Tech Stack
* **Frontend:** Next.js, React, Tailwind CSS
* **UI Components:** Radix UI, Lucide Icons, Glassmorphism design
* **State Management:** React Hooks (`useState`, `useEffect`)
* **Data Persistence:** LocalStorage for the Cable Library and History

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/cablescope.git](https://github.com/your-username/cablescope.git)
   cd cablescope

2. Run The Code
   ```bash
   npm install
   npm run dev
   
