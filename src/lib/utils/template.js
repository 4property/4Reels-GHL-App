/**
 * Replace `{{key}}` placeholders in a template string with values from the
 * given variables list. Used by the Social template editor.
 *
 * @param {string} template
 * @param {Array<{ key: string, sample: string }>} variables
 */
export function renderTemplate(template, variables) {
  let out = template;
  for (const v of variables) {
    out = out.replaceAll(`{{${v.key}}}`, v.sample);
  }
  return out;
}

/**
 * Split a raw template into plain-text + tag segments so tags can be rendered
 * as pills. Returns an ordered list of `{ kind, text }`.
 *
 * @param {string} raw
 * @returns {Array<{ kind: 'text'|'tag', text: string }>}
 */
export function splitTemplate(raw) {
  const out = [];
  const re = /\{\{([a-z0-9_]+)\}\}/gi;
  let i = 0;
  let m;
  while ((m = re.exec(raw)) !== null) {
    if (m.index > i) out.push({ kind: 'text', text: raw.slice(i, m.index) });
    out.push({ kind: 'tag', text: m[0] });
    i = m.index + m[0].length;
  }
  if (i < raw.length) out.push({ kind: 'text', text: raw.slice(i) });
  return out;
}
