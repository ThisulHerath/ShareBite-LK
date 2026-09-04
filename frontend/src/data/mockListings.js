// Mock listings for ShareBite LK — realistic Sri Lankan surplus-food samples
export const mockListings = [
  {
    id: 'sln-001',
    title: 'Fresh bun batch from bakery',
    description: 'Assorted sweet and plain buns baked this morning. Good until end of day.',
    category: 'Bakery',
    portions: 24,
    district: 'Colombo',
    pickupAddress: 'No. 12, Galle Road, Colombo 03 (near Pettah market)',
    availableUntil: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    status: 'available'
  },
  {
    id: 'sln-002',
    title: 'Vegetable rice (family packs)',
    description: 'Leftover vegetable rice in sealed trays — 10 family-size portions.',
    category: 'Catering',
    portions: 10,
    district: 'Gampaha',
    pickupAddress: 'Gampaha Town Hall, Main Road',
    availableUntil: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    status: 'available'
  },
  {
    id: 'sln-003',
    title: 'Prepared kottu (small packs)',
    description: 'Small takeaway packs of kottu — mixed veg and chicken. Best within 8 hours.',
    category: 'Restaurant',
    portions: 12,
    district: 'Kandy',
    pickupAddress: '22 Temple Street, Kandy',
    availableUntil: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    status: 'reserved'
  },
  {
    id: 'sln-004',
    title: 'Samosa / vade packs',
    description: 'Tray of assorted samosas and vade — vegetarian and meat options.',
    category: 'Bakery',
    portions: 30,
    district: 'Negombo',
    pickupAddress: 'Negombo Fish Market Rd, near the lagoon',
    availableUntil: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    status: 'available'
  }
];

export default mockListings;
