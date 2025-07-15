import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  constructor(private firestore: AngularFirestore) {}

  addScore(entry: any) {
    return this.firestore.collection('leaderboard').add(entry);
  }

  getTopScores(limit = 10) {
    return this.firestore.collection('leaderboard', ref =>
      ref.orderBy('score', 'desc').limit(limit)
    ).valueChanges();
  }
}