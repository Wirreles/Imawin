import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/services/firestore.service';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.scss'],
})
export class PerfilClienteComponent implements OnInit {
  userId: string | null = null; // ID del usuario seleccionado
  userData: any = null; // Datos del usuario
  selectedSegment: string = 'info';

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener el ID del usuario desde la ruta
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id'); // Suponiendo que el ID viene como parámetro de la ruta
      if (this.userId) {
        this.loadUserData(this.userId);
      }
    });
  }

  // Método para cargar los datos del usuario
  loadUserData(userId: string) {
    // Paso 1: Buscar datos básicos del usuario en la colección 'usuarios'
    this.firestoreService.getUserById(userId).subscribe(user => {
      this.userData = user; // Guardar los datos básicos del usuario
      console.log('Datos básicos del usuario:', this.userData);

      // Paso 2: Verificar el tipo de usuario y buscar los datos específicos en la colección correspondiente
      if (this.userData?.tipo_usuario) {
        switch (this.userData.tipo_usuario) {
          case 'player':
            this.firestoreService.getPlayerByUserId(userId).subscribe(playerData => {
              this.userData = { ...this.userData, ...playerData[0] }; // Fusionar datos
              console.log('Datos completos del jugador:', this.userData);
            });
            break;

          case 'dt':
            this.firestoreService.getDtByUserId(userId).subscribe(dtData => {
              this.userData = { ...this.userData, ...dtData[0] }; // Fusionar datos
              console.log('Datos completos del DT:', this.userData);
            });
            break;

          case 'manager':
            this.firestoreService.getManagerByUserId(userId).subscribe(managerData => {
              this.userData = { ...this.userData, ...managerData[0] }; // Fusionar datos
              console.log('Datos completos del manager:', this.userData);
            });
            break;

          case 'club':
            this.firestoreService.getClubByUserId(userId).subscribe(clubData => {
              this.userData = { ...this.userData, ...clubData[0] }; // Fusionar datos
              console.log('Datos completos del club:', this.userData);
            });
            break;

          default:
            console.warn('Tipo de usuario desconocido:', this.userData.tipo_usuario);
        }
      } else {
        console.warn('El usuario no tiene un tipo definido.');
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
