# NREGA मित्र (NREGA Mitra)

### *Discover the Progress Happening Near You.*

---

## 🧭 Overview

**NREGA मित्र** is a citizen-centric web application built to simplify and visualize the performance data of the **Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)**.  
The goal is to help citizens, especially in rural areas, understand how their **district** is performing in terms of employment generation, project completion, and welfare impact.

While the **Government of India** provides open access to this data through an API, the raw format is often difficult for non-technical users to interpret.  
**NREGA मित्र** bridges this gap by converting complex government data into **clear, visual insights** that anyone can explore.

---

## 🧩 Problem Statement

> “Our Voice, Our Rights” — The data is public, but not always accessible.

The [MGNREGA Open Data API](https://data.gov.in/catalog/mahatma-gandhi-national-rural-employment-guarantee-act-mgnrega) offers monthly performance metrics for each district across India.  
However, challenges persist:

- The information is **too technical** for the average citizen to interpret.  
- The **API can be rate-limited** or go offline, making direct usage unreliable.  
- **Digital literacy levels** in many rural areas remain low, creating a gap between open data and actual awareness.

**NREGA मित्र** empowers citizens to see, compare, and understand their district’s MGNREGA performance — in a simple, human-friendly way.

---

## 🎯 Project Goal

To design and build a **production-ready, scalable, and inclusive platform** that provides easy-to-understand insights into district-level MGNREGA data.  
It focuses on **clarity, accessibility, and reliability**, ensuring that information remains available even when the government API is down.

---

## 💻 Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | [Next.js](https://nextjs.org/) | Fast, SEO-friendly, server-side rendered interface for smooth performance |
| **Backend** | [Express.js](https://expressjs.com/) | RESTful API and data processing layer connecting frontend with the database |
| **Database** | [MongoDB](https://www.mongodb.com/) | Stores, caches, and updates district-level MGNREGA data for reliability |

---

## ⚙️ Core Features

- **District-Wise Performance Dashboard**  
  Citizens can explore their district’s key statistics such as labor budget, person-days, wages, and works completed.

- **Historical Data & Trends**  
  View monthly and yearly performance to understand long-term progress.

- **Data Reliability**  
  Cached local database ensures the system works even if the API is down.

- **Automatic Updates**  
  A cron job refreshes the dataset periodically to keep insights current.

- **Geolocation-Based District Detection** *(Bonus Feature)*  
  The app can automatically identify the user’s district from their location.

- **Simple, Intuitive UI**  
  Designed with low-literacy users in mind — clear visuals, easy navigation, and clean layout.

---

## 🧱 System Architecture

1. **Backend (Express.js + MongoDB)**  
   - Fetches live data from the [data.gov.in MGNREGA API](https://data.gov.in/catalog/mahatma-gandhi-national-rural-employment-guarantee-act-mgnrega).  
   - Stores and updates the data in MongoDB for offline access and better performance.  
   - Uses `node-cron` to schedule automatic background updates.

2. **Frontend (Next.js)**  
   - Displays district and state-level insights through interactive charts and cards.  
   - Implements responsive, mobile-friendly design for accessibility.  
   - Server-side rendering ensures better SEO and faster initial load times.

3. **Hosting & Deployment**  
   - Backend and database deployed on a **VPS/VM** for stability and scalability.  
   - Frontend deployed with build optimization for production.

---

<img width="299" height="607" alt="Image" src="https://github.com/user-attachments/assets/83edca43-59df-4136-ad01-9acd95b9257c" />

<img width="299" height="607" alt="Image" src="https://github.com/user-attachments/assets/045fa884-fb66-4452-9dd2-425defa3fceb" />

<img width="299" height="607" alt="Image" src="https://github.com/user-attachments/assets/368bc6f4-030f-406b-a4df-6cf027d64367" />

<img width="299" height="607" alt="Image" src="https://github.com/user-attachments/assets/268ec708-f2e3-403f-b8ca-d6fb43d8c794" />

<img width="299" height="607" alt="Image" src="https://github.com/user-attachments/assets/ebb26a3a-d9c7-4cdd-911c-d7b7a782e1bd" />

<img width="299" height="607" alt="Image" src="https://github.com/user-attachments/assets/da72bb24-9d4c-4f01-96ab-f9186cdf61e6" />

<img width="299" height="607" alt="Image" src="https://github.com/user-attachments/assets/b6bb6016-f384-4916-9fa7-ae31b8b25038" />
