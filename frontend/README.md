# ShareBite LK

## Project Description
ShareBite LK is a web platform that helps reduce food waste in Sri Lanka by connecting cafés, bakeries, caterers, restaurants, and households with people or community groups who can collect safe surplus food.

## Problem Statement
Many food businesses prepare more food than they can sell each day. Safe food is often discarded because there is no quick and simple way to find nearby people or organisations who can collect it before it expires. At the same time, many Sri Lankan households and communities face difficulty accessing affordable food.

This creates two connected problems: food waste and limited food access. ShareBite LK addresses this by making surplus food visible to nearby users in real time.

## Proposed Solution
ShareBite LK allows food providers to post available surplus food with its category, number of portions, district, pickup location, and collection deadline. Users can search and filter listings to find suitable food nearby, then reserve an available listing.

The platform does not deliver food. It helps donors and recipients coordinate collection quickly and safely.

## Target Users
- Cafés, bakeries, restaurants, caterers, and food businesses
- Households with safe surplus food
- Community organisations and charities
- Students, families, and individuals looking for available food nearby

## Main Features
1. Landing page introducing the platform, the problem, and how it works.
2. Navigation bar linking Home, Find Food, Share Food, and About.
3. User registration and login using secure password hashing and JWT authentication.
4. Create surplus-food listings with validation.
5. Browse available food listings.
6. Search listings by title or description.
7. Filter listings by district and food category.
8. Reserve an available listing.
9. Display listing status as Available or Reserved.
10. Responsive mobile and desktop interface.
11. Friendly validation, loading, error, success, and empty states.
12. Sample Sri Lankan food listings for demonstration.

## Main User Flow
1. A user creates an account or logs in.
2. A food provider selects "Share Food".
3. The provider enters food details and posts a listing.
4. Another user selects "Find Food".
5. The user searches or filters available listings.
6. The user reserves a suitable listing.
7. The listing status changes to Reserved.

## Technology Stack
- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose
- Authentication: JWT and bcryptjs
- Frontend hosting: Vercel
- Backend hosting: Render
- Version control: GitHub

## AI Tools Used
- **Codex** — used to generate, review, and debug the initial project structure, API components, React components, validation logic, deployment configuration, and documentation. The team reviewed, tested, modified, and understood all generated code before submission.

*(See the AI Prompt Log in the submission PDF for the full record of prompts, purposes, and how each output was checked.)*

## Installation & Setup

### Prerequisites
- Node.js (v18 or later)
- npm
- A MongoDB Atlas connection string

### Backend
```
cd backend
npm install
```
Create a `.env` file in `/server`:
```
PORT=5000
MONGODB_URI=mongodb+srv://thisulh_db_user:CMA76pDIjMvPgLaH@cluster0.grrrp1q.mongodb.net/?appName=Cluster0
JWT_SECRET=hacka1-local-development-secret-change-me
```
Run the backend:
```
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173` (or the port Vite assigns).

### Environment note
For the deployed version, the frontend's API base URL is set via an environment variable pointing to the Render backend URL.

## Team Contributions

| Branch | Member | Contribution |
|---|---|---|
| `feature/backend-listings` | **IT24103586** | Backend API, MongoDB models, authentication integration (JWT/bcrypt), listing routes, and server-side validation. |
| `feature/ui-shell` | **IT24103554** | Responsive UI design, navigation, landing page, problem-explanation page, and reusable components. |
| `feature/listing-features` | **IT24300116** | Food listing cards, search, filters, form validation, sample data, and reservation interface. |
| `feature/integration-deployment` | **IT24100209** | Frontend-backend integration, routing, API service layer, testing, Git management, deployment, README, and demonstration coordination. |

## Expected Impact
ShareBite LK can help reduce avoidable food waste while making safe surplus food easier to discover for nearby Sri Lankan users. It provides a simple, realistic first step toward stronger community food-sharing networks.

## Links
- GitHub Repository:(https://github.com/ThisulHerath/ShareBite-LK.git)
- Deployed Application: (https://sharebite-lk-33z6.vercel.app/)
- Demonstration Video: https://drive.google.com/file/d/1alFNcyXsHJ-2-Qjkwosxpd_cgBmWfwKY/view?usp=sharing
- Group ID: 2026-AI-17
- Team Members and Student IDs:
  - IT24103586 - Herath H.M.T.P
  - IT24103554 - Perera K.V.N
  - IT24100209 - Kulathunga K.M.T.J.
  - IT24300116 - W.A.N.Anjana
