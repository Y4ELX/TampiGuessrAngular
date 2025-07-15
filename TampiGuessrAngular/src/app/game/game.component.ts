import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaderboardService } from '../leaderboard/leaderboard.service';

interface GameLocation {
  image: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  name = '';
  score: number | null = null;
  time: number | null = null;
  
  // Estado del juego
  gameState: 'setup' | 'playing' | 'guessing' | 'results' | 'finished' = 'setup';
  currentRound = 1;
  totalRounds = 5;
  totalScore = 0;
  gameStartTime = 0;
  roundStartTime = 0;
  playerName = '';
  
  // Datos de las ubicaciones de Tampico
  tampicoLocations: GameLocation[] = [
    {
      image: 'https://via.placeholder.com/800x600?text=Laguna+del+Carpintero',
      name: 'Laguna del Carpintero',
      lat: 22.2436,
      lng: -97.8618,
      description: 'Hermosa laguna urbana en el corazón de Tampico'
    },
    {
      image: 'https://via.placeholder.com/800x600?text=Plaza+de+Armas',
      name: 'Plaza de Armas',
      lat: 22.2332,
      lng: -97.8672,
      description: 'Plaza principal del centro histórico de Tampico'
    },
    {
      image: 'https://via.placeholder.com/800x600?text=Catedral+de+Tampico',
      name: 'Catedral de Tampico',
      lat: 22.2329,
      lng: -97.8668,
      description: 'Catedral principal de la ciudad'
    },
    {
      image: 'https://via.placeholder.com/800x600?text=Mercado+Tampico',
      name: 'Mercado de Tampico',
      lat: 22.2298,
      lng: -97.8645,
      description: 'Mercado tradicional con productos locales'
    },
    {
      image: 'https://via.placeholder.com/800x600?text=Malecon+Tampico',
      name: 'Malecón de Tampico',
      lat: 22.2445,
      lng: -97.8623,
      description: 'Paseo marítimo con vista al río Pánuco'
    }
  ];
  
  currentLocation: GameLocation | null = null;
  selectedLocation: {lat: number, lng: number} | null = null;
  roundScores: number[] = [];
  
  constructor(private leaderboard: LeaderboardService, private router: Router) {}
  
  ngOnInit() {
    this.resetGame();
  }
  
  resetGame() {
    this.gameState = 'setup';
    this.currentRound = 1;
    this.totalScore = 0;
    this.roundScores = [];
    this.playerName = '';
  }
  
  startGame() {
    if (!this.playerName.trim()) {
      alert('Por favor ingresa tu nombre para comenzar');
      return;
    }
    
    this.gameState = 'playing';
    this.gameStartTime = Date.now();
    this.loadNextRound();
  }
  
  loadNextRound() {
    if (this.currentRound > this.totalRounds) {
      this.finishGame();
      return;
    }
    
    // Seleccionar una ubicación aleatoria
    const randomIndex = Math.floor(Math.random() * this.tampicoLocations.length);
    this.currentLocation = this.tampicoLocations[randomIndex];
    this.selectedLocation = null;
    this.roundStartTime = Date.now();
    this.gameState = 'guessing';
  }
  
  selectLocation(lat: number, lng: number) {
    this.selectedLocation = { lat, lng };
  }
  
  submitGuess() {
    if (!this.selectedLocation || !this.currentLocation) return;
    
    const roundTime = (Date.now() - this.roundStartTime) / 1000;
    const distance = this.calculateDistance(
      this.currentLocation.lat,
      this.currentLocation.lng,
      this.selectedLocation.lat,
      this.selectedLocation.lng
    );
    
    // Calcular puntuación basada en distancia (máximo 1000 puntos por ronda)
    let roundScore = Math.max(0, 1000 - Math.floor(distance * 100));
    
    // Bonus por tiempo (máximo 200 puntos adicionales)
    if (roundTime < 30) {
      roundScore += Math.floor((30 - roundTime) * 6.67);
    }
    
    this.roundScores.push(roundScore);
    this.totalScore += roundScore;
    
    this.gameState = 'results';
    
    // Mostrar resultado de la ronda
    setTimeout(() => {
      this.currentRound++;
      this.loadNextRound();
    }, 3000);
  }
  
  finishGame() {
    this.gameState = 'finished';
    const totalGameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
    
    // Preparar datos para el leaderboard
    this.name = this.playerName;
    this.score = this.totalScore;
    this.time = totalGameTime;
  }
  
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
  
  // Simular clics en el mapa
  simulateMapClick(locationName: string) {
    const targetLocation = this.tampicoLocations.find(loc => loc.name === locationName);
    if (targetLocation) {
      // Añadir algo de variabilidad para simular imprecisión
      const variation = 0.001;
      this.selectLocation(
        targetLocation.lat + (Math.random() - 0.5) * variation,
        targetLocation.lng + (Math.random() - 0.5) * variation
      );
    }
  }
  
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
    }).catch(error => {
      console.error('Error al guardar puntuación:', error);
      alert('Error al guardar la puntuación. Verifica la conexión a Firebase.');
    });
  }
  
  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }
  
  playAgain() {
    this.resetGame();
  }
}