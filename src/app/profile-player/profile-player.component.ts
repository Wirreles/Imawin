import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el servicio Router
import { PlayerProfile } from 'src/models/playerProfile.model';
import { FirestoreService } from 'src/services/firestore.service';

import { MenuController } from '@ionic/angular';



@Component({
  selector: 'app-profile-player',
  templateUrl: './profile-player.component.html',
  styleUrls: ['./profile-player.component.css']
})
export class ProfilePlayerComponent implements OnInit {

   players: any[] = [];

    filteredPlayers: PlayerProfile[] = [];

  // Propiedades de los filtros
  selectedType: string = '';
  selectedFoot: string = '';
  selectedPosition: string = '';
  searchQuery: string = '';
  country: string = '';

  constructor(private router: Router,private firestoreService: FirestoreService,        private menuCtrl: MenuController
) { }

  ngOnInit() {

        this.getAllPlayers();
     this.menuCtrl.enable(true, 'first');
  }


   ionViewWillLeave() {
  this.menuCtrl.enable(false, 'first');
}

   navigateToPlayerProfil() {
    this.router.navigate(['detalleJugador']);
  }


getAllPlayers() {
    this.firestoreService.getPlayers().subscribe((data: PlayerProfile[]) => {
      console.log("Datos de jugadores obtenidos:", data);
      this.players = data;

              this.filteredPlayers = data; // Inicia con todos los jugadores


    }, error => {
      console.error("Error al obtener los jugadores:", error);
    });
  }


 aplicarFiltros() {
    this.filteredPlayers = this.players.filter(player => {
      return (
        (!this.selectedType || player.playerType === this.selectedType) &&
        (!this.selectedFoot || player.footPreference === this.selectedFoot) &&
        (!this.selectedPosition || player.position === this.selectedPosition) &&
        (!this.country || player.country.toLowerCase().includes(this.country.toLowerCase())) &&
        (!this.searchQuery || player.playerName.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }





sharePlayerProfile(player: any) {
  const playerProfileUrl = `${window.location.origin}/perfil-cliente/${player.userId}`;

  if (navigator.share) {
    // Si Web Share API está disponible
    navigator.share({
      title: `Perfil de ${player.playerName}`,
      text: `Mira el perfil de este jugador: ${player.playerName}`,
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
getProfileUrl(player: any): string {
  if (player && player.userId) {
    return `${window.location.origin}/perfil-cliente/${player.userId}`;
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
