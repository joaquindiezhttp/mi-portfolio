// ============================================================
//  Skateparkrubeach · capa de datos (API backend)
//  Compartida por index.html (alumnos) y admin.html (gestión).
//
//  Habla con el backend Express. Los datos ahora son COMPARTIDOS
//  entre dispositivos (ya no es localStorage).
//
//  Para que funcione, el backend tiene que estar corriendo:
//    cd ~/skateparkrubeach-backend && node index.js
//  En producción, cambiá API por la URL del servidor desplegado.
// ============================================================

window.SPK = (() => {
  const API = 'http://localhost:3000';

  const CATEGORIES = ['Iniciantes', 'Intermedios', 'Adultos', 'Avanzados'];
  const DAYS = ['Lunes', 'Miércoles', 'Jueves'];
  const MAX_PER_CATEGORY = 10;

  // Caché local de lo que devolvió el server (para lectores sincrónicos).
  let cache = [];

  // ---- carga / refresco desde la API ----
  async function refresh() {
    const res = await fetch(`${API}/api/inscripciones`);
    if (!res.ok) throw new Error('No se pudo cargar la lista');
    cache = await res.json();
    return cache;
  }

  // ---- lectores (sincrónicos, leen de la caché) ----
  function all() {
    return cache;
  }
  function countByCategory(cat) {
    return cache.filter((r) => r.category === cat).length;
  }
  function remaining(cat) {
    return Math.max(0, MAX_PER_CATEGORY - countByCategory(cat));
  }
  function isFull(cat) {
    return remaining(cat) <= 0;
  }

  // ---- mutaciones (asíncronas, van al server y refrescan la caché) ----
  async function add(reg) {
    const res = await fetch(`${API}/api/inscripciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reg),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'No se pudo guardar la inscripción');
    await refresh();
    return data;
  }

  async function setPresent(id, present) {
    const res = await fetch(`${API}/api/inscripciones/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ present }),
    });
    if (!res.ok) throw new Error('No se pudo actualizar la asistencia');
    await refresh();
  }

  async function remove(id) {
    const res = await fetch(`${API}/api/inscripciones/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('No se pudo eliminar');
    await refresh();
  }

  return {
    API,
    CATEGORIES,
    DAYS,
    MAX_PER_CATEGORY,
    refresh,
    all,
    countByCategory,
    remaining,
    isFull,
    add,
    setPresent,
    remove,
  };
})();
