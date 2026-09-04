Build ShareBite LK — a platform that helps Sri Lankan cafés, bakeries, caterers, and restaurants post safe surplus food for nearby community groups or individuals to reserve before it is wasted.
It is focused, practical, and easy to demonstrate: users can post a food listing, search/filter available food, and reserve a listing. It clearly meets every required functional item. Sri Lanka has ongoing food-security challenges; WFP reports many households face inadequate diets

Branches
- feature/backend-listings — Member 1
- feature/ui-shell — Member 2
- feature/listing-features — Member 3
- feature/integration-deployment — Member 4


I am Member 3. Work only on branch feature/listing-features.

PROJECT: ShareBite LK, a Sri Lankan surplus-food sharing platform.

OWN THESE FILES/FOLDERS ONLY:
- frontend/src/features/listings/
- frontend/src/data/

DO NOT EDIT:
- frontend/src/App.jsx
- frontend/src/main.jsx
- frontend/src/components/
- frontend/src/pages/
- frontend/src/services/
- backend/
- README.md
- vercel.json

TASK:
Build the core ShareBite LK feature components. Use local mock data first so work can begin immediately; Member 4 will connect the real API later.

CREATE:
1. ListingCard component:
   - Show title, category, portions, district, pickup address, available-until time, and status.
   - Clearly show “Available” or “Reserved”.
   - Include Reserve button that accepts an onReserve callback.

2. ListingBrowser feature:
   - Search by title/description.
   - Filter by district and category.
   - Display filtered results and an informative empty state.
   - Use responsive card grid.

3. CreateListingForm:
   - Fields: title, description, category, portions, district, pickupAddress, availableUntil.
   - Friendly inline validation before submission:
     title 3–100; description 10–500; category required; portions 1–500 whole number; district required; address 5–200; future pickup deadline.
   - Disabled submit while sending.
   - Clear success and error message areas.
   - Accept onSubmit callback from Member 4.

4. mockListings:
   - Add four realistic Sri Lankan sample listings, sufficient for search/filter demonstration.

IMPORTANT:
- Keep state/component logic inside frontend/src/features/listings.
- Do not add Axios calls or alter App.jsx.
- Make the public component interfaces obvious through props.
- Member 4 must be able to replace mock data with API data easily.

DELIVERABLE:
Test search, filter, validation, and reserve-button states using mock data. Commit meaningful changes and tell Member 4 the exported component names and props.

I am member 3 and only do my part