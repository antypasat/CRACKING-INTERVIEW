// 7.2 Call Center - Multi-level employee hierarchy with call dispatching
// 7.2 Call Center - Wielopoziomowa hierarchia pracowników z rozdzielaniem połączeń

// Enum for employee ranks / Enum dla rang pracowników
const Rank = {
  RESPONDENT: 'Respondent',
  MANAGER: 'Manager',
  DIRECTOR: 'Director'
};

// Enum for call status / Enum dla statusów połączeń
const CallStatus = {
  WAITING: 'Waiting',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
};

// Call class representing a phone call / Klasa Call reprezentująca połączenie telefoniczne
class Call {
  constructor(id, caller) {
    this.id = id;
    this.caller = caller;
    this.status = CallStatus.WAITING;
    this.handler = null;
    this.rank = Rank.RESPONDENT; // Start at lowest rank
    this.startTime = null;
    this.endTime = null;
  }

  setHandler(employee) {
    this.handler = employee;
    this.status = CallStatus.IN_PROGRESS;
    this.startTime = Date.now();
  }

  complete() {
    this.status = CallStatus.COMPLETED;
    this.endTime = Date.now();
  }

  escalate() {
    // Move to next rank level
    if (this.rank === Rank.RESPONDENT) {
      this.rank = Rank.MANAGER;
    } else if (this.rank === Rank.MANAGER) {
      this.rank = Rank.DIRECTOR;
    }
    this.handler = null;
    this.status = CallStatus.WAITING;
  }

  getDuration() {
    if (this.startTime && this.endTime) {
      return this.endTime - this.startTime;
    }
    return null;
  }

  toString() {
    return `Call #${this.id} from ${this.caller} [${this.status}]`;
  }
}

// Base Employee class / Podstawowa klasa Employee
class Employee {
  constructor(id, name, rank) {
    this.id = id;
    this.name = name;
    this.rank = rank;
    this.currentCall = null;
    this.callCenter = null;
  }

  isFree() {
    return this.currentCall === null;
  }

  receiveCall(call) {
    if (!this.isFree()) {
      throw new Error(`${this.name} is already on a call`);
    }
    this.currentCall = call;
    call.setHandler(this);
    console.log(`  ${this.rank} ${this.name} received ${call}`);
  }

  completeCall() {
    if (this.currentCall) {
      console.log(`  ${this.name} completed ${this.currentCall}`);
      this.currentCall.complete();
      const completedCall = this.currentCall;
      this.currentCall = null;
      return completedCall;
    }
    return null;
  }

  escalateCall() {
    if (this.currentCall) {
      console.log(`  ${this.name} escalating ${this.currentCall}`);
      const call = this.currentCall;
      this.currentCall = null;
      call.escalate();
      this.callCenter.dispatchCall(call);
    }
  }

  toString() {
    const status = this.isFree() ? 'Available' : `On call ${this.currentCall.id}`;
    return `${this.rank} ${this.name} [${status}]`;
  }
}

// Respondent - lowest level employee / Respondent - pracownik najniższego poziomu
class Respondent extends Employee {
  constructor(id, name) {
    super(id, name, Rank.RESPONDENT);
  }
}

// Manager - mid level employee / Manager - pracownik średniego poziomu
class Manager extends Employee {
  constructor(id, name) {
    super(id, name, Rank.MANAGER);
  }
}

// Director - highest level employee / Director - pracownik najwyższego poziomu
class Director extends Employee {
  constructor(id, name) {
    super(id, name, Rank.DIRECTOR);
  }
}

// Call Center - manages employees and dispatches calls
// Call Center - zarządza pracownikami i rozdziela połączenia
class CallCenter {
  constructor() {
    this.employees = {
      [Rank.RESPONDENT]: [],
      [Rank.MANAGER]: [],
      [Rank.DIRECTOR]: []
    };
    this.callQueue = [];
    this.completedCalls = [];
    this.nextCallId = 1;
  }

  addEmployee(employee) {
    employee.callCenter = this;
    this.employees[employee.rank].push(employee);
  }

