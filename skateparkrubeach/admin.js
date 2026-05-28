// ============================================================
//  Skateparkrubeach · panel de gestión
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const totalsEl = document.getElementById('totals');
  const rowsEl = document.getElementById('rows');
  const emptyEl = document.getElementById('empty');
  const fDay = document.getElementById('f-day');
  const fCat = document.getElementById('f-cat');
  const exportBtn = document.getElementById('export');

  /* ---- Poblar filtros ---- */
  SPK.DAYS.forEach((d) => fDay.add(new Option(d, d)));
  SPK.CATEGORIES.forEach((c) => fCat.add(new Option(c, c)));

  const escape = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---- Resumen de cupos por categoría ---- */
  function renderTotals() {
    totalsEl.innerHTML = SPK.CATEGORIES.map((cat) => {
      const used = SPK.countByCategory(cat);
      const full = used >= SPK.MAX_PER_CATEGORY;
      return `
        <div class="total-card${full ? ' is-full' : ''}">
          <span class="total-cat">${cat}</span>
          <span class="total-count">${used}<span class="total-max">/${SPK.MAX_PER_CATEGORY}</span></span>
        </div>`;
    }).join('');
  }

  /* ---- Tabla ---- */
  function render() {
    renderTotals();

    const day = fDay.value;
    const cat = fCat.value;
    const list = SPK.all()
      .filter((r) => (!day || r.day === day) && (!cat || r.category === cat))
      .sort((a, b) => a.category.localeCompare(b.category) || a.day.localeCompare(b.day));

    rowsEl.innerHTML = list
      .map(
        (r) => `
        <tr class="${r.present ? 'is-present' : ''}">
          <td data-label="Nombre">${escape(r.name)}</td>
          <td data-label="Teléfono"><a href="tel:${escape(r.phone)}">${escape(r.phone)}</a></td>
          <td data-label="Categoría">${escape(r.category)}</td>
          <td data-label="Día">${escape(r.day)}</td>
          <td data-label="Asistencia">
            <button class="att ${r.present ? 'att--on' : ''}" data-id="${r.id}" data-act="att">
              ${r.present ? 'Presente ✓' : 'Marcar'}
            </button>
          </td>
          <td data-label="">
            <button class="del" data-id="${r.id}" data-act="del" aria-label="Eliminar">✕</button>
          </td>
        </tr>`
      )
      .join('');

    emptyEl.hidden = list.length > 0;
    if (!list.length) emptyEl.textContent = 'No hay inscriptos todavía.';
  }

  /* ---- Acciones (delegación) ---- */
  rowsEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const { id, act } = btn.dataset;

    try {
      if (act === 'att') {
        const r = SPK.all().find((x) => x.id === id);
        await SPK.setPresent(id, !(r && r.present));
      } else if (act === 'del') {
        const r = SPK.all().find((x) => x.id === id);
        if (!confirm(`¿Eliminar a ${r ? r.name : 'este inscripto'}?`)) return;
        await SPK.remove(id);
      }
    } catch (err) {
      alert(err.message || 'No se pudo actualizar.');
    }
    render();
  });

  fDay.addEventListener('change', render);
  fCat.addEventListener('change', render);

  /* ---- Exportar CSV ---- */
  exportBtn.addEventListener('click', () => {
    const list = SPK.all();
    if (!list.length) return alert('No hay inscriptos para exportar.');

    const head = ['Nombre', 'Teléfono', 'Categoría', 'Día', 'Asistencia', 'Inscripción'];
    const cell = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [head.join(',')].concat(
      list.map((r) =>
        [
          r.name,
          r.phone,
          r.category,
          r.day,
          r.present ? 'Presente' : 'Pendiente',
          new Date(r.createdAt).toLocaleString('es-AR'),
        ]
          .map(cell)
          .join(',')
      )
    );

    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscriptos-skateparkrubeach-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });

  /* ---- Carga inicial desde el server ---- */
  async function reload() {
    try {
      await SPK.refresh();
    } catch {
      renderTotals();
      rowsEl.innerHTML = '';
      emptyEl.textContent = 'No se pudo conectar con el servidor. ¿Está corriendo el backend?';
      emptyEl.hidden = false;
      return;
    }
    render();
  }
  reload();
});
