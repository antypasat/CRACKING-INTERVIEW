# 7.2 Call Center / Call Center

## Problem
Imagine you have a call center with three levels of employees: respondent, manager, and director. An incoming telephone call must be first allocated to a respondent who is free. If the respondent can't handle the call, he or she must escalate the call to a manager. If the manager is not free or not able to handle it, then the call should be escalated to a director. Design the classes and data structures for this problem. Implement a method dispatchCall() which assigns a call to the first available employee.

Wyobraź sobie call center z trzema poziomami pracowników: respondent, manager i director. Przychodzące połączenie telefoniczne musi być najpierw przydzielone wolnemu respondentowi. Jeśli respondent nie może obsłużyć połączenia, musi je eskalować do managera. Jeśli manager nie jest wolny lub nie może go obsłużyć, to połączenie powinno być eskalowane do directora. Zaprojektuj klasy i struktury danych dla tego problemu. Zaimplementuj metodę dispatchCall(), która przydziela połączenie pierwszemu dostępnemu pracownikowi.

## OOP Design / Projekt OOP

### Core Classes / Podstawowe Klasy

```
Call
├── id: int
├── caller: string
├── status: CallStatus (Waiting/In Progress/Completed)
├── handler: Employee
├── rank: Rank (required rank to handle)
├── setHandler(employee)
├── complete()
├── escalate()
└── getDuration()

Employee (base class)
├── id: int
├── name: string
├── rank: Rank
├── currentCall: Call
├── callCenter: CallCenter
├── isFree() → boolean
├── receiveCall(call)
├── completeCall()
└── escalateCall()

Respondent extends Employee
└── rank = RESPONDENT

Manager extends Employee
└── rank = MANAGER

Director extends Employee
└── rank = DIRECTOR

CallCenter
├── employees: Map<Rank, Employee[]>
├── callQueue: Call[]
├── completedCalls: Call[]
├── addEmployee(employee)
├── dispatchCall(call) → boolean
├── getAvailableEmployee(rank) → Employee
├── receiveCall(caller) → Call
├── completeCall(employee)
└── getStatistics()
```

## Key Design Decisions / Kluczowe Decyzje Projektowe

### 1. Employee Hierarchy
- **Base Employee class** provides common functionality
- **Respondent, Manager, Director** extend Employee with specific ranks
- All employees can handle calls the same way (polymorphism)

### 2. Call Routing Strategy
```javascript
dispatchCall(call):
  1. Get required rank from call
  2. Find first available employee at that rank
  3. If available → assign call
  4. If not available → add to queue
```

### 3. Escalation Mechanism
- Call tracks required rank (starts at RESPONDENT)
- Employee can escalate: moves call to next rank level
- Escalated call re-enters dispatch system
```javascript
escalate():
  RESPONDENT → MANAGER → DIRECTOR
```

### 4. Queue Management
- FIFO queue for waiting calls
- When employee becomes free, queue is checked
- Calls dispatched based on availability

### 5. Encapsulation
- CallCenter manages all employees and routing logic
- Call encapsulates call state and escalation
- Employee manages own availability

## Example Usage / Przykład Użycia

```javascript
// Create call center
const callCenter = new CallCenter();

// Add employees
callCenter.addEmployee(new Respondent(1, 'Alice'));
callCenter.addEmployee(new Respondent(2, 'Bob'));
callCenter.addEmployee(new Manager(3, 'Charlie'));
callCenter.addEmployee(new Director(4, 'Diana'));

// Receive incoming call
const call = callCenter.receiveCall('Customer John');
// → Dispatched to first available Respondent

// Employee handles and completes
callCenter.completeCall(alice);

// Escalate if needed
alice.escalateCall(); // → Call goes to Manager
```

## Call Flow Scenarios / Scenariusze Przepływu Połączeń

### Scenario 1: Normal Call
1. Customer calls → Call created
2. Dispatched to available Respondent
3. Respondent handles and completes
4. Call marked as completed

### Scenario 2: Escalation
1. Customer calls → Assigned to Respondent
2. Respondent cannot handle → escalateCall()
3. Call rank changes to MANAGER
4. Re-dispatched to available Manager
5. Manager handles and completes

### Scenario 3: Queue
1. Multiple calls arrive
2. All Respondents busy
3. Calls added to queue (FIFO)
4. When Respondent becomes free → queue processed
5. Next call dispatched

### Scenario 4: Full Escalation Chain
1. Call → Respondent (cannot handle)
2. Escalate → Manager (cannot handle)
3. Escalate → Director (handles)

## Features Implemented / Zaimplementowane Funkcje

1. **Three-level Hierarchy:** Respondent → Manager → Director
2. **Automatic Dispatching:** First available employee at required rank
3. **Call Escalation:** Move call up the hierarchy
4. **Queue Management:** FIFO queue when all employees busy
5. **Statistics:** Track busy/available employees, queued/completed calls
6. **Status Tracking:** Monitor call and employee states

## OOP Principles Applied / Zastosowane Zasady OOP

1. **Inheritance:** Employee hierarchy (Respondent, Manager, Director)
2. **Encapsulation:** Call routing logic hidden in CallCenter
3. **Abstraction:** Employee interface abstracts rank differences
4. **Polymorphism:** All employee types handled uniformly
5. **Single Responsibility:**
   - Call: manages call state
   - Employee: handles call operations
   - CallCenter: routes and manages calls

## Extensions / Rozszerzenia

Easy to extend for:
- **Multiple call types:** Technical support, billing, sales
- **Priority queues:** VIP customers get priority
- **Skill-based routing:** Route to employees with specific skills
- **Call transfer:** Transfer between employees
- **Conference calls:** Multiple employees on one call
- **Call recording:** Track conversation logs
- **Performance metrics:** Average handle time, calls per employee
- **Shift management:** Track employee schedules

## Complexity / Złożoność

- **dispatchCall():** O(n) where n = employees at required rank
- **escalate():** O(1) to update rank, O(n) to re-dispatch
- **completeCall():** O(1) to complete, O(m) to check queue (m = queued calls)
- **getStatistics():** O(e) where e = total employees
- **Space:** O(e + c) where e = employees, c = active + queued calls

## Testing Coverage / Pokrycie Testowe

1. ✅ Basic call dispatching to respondents
2. ✅ Call completion and queue processing
3. ✅ Escalation from Respondent to Manager
4. ✅ Escalation from Manager to Director
5. ✅ Overload scenario (all employees busy)
6. ✅ Queue processing when employees become free
7. ✅ Statistics and status tracking
8. ✅ Stress test with multiple concurrent calls
