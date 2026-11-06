/* -----------------------------------------------------------------------
   Contenido de los tres juegos de Mente activa.
   Fuente: hoja de contenido del Figma (Imagenes/7.png).
   ----------------------------------------------------------------------- */

// ========================== CUENTOS ======================================

export interface PreguntaCuento {
  texto: string;
  opciones: string[];
  correcta: number;
}

export interface Cuento {
  id: string;
  nivel: number;
  titulo: string;
  texto: string;
  /** Fragmento del cuento que se muestra como pista tras responder. */
  preguntas: PreguntaCuento[];
}

export const CUENTOS: Cuento[] = [
  {
    id: "cuento-1",
    nivel: 1,
    titulo: "Rosa y el paraguas amarillo",
    texto:
      "Rosa salió temprano a la panadería de la esquina. Allí se encontró con don Luis, que llevaba un paraguas amarillo. Empezó a llover y él la acompañó hasta la casa. Al llegar, Rosa le regaló un pan de queso.",
    preguntas: [
      {
        texto: "¿Quién llevaba el paraguas amarillo?",
        opciones: ["Don Luis", "Rosa", "El panadero"],
        correcta: 0,
      },
      {
        texto: "¿Dónde se encontraron?",
        opciones: ["En la panadería", "En el parque", "En la iglesia"],
        correcta: 0,
      },
      {
        texto: "¿Qué pasó después de que se encontraron?",
        opciones: [
          "Empezó a llover",
          "Cerraron la panadería",
          "Rosa se fue sola",
        ],
        correcta: 0,
      },
      {
        texto: "¿Qué le regaló Rosa a don Luis?",
        opciones: ["Un pan de queso", "Un café", "Un paraguas"],
        correcta: 0,
      },
    ],
  },
  {
    id: "cuento-2",
    nivel: 2,
    titulo: "El cumpleaños de doña Carmen",
    texto:
      "El sábado, doña Carmen cumplió setenta años. Su nieto Andrés llegó a la casa con una torta de chocolate. Antes de cantar, se fue la luz. Prendieron unas velas y, cuando partieron la torta, volvió la luz.",
    preguntas: [
      {
        texto: "¿Cuántos años cumplió doña Carmen?",
        opciones: ["Setenta", "Sesenta", "Ochenta"],
        correcta: 0,
      },
      {
        texto: "¿Quién llevó la torta?",
        opciones: ["Su nieto Andrés", "Su hija", "La vecina"],
        correcta: 0,
      },
      {
        texto: "¿Qué pasó antes de cantar el cumpleaños?",
        opciones: [
          "Se fue la luz",
          "Volvió la luz",
          "Partieron la torta",
        ],
        correcta: 0,
      },
      {
        texto: "¿De qué era la torta?",
        opciones: ["De chocolate", "De vainilla", "De tres leches"],
        correcta: 0,
      },
    ],
  },
  {
    id: "cuento-3",
    nivel: 3,
    titulo: "Don Ernesto va al mercado",
    texto:
      "El martes, don Ernesto fue a la plaza de mercado con su vecina Inés. Compraron mangos, aguacates y un ramo de flores amarillas para la mesa. En el bus de regreso, don Ernesto se dio cuenta de que había olvidado las arepas. Inés se rio y le dijo que no se preocupara: ella había comprado de más y le regaló la mitad.",
    preguntas: [
      {
        texto: "¿Con quién fue don Ernesto al mercado?",
        opciones: ["Con su vecina Inés", "Con su nieta", "Con su hermano"],
        correcta: 0,
      },
      {
        texto: "¿Qué día fue?",
        opciones: ["El martes", "El domingo", "El viernes"],
        correcta: 0,
      },
      {
        texto: "¿De qué color eran las flores?",
        opciones: ["Amarillas", "Rojas", "Blancas"],
        correcta: 0,
      },
      {
        texto: "¿Qué olvidó don Ernesto?",
        opciones: ["Las arepas", "Los mangos", "Las flores"],
        correcta: 0,
      },
      {
        texto: "¿Qué hizo Inés cuando él lo olvidó?",
        opciones: [
          "Le regaló la mitad de las suyas",
          "Volvieron al mercado",
          "Compraron en la tienda",
        ],
        correcta: 0,
      },
    ],
  },
];

// ========================== FIGURAS ======================================

export interface Figura {
  id: string;
  nivel: number;
  segundos: number;
  descripcion: string;
}

export const FIGURAS: Figura[] = [
  {
    id: "figura-1",
    nivel: 1,
    segundos: 15,
    descripcion: "Un triángulo dentro de un cuadrado",
  },
  {
    id: "figura-2",
    nivel: 2,
    segundos: 15,
    descripcion: "Una cruz dentro de un círculo",
  },
  {
    id: "figura-3",
    nivel: 3,
    segundos: 12,
    descripcion: "Una casa: techo, paredes y puerta",
  },
  {
    id: "figura-4",
    nivel: 4,
    segundos: 10,
    descripcion: "Un círculo dentro de un triángulo, dentro de un cuadrado",
  },
];

