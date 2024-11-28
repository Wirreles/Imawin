import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DtProfile } from 'src/models/dt.model';
import { FirestoreService } from 'src/services/firestore.service';

import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-dts',
  templateUrl: './dts.component.html',
  styleUrls: ['./dts.component.css']
})
export class DtsComponent implements OnInit {
  dts: DtProfile[] = [];


  filteredDts: DtProfile[] = [];

  // Variables para los filtros
  selectedStatus: 'Activo' | 'Inactivo' | '' = '';
  selectedStyle: 'Ofensivo' | 'Defensivo' | 'Ambas' | 'Depende' | '' = '';
  searchText: string = '';
  selectedCountry: string = '';






  constructor(private router: Router,
    private firestoreService: FirestoreService,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.getAllDts();
      this.menuCtrl.enable(true, 'first');
  }




  ionViewWillLeave() {
  this.menuCtrl.enable(false, 'first');
}


  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  getAllDts() {
    this.firestoreService.getDts().subscribe(data => {
      console.log("Datos de DTs obtenidos:", data);
      if (data && data.length > 0) {
        this.dts = data;
        this.applyFilters(); // Aplica filtros después de obtener los datos
      } else {
        console.log("No se encontraron DTs.");
      }
    }, error => {
      console.error("Error al obtener los DTs:", error);
    });
  }

  // Función para aplicar los filtros
  applyFilters() {
    this.filteredDts = this.dts.filter(dt =>
      (this.selectedStatus ? dt.dt === this.selectedStatus : true) &&
      (this.selectedStyle ? dt.gusto === this.selectedStyle : true) &&
      (this.selectedCountry ? dt.country.includes(this.selectedCountry) : true) &&
      (this.searchText ? dt.playerName.toLowerCase().includes(this.searchText.toLowerCase()) : true)
    );
  }

  // Función para actualizar los filtros
  updateFilters() {
    this.applyFilters();
  }



shareDtProfile(dt: any) {
  const dtProfileUrl = `${window.location.origin}/perfil-cliente/${dt.userId}`;

  if (navigator.share) {
    // Si Web Share API está disponible
    navigator.share({
      title: `Perfil de ${dt.playerName}`,
      text: `Mira el perfil de este DT: ${dt.playerName}`,
      url: dtProfileUrl,
    })
    .then(() => console.log('Perfil compartido con éxito'))
    .catch((error) => console.error('Error al compartir:', error));
  } else {
    // Alternativa: Copiar el enlace al portapapeles
    navigator.clipboard.writeText(dtProfileUrl)
      .then(() => alert('Enlace del perfil copiado al portapapeles'))
      .catch((error) => console.error('Error al copiar el enlace:', error));
  }
}

getProfileUrl(dt: any): string {
  if (dt && dt.userId) {
    return `${window.location.origin}/perfil-dt/${dt.userId}`;
  } else {
    console.error('Error: dt.userId no está definido');
    return ''; // Retorna una cadena vacía si no se encuentra userId
  }
}


copyToClipboard(url: string): void {
  navigator.clipboard.writeText(url)
    .then(() => alert('Enlace copiado al portapapeles'))
    .catch(err => console.error('Error al copiar el enlace:', err));
}


encodeURIComponent(url: string): string {
  return encodeURIComponent(url);
}


}
