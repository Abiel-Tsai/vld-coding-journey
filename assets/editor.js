(() => {
  'use strict';
  const form = document.querySelector('#reflection-form');
  if (!form) return;
  const key = 'vld-reflection-draft-v1';
  const fields = ['title', 'date', 'work', 'challenge', 'response', 'next', 'check'];
  const status = document.querySelector('#draft-status');
  const panel = document.querySelector('#publish-panel');
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  let id = crypto.randomUUID();
  form.elements.date.value = today;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && typeof saved === 'object') {
      for (const field of fields) if (typeof saved[field] === 'string') form.elements[field].value = saved[field];
      if (/^[a-f0-9-]{36}$/.test(saved.id)) id = saved.id;
      status.textContent = 'Your saved draft is restored. It has not been published.';
    }
  } catch { status.textContent = 'Browser storage is unavailable. Download a backup before leaving.'; }
  const entry = () => Object.fromEntries(fields.map(field => [field, form.elements[field].value.trim()]));
  const filename = () => `${form.elements.date.value || today}-${id}.json`;
  function save() {
    panel.hidden = true;
    try {
      localStorage.setItem(key, JSON.stringify({ ...entry(), id }));
      status.textContent = 'Draft saved on this device. Not published.';
    } catch { status.textContent = 'Could not save on this device. Download a backup to keep your writing.'; }
  }
  form.addEventListener('input', save);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (fields.some(field => !entry()[field])) { status.textContent = 'Please add text to every field; spaces alone cannot be published.'; return; }
    const content = JSON.stringify(entry(), null, 2) + '\n';
    document.querySelector('#publish-content').value = content;
    const url = new URL('https://github.com/Abiel-Tsai/vld-coding-journey/new/main');
    url.searchParams.set('filename', `_data/reflections/${filename()}`);
    document.querySelector('#github-publish').href = url.href;
    panel.hidden = false;
    const copyStatus = document.querySelector('#copy-status');
    try { await navigator.clipboard.writeText(content); copyStatus.textContent = 'Entry copied. Continue to GitHub to publish.'; }
    catch { copyStatus.textContent = 'Select and copy the entry file contents below, then continue to GitHub.'; }
    panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    document.querySelector('#publish-content').focus({ preventScroll: true });
    document.querySelector('#publish-content').select();
  });
  document.querySelector('#download-draft').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(entry(), null, 2) + '\n'], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = filename(); link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  document.querySelector('#clear-draft').addEventListener('click', () => {
    if (!confirm('Clear this device’s draft? Published reflections will stay in the journal.')) return;
    try { localStorage.removeItem(key); } catch { /* Form can still be cleared when storage is blocked. */ }
    form.reset(); form.elements.date.value = today; id = crypto.randomUUID(); panel.hidden = true;
    status.textContent = 'Draft cleared. Ready for a new entry.';
    form.elements.title.focus();
  });
})();
