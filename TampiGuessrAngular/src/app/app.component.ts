import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trophyIcon } from '../components/Icons/svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TampiGuessrAngular';

  // Iconos SVG
  trophyIconHtml = trophyIcon(30, 30, 'trophy-icon');

  // Variables para el modal de ajustes
  showSettingsModal = false;
  gameMode = 'normal'; // 'normal' o 'custom'
  customRounds = 2; // Número de rondas para modo personalizado

  constructor(private router: Router) {
    // Constructor con router
  }

  // Función para verificar si estamos en la página principal
  isHomePage(): boolean {
    return this.router.url === '/';
  }

  // Función para iniciar el juego
  startGame() {
    console.log('Iniciando juego...');
    // Pasar configuración al juego si es necesario
    if (this.gameMode === 'custom') {
      // Aquí podrías pasar parámetros al componente del juego
      // Por ejemplo, usando un servicio o query params
      this.router.navigate(['/game'], { queryParams: { mode: 'custom', rounds: this.customRounds } });
    } else {
      this.router.navigate(['/game']);
    }
  }

  // Función para mostrar el tutorial
  showTutorial() {
    console.log('Mostrando tutorial...');
    alert('📚 CÓMO JUGAR TAMPIGUESSR\n\n🌍 1. OBSERVA LA IMAGEN\n   • Se te mostrará una imagen de una ubicación en Tampico\n   • Examina las pistas: señales, arquitectura, características\n\n🎯 2. ADIVINA LA UBICACIÓN\n   • Usa tus conocimientos sobre Tampico\n   • Busca pistas familiares de la ciudad\n\n🗺️ 3. HAZ CLIC EN EL MAPA\n   • Selecciona donde crees que está la imagen\n   • Mientras más cerca estés, más puntos ganarás\n\n🏆 4. GANA PUNTOS\n   • Distancia perfecta: 1000 puntos por ronda\n   • Respuestas rápidas dan bonificaciones\n   • Máximo 5000 puntos en 5 rondas\n\n¡Buena suerte explorando Tampico! 🌟');
  }

  // Función para mostrar configuración
  showSettings() {
    console.log('Mostrando configuración...');
    this.showSettingsModal = true;
  }

  // Función para cerrar el modal de configuración
  closeSettings() {
    this.showSettingsModal = false;
  }

  // Función para cambiar el modo de juego
  setGameMode(mode: string) {
    this.gameMode = mode;
  }

  // Función para cambiar el número de rondas personalizadas
  onRoundsChange(event: any) {
    const value = parseInt(event.target.value);
    if (value >= 1 && value <= 10) {
      this.customRounds = value;
    }
  }

  // Función para ir al leaderboard
  goToLeaderboard() {
    console.log('Ir al leaderboard...');
    this.router.navigate(['/leaderboard']);
  }
}