// ========================== FOTOS ========================================

export interface PreguntaFoto {
  texto: string;
  opciones: string[];
  correcta: number;
}

export interface Foto {
  id: string;
  nivel: number;
  nombre: string;
  segundos: number;
  preguntas: PreguntaFoto[];
}

export const FOTOS: Foto[] = [
  {
    id: "foto-1",
    nivel: 1,
    nombre: "Plaza",
    segundos: 30,
    preguntas: [
      {
        texto: "¿De qué color era la camisa de la persona de la izquierda?",
        opciones: ["Naranja", "Azul", "Verde"],
        correcta: 0,
      },
      {
        texto: "¿Cuántas sillas había?",
        opciones: ["3", "2", "4"],
        correcta: 0,
      },
      {
        texto: "¿Había algún animal?",
        opciones: ["Un perro", "Un gato", "Ninguno"],
        correcta: 0,
      },
      {
        texto: "¿Qué había encima de la mesa?",
        opciones: ["Una sombrilla", "Una lámpara", "Nada"],
        correcta: 0,
      },
      {
        texto: "¿Dónde estaba el árbol?",
        opciones: ["A la izquierda", "En el centro", "A la derecha"],
        correcta: 0,
      },
    ],
  },
  {
    id: "foto-2",
    nivel: 2,
    nombre: "Mercado",
    segundos: 25,
    preguntas: [
      {
        texto: "¿De qué colores era el toldo?",
        opciones: ["Azul y blanco", "Rojo y blanco", "Verde"],
        correcta: 0,
      },
      {
        texto: "¿Qué fruta había en la caja del medio?",
        opciones: ["Bananos", "Naranjas", "Aguacates"],
        correcta: 0,
      },
      {
        texto: "¿El vendedor tenía sombrero?",
        opciones: ["Sí", "No", "No había vendedor"],
        correcta: 0,
      },
      {
        texto: "¿Cuántas cajas de fruta había?",
        opciones: ["3", "2", "4"],
        correcta: 0,
      },
      {
        texto: "¿Qué animal había?",
        opciones: ["Un gato", "Un perro", "Una gallina"],
        correcta: 0,
      },
    ],
  },
  {
    id: "foto-3",
    nivel: 3,
    nombre: "Cocina",
    segundos: 25,
    preguntas: [
      {
        texto: "¿Qué hora marcaba el reloj?",
        opciones: ["Las 3:00", "Las 6:00", "Las 12:00"],
        correcta: 0,
      },
      {
        texto: "¿Cuántas tazas había en la mesa?",
        opciones: ["2", "1", "3"],
        correcta: 0,
      },
      {
        texto: "¿Qué había en la ventana?",
        opciones: ["Una planta", "Un gato", "Nada"],
        correcta: 0,
      },
      {
        texto: "¿De qué color era la olla?",
        opciones: ["Naranja", "Azul", "Gris"],
        correcta: 0,
      },
      {
        texto: "¿Dónde estaba la nevera?",
        opciones: ["A la derecha", "A la izquierda", "En el centro"],
        correcta: 0,
      },
    ],
  },
  {
    id: "foto-4",
    nivel: 4,
    nombre: "Parque",
    segundos: 20,
    preguntas: [
      {
        texto: "¿Qué había en el cielo?",
        opciones: ["Una cometa", "Un globo", "Un avión"],
        correcta: 0,
      },
      {
        texto: "¿Cuántos pájaros había?",
        opciones: ["2", "1", "3"],
        correcta: 0,
      },
      {
        texto: "¿De qué color era la banca?",
        opciones: ["Verde", "Café", "Azul"],
        correcta: 0,
      },
      {
        texto: "¿Había un farol?",
        opciones: ["Sí", "No", "No me acuerdo"],
        correcta: 0,
      },
      {
        texto: "¿Qué había junto a la banca?",
        opciones: ["Un balón", "Un perro", "Una bicicleta"],
        correcta: 0,
      },
    ],
  },
];

// ========================== HUB ==========================================

export interface TipoJuego {
  slug: string;
  titulo: string;
  subtitulo: string;
}

export const TIPOS_JUEGO: TipoJuego[] = [
  {
    slug: "cuento",
    titulo: "El cuento de hoy",
    subtitulo: "Entrena recordar lo que lee",
  },
  {
    slug: "dibujo",
    titulo: "Dibuja de memoria",
    subtitulo: "Entrena recordar formas",
  },
  {
    slug: "foto",
    titulo: "La foto",
    subtitulo: "Entrena recordar lo que ve",
  },
];
