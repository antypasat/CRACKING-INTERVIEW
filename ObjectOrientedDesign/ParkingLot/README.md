# 7.4 Parking Lot / Parking

## Problem
Design a parking lot using object-oriented principles. The parking lot should support different vehicle types (motorcycle, car, truck) with different spot sizes. Implement functionality for parking vehicles, removing vehicles, and calculating parking fees.

Zaprojektuj parking wykorzystując zasady programowania obiektowego. Parking powinien obsługiwać różne typy pojazdów (motocykl, samochód, ciężarówka) z różnymi rozmiarami miejsc. Zaimplementuj funkcjonalność parkowania pojazdów, usuwania pojazdów i obliczania opłat parkingowych.

## OOP Design / Projekt OOP

### Core Classes / Podstawowe Klasy

```
Vehicle (abstract base)
├── licensePlate: string
├── type: VehicleType
├── spotsNeeded: int
├── canFitInSpot(spot) → boolean
└── toString()

Motorcycle extends Vehicle
├── type = MOTORCYCLE
├── spotsNeeded = 1
└── canFitInSpot() → true (fits anywhere)

Car extends Vehicle
├── type = CAR
├── spotsNeeded = 1
└── canFitInSpot() → REGULAR or LARGE only

Truck extends Vehicle
├── type = TRUCK
├── spotsNeeded = 1
└── canFitInSpot() → LARGE only

ParkingSpot
├── id: int
├── size: SpotSize (COMPACT/REGULAR/LARGE)
├── level: int
├── row: string
├── status: SpotStatus (AVAILABLE/OCCUPIED)
├── vehicle: Vehicle
├── isAvailable() → boolean
├── canFitVehicle(vehicle) → boolean
├── park(vehicle) → boolean
└── removeVehicle() → Vehicle

ParkingLevel
├── level: int
├── spots: ParkingSpot[]
├── initializeSpots(numSpots)
├── findAvailableSpot(vehicle) → ParkingSpot
├── parkVehicle(vehicle) → ParkingSpot
├── getAvailableCount() → int
└── getOccupiedCount() → int

ParkingTicket
├── ticketId: int
├── vehicle: Vehicle
├── spot: ParkingSpot
├── entryTime: Date
├── exitTime: Date
├── fee: number
├── markExit()
├── getDurationMinutes() → int
└── getDurationHours() → int

FeeCalculator
├── hourlyRates: Map<VehicleType, number>
├── minimumFee: number
└── calculateFee(ticket) → number

ParkingLot
├── name: string
├── levels: ParkingLevel[]
├── tickets: Map<ticketId, ParkingTicket>
├── activeTickets: Map<licensePlate, ParkingTicket>
├── feeCalculator: FeeCalculator
├── parkVehicle(vehicle) → ParkingTicket
├── removeVehicle(licensePlate) → ParkingTicket
├── getAvailableSpots() → int
├── getTotalSpots() → int
├── getOccupancyRate() → number
└── getRevenueStats() → object
```

## Key Design Decisions / Kluczowe Decyzje Projektowe

### 1. Vehicle-Spot Compatibility
Each vehicle type can fit in specific spot sizes:

| Vehicle Type | Compact | Regular | Large |
|-------------|---------|---------|-------|
| Motorcycle  | ✓       | ✓       | ✓     |
| Car         | ✗       | ✓       | ✓     |
| Truck       | ✗       | ✗       | ✓     |

Implemented via polymorphic `canFitInSpot()` method:
```javascript
// Motorcycle can fit anywhere
canFitInSpot(spot) {
  return true;
}

// Car needs regular or large
canFitInSpot(spot) {
  return spot.size === REGULAR || spot.size === LARGE;
}

// Truck needs large only
canFitInSpot(spot) {
  return spot.size === LARGE;
}
```

### 2. Multi-Level Architecture
- Parking lot contains multiple levels
- Each level has distributed spot sizes (30% compact, 50% regular, 20% large)
- Vehicle placement algorithm tries levels sequentially