  // Dispatch call to first available employee of appropriate rank
  // Przydziel połączenie pierwszemu dostępnemu pracownikowi odpowiedniego poziomu
  dispatchCall(call) {
    console.log(`\nDispatching ${call} (requires ${call.rank})...`);

    // Try to find available employee at required rank
    const employee = this.getAvailableEmployee(call.rank);

    if (employee) {
      employee.receiveCall(call);
      return true;
    } else {
      // No one available at this rank, add to queue
      console.log(`  No ${call.rank} available. Adding to queue.`);
      this.callQueue.push(call);
      return false;
    }
  }

  // Get first available employee of given rank
  // Pobierz pierwszego dostępnego pracownika danego poziomu
  getAvailableEmployee(rank) {
    const employeeList = this.employees[rank];
    for (let employee of employeeList) {
      if (employee.isFree()) {
        return employee;
      }
    }
    return null;
  }

  // Create and dispatch a new call / Utwórz i przydziel nowe połączenie
  receiveCall(caller) {
    const call = new Call(this.nextCallId++, caller);
    this.dispatchCall(call);
    return call;
  }

  // Complete a call and dispatch queued calls if any
  // Zakończ połączenie i przydziel kolejkowane połączenia jeśli są
  completeCall(employee) {
    const call = employee.completeCall();
    if (call) {
      this.completedCalls.push(call);
      this.dispatchQueuedCall();
    }
  }

  // Try to dispatch next queued call / Spróbuj przydzielić następne kolejkowane połączenie
  dispatchQueuedCall() {
    if (this.callQueue.length === 0) return;

    // Find a call that can be handled
    for (let i = 0; i < this.callQueue.length; i++) {
      const call = this.callQueue[i];
      if (this.getAvailableEmployee(call.rank)) {
        this.callQueue.splice(i, 1);
        this.dispatchCall(call);
        break;
      }
    }
  }

  // Get statistics / Pobierz statystyki
  getStatistics() {
    const totalEmployees =
      this.employees[Rank.RESPONDENT].length +
      this.employees[Rank.MANAGER].length +
      this.employees[Rank.DIRECTOR].length;

    const busyEmployees =
      this.employees[Rank.RESPONDENT].filter(e => !e.isFree()).length +
      this.employees[Rank.MANAGER].filter(e => !e.isFree()).length +
      this.employees[Rank.DIRECTOR].filter(e => !e.isFree()).length;

    return {
      totalEmployees,
      busyEmployees,
      availableEmployees: totalEmployees - busyEmployees,
      queuedCalls: this.callQueue.length,
      completedCalls: this.completedCalls.length,
      respondents: {
        total: this.employees[Rank.RESPONDENT].length,
        busy: this.employees[Rank.RESPONDENT].filter(e => !e.isFree()).length
      },
      managers: {
        total: this.employees[Rank.MANAGER].length,
        busy: this.employees[Rank.MANAGER].filter(e => !e.isFree()).length
      },
      directors: {
        total: this.employees[Rank.DIRECTOR].length,
        busy: this.employees[Rank.DIRECTOR].filter(e => !e.isFree()).length
      }
    };
  }

  printStatus() {
    const stats = this.getStatistics();
    console.log('\n' + '='.repeat(70));
    console.log('CALL CENTER STATUS');
    console.log('='.repeat(70));
    console.log(`Total Employees: ${stats.totalEmployees} (${stats.busyEmployees} busy, ${stats.availableEmployees} available)`);
    console.log(`Respondents: ${stats.respondents.busy}/${stats.respondents.total} busy`);
    console.log(`Managers: ${stats.managers.busy}/${stats.managers.total} busy`);
    console.log(`Directors: ${stats.directors.busy}/${stats.directors.total} busy`);
    console.log(`Queued Calls: ${stats.queuedCalls}`);
    console.log(`Completed Calls: ${stats.completedCalls}`);
    console.log('='.repeat(70));
  }
}

// Tests
console.log('='.repeat(70));
console.log('7.2 CALL CENTER - EMPLOYEE HIERARCHY & CALL ROUTING');
console.log('='.repeat(70));

