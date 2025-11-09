# 6.6 Blue-Eyed Island / Wyspa Niebieskich Oczu

## Problem
A bunch of people are living on an island, when a visitor comes with a strange order: all blue-eyed people must leave the island as soon as possible. There will be a flight out at 8:00 pm every evening. Each person can see everyone else's eye color, but they do not know their own (nor is anyone allowed to tell them). Additionally, they do not know how many people have blue eyes, although they do know that at least one person does. How many days will it take the blue-eyed people to leave?

## Solution / Rozwiązanie

**Answer: If there are n blue-eyed people, they all leave on day n.**

## Proof by Induction / Dowód przez Indukcję

### Base Case: n = 1
- The person sees no other blue eyes
- Visitor announces: "at least one has blue eyes"
- Person realizes: "I must be the one!"
- **Leaves on day 1**

### Case: n = 2 (people A and B)

**Day 1:**
- A sees B (blue eyes), thinks: "Maybe only B has blue eyes"
- B sees A (blue eyes), thinks: "Maybe only A has blue eyes"
- Both wait → no one leaves

**Day 2:**
- A thinks: "If only B had blue eyes, B would have left yesterday"
- A realizes: "Since B didn't leave, B must see another blue-eyed person = ME!"
- B makes the same reasoning
- **Both leave on day 2**

### Case: n = 3

**Day 1-2:** Everyone waits (each sees 2 blue-eyed people)

**Day 3:**
- Each person expected the 2 people they see to leave on day 2
- Since no one left, there must be 3 blue-eyed people
- Each realizes: "I'm the 3rd one!"
- **All 3 leave on day 3**

### General: n blue-eyed people

By induction, if n people have blue eyes:
- Each person sees n-1 blue-eyed people
- They expect those n-1 to leave on day n-1 (by inductive hypothesis)
- When no one leaves on day n-1, everyone realizes there are n blue-eyed people
- **All n leave on day n**

## Why Does the Announcement Matter? / Dlaczego Ogłoszenie Ma Znaczenie?

**Before announcement:**
- Everyone already knew at least one person has blue eyes
- (They could see blue-eyed people)

**After announcement:**
- Everyone knows that **EVERYONE** knows at least one has blue eyes
- This is **common knowledge**

**Example with n=2:**
- Before: A knows B has blue eyes, but doesn't know if B knows anyone has blue eyes
- After: A knows that B knows someone has blue eyes
- This allows the inductive reasoning chain to start!

## Key Insight / Kluczowa Obserwacja

This problem is about **common knowledge**:
- The announcement doesn't give new information to any individual
- But it creates **shared knowledge** that everyone is working from the same information
- The announcement acts as a synchronized "clock" that starts everyone's reasoning

Problem dotyczy **wspólnej wiedzy**:
- Ogłoszenie nie daje nowej informacji żadnej osobie indywidualnie
- Ale tworzy **wspólną wiedzę** że wszyscy pracują z tych samych informacji
- Ogłoszenie działa jak zsynchronizowany "zegar" startujący rozumowanie wszystkich

## Complexity / Złożoność
- **Time:** O(1) - simple formula: n people → day n
- **Space:** O(1)
