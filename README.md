# ShareBite LK

ShareBite LK helps Sri Lankan cafés, bakeries, caterers, and restaurants share safe surplus food with nearby individuals and community groups before it is wasted.

## Problem

Usable food can go to waste while households and community organisations need affordable local food options. Sri Lanka continues to face food-security challenges, making a practical way to redirect safe surplus particularly valuable.

## Solution

Businesses post clear, time-bound surplus-food listings. People and community groups browse nearby options, reserve a listing, and collect it before its deadline.

## Features

- Register and log in securely with JWT authentication.
- Create validated surplus-food listings.
- Browse, search, and filter available listings by keyword, district, and category.
- Reserve an available listing; already-reserved listings cannot be claimed again.
- Clear loading, empty, network-error, validation, authentication, and reservation feedback.
- Responsive mobile layout and SPA routing for direct page loads.

## Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Deployment: Vercel (frontend) and Render (backend)

## Setup

1. Create `backend/.env` from `backend/.env.example` and set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.
2. Create `frontend/.env` from `frontend/.env.example` and set `VITE_API_URL` to the API origin, without a trailing slash.
3. Run `npm install` in both `backend` and `frontend`.
4. Start the backend with `npm run dev` (or `npm start`, according to its scripts), then run `npm run dev` in `frontend`.

## Deployment

- Vercel: import the repository and set **Root Directory** to `frontend`. Add `VITE_API_URL` with the Render API URL, without a trailing slash. `frontend/vercel.json` includes the SPA rewrite required for refreshing `/find-food` and `/share-food`.
- Render: create a web service with **Root Directory** set to `backend`. Set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.
- After Vercel deploys, update Render’s `CLIENT_URL` to the Vercel production URL, then redeploy Render.

## Deployed link

Add the Vercel production URL here after deployment.

## Demo link

Add the recorded demo link here after recording.

## Team contributions

- Member 1 — Backend API, database models, authentication, and listing endpoints.
- Member 2 — Visual UI shell, landing page, problem page, shared header, and responsive styling.
- Member 3 — Listing browser, listing cards, create-listing form, client-side filtering, and validation UI.
- Member 4 — Route integration, Axios API connection, protected listing creation, reservation flow, deployment configuration, and documentation.

## AI declaration

AI assistance was used for implementation guidance, code integration, and documentation drafting. The team reviewed, tested, and adapted the final code for this project.
