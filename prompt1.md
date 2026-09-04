Build ShareBite LK — a platform that helps Sri Lankan cafés, bakeries, caterers, and restaurants post safe surplus food for nearby community groups or individuals to reserve before it is wasted.
It is focused, practical, and easy to demonstrate: users can post a food listing, search/filter available food, and reserve a listing. It clearly meets every required functional item. Sri Lanka has ongoing food-security challenges; WFP reports many households face inadequate diets

Branches
- feature/backend-listings — Member 1
- feature/ui-shell — Member 2
- feature/listing-features — Member 3
- feature/integration-deployment — Member 4


I am Member 1. Work only on branch feature/backend-listings.

PROJECT: ShareBite LK, a Sri Lankan surplus-food sharing platform.

OWN THESE FILES/FOLDERS ONLY:
- backend/src/models/
- backend/src/controllers/
- backend/src/routes/
- backend/src/config/
- backend/src/middleware/
- backend/src/server.js
- backend/package.json if absolutely needed

DO NOT EDIT:
- frontend/
- README.md
- deployment files

TASK:
Keep the existing authentication API working. Add a Listing model and these endpoints:

1. GET /api/listings
   - Supports optional query parameters: search, district, category, status.
   - Default status must be available.
   - Search title and description case-insensitively.
   - Return listings sorted newest first.

2. POST /api/listings
   - Requires JWT authentication.
   - Accept title, description, category, portions, district, pickupAddress, availableUntil.
   - Create listing with status: available.

3. PATCH /api/listings/:id/reserve
   - Requires JWT authentication.
   - Change an available listing to reserved.
   - Return a friendly error if already reserved or not found.

VALIDATION:
- title: 3 to 100 characters
- description: 10 to 500 characters
- category: required; Meals, Bakery, Produce, or Other
- portions: whole number between 1 and 500
- district: required
- pickupAddress: 5 to 200 characters
- availableUntil: a future date/time
- Return clear JSON errors: { "message": "..." }

SAMPLE DATA:
When the database has no listings, add 4 safe sample listings relevant to Sri Lanka, such as Colombo bakery items, Kandy meals, Galle produce, and Jaffna catering portions. Do not overwrite existing data.

DEPLOYMENT:
- Preserve process.env.PORT || 5000 and bind to 0.0.0.0.
- Preserve CORS using CLIENT_URL, allowing comma-separated URLs.
- Keep GET /api/health working.

DELIVERABLE:
Test all endpoints locally. Commit in small meaningful commits. Tell the team the final request and response JSON shapes.

I am member  and only do my part