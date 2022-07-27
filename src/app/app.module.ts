import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DeclareWinnerComponent } from './declare-winner/declare-winner.component';
import { DeckComponent } from './deck/deck.component';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    DeclareWinnerComponent,
    DeckComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