console.log('\nTest 1: Setting up Call Center');
console.log('-'.repeat(70));
const callCenter = new CallCenter();

// Add employees
callCenter.addEmployee(new Respondent(1, 'Alice'));
callCenter.addEmployee(new Respondent(2, 'Bob'));
callCenter.addEmployee(new Respondent(3, 'Charlie'));
callCenter.addEmployee(new Manager(4, 'Diana'));
callCenter.addEmployee(new Manager(5, 'Eve'));
callCenter.addEmployee(new Director(6, 'Frank'));

console.log('Added employees:');
for (let rank of Object.values(Rank)) {
  console.log(`  ${rank}s: ${callCenter.employees[rank].map(e => e.name).join(', ')}`);
}

console.log('\nTest 2: Basic Call Dispatching');
console.log('-'.repeat(70));
const call1 = callCenter.receiveCall('Customer 1');
const call2 = callCenter.receiveCall('Customer 2');
const call3 = callCenter.receiveCall('Customer 3');

callCenter.printStatus();

console.log('\nTest 3: Call Completion and Queue Processing');
console.log('-'.repeat(70));
// Complete first call
callCenter.completeCall(callCenter.employees[Rank.RESPONDENT][0]);

console.log('\nTest 4: Call Escalation - Respondent to Manager');
console.log('-'.repeat(70));
const call4 = callCenter.receiveCall('Customer 4');
// Respondent escalates the call
const respondent = callCenter.employees[Rank.RESPONDENT].find(e => !e.isFree());
if (respondent) {
  console.log(`\n${respondent.name} cannot handle the call...`);
  respondent.escalateCall();
}

callCenter.printStatus();

console.log('\nTest 5: Call Escalation - Manager to Director');
console.log('-'.repeat(70));
const call5 = callCenter.receiveCall('VIP Customer');
// Assign to manager first
const manager = callCenter.employees[Rank.MANAGER].find(e => e.isFree());
if (manager && manager.currentCall) {
  console.log(`\n${manager.name} cannot handle the VIP call...`);
  manager.escalateCall();
}

callCenter.printStatus();

console.log('\nTest 6: Overload Scenario - All Respondents Busy');
console.log('-'.repeat(70));
// Make all respondents busy
callCenter.receiveCall('Customer 6');
callCenter.receiveCall('Customer 7');
callCenter.receiveCall('Customer 8');
callCenter.receiveCall('Customer 9'); // Should queue

callCenter.printStatus();

console.log('\nTest 7: Processing Queue');
console.log('-'.repeat(70));
// Complete some calls to free up respondents
const busyRespondent = callCenter.employees[Rank.RESPONDENT].find(e => !e.isFree());
if (busyRespondent) {
  callCenter.completeCall(busyRespondent);
}

callCenter.printStatus();

console.log('\nTest 8: Complete All Calls');
console.log('-'.repeat(70));
// Complete all active calls
for (let rank of Object.values(Rank)) {
  for (let employee of callCenter.employees[rank]) {
    if (!employee.isFree()) {
      callCenter.completeCall(employee);
    }
  }
}

callCenter.printStatus();

console.log('\nTest 9: Stress Test - Multiple Concurrent Calls');
console.log('-'.repeat(70));
console.log('Receiving 10 calls simultaneously...');
const calls = [];
for (let i = 1; i <= 10; i++) {
  calls.push(callCenter.receiveCall(`Stress Test Customer ${i}`));
}

callCenter.printStatus();

console.log('\n' + '='.repeat(70));
console.log('OOP Design Principles Demonstrated:');
console.log('- Inheritance: Respondent, Manager, Director extend Employee');
console.log('- Encapsulation: Call routing logic encapsulated in CallCenter');
console.log('- Abstraction: Employee interface for different ranks');
console.log('- Polymorphism: All employee types can handle calls uniformly');
console.log('- Queue Management: FIFO queue for waiting calls');
console.log('- Escalation Chain: Calls escalate through hierarchy');
console.log('='.repeat(70));
