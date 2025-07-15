import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaderboardService } from './leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  scores: any[] = [];

  constructor(
    private leaderboard: LeaderboardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadScores();
  }

  loadScores() {
    this.leaderboard.getTopScores().subscribe(scores => {
      this.scores = scores;
    });
  }

  getTopScore(): number {
    if (this.scores.length === 0) return 0;
    return Math.max(...this.scores.map(s => s.score));
  }

  getBestTime(): number {
    if (this.scores.length === 0) return 0;
    return Math.min(...this.scores.map(s => s.time));
  }

  getRankMedal(position: number): string {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[position] || '';
  }

  getRankTitle(position: number): string {
    const titles = ['Maestro', 'Experto', 'Veterano'];
    return titles[position] || '';
  }

  goToGame() {
    this.router.navigate(['/game']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  refreshLeaderboard() {
    this.loadScores();
  }
}