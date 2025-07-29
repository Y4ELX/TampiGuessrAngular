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
    this.leaderboard.getTopScores().subscribe((scores: any[]) => {
      this.scores = scores;
    });
  }

  getTopScore(): number {
    if (this.scores.length === 0) return 0;
    return Math.max(...this.scores.map(s => s.score));
  }

  getBestTime(): number {
    if (this.scores.length === 0) return 0;
    const times = this.scores.map(s => s.time || 60).filter(t => t > 0);
    return times.length > 0 ? Math.min(...times) : 60;
  }

  getBestDistance(): string {
    if (this.scores.length === 0) return '0 m';
    const distances = this.scores
      .filter(s => s.distance)
      .map(s => s.distance);
    if (distances.length === 0) return '0 m';
    
    // Encontrar la distancia más pequeña (mejor precisión)
    const bestDistance = distances.reduce((best, current) => {
      const bestNum = parseFloat(best.replace(/[^\d.]/g, ''));
      const currentNum = parseFloat(current.replace(/[^\d.]/g, ''));
      return currentNum < bestNum ? current : best;
    });
    
    return bestDistance;
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
    console.log('Actualizando leaderboard...');
    this.loadScores();
  }
}