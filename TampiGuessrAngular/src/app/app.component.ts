import { Component } from '@angular/core';
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

  constructor() {
    // Constructor simplificado
  }

  // Función para iniciar el juegoe
  startGame() {
    console.log('Iniciando juego...');
    alert('🎮 ¡Bienvenido a TampiGuessr!\n\n🌟 Características del juego:\n• Imágenes de Street View de todo el mundo\n• Mapa interactivo para adivinar ubicaciones\n• Sistema de puntuación basado en precisión\n• Múltiples niveles de dificultad\n• Tablas de clasificación globales\n\n🚀 ¡La funcionalidad de juego estará disponible pronto!');
  }

  // Función para mostrar el tutorial
  showTutorial() {
    console.log('Mostrando tutorial...');
    alert('📚 CÓMO JUGAR TAMPIGUESSR\n\n🌍 1. OBSERVA LA IMAGEN\n   • Se te mostrará una imagen de Street View\n   • Examina las pistas: señales, arquitectura, vegetación\n\n🎯 2. ADIVINA LA UBICACIÓN\n   • Usa tus conocimientos geográficos\n   • Busca pistas como idiomas, estilos arquitectónicos\n\n🗺️ 3. HAZ CLIC EN EL MAPA\n   • Selecciona donde crees que está la imagen\n   • Mientras más cerca estés, más puntos ganarás\n\n🏆 4. GANA PUNTOS\n   • Distancia perfecta: 5000 puntos\n   • Respuestas rápidas dan bonificaciones\n\n¡Buena suerte explorando el mundo! 🌟');
  }

  // Función para mostrar configuración
  showSettings() {
    console.log('Mostrando configuración...');
    alert('⚙️ CONFIGURACIÓN\n\n🔧 Próximas opciones disponibles:\n• Dificultad del juego (Fácil, Medio, Difícil)\n• Tiempo límite por ronda\n• Regiones del mundo (Europa, Asia, América, etc.)\n• Modo de juego (Clásico, Sin movimiento, Explorador)\n• Configuración de sonido y música\n• Idioma de la interfaz\n• Modo oscuro/claro\n\n🎮 Estas funciones estarán disponibles en la próxima versión.');
  }

  // Función para mostrar la tabla de puntuaciones
  showLeaderboard() {
    console.log('Mostrando tabla de puntuaciones...');
    alert('🏆 TABLA DE PUNTUACIONES\n\n🥇 TOP JUGADORES:\n1. GeoMaster_Pro - 🌟 25,480 pts\n2. WorldExplorer - 🌟 23,890 pts\n3. MapWizard2024 - 🌟 21,750 pts\n4. StreetViewKing - 🌟 19,650 pts\n5. GlobalGuesser - 🌟 18,320 pts\n\n📊 ESTADÍSTICAS:\n• Precisión promedio: 87%\n• Países visitados: 195\n• Tiempo total jugado: 2.5h\n\n🔒 Inicia sesión para guardar tu progreso y competir con otros jugadores.');
  }
}
