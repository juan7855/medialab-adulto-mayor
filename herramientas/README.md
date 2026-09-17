# Herramientas de comprobación visual

No se despliegan: viven fuera de `public/` a propósito, para no quedar
expuestas en producción.

## Cómo usarlas

```bash
cp herramientas/*.html public/
npm run build && npx next start -p 3000
```

- `http://localhost:3000/auditoria-desbordes.html` — recorre todas las rutas
  a 320, 360, 390, 430 y 480px y reporta cualquier elemento cuyo contenido se
  salga de su caja. Termina con un **caso de control**: un desborde
  deliberado que *debe* detectar. Si el control no salta, el informe no vale
  nada — así fue como se descubrió que la primera versión del detector era
  ciega a los elementos con hijos.

  Desde que la sesión es una cookie firmada por el servidor (src/lib/auth.ts),
  esta herramienta inicia sesión de verdad antes de auditar, con el pin
  2468. Ese paciente tiene que existir en la base, si no la auditoría lo dice
  y no revisa nada:
  ```bash
  npx tsx src/db/seed.ts "Nombre de prueba" 2468
  ```

- `http://localhost:3000/ver-a-ancho-real.html?r=/rutina&w=320,360` — pinta
  una ruta dentro de iframes del ancho indicado. Hace falta porque Chrome sin
  interfaz impone un ancho mínimo de ventana y recorta las capturas por
  debajo de ~480px, dando una falsa impresión de desborde.

Al terminar: `rm public/auditoria-desbordes.html public/ver-a-ancho-real.html`
