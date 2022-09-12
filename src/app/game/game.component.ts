import { Component, OnInit } from '@angular/core';
import { DeckOfCardsService } from '../deck-of-cards.service';
import { SharedUtilitiesService } from '../shared-utilities.service';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
import * as ergoscript from 'ergoscript';
import * as ergoWasm from 'ergo-lib-wasm-browser'
import Transaction from 'ergoscript';
import { MIN_FEE } from 'ergoscript/lib/constants';


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
    this.checkWalletConnection();
    this.getMinBet();
    this.getMaxBet();
  }

  minBet: number = 1;
  maxBet: number = 100;
  wagerAmount: number = 1;
  playerAmount: number = 100;
  insufficientFunds: boolean = false;

  // Displayed in UI
  walletText: string = 'Connect Wallet'

  // isConnected = await ergo_request_read_access();
  // isConnected:Promise<boolean> | null = null;
  isConnected: boolean | null = true;

  pairPlusWager: number = 0;
  pairPlusPayouts: number[] = [40, 25, 5, 4, 1];

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

  // *****Transaction going here for now until I check order*****
  // async sendWager() {
  //   const tx = new Transaction([
  //     {
  //       funds: {
  //         ERG: MIN_FEE,
  //         tokens: [{amount: 1, tokenId: '0779ec04f2fae64e87418a1ad917639d4668f78484f45df962b0dec14a2591d2'}]
  //       },
  //       toAddress: "9gQTvn7KpptzfbJezcJTqnBnyvCKv5U4GipXFWJsTW9tBcgY1iW",
  //       additionalRegisters: {}
  //     }
  //   ])

  //   const unsignedTx = await tx.build();

  //   const signedTx = await ergo.sign_tx(unsignedTx.toJSON());

  //   // await ergo.submit_tx(signedTx);
  // }

  dealCards(){
    // Needs to:
    // 2. Get money from user and send to smart contract
    // 3. Deal the cards
    // 4. Check for enough funds

    // Get current wager amounts before checks
    this.wagerAmount = this.wagerAmount.valueOf();
    this.pairPlusWager = this.pairPlusWager.valueOf();

    // Checks for enough funds to play before dealing cards
    // Need to add check for pairPlus also...kind of already works
    if(this.playerAmount < (this.wagerAmount * 2 + this.pairPlusWager)){
      $('#insufficientFundsModal').show();
      console.log("not enough funds")
      return;
    }



    // sendWager();


    // Subtract wager amounts from player amount if they have sufficient funds
    // 2 lines below may be solved and able to remove comments
    // Needs to be after check for funds above, shouldn't take if game can't be played
    // Maybe wagerAmount should be moved before above check, to get current wager, should run check with 2 numbers
    this.playerAmount -= this.wagerAmount;
    this.playerAmount -= this.pairPlusWager;

    // This adds to UI needs to be after check for funds above
    this.sharedUtilitiesService.dealerHand = "Dealer Hand";
    this.sharedUtilitiesService.yourHand = "Your Hand";

    this.deckOfCardsService.generateCards();
    this.sharedUtilitiesService.wagerNotSubmitted = false;
    this.sharedUtilitiesService.allowRaiseOrFold = true;
    this.sharedUtilitiesService.beenDealt = true;
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


    // ****ADDED +THIS.PAIRPLUSWAGER AND +THIS.WAGERAMOUNT TO 2 CHECKS BELOW, ADDS BACK ORIGINAL WAGER..WRITING THIS TO DOUBLE CHECK

    // SHOULD THIS BE IN DEAL? WHAT IF SOMEONE ONLY PLAYS PAIR PLUS? NEED TO ADJUST ANTE AND MAKE SURE EITHER PAIR PLUS OR ANTE IS PLAYED, ANTE NOT REQUIRED
    // Check and payout Pair Plus
    handRank !== 6 ? this.playerAmount += this.pairPlusWager * this.pairPlusPayouts[handRank - 1] + this.pairPlusWager : '';


    // Pay Ante Bonus...maybe able to simplify and combine with above
    if(handRank <= 3){
      handRank === 3 ? this.playerAmount += this.wagerAmount : this.playerAmount += this.wagerAmount * (6 - handRank) + this.wagerAmount
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

  closeModal() {
    $("#insufficientFundsModal").hide();
  }

  // Function called to check if wallet is connected, if so display abbv. address
  async checkWalletConnection() {
    this.isConnected = await ergo_check_read_access() || await ergo_request_read_access();
    if(this.isConnected){
      const address = await ergo.get_change_address();
      console.log(address)
      // Shorten address for better display
      const firstPart = address.slice(0, 6);
      const secondPart = address.slice(address.length - 7, address.length)
      this.walletText = firstPart + '...' + secondPart;
    }
  }
}
