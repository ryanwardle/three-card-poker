import { Component } from '@angular/core';
import { DeckOfCardsService } from './deck-of-cards.service';
import { SharedUtilitiesService } from './shared-utilities.service';
// **SHOULD PROBABLY PUT MUCH OF THIS AND HTML, CSS CODE IN "GAME COMPONENT"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'three-card-poker';

  game = "Three Card Poker"

  constructor(private sharedUtilitiesService: SharedUtilitiesService) {

  }

  get declareWinner() {
    return this.sharedUtilitiesService.declareWinner;
  }
}
