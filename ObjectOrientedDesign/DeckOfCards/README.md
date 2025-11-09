# 7.1 Deck of Cards / Talia Kart

## Problem
Design the data structures for a generic deck of cards. Explain how you would subclass the data structures to implement blackjack.

Zaprojektuj struktury danych dla ogólnej talii kart. Wyjaśnij jak użyłbyś podklas do implementacji blackjacka.

## OOP Design / Projekt OOP

### Core Classes / Podstawowe Klasy

```
Card
├── suit: Suit
├── value: int (1-13)
└── toString()

Deck
├── cards: Card[]
├── dealtIndex: int
├── initializeDeck()
├── shuffle()
├── dealCard()
└── remainingCards()

BlackjackCard extends Card
├── getValue() → int (handles Ace=11, Face=10)
└── isAce() → boolean

BlackjackHand
├── cards: BlackjackCard[]
├── addCard(card)
├── getValue() → int (handles Ace adjustment)
├── isBusted() → boolean
└── isBlackjack() → boolean

BlackjackDeck extends Deck
└── initializeDeck() (creates BlackjackCard instances)

BlackjackGame
├── deck: BlackjackDeck
├── playerHand: BlackjackHand
├── dealerHand: BlackjackHand
├── startGame()
├── hit(hand)
├── dealerPlay()
└── determineWinner()
```

## Key Design Decisions / Kluczowe Decyzje Projektowe

### 1. Generic Base Classes
- **Card** and **Deck** are generic and game-agnostic
- Can be reused for Poker, Bridge, Hearts, etc.
- Provides foundation for specialization

### 2. Inheritance for Blackjack
- **BlackjackCard** extends **Card** to add game-specific value calculation
- **BlackjackDeck** ensures it creates BlackjackCard instances
- Separates generic card concepts from game rules

### 3. Ace Handling
Special logic in `BlackjackHand.getValue()`:
```javascript
// Start with all Aces as 11
// If busted and have Aces, count some as 1
while (sum > 21 && numAces > 0) {
  sum -= 10; // Convert Ace from 11 to 1
  numAces--;
}
```

### 4. Encapsulation
- Deck manages its own shuffling and dealing
- Hand manages value calculation
- Game orchestrates gameplay

## Example Usage / Przykład Użycia

```javascript
// Create and shuffle deck
const deck = new BlackjackDeck();
deck.shuffle();

// Create game
const game = new BlackjackGame();
game.startGame();

// Player hits
game.hit(game.playerHand);

// Dealer plays (hits until 17+)
game.dealerPlay();

// Determine winner
const result = game.determineWinner();
```

## Blackjack Rules Implemented / Zaimplementowane Zasady

1. **Card Values:**
   - Number cards: face value (2-10)
   - Face cards (J, Q, K): 10
   - Ace: 11 or 1 (whichever doesn't bust)

2. **Blackjack:** Ace + 10-value card = 21 in first 2 cards

3. **Dealer Rules:** Hits on 16 or less, stands on 17+

4. **Outcomes:**
   - Player busts → Dealer wins
   - Dealer busts → Player wins
   - Higher value wins
   - Equal values → Push (tie)
   - Blackjack beats regular 21

## OOP Principles Applied / Zastosowane Zasady OOP

1. **Inheritance:** BlackjackCard extends Card, BlackjackDeck extends Deck
2. **Encapsulation:** Internal state (cards, values) hidden behind methods
3. **Abstraction:** Generic Deck interface can support multiple games
4. **Polymorphism:** getValue() behaves differently in Blackjack context
5. **Single Responsibility:** Each class has one clear purpose

## Extensions / Rozszerzenia

Easy to extend for:
- Multiple players
- Betting system
- Split/Double down
- Insurance
- Multiple decks (6-deck shoe)
- Card counting tracking

## Complexity / Złożoność
- **Shuffle:** O(n) using Fisher-Yates
- **Deal card:** O(1)
- **Calculate hand value:** O(k) where k = cards in hand
