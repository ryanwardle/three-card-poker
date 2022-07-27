import { Component, OnInit } from '@angular/core';
import { SharedUtilitiesService } from '../shared-utilities.service';
// import * as $ from 'jquery'
// import * as bootstrap from 'bootstrap'

@Component({
  selector: 'app-declare-winner',
  templateUrl: './declare-winner.component.html',
  styleUrls: ['./declare-winner.component.css']
})
export class DeclareWinnerComponent implements OnInit {

  constructor(private sharedUtilitiesService: SharedUtilitiesService) { }

  ngOnInit(): void {

  }

  get winningRank() {
    return this.sharedUtilitiesService.winningRank;
  }

  get result(){
    return this.sharedUtilitiesService.result;
  }

  playAgain() {
    return this.sharedUtilitiesService.resetGame();
  }

  leaveGame(){
    return true;
  }

}
