# Skatepark Perubeach · Sistema de inscripción

Sistema web de inscripción a clases de skate. Estático (HTML/CSS/JS, sin build).
Estilo urbano skate · negro, blanco y amarillo · Bebas Neue · mobile-first.

- **Clases:** lunes, miércoles y jueves · 17 a 21 hs
- **Categorías:** Iniciantes · Intermedios · Adultos · Avanzados
- **Cupo:** 10 alumnos por categoría

## Archivos

```
index.html   Página de alumnos (formulario + cupos + link de WhatsApp)
admin.html   Panel de gestión (lista, asistencia, export CSV)
store.js     Capa de datos compartida (localStorage)
app.js       Lógica del formulario de alumnos
admin.js     Lógica del panel
styles.css   Estilos (compartidos)
```

## ⚠️ Antes de usar: poné el WhatsApp del skatepark

En `app.js`, editá la constante del principio:

```js
const WHATSAPP_NUMBER = '5491155555555'; // país + número, sin + ni espacios
```

Si la dejás vacía, al confirmar WhatsApp abre el selector de contacto en vez
de ir directo al número del skatepark.

## Ver en local

```bash
python3 -m http.server 8000
# alumnos: http://localhost:8000/skateparkrubeach/
# admin:   http://localhost:8000/skateparkrubeach/admin.html
```

## Cómo funciona

1. El alumno elige categoría, día, nombre y teléfono.
2. Al confirmar, se guarda la inscripción y se genera el link de WhatsApp con
   el mensaje pre-armado para enviar al skatepark.
3. El panel (`admin.html`) lista a los inscriptos, permite marcar asistencia,
   eliminar y exportar todo a CSV (reemplaza el Excel).

## Limitación importante (y cómo escalar)

Los datos se guardan en **localStorage**, que es **por dispositivo**. Funciona
perfecto en un único dispositivo (ej: la tablet del skatepark), pero si los
alumnos se inscriben desde sus propios celulares, esas inscripciones **no** se
ven en el panel de otro dispositivo, y los cupos no se comparten.

Para cupos y lista realmente compartidos entre todos, hay que conectar un
backend. La capa de datos está aislada en `store.js`, así que migrar a
**Supabase / Firebase / Google Sheets** no toca la interfaz, solo ese archivo.

## Ajuste opcional

El cupo es **10 por categoría** (sumando los 3 días), tal como se pidió. Si
preferís 10 por categoría **y por día**, es un cambio de una línea en las
funciones `countByCategory` / `remaining` de `store.js`.
