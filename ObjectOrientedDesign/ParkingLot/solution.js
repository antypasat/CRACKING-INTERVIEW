// 7.4 Parking Lot - Vehicle parking system with different spot sizes and fees
// 7.4 Parking - System parkowania pojazdów z różnymi rozmiarami miejsc i opłatami

// Enum for vehicle types / Enum dla typów pojazdów
const VehicleType = {
  MOTORCYCLE: 'Motorcycle',
  CAR: 'Car',
  TRUCK: 'Truck'
};

// Enum for spot sizes / Enum dla rozmiarów miejsc
const SpotSize = {
  COMPACT: 'Compact',      // For motorcycles
  REGULAR: 'Regular',      // For cars
  LARGE: 'Large'           // For trucks
};

// Enum for spot status / Enum dla statusów miejsc
const SpotStatus = {
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied'
};

// Vehicle base class / Podstawowa klasa Vehicle
class Vehicle {
  constructor(licensePlate, type) {
    this.licensePlate = licensePlate;
    this.type = type;
    this.spotsNeeded = 1;
  }

  canFitInSpot(spot) {
    // Override in subclasses
    return false;
  }

  toString() {
    return `${this.type} [${this.licensePlate}]`;
  }
}

// Motorcycle - fits in any spot / Motocykl - pasuje na każde miejsce
class Motorcycle extends Vehicle {
  constructor(licensePlate) {
    super(licensePlate, VehicleType.MOTORCYCLE);
    this.spotsNeeded = 1;
  }

  canFitInSpot(spot) {
    // Motorcycle can fit in any spot
    return true;
  }
}

// Car - needs regular or large spot / Samochód - potrzebuje zwykłego lub dużego miejsca
class Car extends Vehicle {
  constructor(licensePlate) {
    super(licensePlate, VehicleType.CAR);
    this.spotsNeeded = 1;
  }

  canFitInSpot(spot) {
    return spot.size === SpotSize.REGULAR || spot.size === SpotSize.LARGE;
  }
}

// Truck - needs large spot / Ciężarówka - potrzebuje dużego miejsca
class Truck extends Vehicle {
  constructor(licensePlate) {
    super(licensePlate, VehicleType.TRUCK);
    this.spotsNeeded = 1;
  }

  canFitInSpot(spot) {
    return spot.size === SpotSize.LARGE;
  }
}

// Parking Spot / Miejsce parkingowe
class ParkingSpot {
  constructor(id, size, level, row) {
    this.id = id;
    this.size = size;
    this.level = level;
    this.row = row;
    this.status = SpotStatus.AVAILABLE;
    this.vehicle = null;
  }

  isAvailable() {
    return this.status === SpotStatus.AVAILABLE;
  }

  canFitVehicle(vehicle) {
    return this.isAvailable() && vehicle.canFitInSpot(this);
  }

  park(vehicle) {
    if (!this.canFitVehicle(vehicle)) {
      return false;
    }
    this.vehicle = vehicle;
    this.status = SpotStatus.OCCUPIED;
    return true;
  }

  removeVehicle() {
    const vehicle = this.vehicle;
    this.vehicle = null;
    this.status = SpotStatus.AVAILABLE;
    return vehicle;
  }

  toString() {
    const vehicleInfo = this.vehicle ? this.vehicle.licensePlate : 'Empty';
    return `Spot ${this.id} (${this.size}) - Level ${this.level}, Row ${this.row} [${vehicleInfo}]`;
  }
}

// Parking Level / Poziom parkingu
class ParkingLevel {
  constructor(level, numSpots) {
    this.level = level;
    this.spots = [];
    this.initializeSpots(numSpots);
  }

  initializeSpots(numSpots) {
    // Distribute spots: 30% compact, 50% regular, 20% large
    const numCompact = Math.floor(numSpots * 0.3);
    const numRegular = Math.floor(numSpots * 0.5);
    const numLarge = numSpots - numCompact - numRegular;

    let spotId = this.level * 100; // Level 1 starts at 100, Level 2 at 200, etc.

    // Add compact spots
    for (let i = 0; i < numCompact; i++) {
      this.spots.push(new ParkingSpot(spotId++, SpotSize.COMPACT, this.level, 'A'));
    }

    // Add regular spots
    for (let i = 0; i < numRegular; i++) {
      this.spots.push(new ParkingSpot(spotId++, SpotSize.REGULAR, this.level, 'B'));
    }

    // Add large spots
    for (let i = 0; i < numLarge; i++) {
      this.spots.push(new ParkingSpot(spotId++, SpotSize.LARGE, this.level, 'C'));
    }
  }

