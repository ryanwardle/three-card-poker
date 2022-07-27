export class Card {
  constructor(public value: string, public suit: string, public image: string, imageBack: string){
    this.value = value;
    this.suit = suit;
    this.image = image;
  }
}
