# Joaco · Portfolio

Sitio web de portfolio para **Joaco**, diseñador gráfico.
Estética minimalista editorial · paleta **negro cálido + caramelo**.

Sitio estático (HTML/CSS/JS, sin paso de build ni dependencias).

## Estructura

```
index.html    Estructura y contenido
styles.css    Estilos y paleta (variables CSS en :root)
script.js     Menú móvil, scroll reveal, header dinámico
```

## Ver en local

Basta con abrir `index.html` en el navegador. Para un servidor local:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## Personalizar

- **Colores**: variables CSS al inicio de `styles.css` (`--ink`, `--caramel`, `--cream`…).
- **Proyectos**: bloques `<article class="project">` en la sección `#trabajo` de `index.html`.
  Para usar imágenes reales, reemplaza `.project-thumb` por un `<img>` (proporción 4:3).
- **Textos y datos de contacto**: editables directamente en `index.html`
  (email, enlaces a Behance/Instagram/LinkedIn, estadísticas).

## Desplegar

Funciona tal cual en Netlify, GitHub Pages, Vercel o cualquier hosting estático
(no requiere compilación).
