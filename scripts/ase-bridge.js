/**
 * ASE Bridge v1.6
 * Hydrates static HTML from content/content.json via data-ase attributes.
 *
 * Supported attributes:
 *   data-ase="path.to.value"      → sets innerHTML / src+alt (img) / content (meta) / href (a)
 *   data-ase-href-path="path"     → sets href on an <a> from a path in root data
 *   data-ase-item="key" | "."     → list item field (inside <template>)
 *   data-ase-href="key"           → list item href field (inside <template>)
 *   data-icon="name"              → inserts ICONS[name] as inline SVG
 */

const ICON_SVG = (path) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;

const ICONS = {
  clock: ICON_SVG('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
  'map-pin': ICON_SVG('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
  phone: ICON_SVG('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  bath: ICON_SVG('<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="21"/><line x1="17" x2="17" y1="19" y2="21"/>'),
  alert: ICON_SVG('<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>'),
  snowflake: ICON_SVG('<line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>'),
  hammer: ICON_SVG('<path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>'),
  wrench: ICON_SVG('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
  thermometer: ICON_SVG('<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>'),
  award: ICON_SVG('<circle cx="12" cy="8" r="6"/><polyline points="15.477 12.89 17 22 12 19 7 22 8.523 12.89"/>'),
  zap: ICON_SVG('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),
  document: ICON_SVG('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/>'),
  toolbox: ICON_SVG('<path d="M22 17v-3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3"/><path d="M6 19v-7"/><path d="M18 19v-7"/><path d="M2 17v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-3"/><path d="M14 8V5a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v3"/><path d="M6 12V8"/><path d="M18 12V8"/>'),
  ruler: ICON_SVG('<path d="M21.3 8.7 8.7 21.3a2.4 2.4 0 0 1-3.4 0L2.7 18.7a2.4 2.4 0 0 1 0-3.4L15.3 2.7a2.4 2.4 0 0 1 3.4 0l2.6 2.6a2.4 2.4 0 0 1 0 3.4Z"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/>'),
  sparkles: ICON_SVG('<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>'),
  accessible: ICON_SVG('<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>'),
  euro: ICON_SVG('<path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>'),
  message: ICON_SVG('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  mail: ICON_SVG('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
  gear: ICON_SVG('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>')
};

function renderIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    const name = el.getAttribute('data-icon');
    if (ICONS[name] && !el.querySelector('svg')) el.innerHTML = ICONS[name];
  });
}

async function initASE() {
  try {
    let data;
    if (window.__ASE_CONTENT__) {
      data = window.__ASE_CONTENT__;
    } else {
      const response = await fetch('./content/content.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Content not found');
      data = await response.json();
    }

    document.querySelectorAll('[data-ase]').forEach((el) => {
      const path = el.getAttribute('data-ase');
      const value = getByPath(data, path);

      if (Array.isArray(value)) {
        renderASEList(el, value);
        return;
      }

      if (value !== undefined && value !== null && value !== '') {
        applyASEValue(el, value);
      }

      const hrefPath = el.getAttribute('data-ase-href-path');
      if (hrefPath && el.tagName === 'A') {
        const hrefVal = getByPath(data, hrefPath);
        if (hrefVal) el.href = hrefVal;
      }
    });

    document.querySelectorAll('a[data-ase-href-path]:not([data-ase])').forEach((el) => {
      const hrefVal = getByPath(data, el.getAttribute('data-ase-href-path'));
      if (hrefVal) el.href = hrefVal;
    });

    console.log('ASE: Content hydrated successfully.');
  } catch (error) {
    console.error('ASE: Error loading content.json', error);
  }
}

function getByPath(source, path) {
  return path.split('.').reduce((obj, key) => obj?.[key], source);
}

function applyASEValue(el, value) {
  if (el.tagName === 'IMG') {
    const image = typeof value === 'object' ? value : { src: value };
    if (image.src) el.src = image.src;
    if (image.alt !== undefined) el.alt = image.alt;
    return;
  }

  if (el.tagName === 'META') {
    el.setAttribute('content', value);
    return;
  }

  if (el.tagName === 'A' && typeof value === 'object' && value !== null) {
    if (value.href) el.href = value.href;
    if (!el.children.length && value.text !== undefined) el.innerHTML = value.text;
    return;
  }

  if (typeof value === 'object' && value !== null) {
    return;
  }

  el.innerHTML = value;
}

function renderASEList(container, items) {
  const template = container.querySelector('template');
  if (!template) return;

  container.innerHTML = '';
  container.appendChild(template);

  items.forEach((item) => {
    const clone = template.content.cloneNode(true);

    clone.querySelectorAll('[data-ase-item]').forEach((el) => {
      const key = el.getAttribute('data-ase-item');
      const value = key === '.' ? item : getByPath(item, key);

      if (value === undefined || value === null || value === '') {
        if (key !== '.') el.remove();
        return;
      }

      if (key === 'icon' && typeof value === 'string' && ICONS[value]) {
        el.innerHTML = ICONS[value];
      } else {
        applyASEValue(el, value);
      }

      const hrefKey = el.getAttribute('data-ase-href');
      if (hrefKey && el.tagName === 'A') {
        const hrefVal = getByPath(item, hrefKey);
        if (hrefVal) el.href = hrefVal;
      }
    });

    container.appendChild(clone);
  });
}

function initNavToggle() {
  const header = document.querySelector('.site-header');
  const toggle = header?.querySelector('.nav-toggle');
  if (!header || !toggle) return;
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    header.classList.toggle('nav-open');
  });
  header.querySelectorAll('.main-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => header.classList.remove('nav-open'));
  });
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) header.classList.remove('nav-open');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderIcons();
  initASE().then(() => renderIcons());
  initNavToggle();
});
