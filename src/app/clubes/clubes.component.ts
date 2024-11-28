import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClubProfile } from 'src/models/club.model';
import { FirestoreService } from 'src/services/firestore.service';
import { MenuController, Platform } from '@ionic/angular';

import { Clipboard } from '@ionic-native/clipboard/ngx';





@Component({
  selector: 'app-clubes',
  templateUrl: './clubes.component.html',
  styleUrls: ['./clubes.component.css']
})
export class ClubesComponent implements OnInit {

  clubs: ClubProfile[] = [];


   filteredClubs: ClubProfile[] = [];
  searchTerm: string = '';

  // Filtros
  nameFilter: string = '';
  countryFilter: string = '';




  constructor(private router: Router,
  private menuCtrl: MenuController,
    private firestoreService: FirestoreService,
    private platform: Platform

  ) { }

  ngOnInit() {
    this.getAllClubs();

     this.menuCtrl.enable(true, 'first');
  }


  ionViewWillLeave() {
  this.menuCtrl.enable(false, 'first'); 
}

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

 getAllClubs() {
    this.firestoreService.getClubs().subscribe(data => {
      if (data && data.length > 0) {
        this.clubs = data;
        this.filteredClubs = data; // Inicializa con todos los clubes
      } else {
        console.log('No se encontraron clubes.');
      }
    }, error => {
      console.error('Error al obtener los clubes:', error);
    });
  }

  applyFilters() {
    const searchTermLower = this.searchTerm.toLowerCase();
    const countryFilterLower = this.countryFilter.toLowerCase();

    this.filteredClubs = this.clubs.filter(club =>
      (!this.searchTerm ||
       club.nombre?.toLowerCase().includes(searchTermLower) ||
       club.detalle?.toLowerCase().includes(searchTermLower) ||
       club.country?.toLowerCase().includes(searchTermLower)) &&
      (!this.countryFilter ||
       club.country?.toLowerCase().includes(countryFilterLower))
    );
  }

 

 // Método para copiar el enlace del perfil
 copyProfileLink(userId: string): void {
  const link = `https://inawin.com.ar/perfil/${userId}`;  // Generamos el enlace a copiar

  // Intentamos copiar el enlace al portapapeles usando la API Clipboard
  navigator.clipboard.writeText(link).then(() => {
    console.log('Enlace copiado al portapapeles: ', link);
  }).catch((error) => {
    console.error('Error al copiar al portapapeles: ', error);
  });
}
}