### 3. Ticket-Based System
- Ticket issued when vehicle parks
- Ticket tracks: vehicle, spot, entry time
- Active tickets stored by license plate for quick lookup
- Historical tickets stored by ticket ID

### 4. Fee Calculation
```javascript
Fee = max(hours × hourlyRate, minimumFee)

Hourly Rates:
- Motorcycle: $2/hour
- Car: $4/hour
- Truck: $6/hour

Minimum Fee: $5
```

### 5. Encapsulation Strategy
- **ParkingSpot:** Manages spot state and vehicle assignment
- **ParkingLevel:** Manages collection of spots, finds available spots
- **ParkingLot:** Orchestrates parking/removal, manages tickets
- **FeeCalculator:** Isolated fee logic (easy to modify pricing)

## Example Usage / Przykład Użycia

```javascript
// Create parking lot: 3 levels, 20 spots each
const parkingLot = new ParkingLot('Downtown Parking', 3, 20);

// Park vehicles
const car = new Car('ABC-123');
const ticket = parkingLot.parkVehicle(car);
// → Returns ParkingTicket with spot assignment

const motorcycle = new Motorcycle('MOTO-456');
parkingLot.parkVehicle(motorcycle);

const truck = new Truck('TRUCK-789');
parkingLot.parkVehicle(truck);

// Check status
parkingLot.printStatus();
// → Shows available spots, occupancy rate

// Remove vehicle (calculates fee)
const completedTicket = parkingLot.removeVehicle('ABC-123');
// → Fee calculated based on duration

// Get statistics
const stats = parkingLot.getRevenueStats();
// → Total revenue, average fee, etc.
```

## Parking Flow / Przepływ Parkowania

### Park Vehicle
```
1. Check if vehicle already parked
   ├─ Yes → Return error
   └─ No → Continue

2. For each level:
   ├─ Find available spot that fits vehicle
   ├─ If found:
   │  ├─ Assign vehicle to spot
   │  ├─ Create ticket
   │  ├─ Store in active tickets
   │  └─ Return ticket
   └─ If not found → Try next level

3. No spot found → Return null
```

### Remove Vehicle
```
1. Lookup ticket by license plate
   ├─ Not found → Return error
   └─ Found → Continue

2. Remove vehicle from spot
   ├─ Set spot status to AVAILABLE
   └─ Clear spot's vehicle reference

3. Mark ticket exit time

4. Calculate fee
   ├─ Duration in hours (rounded up)
   ├─ Apply hourly rate for vehicle type
   └─ Apply minimum fee if needed

5. Remove from active tickets

6. Return completed ticket with fee
```

## Features Implemented / Zaimplementowane Funkcje

### Core Parking Operations
1. **Park Vehicle:** Assign vehicle to appropriate spot
2. **Remove Vehicle:** Clear spot and calculate fee
3. **Multi-Level Support:** Search across multiple levels
4. **Spot Type Distribution:** Automatic allocation of spot sizes

### Vehicle Management
1. **Type-Based Restrictions:** Different vehicles fit different spots
2. **License Plate Tracking:** Quick lookup by plate number
3. **Duplicate Prevention:** Can't park same vehicle twice

### Fee System
1. **Time-Based Fees:** Calculated by duration
2. **Type-Based Rates:** Different rates per vehicle type
3. **Minimum Fee:** Ensures minimum charge
4. **Automatic Calculation:** Computed on removal

### Statistics & Monitoring
1. **Occupancy Tracking:** Available vs. occupied spots
2. **Revenue Statistics:** Total revenue, average fee
3. **Level Status:** Per-level availability
4. **Ticket History:** All completed transactions

## OOP Principles Applied / Zastosowane Zasady OOP

### 1. Inheritance
- Vehicle hierarchy: Motorcycle, Car, Truck extend Vehicle
- Common vehicle properties inherited
- Specialized behavior in subclasses

### 2. Polymorphism
- `canFitInSpot()` behaves differently for each vehicle type
- All vehicles handled uniformly in parking logic
- Runtime determination of spot compatibility

### 3. Encapsulation
- Spot state managed internally
- Fee calculation logic isolated in FeeCalculator
- Ticket management hidden from external callers

