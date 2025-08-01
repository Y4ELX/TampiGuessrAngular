import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Trabajador } from './trabajador.model';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-examen2p',
  templateUrl: './examen2P.html',
  styleUrls: ['./examen2P.css']
})
export class Examen2PComponent implements OnInit {
  trabajadorForm: FormGroup;
  trabajadores: Trabajador[] = [];
  gafeteVisible: boolean = false;
  trabajadorParaGafete: Trabajador | null = null;
  cargando: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore
  ) {
    this.trabajadorForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      puesto: ['', [Validators.required]],
      fechaIngreso: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      nss: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]]
    });
  }

  ngOnInit(): void {
    this.cargarTrabajadores();
  }

  async agregarTrabajador(): Promise<void> {
    if (this.trabajadorForm.valid) {
      this.cargando = true;
      try {
        const formData = this.trabajadorForm.value;
        const nuevoTrabajador = new Trabajador(
            Trabajador.generarId(),
            formData.nombre,
            formData.apellidos,
            formData.puesto,
            new Date(formData.fechaIngreso),
            formData.edad,
            formData.telefono,
            formData.email,
            formData.nss
        );

        await this.firestore.collection('trabajadores').add({
            trabajadorId: nuevoTrabajador.trabajadorId,
            nombre: nuevoTrabajador.nombre,
            apellidos: nuevoTrabajador.apellidos,
            puesto: nuevoTrabajador.puesto,
            fechaIngreso: nuevoTrabajador.fechaIngreso,
            edad: nuevoTrabajador.edad,
            telefono: nuevoTrabajador.telefono,
            email: nuevoTrabajador.email,
            nss: nuevoTrabajador.nss
        });

        this.trabajadorForm.reset();
        alert('Trabajador agregado exitosamente');
      } catch (error) {
        console.error('Error al agregar trabajador:', error);
        alert('Error al agregar el trabajador. Por favor, inténtelo nuevamente.');
      } finally {
        this.cargando = false;
      }
    } else {
      this.marcarCamposComoTocados();
      alert('Por favor, complete todos los campos correctamente');
    }
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.trabajadorForm.controls).forEach(key => {
      this.trabajadorForm.get(key)?.markAsTouched();
    });
  }

  async eliminarTrabajador(index: number): Promise<void> {
    if (confirm('¿Está seguro de eliminar este trabajador?')) {
      this.cargando = true;
      try {
        const trabajador = this.trabajadores[index];
        
        const querySnapshot = await this.firestore.collection('trabajadores', ref => 
          ref.where('trabajadorId', '==', trabajador.trabajadorId)
        ).get().toPromise();
        
        if (querySnapshot && !querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          await doc.ref.delete();
          alert('Trabajador eliminado exitosamente');
        }
      } catch (error) {
        console.error('Error al eliminar trabajador:', error);
        alert('Error al eliminar el trabajador');
      } finally {
        this.cargando = false;
      }
    }
  }

  async imprimirGafete(trabajador: Trabajador): Promise<void> {
    this.trabajadorParaGafete = trabajador;
    this.gafeteVisible = true;

    await new Promise(resolve => setTimeout(resolve, 100));

    const gafeteElement = document.getElementById('gafete-print');
    if (!gafeteElement) {
    throw new Error('No se encontró el elemento del gafete');
    }

    const canvas = await html2canvas(gafeteElement, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    allowTaint: true
    });

    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    const pageWidth = 297;
    const pageHeight = 210;
    const imgWidth = 60;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save(`gafete-${trabajador.nombre}-${trabajador.apellidos}.pdf`);

    this.gafeteVisible = false;
    this.trabajadorParaGafete = null;
  }

  cargarTrabajadores(): void {
    this.cargando = true;
    this.firestore.collection('trabajadores').valueChanges({ idField: 'id' }).subscribe({
      next: (data: any[]) => {
        this.trabajadores = data.map(item => 
          new Trabajador(
            item.trabajadorId,
            item.nombre,
            item.apellidos,
            item.puesto,
            item.fechaIngreso ? item.fechaIngreso.toDate() : new Date(),
            item.edad,
            item.telefono,
            item.email,
            item.nss
          )
        );
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar trabajadores:', error);
        this.cargando = false;
        alert('Error al cargar los trabajadores');
      }
    });
  }

  async limpiarTrabajadores(): Promise<void> {
    if (confirm('¿Está seguro de eliminar todos los trabajadores?')) {
      this.cargando = true;
      try {
        const querySnapshot = await this.firestore.collection('trabajadores').get().toPromise();
        
        if (querySnapshot) {
          const batch = this.firestore.firestore.batch();
          querySnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
          });
          
          await batch.commit();
          this.trabajadores = [];
          alert('Todos los trabajadores han sido eliminados');
        }
      } catch (error) {
        console.error('Error al limpiar trabajadores:', error);
        alert('Error al eliminar los trabajadores');
      } finally {
        this.cargando = false;
      }
    }
  }
}