  findAvailableSpot(vehicle) {
    for (let spot of this.spots) {
      if (spot.canFitVehicle(vehicle)) {
        return spot;
      }
    }
    return null;
  }

  parkVehicle(vehicle) {
    const spot = this.findAvailableSpot(vehicle);
    if (spot) {
      spot.park(vehicle);
      return spot;
    }
    return null;
  }

  getAvailableCount() {
    return this.spots.filter(spot => spot.isAvailable()).length;
  }

  getOccupiedCount() {
    return this.spots.filter(spot => !spot.isAvailable()).length;
  }

  toString() {
    return `Level ${this.level}: ${this.getAvailableCount()}/${this.spots.length} spots available`;
  }
}

// Parking Ticket / Bilet parkingowy
class ParkingTicket {
  constructor(ticketId, vehicle, spot) {
    this.ticketId = ticketId;
    this.vehicle = vehicle;
    this.spot = spot;
    this.entryTime = new Date();
    this.exitTime = null;
    this.fee = 0;
  }

  markExit() {
    this.exitTime = new Date();
  }

  getDurationMinutes() {
    const endTime = this.exitTime || new Date();
    return Math.ceil((endTime - this.entryTime) / (1000 * 60));
  }

  getDurationHours() {
    return Math.ceil(this.getDurationMinutes() / 60);
  }

  toString() {
    const duration = this.exitTime
      ? `${this.getDurationMinutes()} minutes`
      : 'In progress';
    return `Ticket #${this.ticketId} - ${this.vehicle} at ${this.spot.id} (${duration})`;
  }
}

// Fee Calculator / Kalkulator opłat
class FeeCalculator {
  constructor() {
    // Hourly rates by vehicle type (in dollars)
    this.hourlyRates = {
      [VehicleType.MOTORCYCLE]: 2.00,
      [VehicleType.CAR]: 4.00,
      [VehicleType.TRUCK]: 6.00
    };
    this.minimumFee = 5.00;
  }

  calculateFee(ticket) {
    const hours = ticket.getDurationHours();
    const rate = this.hourlyRates[ticket.vehicle.type];
    const fee = hours * rate;
    return Math.max(fee, this.minimumFee);
  }
}

// Parking Lot - main class / Parking - główna klasa
class ParkingLot {
  constructor(name, numLevels, spotsPerLevel) {
    this.name = name;
    this.levels = [];
    this.tickets = new Map(); // ticketId -> ParkingTicket
    this.activeTickets = new Map(); // licensePlate -> ParkingTicket
    this.feeCalculator = new FeeCalculator();
    this.nextTicketId = 1;

    // Initialize levels
    for (let i = 1; i <= numLevels; i++) {
      this.levels.push(new ParkingLevel(i, spotsPerLevel));
    }
  }

  // Park a vehicle / Zaparkuj pojazd
  parkVehicle(vehicle) {
    // Check if vehicle already parked
    if (this.activeTickets.has(vehicle.licensePlate)) {
      console.log(`⚠ ${vehicle} is already parked`);
      return null;
    }

    // Try to find spot on each level
    for (let level of this.levels) {
      const spot = level.parkVehicle(vehicle);
      if (spot) {
        const ticket = new ParkingTicket(this.nextTicketId++, vehicle, spot);
        this.tickets.set(ticket.ticketId, ticket);
        this.activeTickets.set(vehicle.licensePlate, ticket);
        console.log(`✓ Parked ${vehicle} at Spot ${spot.id} (Level ${level.level})`);
        console.log(`  Ticket #${ticket.ticketId} issued`);
        return ticket;
      }
    }

    console.log(`✗ No available spot for ${vehicle}`);
    return null;
  }