### 4. Abstraction
- Vehicle provides abstract interface
- ParkingLot hides complex multi-level logic
- Clean public API for parking operations

### 5. Single Responsibility
- **Vehicle:** Vehicle data and spot compatibility
- **ParkingSpot:** Spot state and occupancy
- **ParkingLevel:** Collection management
- **ParkingTicket:** Transaction tracking
- **FeeCalculator:** Pricing logic
- **ParkingLot:** System orchestration

### 6. Composition
- ParkingLot composed of ParkingLevels
- ParkingLevel composed of ParkingSpots
- Ticket references Vehicle and Spot

## Extensions / Rozszerzenia

Easy to extend for:

### Pricing Extensions
- **Time-of-day pricing:** Peak/off-peak rates
- **Monthly passes:** Subscription-based access
- **Early bird specials:** Discount for early arrival
- **Maximum daily rate:** Cap on daily charges

### Spot Management
- **Reserved spots:** VIP or disabled parking
- **Spot preferences:** Near elevator, covered, etc.
- **Multiple spots:** Large vehicles need multiple spots
- **Electric vehicle charging:** Special EV spots

### User Features
- **Reservations:** Book spot in advance
- **Mobile payments:** Pay via app
- **Spot finding:** Guide to assigned spot
- **Loyalty program:** Rewards for frequent parkers

### Operations
- **Valet mode:** Staff parks vehicle
- **Validation system:** Merchant validation
- **Event parking:** Special event rates/allocation
- **Maintenance mode:** Mark spots as unavailable

### Analytics
- **Peak hours:** Track busiest times
- **Spot utilization:** Which spots most used
- **Revenue forecasting:** Predict income
- **Wait time tracking:** Monitor entry/exit times

## Complexity / Złożoność

### Time Complexity
- **Park vehicle:** O(L × S) where L = levels, S = spots per level (worst case)
  - Average case much better with early exit
- **Remove vehicle:** O(1) - Map lookup by license plate
- **Get available spots:** O(L × S) - scan all spots
- **Calculate fee:** O(1)

### Space Complexity
- **Total spots:** O(L × S)
- **Active tickets:** O(V) where V = parked vehicles
- **Historical tickets:** O(T) where T = total transactions
- **Overall:** O(L × S + T)

## Optimizations / Optymalizacje

1. **Spot Availability Cache:**
   - Track count per level instead of scanning
   - Update on park/remove
   - O(1) availability check

2. **Spot Index by Size:**
   - Separate lists for each spot size
   - Direct lookup instead of scan
   - Faster spot finding

3. **Priority Queue:**
   - Prefer spots closer to entrance
   - Implement spot scoring system

## Testing Coverage / Pokrycie Testowe

1. ✅ Creating parking lot with multiple levels
2. ✅ Parking different vehicle types
3. ✅ Parking multiple vehicles
4. ✅ Removing vehicles and fee calculation
5. ✅ Preventing duplicate parking
6. ✅ Re-parking previously removed vehicle
7. ✅ Filling up parking lot
8. ✅ Handling full parking lot
9. ✅ Vehicle-spot compatibility rules
10. ✅ Revenue statistics tracking

## Real-World Applications / Aplikacje w Świecie Rzeczywistym

This design pattern applies to:
- **Airport parking:** Multiple terminals, long-term/short-term
- **Shopping mall parking:** Validation, reserved spots
- **Office building parking:** Employee permits, visitor parking
- **Hospital parking:** Emergency, visitor, staff zones
- **Street parking meters:** Individual spot tracking
- **Parking garages:** Multi-level commercial facilities

## Edge Cases Handled / Obsługa Przypadków Brzegowych

1. ✅ Parking lot full → Return null, no spot assigned
2. ✅ Vehicle already parked → Prevent duplicate tickets
3. ✅ Removing non-existent vehicle → Return error message
4. ✅ Wrong spot size → Vehicle can't fit, try next spot
5. ✅ Zero duration → Minimum fee applied
6. ✅ All compact spots full → Try regular/large for motorcycle
