export interface PlayerProfile {
  foot: any;
  birthDate: string|number|Date;
    playerType: 'jugador' | 'arquero'; // Tipo de jugador
    footPreference: 'izquierdo' | 'derecho' | 'ambas'; // Preferencia de pie
    position: 'central' | 'lateral' | 'delantero' | 'enganche' | 'medio'; // Posición en el campo
    country: string; // País
    province: string; // Provincia
    playerName: string; // Nombre del jugador
    lastClub: string; // Último club
    currentClub: string; // Club actual
    age: any; // Edad
    height: any; // Altura en cm
    yearsOfExperience: any; // Años de experiencia
    videoLink: string; // Enlace a video de YouTube
      profilePhotoUrl: string; // URL de la foto de perfil
      detalle: string;
  }
