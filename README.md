# JOACO · Portfolio

Sitio web de **Joaco**, diseñador gráfico de Buenos Aires.
Branding crudo y urbano para **gastronomía, música y skate**.

Estilo: urbano / crudo / colorido (póster · zine · riso).
Sitio estático (HTML/CSS/JS, sin build ni dependencias).

## Identidad

- **Paleta:** negro `#1A1A1A` · rojo `#E63946` · blanco `#FFFFFF` · verde musgo `#606C38`
- **Tipografía:** Bebas Neue (títulos) + Inter (cuerpo) — vía Google Fonts

## Estructura

```
index.html    Estructura y contenido
styles.css    Estilos, paleta y tipografía (variables en :root)
script.js     Menú móvil, scroll reveal, año automático
```

## Ver en local

```bash
python3 -m http.server 8000
# abrí http://localhost:8000
```

O simplemente abrí `index.html` en el navegador.

## Proyectos

Los 3 proyectos del portfolio (NAFTA, La Muzza, Baldío) son **conceptuales**,
creados para mostrar el enfoque mientras se suman clientes reales. Están
marcados como "Concepto" en cada ficha. Para reemplazarlos por trabajo real,
editá los bloques `<article class="project">` en `index.html` (cambiá los
`.project-cover` por `<img>` con tus piezas).

## Personalizar

- **Colores y tipos:** variables CSS al inicio de `styles.css`.
- **Textos / contacto:** directamente en `index.html` (email, Instagram,
  Behance, WhatsApp son placeholders — cambialos por los reales).

## Desplegar

Funciona tal cual en GitHub Pages, Netlify o Vercel (sin compilación).
```
Settings → Pages → Deploy from a branch → main → /(root)
```
