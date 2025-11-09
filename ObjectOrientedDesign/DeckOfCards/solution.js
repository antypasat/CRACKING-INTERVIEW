// 7.1 Deck of Cards - Generic deck and Blackjack implementation
// 7.1 Talia Kart - Ogólna talia i implementacja Blackjacka

// Enum for card suits / Enum dla kolorów kart
const Suit = {
  CLUBS: 'Clubs',
  DIAMONDS: 'Diamonds',
  HEARTS: 'Hearts',
  SPADES: 'Spades'
};

// Base Card class / Podstawowa klasa Card
class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value; // 1-13 (Ace through King)
  }

  toString() {
    const faces = ['', 'Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    return `${faces[this.value]} of ${this.suit}`;
  }
}

// Generic Deck class / Ogólna klasa Deck
class Deck {
  constructor() {
    this.cards = [];
    this.dealtIndex = 0;
    this.initializeDeck();
  }

  initializeDeck() {
    this.cards = [];
    for (let suit of Object.values(Suit)) {
      for (let value = 1; value <= 13; value++) {
        this.cards.push(new Card(suit, value));
      }
    }
    this.dealtIndex = 0;
  }

  shuffle() {
    // Fisher-Yates shuffle
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    this.dealtIndex = 0;
  }

  dealCard() {
    if (this.remainingCards() === 0) {
      return null;
    }
    return this.cards[this.dealtIndex++];
  }

  remainingCards() {
    return this.cards.length - this.dealtIndex;
  }
}

// Blackjack-specific Card class / Klasa Card specyficzna dla Blackjacka
class BlackjackCard extends Card {
  // Value in Blackjack context
  getValue() {
    if (this.value === 1) return 11; // Ace
    if (this.value >= 11) return 10; // Face cards
    return this.value;
  }

  isAce() {
    return this.value === 1;
  }
}

// Blackjack Hand / Ręka w Blackjacku
class BlackjackHand {
  constructor() {
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  // Calculate hand value, handling Aces properly
  // Oblicz wartość ręki, prawidłowo obsługując asy
  getValue() {
    let sum = 0;
    let numAces = 0;

    for (let card of this.cards) {
      sum += card.getValue();
      if (card.isAce()) {
        numAces++;
      }
    }

    // Adjust for Aces: if sum > 21 and we have Aces, count them as 1 instead of 11
    while (sum > 21 && numAces > 0) {
      sum -= 10; // Count Ace as 1 instead of 11
      numAces--;
    }

    return sum;
  }

  isBusted() {
    return this.getValue() > 21;
  }

  isBlackjack() {
    return this.cards.length === 2 && this.getValue() === 21;
  }

  toString() {
    return this.cards.map(c => c.toString()).join(', ');
  }
}

// Blackjack Deck (uses BlackjackCard)
class BlackjackDeck extends Deck {
  initializeDeck() {
    this.cards = [];
    for (let suit of Object.values(Suit)) {
      for (let value = 1; value <= 13; value++) {
        this.cards.push(new BlackjackCard(suit, value));
      }
    }
    this.dealtIndex = 0;
  }
}

// Blackjack Game / Gra w Blackjacka
class BlackjackGame {
  constructor() {
    this.deck = new BlackjackDeck();
    this.playerHand = new BlackjackHand();
    this.dealerHand = new BlackjackHand();
  }

  startGame() {
    this.deck.shuffle();
    this.playerHand = new BlackjackHand();
    this.dealerHand = new BlackjackHand();

    // Deal initial cards
    this.playerHand.addCard(this.deck.dealCard());
    this.dealerHand.addCard(this.deck.dealCard());
    this.playerHand.addCard(this.deck.dealCard());
    this.dealerHand.addCard(this.deck.dealCard());
  }

  hit(hand) {
    const card = this.deck.dealCard();
    hand.addCard(card);
    return card;
  }

  // Dealer plays according to standard rules (hit on 16 or less)
  dealerPlay() {
    while (this.dealerHand.getValue() < 17) {
      this.hit(this.dealerHand);
    }
  }

