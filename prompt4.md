Build ShareBite LK — a platform that helps Sri Lankan cafés, bakeries, caterers, and restaurants post safe surplus food for nearby community groups or individuals to reserve before it is wasted.
It is focused, practical, and easy to demonstrate: users can post a food listing, search/filter available food, and reserve a listing. It clearly meets every required functional item. Sri Lanka has ongoing food-security challenges; WFP reports many households face inadequate diets

Branches
- feature/backend-listings — Member 1
- feature/ui-shell — Member 2
- feature/listing-features — Member 3
- feature/integration-deployment — Member 4


I am Member 4. Work only on branch feature/integration-deployment.

PROJECT: ShareBite LK, a Sri Lankan surplus-food sharing platform.

OWN THESE FILES/FOLDERS ONLY:
- frontend/src/App.jsx
- frontend/src/main.jsx
- frontend/src/services/
- frontend/vercel.json
- frontend/.env.example
- README.md
- deployment configuration only

DO NOT EDIT:
- backend/src/
- frontend/src/components/
- frontend/src/pages/
- frontend/src/features/
- frontend/src/styles/

TASK:
1. Preserve existing login/register functionality.
2. Add React Router routes:
   - /              LandingPage
   - /find-food     Listing browser
   - /share-food    Protected create-listing form
   - /about         ProblemPage
   - /login and /register as needed
3. Connect Axios to VITE_API_URL with no trailing slash.
4. Connect listing UI to:
   - GET /api/listings
   - POST /api/listings
   - PATCH /api/listings/:id/reserve
5. Handle API loading, network failure, empty result, validation error, unauthorized user, and successful reservation clearly.
6. Add frontend/vercel.json with an SPA rewrite so direct navigation or browser refresh on /find-food and /share-food never returns a Vercel 404.
7. Document deployment in README:
   - Vercel Root Directory: frontend
   - Render Root Directory: backend
   - Render variables: MONGODB_URI, JWT_SECRET, CLIENT_URL
   - Vercel variable: VITE_API_URL
   - Set CLIENT_URL to the Vercel production URL after deployment.
8. Add README sections required by the brief: problem, solution, features, stack, AI declaration, all four contributions, setup, deployed link, demo link.

TEST:
- Register, login, create a listing, search/filter it, reserve it from another account, refresh every route, and test mobile layout.
- Test the deployed URL in an incognito window.
- Do not include secrets in Git.

DELIVERABLE:
Keep commits meaningful. Merge only after reviewing each feature branch. Report any API mismatch immediately.

I am member 4 and only do my part