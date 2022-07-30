import { Component, OnInit } from '@angular/core';
import { DeckOfCardsService } from '../deck-of-cards.service';
import { SharedUtilitiesService } from '../shared-utilities.service';
import * as $ from 'jquery'
import * as bootstrap from 'bootstrap'


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(private deckOfCardsService: DeckOfCardsService,
    private sharedUtilitiesService: SharedUtilitiesService) {

}

  ngOnInit(): void {

    this.getMinBet();
    this.getMaxBet();
  }

  minBet: number = 0;
  maxBet: number = 100;
  wagerAmount: number = 1;
  playerAmount: number = 100;

  // Had to change to any, need to get it back to number, doesn't make sense why html and ts seem to be the same as wagerAmount
  pairPlusWager: number = 0;
  pairPlusPayouts: number[] = [40, 25, 5, 4, 1];

  // // Assisgned variables, because will probably have to get dynamically later using formula for maxBet

  // Running total or payout after each game?

  get beenDealt() {
    return this.sharedUtilitiesService.beenDealt;
  }

  get dealerHand() {
    return this.sharedUtilitiesService.dealerHand;
  }

  get yourHand() {
    return this.sharedUtilitiesService.yourHand;
  }

  get wagerNotSubmitted() {
    return this.sharedUtilitiesService.wagerNotSubmitted;
  }

  get allowRaiseOrFold() {
    return this.sharedUtilitiesService.allowRaiseOrFold;
  }

  get declareWinner() {
    return this.sharedUtilitiesService.declareWinner;
  }

  get dealerCards() {
    return this.sharedUtilitiesService.dealerCards;
  }

  get playerCards() {
    return this.sharedUtilitiesService.playerCards;
  }


  dealCards(){
    // Needs to:
    // 2. Get money from user and send to smart contract
    // 3. Deal the cards
    this.deckOfCardsService.generateCards();
    this.sharedUtilitiesService.wagerNotSubmitted = false;
    this.sharedUtilitiesService.allowRaiseOrFold = true;
    this.sharedUtilitiesService.beenDealt = true;
    this.wagerAmount = this.wagerAmount.valueOf();
    this.playerAmount -= this.wagerAmount;
    this.pairPlusWager = this.pairPlusWager.valueOf();
    this.playerAmount -= this.pairPlusWager;
    this.sharedUtilitiesService.dealerHand = "Dealer Hand";
    this.sharedUtilitiesService.yourHand = "Your Hand";
    this.sharedUtilitiesService.cards = this.deckOfCardsService.getDealtCards();

    // Deals cards into 2 arrays playerCards and DealerCards
    for(let i = 0; i < this.sharedUtilitiesService.cards.length; i++){
      if(i % 2 === 0){
        this.sharedUtilitiesService.playerCards.push(this.sharedUtilitiesService.cards[i]);
      }else{
        this.sharedUtilitiesService.dealerCards.push(this.sharedUtilitiesService.cards[i]);
      }
    }
    // console.log(this.sharedUtilitiesService.cards)

    // ANIMATE DEALING OF CARDS
    // $(this).addClass('animated');

  }

  raise(){
    // **REVEAL DEALERS HAND HERE? TURN OVER CARDS USING CSS, FORM DISAPPEARS, THEN DECLARATION OF WINNER APPEARS
    // Send raise money to smart contract
    // Show winning hand and then have a Play Again Button to reset the page
    // Send money to winner
    this.sharedUtilitiesService.allowRaiseOrFold = false;

    // NEED TO TAKE RANK AND PAYOUT BASED ON HAND, SHOULD PROBABLY ONLY PAY OUT IN ONE PLACE
    let handRank: any = this.sharedUtilitiesService.getWinner(this.playerCards, this.dealerCards)[1];


    // SHOULD THIS BE IN DEAL? WHAT IF SOMEONE ONLY PLAYS PAIR PLUS? NEED TO ADJUST ANTE AND MAKE SURE EITHER PAIR PLUS OR ANTE IS PLAYED, ANTE NOT REQUIRED
    // Check and payout Pair Plus
    handRank !== 6 ? this.playerAmount += this.pairPlusWager * this.pairPlusPayouts[handRank - 1] : '';


    // Pay Ante Bonus...maybe able to simplify and combine with above
    if(handRank <= 3){
      handRank === 3 ? this.playerAmount += this.wagerAmount : this.playerAmount += this.wagerAmount * (6 - handRank)
    }

    // CHECKS IF PLAYER WON
    if(this.sharedUtilitiesService.getWinner(this.playerCards, this.dealerCards)[0] === "player"){
      // Pay player wins pot if wins
      // Will have to add to pay all combinations, straight above etc...
      this.playerAmount += this.wagerAmount * 3;
    }else if(this.sharedUtilitiesService.getWinner(this.playerCards, this.dealerCards)[0] !== "dealer"){
      // Checks for dealer hand not qualified (Ante bet wins, raise pushes) and the case of a draw (Bets push if draw)
      this.sharedUtilitiesService.getWinner(this.playerCards, this.dealerCards)[0] === "does not qualify" ? this.playerAmount += this.wagerAmount * 2 : this.playerAmount += this.wagerAmount;
    }else{
      // First performed checks for winner, draw or dealer not qualified, if not then hand is lost
      this.playerAmount -= this.wagerAmount;
    }

    this.sharedUtilitiesService.declareWinner = true;

    // Reveal modal 2.5 secs after cards are revealed
    setTimeout(function() {
      $('#declareWinnerModal').show();
      }, 2500);

  }

  foldCards(){
    // Reset game or Play Again Screen?--Own component
    // Send money to casino
    this.sharedUtilitiesService.resetGame();

  }

  // Will need to get min bet dynamically eventually
  getMinBet() {
    this.minBet = 1;
  }

  // Will need to get max bet dynamically eventually
  getMaxBet() {
    this.maxBet = 25;
  }
}
