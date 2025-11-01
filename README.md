# NREGA मित्र (NREGA Mitra)

### *Discover the Progress Happening Near You.*

---

## 🧭 Overview

**NREGA मित्र** is a citizen-centric web application designed to make the performance data of the **Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)** simple and accessible to all.  
The platform helps people, especially in rural India, explore how their **district** is performing in generating employment, completing works, and utilizing funds under the MGNREGA scheme.

The data provided by the **Government of India** through [data.gov.in](https://data.gov.in/catalog/mahatma-gandhi-national-rural-employment-guarantee-act-mgnrega) is open but not always easy to understand.  
**NREGA मित्र** transforms this complex dataset into **visual insights** that every citizen can explore effortlessly.

---

## 🧩 Problem Statement

> “Our Voice, Our Rights” — The data is public, but not always accessible.

The Government of India provides an open API containing district-wise monthly performance data for MGNREGA.  
However, several issues limit its usefulness to the public:

- The data format is **too technical** for non-technical citizens.  
- The API may face **downtime or rate limits**, making direct access unreliable.  
- **Data literacy is low** in rural areas, leaving people disconnected from insights that affect their lives.

**NREGA मित्र** bridges this gap by providing an intuitive platform where citizens can **see, compare, and understand** their district’s MGNREGA performance in plain, visual terms.

---

## 🎯 Project Goal

To create a **scalable, production-ready, and inclusive platform** that brings MGNREGA data to life for rural citizens.  
The platform focuses on **clarity, accessibility, and resilience**, ensuring data remains available even when external APIs are not.

---

## 💻 Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | [Next.js](https://nextjs.org/) | Fast, SEO-optimized interface built for accessibility and speed |
| **Backend** | [Express.js](https://expressjs.com/) | Handles data fetching, transformation, and API routing |
| **Database** | [MongoDB](https://www.mongodb.com/) | Stores cached district-level data for offline reliability and scalability |

---

## ⚙️ Core Features

- **District-Wise Performance Dashboard**  
  Visualize key metrics like labor budget, person-days, works completed, and wage distribution.

- **Historical Data Trends**  
  Access past performance data to see progress and year-over-year improvements.

- **Offline-Ready Architecture**  
  Uses local caching to ensure smooth performance even during API downtime.

- **Automated Data Updates**  
  Background jobs using `node-cron` keep the data refreshed automatically.

- **Geolocation-Based District Detection** *(Bonus Feature)*  
  Automatically identifies the user’s district for a personalized experience.

- **Simple, Visual Interface**  
  Minimalist design crafted for low-literacy users, focusing on clarity and usability.

---

## 🧱 System Architecture

1. **Backend (Express.js + MongoDB)**  
   - Fetches and stores data from [data.gov.in MGNREGA API](https://data.gov.in/catalog/mahatma-gandhi-national-rural-employment-guarantee-act-mgnrega).  
   - Manages database updates and API endpoints for the frontend.  
   - Uses cron jobs for periodic synchronization.

2. **Frontend (Next.js)**  
   - Displays state and district data through charts and graphs.  
   - Provides responsive and mobile-friendly layouts.  
   - Server-side rendering ensures faster loading and better SEO.

3. **Hosting & Deployment**  
   - Backend and database hosted on a **VPS/VM** for reliability and control.  
   - Frontend optimized for production with modern build practices.

---

## 🗺️ Dataset Reference

**Official Dataset:**  
[Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) – Monthly Performance Data](https://data.gov.in/catalog/mahatma-gandhi-national-rural-employment-guarantee-act-mgnrega)

**Source:** Open Government Data (OGD) Platform, Government of India  
**Data Type:** State-wise Performance Metrics  
**License:** Open Government Data License – India  

---

## 🔮 Future Roadmap
 
- [ ] Integrate **AI-based voice assistance** for accessibility  
- [ ] Build **data comparison tools** across districts and years  
- [ ] Launch **Progressive Web App (PWA)** for offline mobile use  
- [ ] Include **citizen feedback** and story-based visualization  

---

## 🤝 Acknowledgements

- **Government of India** – for making MGNREGA data openly accessible  
- **data.gov.in** – for promoting transparency through open APIs  
- **Open-Source Community** – for providing the frameworks and tools that power this platform  

---

## 🌟 Vision

To empower every citizen to **understand and engage** with public data that shapes their community’s growth.  
With **NREGA मित्र**, government transparency meets local awareness — one district at a time.

> **"Discover the Progress Happening Near You."**

---


