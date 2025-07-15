import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LeaderboardService } from '../leaderboard.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  name = '';
  score: number | null = null;
  time: number | null = null;

  constructor(private leaderboard: LeaderboardService, private router: Router) {}

  submitScore() {
    if (!this.name || this.score === null || this.time === null) return;
    const entry = {
      name: this.name,
      score: this.score,
      time: this.time,
      date: new Date().toISOString()
    };
    this.leaderboard.addScore(entry).then(() => {
      this.router.navigate(['/leaderboard']);
    });
  }
}