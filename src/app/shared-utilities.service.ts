import { Injectable } from '@angular/core';
import { Card } from './card.model';

@Injectable({
  providedIn: 'root'
})
export class SharedUtilitiesService {

  constructor() { }

  cards: Card[] = [];
  dealerCards: Card [] = [];
  playerCards: Card [] = [];

  // May have to think of a better way to do this
  dealerHand: string = "";
  yourHand: string = "";
  wagerNotSubmitted: boolean = true;
  allowRaiseOrFold: boolean = false;
  declareWinner: boolean = false;
  beenDealt: boolean = false;
  result: string = "";
  winningRank: string = "";

  order: string = "23456789TJQKA"

  handRankings: string[] = [
    "Straight Flush",
    "Three of a Kind",
    "Straight",
    "Flush",
    "Pair",
    "High Card"
  ];

   // Will probably have to add more to reset, reset/shuffle cards
   resetGame(){
    // May have to think of a better way to do this
    this.dealerHand = "";
    this.yourHand = "";

    this.wagerNotSubmitted = true;
    this.allowRaiseOrFold = false;
    this.declareWinner = false;
    this.beenDealt = false;
    this.cards = [];
    this.dealerCards = [];
    this.playerCards = [];
    this.result = "";
    this.winningRank = "";
  }

  getWinner(playerHand: Card[], dealerHand: Card[]) {
    const playerCards = this.getHandDetails(playerHand);
    const dealerCards = this.getHandDetails(dealerHand);

    console.log(this.checkThatDealerQualifies(dealerCards.value.split('')));

    // Check if dealer hand qualifies
    if(dealerCards.rank === 6 && !this.checkThatDealerQualifies(dealerCards.value.split(''))){
      // This pays even money on ante and pushes on raise
      this.result = "Dealer hand Q High or less does not qualify"
      return ["does not qualify", playerCards.rank]
    }

    if (playerCards.rank === dealerCards.rank) {
      if (playerCards.value < dealerCards.value) {
          this.winningRank = this.getHandRank(playerCards.rank);
          this.result = "You win with a "
          return ["player", playerCards.rank];
      } else if (playerCards.value > dealerCards.value) {
          this.winningRank = this.getHandRank(dealerCards.rank);
          this.result = "The dealer wins with a "
          return ["dealer", playerCards.rank];
      } else {
          this.result = "Draw, bets will push"
          return ["draw", playerCards.rank];
      }
   }

   if(playerCards.rank < dealerCards.rank){
     this.winningRank = this.getHandRank(playerCards.rank);
     this.result = "You win with a "
     return ["player", playerCards.rank];
   }else{
     this.winningRank = this.getHandRank(dealerCards.rank);
     this.result = "The dealer wins with a "
     return ["dealer", playerCards.rank];
   }
  }

  getHandDetails(hand: Card[]){
    let suits: string[] = [hand[0].suit, hand[1].suit, hand[2].suit];
    suits = suits.sort();
    let faces = [hand[0].value, hand[1].value, hand[2].value];
    faces = faces.map(face => String.fromCharCode(77 - this.order.indexOf(face))).sort()

    const flush = suits[0] === suits[2];
    const first = faces[0].charCodeAt(0);
    // Checks for straight and A 2 3  straight in right side of || expression
    const straight = faces.every((face, index) => face.charCodeAt(0) - first === index) || faces === ["A", "M", "L"];

    const counts = faces.reduce(count, {})
    const duplicates: any = Object.values(counts).reduce(count, {})

    let rank:number = (flush && straight && 1) ||
                      (duplicates[3] && 2) ||
                      (straight && 3) ||
                      (flush && 4) ||
                      (duplicates[2] && 5) ||
                      6


    return {rank, value: faces.sort(byCountFirst).join("")};

    function byCountFirst(a: string, b: string) {
      //Counts are in reverse order - bigger is better
      const countDiff = counts[b] - counts[a]
      if (countDiff) return countDiff // If counts don't match return
      return b > a ? -1 : b === a ? 0 : 1
   }

    function count(c: any, a: any) {
        c[a] = (c[a] || 0) + 1
        return c
    }
  }

  // Turns hand rank as a number into a string;
  getHandRank(rank: number) {
    return this.handRankings[rank - 1];
  }

  checkThatDealerQualifies(hand: string[]): boolean{
    let highCards = ["A", "B", "C"];
    console.log(hand.filter(card => highCards.includes(card)));

    // Returns if Ace King or Queen has been counted > 0 means atleast 1 counted
    return hand.filter(card => highCards.includes(card)).length > 0;
  }

  // Need to write code for payout of straight or better regardless of winning hand
  // HTML and CSS hand ranks and payouts
  // https://wizardofodds.com/games/three-card-poker/ pay table 1 to start
}
