import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerProfile } from 'src/models/manager.model';
import { FirestoreService } from 'src/services/firestore.service';

import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.scss'],
})
export class ManagersComponent  implements OnInit {


  managers: ManagerProfile[] = [];

  filteredManagers: ManagerProfile[] = [];

  searchQuery: string = '';
  countryFilter: string = '';
  statusFilter: string = 'jugador';




  constructor(private firestoreService: FirestoreService,
    private router: Router,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.getAllManagers();
     this.menuCtrl.enable(true, 'first');
  }

   ionViewWillLeave() {
  this.menuCtrl.enable(false, 'first');
}


  getAllManagers() {
    this.firestoreService.getManagers().subscribe(
      (data) => {
        console.log("Datos de Managers obtenidos:", data);
        this.managers = data;
        this.applyFilters();
      },
      (error) => {
        console.error("Error al obtener los managers:", error);
      }
    );
  }
// Método para aplicar los filtros
  applyFilters() {
    this.filteredManagers = this.managers.filter(manager => {
      const matchesStatus = this.statusFilter === 'jugador' || (this.statusFilter === 'arquero' && manager.manager === 'Activo');
      const matchesCountry = this.countryFilter ? manager.country.includes(this.countryFilter) : true;
      const matchesSearch = this.searchQuery ? manager.playerName.toLowerCase().includes(this.searchQuery.toLowerCase()) : true;

      return matchesStatus && matchesCountry && matchesSearch;
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }






sharePlayerProfile(manager: any) {
  const playerProfileUrl = `${window.location.origin}/perfil-cliente/${manager.userId}`;

  if (navigator.share) {
    // Si Web Share API está disponible
    navigator.share({
      title: `Perfil de ${manager.playerName}`,
      text: `Mira el perfil de este jugador: ${manager.playerName}`,
      url: playerProfileUrl,
    })
    .then(() => console.log('Perfil compartido con éxito'))
    .catch((error) => console.error('Error al compartir:', error));
  } else {
    // Alternativa: Copiar el enlace al portapapeles
    navigator.clipboard.writeText(playerProfileUrl)
      .then(() => alert('Enlace del perfil copiado al portapapeles'))
      .catch((error) => console.error('Error al copiar el enlace:', error));
  }
}
getProfileUrl(manager: any): string {
  if (manager && manager.userId) {
    return `${window.location.origin}/perfil-cliente/${manager.userId}`;
  } else {
    console.error('Error: player.userId no está definido');
    return '';  // Retorna una cadena vacía si no se encuentra userId
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