  // Remove vehicle and calculate fee / Usuń pojazd i oblicz opłatę
  removeVehicle(licensePlate) {
    const ticket = this.activeTickets.get(licensePlate);

    if (!ticket) {
      console.log(`⚠ No vehicle with license plate ${licensePlate} found`);
      return null;
    }

    // Remove vehicle from spot
    ticket.spot.removeVehicle();
    ticket.markExit();

    // Calculate fee
    ticket.fee = this.feeCalculator.calculateFee(ticket);

    // Remove from active tickets
    this.activeTickets.delete(licensePlate);

    console.log(`✓ ${ticket.vehicle} removed from Spot ${ticket.spot.id}`);
    console.log(`  Duration: ${ticket.getDurationMinutes()} minutes (${ticket.getDurationHours()} hours)`);
    console.log(`  Fee: $${ticket.fee.toFixed(2)}`);

    return ticket;
  }

  // Get available spots count / Pobierz liczbę dostępnych miejsc
  getAvailableSpots() {
    let total = 0;
    for (let level of this.levels) {
      total += level.getAvailableCount();
    }
    return total;
  }

  // Get total spots / Pobierz całkowitą liczbę miejsc
  getTotalSpots() {
    let total = 0;
    for (let level of this.levels) {
      total += level.spots.length;
    }
    return total;
  }

  // Get occupancy rate / Pobierz stopień zapełnienia
  getOccupancyRate() {
    const total = this.getTotalSpots();
    const available = this.getAvailableSpots();
    return ((total - available) / total * 100).toFixed(1);
  }

  // Print status / Wyświetl status
  printStatus() {
    console.log('\n' + '='.repeat(70));
    console.log(`🅿️  ${this.name.toUpperCase()} STATUS`);
    console.log('='.repeat(70));
    console.log(`Total Spots: ${this.getTotalSpots()}`);
    console.log(`Available: ${this.getAvailableSpots()}`);
    console.log(`Occupied: ${this.getTotalSpots() - this.getAvailableSpots()}`);
    console.log(`Occupancy Rate: ${this.getOccupancyRate()}%`);
    console.log(`Active Vehicles: ${this.activeTickets.size}`);
    console.log('-'.repeat(70));
    for (let level of this.levels) {
      console.log(level.toString());
    }
    console.log('='.repeat(70));
  }

  // Get revenue statistics / Pobierz statystyki przychodów
  getRevenueStats() {
    let totalRevenue = 0;
    let completedTickets = 0;

    for (let ticket of this.tickets.values()) {
      if (ticket.exitTime) {
        totalRevenue += ticket.fee;
        completedTickets++;
      }
    }

    return {
      totalRevenue,
      completedTickets,
      averageFee: completedTickets > 0 ? totalRevenue / completedTickets : 0,
      activeTickets: this.activeTickets.size
    };
  }

  printRevenueStats() {
    const stats = this.getRevenueStats();
    console.log('\n' + '='.repeat(70));
    console.log('💰 REVENUE STATISTICS');
    console.log('='.repeat(70));
    console.log(`Total Revenue: $${stats.totalRevenue.toFixed(2)}`);
    console.log(`Completed Tickets: ${stats.completedTickets}`);
    console.log(`Average Fee: $${stats.averageFee.toFixed(2)}`);
    console.log(`Active Tickets: ${stats.activeTickets}`);
    console.log('='.repeat(70));
  }
}

// Tests
console.log('='.repeat(70));
console.log('7.4 PARKING LOT - VEHICLE PARKING MANAGEMENT SYSTEM');
console.log('='.repeat(70));

console.log('\nTest 1: Creating Parking Lot');
console.log('-'.repeat(70));
const parkingLot = new ParkingLot('Downtown Parking', 3, 20);
console.log(`Created "${parkingLot.name}" with ${parkingLot.levels.length} levels`);
console.log(`Total capacity: ${parkingLot.getTotalSpots()} spots`);
parkingLot.printStatus();

console.log('\nTest 2: Parking Different Vehicle Types');
console.log('-'.repeat(70));
const motorcycle1 = new Motorcycle('MOTO-001');
const car1 = new Car('CAR-001');
const truck1 = new Truck('TRUCK-001');

parkingLot.parkVehicle(motorcycle1);
parkingLot.parkVehicle(car1);
parkingLot.parkVehicle(truck1);

parkingLot.printStatus();