  determineWinner() {
    const playerValue = this.playerHand.getValue();
    const dealerValue = this.dealerHand.getValue();
    const playerBusted = this.playerHand.isBusted();
    const dealerBusted = this.dealerHand.isBusted();
    const playerBlackjack = this.playerHand.isBlackjack();
    const dealerBlackjack = this.dealerHand.isBlackjack();

    if (playerBusted) return 'DEALER_WINS';
    if (dealerBusted) return 'PLAYER_WINS';
    if (playerBlackjack && !dealerBlackjack) return 'PLAYER_BLACKJACK';
    if (dealerBlackjack && !playerBlackjack) return 'DEALER_BLACKJACK';
    if (playerValue > dealerValue) return 'PLAYER_WINS';
    if (dealerValue > playerValue) return 'DEALER_WINS';
    return 'PUSH';
  }
}

// Tests
console.log('='.repeat(70));
console.log('7.1 DECK OF CARDS - BLACKJACK');
console.log('='.repeat(70));
console.log();

console.log('Test 1: Generic Deck');
console.log('-'.repeat(70));
const deck = new Deck();
console.log(`Initial cards: ${deck.remainingCards()}`);
deck.shuffle();
console.log('Dealing 5 cards:');
for (let i = 0; i < 5; i++) {
  console.log(`  ${deck.dealCard()}`);
}
console.log(`Remaining: ${deck.remainingCards()}`);
console.log();

console.log('Test 2: Blackjack Card Values');
console.log('-'.repeat(70));
const aceSpades = new BlackjackCard(Suit.SPADES, 1);
const kingHearts = new BlackjackCard(Suit.HEARTS, 13);
const fiveDiamonds = new BlackjackCard(Suit.DIAMONDS, 5);

console.log(`${aceSpades} → Value: ${aceSpades.getValue()} (is Ace: ${aceSpades.isAce()})`);
console.log(`${kingHearts} → Value: ${kingHearts.getValue()}`);
console.log(`${fiveDiamonds} → Value: ${fiveDiamonds.getValue()}`);
console.log();

console.log('Test 3: Blackjack Hand with Aces');
console.log('-'.repeat(70));
const hand1 = new BlackjackHand();
hand1.addCard(new BlackjackCard(Suit.SPADES, 1)); // Ace
hand1.addCard(new BlackjackCard(Suit.HEARTS, 10));
console.log(`Hand: ${hand1}`);
console.log(`Value: ${hand1.getValue()} (Blackjack: ${hand1.isBlackjack()})`);
console.log();

const hand2 = new BlackjackHand();
hand2.addCard(new BlackjackCard(Suit.SPADES, 1)); // Ace
hand2.addCard(new BlackjackCard(Suit.HEARTS, 5));
hand2.addCard(new BlackjackCard(Suit.DIAMONDS, 5));
console.log(`Hand: ${hand2}`);
console.log(`Value: ${hand2.getValue()} (Ace counted as 1)`);
console.log();

const hand3 = new BlackjackHand();
hand3.addCard(new BlackjackCard(Suit.SPADES, 1)); // Ace
hand3.addCard(new BlackjackCard(Suit.HEARTS, 1)); // Ace
hand3.addCard(new BlackjackCard(Suit.DIAMONDS, 9));
console.log(`Hand: ${hand3}`);
console.log(`Value: ${hand3.getValue()} (Both Aces adjusted)`);
console.log();

console.log('Test 4: Full Blackjack Game Simulation');
console.log('='.repeat(70));

for (let gameNum = 1; gameNum <= 3; gameNum++) {
  console.log(`\nGame ${gameNum}:`);
  console.log('-'.repeat(70));

  const game = new BlackjackGame();
  game.startGame();

  console.log(`Player: ${game.playerHand} (Value: ${game.playerHand.getValue()})`);
  console.log(`Dealer: ${game.dealerHand.cards[0]} and [hidden]`);
  console.log();

  // Simulate simple strategy: hit if < 17
  while (game.playerHand.getValue() < 17 && !game.playerHand.isBusted()) {
    console.log('Player hits...');
    const card = game.hit(game.playerHand);
    console.log(`  Received: ${card}`);
    console.log(`  Hand value: ${game.playerHand.getValue()}`);
  }

  if (game.playerHand.isBusted()) {
    console.log('Player busted!');
  } else {
    console.log('Player stands.');
  }
  console.log();

  // Dealer plays
  console.log(`Dealer reveals: ${game.dealerHand} (Value: ${game.dealerHand.getValue()})`);
  if (!game.playerHand.isBusted()) {
    game.dealerPlay();
    console.log(`Dealer final: ${game.dealerHand} (Value: ${game.dealerHand.getValue()})`);
  }
  console.log();

  const result = game.determineWinner();
  console.log(`Result: ${result}`);
  console.log(`Final - Player: ${game.playerHand.getValue()}, Dealer: ${game.dealerHand.getValue()}`);
}

console.log();
console.log('='.repeat(70));
console.log('OOP Design Principles Demonstrated:');
console.log('- Inheritance: BlackjackCard extends Card, BlackjackDeck extends Deck');
console.log('- Encapsulation: Card values, hand management');
console.log('- Abstraction: Generic Deck can be subclassed for different games');
console.log('- Polymorphism: getValue() behaves differently for Blackjack');
console.log('='.repeat(70));
