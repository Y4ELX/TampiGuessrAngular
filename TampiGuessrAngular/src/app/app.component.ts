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
    this.router.navigate(['/game']);
  }

  // Función para mostrar el tutorial
  showTutorial() {
    console.log('Mostrando tutorial...');
    alert('📚 CÓMO JUGAR TAMPIGUESSR\n\n🌍 1. OBSERVA LA IMAGEN\n   • Se te mostrará una imagen de una ubicación en Tampico\n   • Examina las pistas: señales, arquitectura, características\n\n🎯 2. ADIVINA LA UBICACIÓN\n   • Usa tus conocimientos sobre Tampico\n   • Busca pistas familiares de la ciudad\n\n🗺️ 3. HAZ CLIC EN EL MAPA\n   • Selecciona donde crees que está la imagen\n   • Mientras más cerca estés, más puntos ganarás\n\n🏆 4. GANA PUNTOS\n   • Distancia perfecta: 1000 puntos por ronda\n   • Respuestas rápidas dan bonificaciones\n   • Máximo 5000 puntos en 5 rondas\n\n¡Buena suerte explorando Tampico! 🌟');
  }

  // Función para mostrar configuración
  showSettings() {
    console.log('Mostrando configuración...');
    alert('⚙️ CONFIGURACIÓN\n\n🔧 Próximas opciones disponibles:\n• Dificultad del juego (Fácil, Medio, Difícil)\n• Tiempo límite por ronda\n• Ubicaciones específicas de Tampico\n• Modo de juego (Clásico, Sin tiempo, Explorador)\n• Configuración de sonido y música\n• Idioma de la interfaz\n• Modo oscuro/claro\n\n🎮 Estas funciones estarán disponibles en la próxima versión.');
  }
}
