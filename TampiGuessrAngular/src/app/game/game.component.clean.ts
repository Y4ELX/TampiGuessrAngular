import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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

  // Estados de UI
  showFinalScore = false;
  finalDistance = '';
  playerName = '';

  constructor(private leaderboard: LeaderboardService, private router: Router) {}

  ngOnInit() {
    this.initializeGame();
  }

  ngOnDestroy() {
    this.clearMarkersAndLines();
  }

  initializeGame() {
    console.log("Iniciando juego...");
    
    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || !google.maps) {
      console.log("Google Maps API no está cargada, esperando...");
      setTimeout(() => this.initializeGame(), 500);
      return;
    }
    
    setTimeout(() => {
      if (this.streetViewElement && this.mapElement) {
        console.log("Elementos del DOM encontrados, inicializando mapa...");
        this.initMap();
      } else {
        console.error("Elementos del DOM no encontrados, intentando de nuevo...");
        setTimeout(() => this.initializeGame(), 500);
      }
    }, 1000);
  }

  initMap() {
    console.log("Inicializando mapa...");
    if (!this.mapElement) {
      console.error("Elemento del mapa no encontrado");
      return;
    }

    try {
      const mapOptions = {
        center: { lat: 22.28552, lng: -97.86614 },
        zoom: 12,
        zoomControl: true,
        disableDefaultUI: true,
        draggableCursor: 'crosshair'
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.streetViewService = new google.maps.StreetViewService();
      
      console.log("Mapa inicializado correctamente");

      this.map.addListener('click', (event: any) => {
        if (this.markers.length >= 1) {
          this.markers[0].setMap(null);
          this.markers.shift();
        }
        this.placeMarker(event.latLng);
      });

      this.initializeStreetView();
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
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
            console.log("Ubicación generada:", coordinates);
            console.log("Street View inicializado correctamente");
          } else {
            console.error("Elemento Street View no encontrado");
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
      
      const distancia = this.distanciaEntrePuntos(this.plat, this.plng, mlat, mlng);
      const puntos = this.calcularPuntos(distancia);
      
      this.puntosTotales = puntos;
      this.finalDistance = distancia < 1 ? (distancia * 1000).toFixed(0) + " m" : distancia.toFixed(2) + " km";
      
      this.dibujarLineaRecta({ lat: this.plat, lng: this.plng }, { lat: mlat, lng: mlng });
      this.showFinalScore = true;
    }
  }

  saveScore() {
    if (this.playerName && this.playerName.trim() !== '') {
      const scoreData = {
        name: this.playerName.trim(),
        score: this.puntosTotales,
        distance: this.finalDistance,
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

  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  playAgain() {
    this.puntosTotales = 0;
    this.showFinalScore = false;
    this.playerName = '';
    this.finalDistance = '';
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
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    line.setMap(this.map);
    this.lines.push(line);
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

  calcularPuntos(distancia: number): number {
    const distanciaMetros = distancia * 1000;
    const areaCiudadMetrosCuadrados = 9273000;
    const maxDistanciaMetros = Math.sqrt(areaCiudadMetrosCuadrados * 2);
    
    let puntos = 5000 - ((distanciaMetros / maxDistanciaMetros) * 5000);
    puntos = Math.max(0, puntos);
    return Math.round(puntos);
  }
}
