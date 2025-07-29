import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private scores: any[] = [
    { name: 'Jugador Demo', score: 4500, date: new Date(), time: 60 },
    { name: 'Jugador 2', score: 4200, date: new Date(), time: 45 },
    { name: 'Jugador 3', score: 3800, date: new Date(), time: 30 }
  ];

  constructor(private firestore: AngularFirestore) {}

  addScore(entry: any): Promise<any> {
    // Asegurar que el objeto tenga la estructura correcta
    const scoreData = {
      name: entry.name,
      score: entry.score,
      distance: entry.distance || '',
      time: entry.time || Math.floor(Math.random() * 60) + 30, // Tiempo aleatorio si no se proporciona
      date: entry.timestamp || new Date().toISOString()
    };

    console.log('Guardando en Firebase:', scoreData);
    
    return this.firestore.collection('leaderboard').add(scoreData).then(() => {
      console.log('Puntuación guardada en Firebase');
      return scoreData;
    }).catch((error) => {
      console.log('Error al guardar en Firebase, usando almacenamiento local:', error);
      this.scores.push(scoreData);
      this.scores.sort((a, b) => b.score - a.score);
      return scoreData;
    });
  }

  getTopScores(limit = 10): Observable<any[]> {
    return this.firestore.collection('leaderboard', ref => 
      ref.orderBy('score', 'desc').limit(limit)
    ).valueChanges({ idField: 'id' }).pipe(
      map(scores => {
        console.log('Puntuaciones obtenidas de Firebase:', scores);
        if (scores && scores.length > 0) {
          return scores.map((score: any) => ({
            ...score,
            date: score.date ? new Date(score.date) : new Date()
          }));
        }
        return this.scores.slice(0, limit);
      }),
      catchError(error => {
        console.log('Error al obtener de Firebase, usando datos locales:', error);
        return of(this.scores.slice(0, limit));
      })
    );
  }
}