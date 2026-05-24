/**
 * ASE Bridge v1.5
 * Hydrates static HTML from content/content.json via data-ase attributes.
 *
 * Supported attributes:
 *   data-ase="path.to.value"      → sets innerHTML / src+alt (img) / content (meta) / href (a)
 *   data-ase-href-path="path"     → sets href on an <a> from a path in root data
 *   data-ase-item="key" | "."     → list item field (inside <template>)
 *   data-ase-href="key"           → list item href field (inside <template>)
 */

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
