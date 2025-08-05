import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeaderboardService } from '../leaderboard/leaderboard.service';

declare var google: any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('streetView', { static: false }) streetViewElement!: ElementRef;
  @ViewChild('map', { static: false }) mapElement!: ElementRef;

  // Variables del juego simplificado
  puntosTotales = 0;
  markers: any[] = [];
  lines: any[] = [];
  marker: any = null;
  plat: number = 0;
  plng: number = 0;
  streetView: any = null;
  randomCoordinates: any = null;
  map: any = null;
  streetViewService: any = null;

  // Sistema de rondas
  maxRondas = 2; // Variable escalable para cambiar cantidad de rondas
  rondaActual = 1;
  distanciasRonda: number[] = []; // Array para guardar distancias de cada ronda
  tiemposRonda: number[] = []; // Array para guardar tiempos de cada ronda
  tiempoInicioRonda: number = 0; // Timestamp del inicio de la ronda actual
  
  // Modo de juego
  gameMode = 'normal'; // 'normal' o 'custom'
  saveToLeaderboard = true; // Si false, no se guarda en leaderboard

  // Estados de UI
  showFinalScore = false;
  finalDistance = '';
  promedioDistancia = 0;
  playerName = '';
  showRoundResult = false; // Nueva variable para mostrar resultado de ronda
  currentRoundDistance = ''; // Distancia de la ronda actual
  currentRoundPoints = 0; // Puntos de la ronda actual

  constructor(private leaderboard: LeaderboardService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Verificar si viene configuración personalizada
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'custom') {
        this.gameMode = 'custom';
        this.maxRondas = parseInt(params['rounds']) || 2;
        this.saveToLeaderboard = false;
        console.log(`Modo personalizado: ${this.maxRondas} rondas, no se guardará en leaderboard`);
      } else {
        this.gameMode = 'normal';
        this.maxRondas = 2;
        this.saveToLeaderboard = true;
      }
    });
    
    this.initializeGame();
  }

  ngOnDestroy() {
    this.clearMarkersAndLines();
  }

  initializeGame() {
    console.log("Iniciando juego...");
    // Reiniciar variables de ronda
    this.rondaActual = 1;
    this.puntosTotales = 0;
    this.distanciasRonda = [];
    this.tiemposRonda = [];
    this.showFinalScore = false;
    
    // Verificar si Google Maps está disponible
    if (typeof google === 'undefined') {
      console.error("Google Maps no está disponible");
      // Mostrar mensaje de error al usuario
      alert("Error: Google Maps no pudo cargar. Verifica tu conexión a internet y la API Key.");
      return;
    }
    
    setTimeout(() => {
      if (this.streetViewElement && this.mapElement) {
        this.initMap();
      } else {
        console.error("Elementos del DOM no encontrados, intentando de nuevo...");
        setTimeout(() => this.initializeGame(), 500);
      }
    }, 1000);
  }

  initMap() {
    console.log("Inicializando mapa...");
    if (!this.mapElement) return;

    try {
      const mapOptions = {
        center: { lat: 22.28552, lng: -97.86614 },
        zoom: 12,
        zoomControl: true,
        disableDefaultUI: true,
        draggableCursor: 'crosshair',
        gestureHandling: 'greedy', // Mejora el manejo de gestos
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.streetViewService = new google.maps.StreetViewService();

      this.map.addListener('click', (event: any) => {
        if (this.markers.length >= 1) {
          this.markers[0].setMap(null);
          this.markers.shift();
        }
        this.placeMarker(event.latLng);
      });

      this.initializeStreetView();
    } catch (error) {
      console.error("Error al inicializar Google Maps:", error);
      alert("Error al cargar Google Maps. Posibles causas:\n1. API Key inválida o con cuota excedida\n2. Problemas de conexión\n3. Restricciones de dominio");
    }
  }

  initializeStreetView() {
    let attempts = 0;
    const maxAttempts = 20;

    const checkStreetViewAvailability = (coordinates: any) => {
      this.streetViewService.getPanorama({ location: coordinates, radius: 50 }, (data: any, status: any) => {
        if (status === 'OK') {
          const panoramaOptions = {
            addressControl: false,
            fullscreenControl: false,
            position: coordinates,
            pov: { heading: 0, pitch: 0 },
            zoom: 1,
            showRoadLabels: false
          };
          
          if (this.streetViewElement) {
            this.streetView = new google.maps.StreetViewPanorama(this.streetViewElement.nativeElement, panoramaOptions);
            this.plat = coordinates.lat;
            this.plng = coordinates.lng;
            this.tiempoInicioRonda = Date.now(); // Iniciar contador de tiempo
            console.log("Ubicación generada:", coordinates);
            console.log(`Ronda ${this.rondaActual} de ${this.maxRondas}`);
          }
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            generateAndCheckCoordinates();
          } else {
            console.error('No se encontraron ubicaciones con Street View.');
          }
        }
      });
    };

    const generateAndCheckCoordinates = () => {
      const lat = Math.random() * (22.352500 - 22.210202) + 22.210202;
      const lng = Math.random() * (-97.784303 - (-97.904524)) + (-97.904524);
      this.randomCoordinates = { lat, lng };
      checkStreetViewAvailability(this.randomCoordinates);
    };

    generateAndCheckCoordinates();
  }

  placeMarker(location: any) {
    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      draggable: true,
      title: 'Tu adivinanza'
    });

    this.markers.push(this.marker);
  }

  makeGuess() {
    if (this.marker) {
      const mlat = this.marker.getPosition().lat();
      const mlng = this.marker.getPosition().lng();
      
      // Calcular tiempo transcurrido en la ronda actual
      const tiempoTranscurrido = (Date.now() - this.tiempoInicioRonda) / 1000; // en segundos
      
      const distancia = this.distanciaEntrePuntos(this.plat, this.plng, mlat, mlng);
      const puntos = this.calcularPuntos(distancia, tiempoTranscurrido);
      
      // Guardar datos de la ronda actual
      this.distanciasRonda.push(distancia);
      this.tiemposRonda.push(tiempoTranscurrido);
      this.puntosTotales += puntos;
      
      // Guardar info de la ronda actual para mostrar
      this.currentRoundDistance = distancia < 1 ? 
        (distancia * 1000).toFixed(0) + " m" : 
        distancia.toFixed(2) + " km";
      this.currentRoundPoints = puntos;
      
      this.dibujarLineaRecta({ lat: this.plat, lng: this.plng }, { lat: mlat, lng: mlng });
      
      // Mostrar resultado de la ronda actual
      this.showRoundResult = true;
    }
  }

  saveScore() {
    if (this.playerName && this.playerName.trim() !== '') {
      // Solo guardar si está habilitado el leaderboard
      if (!this.saveToLeaderboard) {
        console.log('Modo personalizado: puntuación no guardada en leaderboard');
        this.goToLeaderboard();
        return;
      }

      const scoreData = {
        name: this.playerName.trim(),
        score: this.puntosTotales,
        distance: this.promedioDistancia.toFixed(2) + " km", // Enviar promedio en vez de distancia final
        timestamp: new Date().toISOString()
      };
      
      this.leaderboard.addScore(scoreData).then(() => {
        console.log('Puntuación guardada exitosamente');
        this.goToLeaderboard();
      }).catch(() => {
        console.log('Error al guardar, pero continuando...');
        this.goToLeaderboard();
      });
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  siguienteRonda() {
    // Verificar si hay más rondas
    if (this.rondaActual < this.maxRondas) {
      this.rondaActual++;
      this.showRoundResult = false;
      this.clearMarkersAndLines();
      
      // Transición suave del mapa con animación
      this.map.panTo({ lat: 22.28552, lng: -97.86614 });
      
      // Animar el zoom gradualmente
      const currentZoom = this.map.getZoom();
      const targetZoom = 12;
      const zoomDifference = Math.abs(currentZoom - targetZoom);
      
      if (zoomDifference > 1) {
        // Si la diferencia es grande, hacer zoom gradual
        const steps = Math.min(zoomDifference, 5);
        const zoomStep = (targetZoom - currentZoom) / steps;
        
        for (let i = 1; i <= steps; i++) {
          setTimeout(() => {
            const newZoom = currentZoom + (zoomStep * i);
            this.map.setZoom(Math.round(newZoom));
          }, i * 100);
        }
      } else {
        this.map.setZoom(targetZoom);
      }
      
      // Esperar a que las animaciones terminen antes de cargar nueva ubicación
      setTimeout(() => {
        this.initializeStreetView();
      }, 800);
    } else {
      // Juego terminado
      this.finalizarJuego();
    }
  }

  finalizarJuego() {
    // Calcular promedio de distancias
    this.promedioDistancia = this.distanciasRonda.reduce((sum, dist) => sum + dist, 0) / this.distanciasRonda.length;
    this.finalDistance = this.promedioDistancia < 1 ? 
      (this.promedioDistancia * 1000).toFixed(0) + " m promedio" : 
      this.promedioDistancia.toFixed(2) + " km promedio";
    
    this.showRoundResult = false;
    this.showFinalScore = true;
    console.log(`Juego terminado. Promedio de distancia: ${this.promedioDistancia.toFixed(2)} km`);
    console.log(`Tiempos por ronda: ${this.tiemposRonda.map(t => t.toFixed(1) + 's').join(', ')}`);
  }

  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  playAgain() {
    this.puntosTotales = 0;
    this.showFinalScore = false;
    this.showRoundResult = false;
    this.playerName = '';
    this.finalDistance = '';
    this.promedioDistancia = 0;
    this.rondaActual = 1;
    this.distanciasRonda = [];
    this.tiemposRonda = [];
    this.clearMarkersAndLines();
    this.initializeGame();
  }

  clearMarkersAndLines() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];

    for (let j = 0; j < this.lines.length; j++) {
      this.lines[j].setMap(null);
    }
    this.lines = [];
  }

  dibujarLineaRecta(coord1: any, coord2: any) {
    const line = new google.maps.Polyline({
      path: [coord1, coord2],
      geodesic: true,
      strokeColor: '#eb4343',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    line.setMap(this.map);
    this.lines.push(line);
    
    // Centrar el mapa para mostrar ambos puntos
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(coord1);
    bounds.extend(coord2);
    this.map.fitBounds(bounds);
    
    // Ajustar el zoom si está muy cerca
    google.maps.event.addListenerOnce(this.map, 'bounds_changed', () => {
      if (this.map.getZoom() > 15) {
        this.map.setZoom(15);
      }
    });
  }

  distanciaEntrePuntos(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const radioTierra = 6371;
    const latitud1 = this.degToRad(lat1);
    const longitud1 = this.degToRad(lon1);
    const latitud2 = this.degToRad(lat2);
    const longitud2 = this.degToRad(lon2);

    const deltaLat = latitud2 - latitud1;
    const deltaLon = longitud2 - longitud1;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(latitud1) * Math.cos(latitud2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = radioTierra * c;

    return distancia;
  }

  degToRad(grados: number): number {
    return grados * Math.PI / 180;
  }

  calcularPuntos(distancia: number, tiempo: number): number {
    const distanciaMetros = distancia * 1000;
    const areaCiudadMetrosCuadrados = 9273000;
    const maxDistanciaMetros = Math.sqrt(areaCiudadMetrosCuadrados * 2);
    
    // Puntos base por precisión (0-4000 puntos)
    let puntosDistancia = 4000 - ((distanciaMetros / maxDistanciaMetros) * 4000);
    puntosDistancia = Math.max(0, puntosDistancia);
    
    // Bonificación por tiempo (0-1000 puntos adicionales)
    // Máximo tiempo esperado: 60 segundos
    const tiempoMaximo = 60;
    let bonificacionTiempo = 1000 - ((tiempo / tiempoMaximo) * 1000);
    bonificacionTiempo = Math.max(0, Math.min(1000, bonificacionTiempo));
    
    const puntosTotal = puntosDistancia + bonificacionTiempo;
    console.log(`Distancia: ${distancia.toFixed(2)}km, Tiempo: ${tiempo.toFixed(1)}s, Puntos: ${Math.round(puntosTotal)}`);
    
    return Math.round(puntosTotal);
  }
}
