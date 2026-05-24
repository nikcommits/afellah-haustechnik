/**
 * ASE Bridge v1.4
 * Hydrates static HTML from content/content.json via data-ase attributes.
 */

const SVG_ICONS = {
  check: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  email: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  star: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></polygon></svg>`
};

async function initASE() {
  try {
    let data;
    if (window.__ASE_CONTENT__) {
      data = window.__ASE_CONTENT__;
    } else {
      const response = await fetch('./content/content.json');
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

      if (value === undefined || value === null || value === '') {
        return;
      }

      applyASEValue(el, value);
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
  const isIconItem = el.getAttribute('data-ase-item') === 'icon';
  if (isIconItem && SVG_ICONS[value]) {
    el.innerHTML = SVG_ICONS[value];
    return;
  }

  if (el.tagName === 'IMG') {
    const image = typeof value === 'object' ? value : { src: value };
    el.src = image.src || el.src;
    if (image.alt !== undefined) el.alt = image.alt;
    return;
  }

  if (el.tagName === 'META') {
    el.setAttribute('content', value);
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
        el.remove();
        return;
      }

      applyASEValue(el, value);

      const hrefKey = el.getAttribute('data-ase-href');
      if (hrefKey && el.tagName === 'A') {
        const hrefVal = getByPath(item, hrefKey);
        if (hrefVal) el.href = hrefVal;
      }
    });

    container.appendChild(clone);
  });
}

document.addEventListener('DOMContentLoaded', initASE);
