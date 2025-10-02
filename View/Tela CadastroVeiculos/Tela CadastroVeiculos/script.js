// script.js — versão robusta para evitar os problemas mais comuns
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'tokyo-park:veiculos';
  const rowsEl = document.getElementById('rows');
  const tpl = document.getElementById('tpl-row');
  const modal = document.getElementById('editor');
  const form = document.getElementById('form-veiculo');
  const btnAdd = document.getElementById('btn-add');

  // checagem básica (evita erro silencioso se algum id mudou)
  if (!rowsEl || !tpl || !modal || !form || !btnAdd) {
    console.error('Elemento(s) não encontrado(s). Verifique se index.html contém #rows, #tpl-row, #editor, #form-veiculo e #btn-add.');
    return;
  }

  // fallback para abrir/fechar dialog em navegadores sem suporte
  function showDialog(d) {
    if (typeof d.showModal === 'function') {
      try { d.showModal(); return; } catch (e) { console.warn('showModal falhou:', e); }
    }
    if (typeof d.show === 'function') {
      d.show(); return;
    }
    d.style.display = 'block';
    d.setAttribute('data-fallback-open', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDialog(d) {
    if (typeof d.close === 'function') {
      try { d.close(); return; } catch (e) { console.warn('close falhou:', e); }
    }
    d.style.display = 'none';
    d.removeAttribute('data-fallback-open');
    document.body.style.overflow = '';
  }

  // parse seguro do localStorage
  function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const fallback = [{ id: uid(), proprietario: 'Gustavo Felipe', marca: 'Ford', modelo: 'KA', plano: 'MENSAL' }];
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return fallback;
      return parsed;
    } catch (err) {
      console.warn('Dados inválidos em localStorage — resetando chave:', STORAGE_KEY, err);
      localStorage.removeItem(STORAGE_KEY);
      return fallback;
    }
  }
  function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }
  function uid() { return Math.random().toString(36).slice(2,9); }

  let data = loadData();

  function render() {
    rowsEl.innerHTML = '';
    data.forEach(item => {
      const node = tpl.content.firstElementChild.cloneNode(true);
      node.dataset.id = item.id;
      node.querySelector('[data-field="proprietario"]').textContent = item.proprietario || '';
      node.querySelector('[data-field="marca"]').textContent = item.marca || '';
      node.querySelector('[data-field="modelo"]').textContent = item.modelo || '';
      node.querySelector('[data-field="plano"]').textContent = item.plano || '';

      const btnEdit = node.querySelector('.edit');
      const btnTrash = node.querySelector('.trash');

      btnEdit.addEventListener('click', () => openEditor(item));
      btnTrash.addEventListener('click', () => removeItem(item.id));

      rowsEl.appendChild(node);
    });

    // Linhas "espaçadoras" para manter o visual
    for (let i = data.length; i < 3; i++) {
      const spacer = document.createElement('div');
      spacer.className = 'row';
      spacer.style.background = '#2a2a33';
      spacer.innerHTML = '<div></div><div></div><div></div><div></div><div></div>';
      rowsEl.appendChild(spacer);
    }
  }

  function openEditor(item) {
    form.reset();
    document.getElementById('f-id').value = item && item.id ? item.id : '';
    document.getElementById('f-proprietario').value = item && item.proprietario ? item.proprietario : '';
    document.getElementById('f-marca').value = item && item.marca ? item.marca : '';
    document.getElementById('f-modelo').value = item && item.modelo ? item.modelo : '';
    document.getElementById('f-plano').value = item && item.plano ? item.plano : 'MENSAL';
    showDialog(modal);
  }

  function removeItem(id) {
    if (!id) return;
    if (confirm('Excluir este veículo?')) {
      data = data.filter(v => v.id !== id);
      saveData(data);
      render();
      console.log('Veículo removido:', id);
    }
  }

  btnAdd.addEventListener('click', () => openEditor());

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const payload = {
      id: (document.getElementById('f-id').value) || uid(),
      proprietario: document.getElementById('f-proprietario').value.trim(),
      marca: document.getElementById('f-marca').value.trim(),
      modelo: document.getElementById('f-modelo').value.trim(),
      plano: document.getElementById('f-plano').value
    };
    if (!payload.proprietario || !payload.marca || !payload.modelo) {
      alert('Preencha todos os campos.');
      return;
    }
    const idx = data.findIndex(d => d.id === payload.id);
    if (idx >= 0) data[idx] = payload; else data.unshift(payload);
    saveData(data);
    render();
    closeDialog(modal);
    console.log('Salvo:', payload);
  });

  // Fecha modal ao clicar fora (funciona com native dialog e com fallback)
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const inDialog = (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom);
    if (!inDialog) closeDialog(modal);
  });

  // Se o usuário fechar com ESC no fallback (não nativo), remove o fallback
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.hasAttribute('open') || modal.getAttribute('data-fallback-open') === 'true') {
        closeDialog(modal);
      }
    }
  });

  render();
});
