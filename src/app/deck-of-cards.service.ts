import { Injectable } from '@angular/core';
import { Card } from './card.model';

@Injectable({
  providedIn: 'root'
})

export class DeckOfCardsService {

  constructor() { }

  private deck: Card[] = [];
  private suits = ["spades", "clubs", "hearts", "diamonds"];
  private values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
  private deckExists: boolean = false;

  public generateCards() {
    // if(this.deckExists) { this.deck = [] }
    this.deckExists ? this.deck = [] : "";

    for(let i = 0; i < this.values.length; i++){
      for(let j = 0; j < this.suits.length; j++){
        let image = `./assets/images/${this.values[i]}_of_${this.suits[j]}.svg`;
        this.deck.push(new Card(this.values[i], this.suits[j], image, "./assets/images/Optimized-card-back-red.png"));
      }
    }

    this.shuffle(this.deck);

    console.log(this.deck)
    this.deckExists = true;
    return this.deck;
  }

  // Need to look into better shuffle function that involves RNG and is verifibly random
  private shuffle(deck: Card[]){
    for(let i = 0; i < 1000; i++){
      let card1 = Math.floor((Math.random() * deck.length));
		  let card2 = Math.floor((Math.random() * deck.length));
		  let tmp = deck[card1];
		  deck[card1] = deck[card2];
	  	deck[card2] = tmp;
    }
  }

  private deal(deck: Card[]){
    let dealtCards: Card[] = this.deck.slice(0, 6);
    return dealtCards;
  }

  public getDealtCards() {
    return this.deal(this.deck);
  }

}
