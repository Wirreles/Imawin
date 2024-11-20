import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/services/firestore.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  currentUser: any;
  userProfileData: any;

  constructor(private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadUserProfile();
  }

  loadCurrentUser() {
    const currentUserData = localStorage.getItem('currentUser');
    if (currentUserData) {
      this.currentUser = JSON.parse(currentUserData);
      console.log('Usuario actual cargado:', this.currentUser);
    } else {
      console.error('No se encontró currentUser en el localStorage.');
      return;
    }
  }

  async loadUserProfile() {
    if (!this.currentUser || !this.currentUser.uid || !this.currentUser.tipo_usuario) {
      console.error('No se encontró el UID o el tipo de usuario en el currentUser.');
      return;
    }

    const { uid, tipo_usuario } = this.currentUser;
    let profile$: Observable<any>;

    switch (tipo_usuario) {
      case 'player':
        profile$ = this.firestoreService.getPlayerByUserId(uid);
        break;
      case 'club':
        profile$ = this.firestoreService.getClubByUserId(uid);
        break;
      case 'dt':
        profile$ = this.firestoreService.getDtByUserId(uid);
        break;
      case 'manager':
        profile$ = this.firestoreService.getManagerByUserId(uid);
        break;
      default:
        console.error('Tipo de usuario no válido');
        return;
    }

    profile$.subscribe(profileData => {
      this.userProfileData = profileData[0];  // Guarda el primer elemento del arreglo
      console.log(`Datos de perfil de ${tipo_usuario}:`, this.userProfileData);
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  // Función para manejar el cierre de sesión
  logout() {
    this.firestoreService.logout().then(() => {
      console.log('Sesión cerrada');
                          this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }

}
