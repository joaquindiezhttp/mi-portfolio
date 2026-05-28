// ============================================================
//  Skateparkrubeach · página de alumnos
// ============================================================

// ⚠️ Reemplazá por el WhatsApp REAL del skatepark: código de país +
//    número, sin "+", espacios ni guiones. Ej Argentina: '5491155555555'.
//    Si lo dejás vacío, WhatsApp abre el selector de contacto.
const WHATSAPP_NUMBER = '';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const error = document.getElementById('error');
  const success = document.getElementById('success');
  const sName = document.getElementById('s-name');
  const sDetail = document.getElementById('s-detail');
  const waLink = document.getElementById('wa-link');
  const resetBtn = document.getElementById('reset');
  const membresiaChk = document.getElementById('membresia');
  const precioGroup = document.getElementById('precio-group');
  const precioInput = document.getElementById('precio');

  /* ---- Pintar cupos por categoría ---- */
  function paintSpots() {
    document.querySelectorAll('.cat-spots').forEach((el) => {
      const cat = el.dataset.cat;
      const left = SPK.remaining(cat);
      const card = el.closest('.cat-card');
      const input = card.querySelector('input');

      if (left <= 0) {
        el.textContent = 'COMPLETO';
        card.classList.add('is-full');
        input.disabled = true;
        if (input.checked) input.checked = false;
      } else {
        el.textContent = `Quedan ${left} / ${SPK.MAX_PER_CATEGORY}`;
        card.classList.remove('is-full');
        input.disabled = false;
      }
    });
  }

  /* ---- Helpers ---- */
  const showError = (msg) => {
    error.textContent = msg;
    error.hidden = false;
  };
  const clearError = () => {
    error.hidden = true;
  };

  form.addEventListener('input', clearError);

  /* ---- Mostrar el precio solo si marca membresía ---- */
  if (membresiaChk) {
    membresiaChk.addEventListener('change', () => {
      precioGroup.hidden = !membresiaChk.checked;
      if (!membresiaChk.checked) precioInput.value = '';
      clearError();
    });
  }

  /* ---- Cargar cupos desde el server ---- */
  (async () => {
    try {
      await SPK.refresh();
    } catch {
      showError('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
    }
    paintSpots();
  })();

  /* ---- Submit ---- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const data = new FormData(form);
    const category = data.get('category');
    const day = data.get('day');
    const name = (data.get('name') || '').trim();
    const phone = (data.get('phone') || '').trim();

    if (!category) return showError('Elegí una categoría.');
    if (!day) return showError('Elegí un día.');
    if (name.length < 2) return showError('Escribí tu nombre completo.');
    if (phone.replace(/\D/g, '').length < 6) return showError('Ingresá un teléfono válido.');

    // Membresía opcional — validar el precio ANTES de inscribir
    const wantsMembership = membresiaChk && membresiaChk.checked;
    let precio = null;
    if (wantsMembership) {
      precio = Number(precioInput.value);
      if (!Number.isFinite(precio) || precio <= 0) {
        return showError('Ingresá un precio de membresía válido.');
      }
    }

    if (SPK.isFull(category)) {
      paintSpots();
      return showError(`La categoría ${category} está completa. Elegí otra.`);
    }

    // Guardar inscripción en el server
    let created;
    try {
      created = await SPK.add({ category, day, name, phone });
    } catch (err) {
      await SPK.refresh().catch(() => {});
      paintSpots();
      return showError(err.message || 'No se pudo guardar la inscripción.');
    }

    // Membresía (si corresponde)
    if (wantsMembership) {
      try {
        await SPK.addMembership(created.id, precio);
      } catch (err) {
        return showError(`Te inscribiste, pero falló la membresía: ${err.message || ''}`);
      }
    }

    // Mensaje de WhatsApp (texto exacto pedido + membresía si hay)
    let msg = `Hola! Quiero inscribirme a la clase de ${category} el ${day}. Mi nombre es ${name} y mi tel es ${phone}`;
    if (wantsMembership) msg += ` (con membresía $${precio})`;
    const base = WHATSAPP_NUMBER
      ? `https://wa.me/${WHATSAPP_NUMBER}`
      : 'https://wa.me/';
    waLink.href = `${base}?text=${encodeURIComponent(msg)}`;

    // Estado de éxito
    sName.textContent = name.split(' ')[0];
    sDetail.textContent = `${category} · ${day} · 17 a 21 hs`;
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---- Reset ---- */
  resetBtn.addEventListener('click', async () => {
    form.reset();
    if (precioGroup) precioGroup.hidden = true;
    try {
      await SPK.refresh();
    } catch {}
    paintSpots();
    success.hidden = true;
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
