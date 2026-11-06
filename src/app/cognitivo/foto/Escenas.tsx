/** Ilustraciones planas de los 4 escenarios del juego "La foto". */

export function EscenaPlaza() {
  return (
    <svg viewBox="0 0 360 220" aria-hidden="true" style={{ width: "100%", height: "100%", borderRadius: "var(--r-lg)" }}>
      {/* cielo */}
      <rect width="360" height="130" fill="#D4ECFA" />
      {/* piso */}
      <rect y="130" width="360" height="90" fill="#E8D5B0" />
      {/* sol */}
      <circle cx="310" cy="40" r="22" fill="#F0A832" />
      {/* árbol (izquierda) */}
      <circle cx="50" cy="80" r="35" fill="#009A74" />
      <rect x="45" y="110" width="10" height="40" fill="#8B6914" />
      {/* personas */}
      <circle cx="55" cy="130" r="10" fill="#E8C49A" />
      <rect x="47" y="140" width="16" height="25" rx="3" fill="#E09339" />
      <circle cx="75" cy="135" r="8" fill="#E8C49A" />
      <rect x="69" y="143" width="12" height="20" rx="3" fill="#4399B2" />
      {/* mesa con sombrilla */}
      {/* palo sombrilla */}
      <rect x="188" y="85" width="4" height="50" fill="#8B6914" />
      {/* sombrilla (toldo) */}
      <polygon points="140,88 240,88 190,60" fill="#E09339" />
      {/* tablero mesa */}
      <rect x="155" y="130" width="70" height="5" rx="2" fill="#8B6914" />
      <rect x="170" y="135" width="5" height="20" fill="#8B6914" />
      <rect x="205" y="135" width="5" height="20" fill="#8B6914" />
      {/* 3 sillas */}
      <rect x="145" y="140" width="12" height="18" rx="2" fill="#8B6914" />
      <rect x="185" y="140" width="12" height="18" rx="2" fill="#8B6914" />
      <rect x="218" y="140" width="12" height="18" rx="2" fill="#8B6914" />
      {/* perro (derecha) */}
      <ellipse cx="310" cy="165" rx="18" ry="12" fill="#888" />
      <circle cx="325" cy="157" r="7" fill="#888" />
      <rect x="298" y="170" width="4" height="10" fill="#888" />
      <rect x="316" y="170" width="4" height="10" fill="#888" />
    </svg>
  );
}

export function EscenaMercado() {
  return (
    <svg viewBox="0 0 360 220" aria-hidden="true" style={{ width: "100%", height: "100%", borderRadius: "var(--r-lg)" }}>
      {/* cielo */}
      <rect width="360" height="100" fill="#D4ECFA" />
      {/* piso */}
      <rect y="100" width="360" height="120" fill="#E8D5B0" />
      {/* toldo rayas azul y blanco */}
      <rect x="40" y="40" width="280" height="50" fill="#4399B2" />
      <rect x="40" y="40" width="40" height="50" fill="white" />
      <rect x="120" y="40" width="40" height="50" fill="white" />
      <rect x="200" y="40" width="40" height="50" fill="white" />
      <rect x="280" y="40" width="40" height="50" fill="white" />
      {/* poste izquierdo y derecho */}
      <rect x="44" y="88" width="6" height="80" fill="#8B6914" />
      <rect x="310" y="88" width="6" height="80" fill="#8B6914" />
      {/* 3 cajas de fruta */}
      <rect x="70" y="110" width="65" height="40" rx="4" fill="#8B6914" />
      <rect x="150" y="110" width="65" height="40" rx="4" fill="#8B6914" />
      <rect x="230" y="110" width="65" height="40" rx="4" fill="#8B6914" />
      {/* frutas: naranjas, bananos, aguacates */}
      <circle cx="88" cy="120" r="8" fill="#E09339" />
      <circle cx="108" cy="122" r="7" fill="#E09339" />
      {/* bananos (caja del medio) */}
      <ellipse cx="175" cy="120" rx="12" ry="6" fill="#F5D03A" transform="rotate(-15 175 120)" />
      <ellipse cx="192" cy="122" rx="10" ry="5" fill="#F5D03A" transform="rotate(10 192 122)" />
      {/* aguacates */}
      <ellipse cx="252" cy="122" rx="8" ry="10" fill="#4A7A3D" />
      <ellipse cx="270" cy="120" rx="7" ry="9" fill="#4A7A3D" />
      {/* vendedor con sombrero */}
      <circle cx="180" cy="160" r="10" fill="#E8C49A" />
      <rect x="172" y="170" width="16" height="25" rx="3" fill="#E09339" />
      <ellipse cx="180" cy="152" rx="14" ry="5" fill="#8B6914" />
      <rect x="172" y="148" width="16" height="5" rx="2" fill="#8B6914" />
      {/* gato */}
      <ellipse cx="300" cy="185" rx="12" ry="9" fill="#A0A0A0" />
      <circle cx="310" cy="178" r="6" fill="#A0A0A0" />
      <polygon points="305,173 307,167 310,173" fill="#A0A0A0" />
      <polygon points="312,173 315,167 317,173" fill="#A0A0A0" />
    </svg>
  );
}

