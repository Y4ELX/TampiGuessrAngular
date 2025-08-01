export class Trabajador {
  trabajadorId: string;
  nombre: string;
  apellidos: string;
  puesto: string;
  fechaIngreso: Date;
  edad: number;
  telefono: string;
  email: string;
  nss: string;

  constructor(
    trabajadorId: string = '',
    nombre: string = '',
    apellidos: string = '',
    puesto: string = '',
    fechaIngreso: Date = new Date(),
    edad: number = 0,
    telefono: string = '',
    email: string = '',
    nss: string = ''
  ) {
    this.trabajadorId = trabajadorId;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.puesto = puesto;
    this.fechaIngreso = fechaIngreso;
    this.edad = edad;
    this.telefono = telefono;
    this.email = email;
    this.nss = nss;
  }

  static generarId(): string {
    return 'TRAB-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellidos}`;
  }

  get fechaIngresoFormateada(): string {
    return this.fechaIngreso.toLocaleDateString('es-ES');
  }
}
