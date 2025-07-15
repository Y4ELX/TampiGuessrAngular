import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  scores: any[] = [];

  constructor(private leaderboard: LeaderboardService) {}

  ngOnInit() {
    this.leaderboard.getTopScores().subscribe(scores => {
      this.scores = scores;
    });
  }
}