export function EscenaCocina() {
  return (
    <svg viewBox="0 0 360 220" aria-hidden="true" style={{ width: "100%", height: "100%", borderRadius: "var(--r-lg)" }}>
      {/* pared */}
      <rect width="360" height="220" fill="#F5ECD7" />
      {/* piso */}
      <rect y="170" width="360" height="50" fill="#D8C9A8" />
      {/* ventana con planta */}
      <rect x="130" y="15" width="100" height="70" rx="4" fill="#A8D8EA" stroke="#8B6914" strokeWidth="3" />
      <rect x="130" y="48" width="100" height="3" fill="#8B6914" />
      <rect x="179" y="15" width="3" height="70" fill="#8B6914" />
      {/* planta */}
      <rect x="170" y="58" width="20" height="14" rx="3" fill="#C8412B" />
      <ellipse cx="175" cy="55" rx="8" ry="10" fill="#009A74" />
      <ellipse cx="185" cy="53" rx="7" ry="9" fill="#009A74" />
      {/* reloj 3:00 */}
      <circle cx="55" cy="40" r="22" fill="white" stroke="#8B6914" strokeWidth="3" />
      <line x1="55" y1="40" x2="55" y2="25" stroke="#1B1B1B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="40" x2="70" y2="40" stroke="#1B1B1B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="55" cy="40" r="2" fill="#1B1B1B" />
      {/* mesa */}
      <rect x="60" y="120" width="180" height="8" rx="3" fill="#8B6914" />
      <rect x="80" y="128" width="8" height="42" fill="#8B6914" />
      <rect x="212" y="128" width="8" height="42" fill="#8B6914" />
      {/* 2 tazas */}
      <rect x="100" y="104" width="22" height="16" rx="4" fill="white" stroke="#8B6914" strokeWidth="2" />
      <ellipse cx="122" cy="112" rx="5" ry="4" fill="none" stroke="#8B6914" strokeWidth="2" />
      <rect x="170" y="104" width="22" height="16" rx="4" fill="white" stroke="#8B6914" strokeWidth="2" />
      <ellipse cx="192" cy="112" rx="5" ry="4" fill="none" stroke="#8B6914" strokeWidth="2" />
      {/* olla naranja (izquierda del mesón) */}
      <rect x="10" y="135" width="40" height="30" rx="6" fill="#E09339" />
      <rect x="15" y="128" width="30" height="8" rx="3" fill="#E09339" />
      <ellipse cx="8" cy="148" rx="5" ry="4" fill="none" stroke="#E09339" strokeWidth="2.5" />
      <ellipse cx="52" cy="148" rx="5" ry="4" fill="none" stroke="#E09339" strokeWidth="2.5" />
      {/* nevera (derecha) */}
      <rect x="290" y="60" width="55" height="110" rx="5" fill="#D8D8D8" stroke="#B0B0B0" strokeWidth="2" />
      <rect x="290" y="110" width="55" height="3" fill="#B0B0B0" />
      <rect x="340" y="80" width="3" height="20" rx="1" fill="#888" />
      <rect x="340" y="125" width="3" height="15" rx="1" fill="#888" />
    </svg>
  );
}

export function EscenaParque() {
  return (
    <svg viewBox="0 0 360 220" aria-hidden="true" style={{ width: "100%", height: "100%", borderRadius: "var(--r-lg)" }}>
      {/* cielo */}
      <rect width="360" height="140" fill="#D4ECFA" />
      {/* pasto */}
      <rect y="140" width="360" height="80" fill="#A8D88A" />
      {/* sol */}
      <circle cx="310" cy="35" r="20" fill="#F0A832" />
      {/* cometa */}
      <polygon points="90,25 105,45 90,55 75,45" fill="#C8412B" />
      <line x1="90" y1="55" x2="100" y2="100" stroke="#1B1B1B" strokeWidth="1.5" />
      {/* pájaros (2) */}
      <path d="M150,40 Q155,34 160,40" fill="none" stroke="#1B1B1B" strokeWidth="2" />
      <path d="M175,50 Q180,44 185,50" fill="none" stroke="#1B1B1B" strokeWidth="2" />
      {/* farol */}
      <rect x="248" y="70" width="4" height="90" fill="#666" />
      <ellipse cx="250" cy="68" rx="10" ry="6" fill="#F0C99A" />
      <rect x="243" y="62" width="14" height="8" rx="3" fill="#666" />
      {/* banca verde */}
      <rect x="120" y="150" width="90" height="10" rx="3" fill="#009A74" />
      <rect x="120" y="145" width="90" height="6" rx="2" fill="#009A74" />
      <rect x="125" y="160" width="6" height="18" fill="#006B52" />
      <rect x="200" y="160" width="6" height="18" fill="#006B52" />
      {/* respaldo */}
      <rect x="118" y="135" width="4" height="26" rx="2" fill="#009A74" />
      <rect x="210" y="135" width="4" height="26" rx="2" fill="#009A74" />
      {/* balón */}
      <circle cx="230" cy="172" r="10" fill="#E09339" />
      <path d="M223,168 Q230,175 237,168" fill="none" stroke="white" strokeWidth="1.5" />
      {/* perro */}
      <ellipse cx="60" cy="168" rx="16" ry="10" fill="#B08050" />
      <circle cx="73" cy="160" r="7" fill="#B08050" />
      <rect x="50" y="175" width="4" height="10" fill="#B08050" />
      <rect x="66" y="175" width="4" height="10" fill="#B08050" />
      {/* árbol derecha */}
      <circle cx="320" cy="105" r="28" fill="#009A74" />
      <rect x="316" y="128" width="8" height="30" fill="#8B6914" />
    </svg>
  );
}

export const COMPONENTES_ESCENA = [
  EscenaPlaza,
  EscenaMercado,
  EscenaCocina,
  EscenaParque,
] as const;