console.log('\nTest 3: Parking Multiple Vehicles');
console.log('-'.repeat(70));
const vehicles = [
  new Car('CAR-002'),
  new Car('CAR-003'),
  new Motorcycle('MOTO-002'),
  new Motorcycle('MOTO-003'),
  new Truck('TRUCK-002'),
  new Car('CAR-004'),
  new Car('CAR-005')
];

vehicles.forEach(vehicle => parkingLot.parkVehicle(vehicle));
parkingLot.printStatus();

console.log('\nTest 4: Removing Vehicles and Fee Calculation');
console.log('-'.repeat(70));

// Simulate some time passing (for demo, we'll just calculate fees)
console.log('Removing some vehicles...\n');

// Wait a bit (simulated)
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Remove vehicles
parkingLot.removeVehicle('MOTO-001');
console.log();
parkingLot.removeVehicle('CAR-001');
console.log();
parkingLot.removeVehicle('TRUCK-001');

parkingLot.printStatus();

console.log('\nTest 5: Attempting to Park Already Parked Vehicle');
console.log('-'.repeat(70));
parkingLot.parkVehicle(car1); // Should fail - already has active ticket

console.log('\nTest 6: Re-parking Previously Removed Vehicle');
console.log('-'.repeat(70));
// After removal, should be able to park again
const newTicket = parkingLot.parkVehicle(new Car('CAR-001'));

console.log('\nTest 7: Filling Up Parking Lot');
console.log('-'.repeat(70));
console.log('Parking many vehicles...\n');

let parkedCount = 0;
for (let i = 100; i < 200; i++) {
  const vehicle = i % 3 === 0 ? new Motorcycle(`MOTO-${i}`) :
                  i % 3 === 1 ? new Car(`CAR-${i}`) :
                  new Truck(`TRUCK-${i}`);

  const ticket = parkingLot.parkVehicle(vehicle);
  if (ticket) parkedCount++;

  // Stop when lot is full
  if (parkingLot.getAvailableSpots() === 0) {
    console.log('\n🚫 Parking lot is FULL!');
    break;
  }
}

console.log(`\nSuccessfully parked ${parkedCount} additional vehicles`);
parkingLot.printStatus();

console.log('\nTest 8: Attempting to Park When Full');
console.log('-'.repeat(70));
const lateCar = new Car('LATE-001');
parkingLot.parkVehicle(lateCar);

console.log('\nTest 9: Vehicle Type Spot Compatibility');
console.log('-'.repeat(70));
console.log('Testing spot compatibility rules:');

const testSpots = [
  new ParkingSpot(1, SpotSize.COMPACT, 1, 'A'),
  new ParkingSpot(2, SpotSize.REGULAR, 1, 'B'),
  new ParkingSpot(3, SpotSize.LARGE, 1, 'C')
];

const testVehicles = [
  new Motorcycle('TEST-M'),
  new Car('TEST-C'),
  new Truck('TEST-T')
];

for (let vehicle of testVehicles) {
  console.log(`\n${vehicle}:`);
  for (let spot of testSpots) {
    const fits = vehicle.canFitInSpot(spot);
    console.log(`  ${spot.size} spot: ${fits ? '✓ Can fit' : '✗ Cannot fit'}`);
  }
}

console.log('\nTest 10: Revenue Statistics');
console.log('-'.repeat(70));

// Remove several vehicles to generate revenue
const vehiclesToRemove = ['CAR-002', 'MOTO-002', 'TRUCK-002', 'CAR-003', 'MOTO-003'];
console.log('Removing vehicles to generate fees...\n');

for (let plate of vehiclesToRemove) {
  parkingLot.removeVehicle(plate);
  console.log();
}

parkingLot.printRevenueStats();

console.log('\n' + '='.repeat(70));
console.log('OOP Design Principles Demonstrated:');
console.log('- Inheritance: Motorcycle, Car, Truck extend Vehicle');
console.log('- Polymorphism: canFitInSpot() behaves differently per vehicle type');
console.log('- Encapsulation: Parking logic encapsulated in ParkingLot');
console.log('- Abstraction: Vehicle interface abstracts different types');
console.log('- Single Responsibility: Spot, Level, Ticket, FeeCalculator separated');
console.log('- Composition: ParkingLot composed of Levels, Levels of Spots');
console.log('='.repeat(70));
