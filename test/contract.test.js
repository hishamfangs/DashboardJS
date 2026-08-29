// End-to-end coverage for the unified callback contract.
//
// These boot a real Dashboard against the shipped example page inside jsdom
// rather than poking at internals, because the contract IS the observable
// behaviour: what a handler receives, and what the rendered output looks like.
import { describe, it, expect, beforeAll, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const EXAMPLE = path.resolve(
  process.cwd(),
  'dist/Full Example - Uses Current HTML file - Works Locally'
);

const SRC = path.resolve(process.cwd(), 'src/dashboardjs/js');

const EXPORTS = [
  'Action', 'ActionsContainer', 'ActionsMenu', 'Component', 'Dashboard',
  'DataManager', 'Field', 'FieldHeader', 'FieldHeaderContainer', 'FileLoader',
  'Filtering', 'FilteringKeyword', 'PageButton', 'Paging', 'Record',
  'Recordset', 'Sorting', 'SortingItem', 'Tab', 'Tabs', 'Template',
  'TemplateManager', 'UserProfile', 'ViewSwitcher', 'ViewSwitcherButton',
];

/**
 * Reproduces the gulp "scripts" task in memory: alphabetical concat of
 * src/dashboardjs/js/*.js wrapped in the FutureLabs IIFE. Building from source
 * rather than dist/ means these tests always exercise the current code.
 */
function buildBundle() {
  const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.js')).sort();
  const contents = files
    .map((f) => fs.readFileSync(path.join(SRC, f), 'utf8'))
    .join('\n');
  const returns = EXPORTS.map((n) => `${n}: ${n}`).join(', ');
  return `var FutureLabs = (function () {${contents}
return { ${returns} };
})();`;
}

let BUNDLE = null;

/**
 * Boots a dashboard in its own jsdom window and returns that window.
 * The config is stringified into the page because the library's clone()
 * rejects objects created in another realm.
 */
async function boot(configBody, dataBody) {
  const dom = new JSDOM(fs.readFileSync(path.join(EXAMPLE, 'index.html'), 'utf8'), {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'http://localhost/',
  });
  const { window } = dom;

  window.eval('console.log = function () {};');
  window.eval(BUNDLE);

  window.eval(`
    window.__seen = [];
    window.__warnings = [];
    console.warn = function (m) { window.__warnings.push(String(m)); };
    window.__dash = new FutureLabs.Dashboard({
      config: ${configBody},
      data: ${dataBody}
    });
  `);

  // The render pipeline is async.
  await new Promise((r) => setTimeout(r, 600));
  return window;
}

const ONE_ROW = `{ 'People': [ { Name: 'Jessie', Status: 'Married', Gender: 'Female', Born: '1980-08-10' } ] }`;

const wrap = (fieldsBody, recordSettingsExtra = '') => `{
  tabs: { 'People': { viewMode: 'Cards', recordSettings: {
    ${recordSettingsExtra}
    fields: ${fieldsBody}
  } } }
}`;

let available = true;
beforeAll(() => {
  available = fs.existsSync(path.join(EXAMPLE, 'index.html'));
  if (available) {
    BUNDLE = buildBundle();
  }
});

describe('unified callback contract', () => {
  describe('context object', () => {
    it('gives a field ctx.value, ctx.record, ctx.el and ctx.component', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', onRender: function (ctx) {
          window.__seen.push({
            value: ctx.value,
            record: ctx.record && ctx.record.Name,
            hasEl: !!(ctx.el && ctx.el.nodeType),
            isSelf: ctx.component === ctx
          });
        } } }`),
        ONE_ROW
      );
      const seen = w.__seen;
      expect(seen.length).toBeGreaterThan(0);
      expect(seen[0].value).toBe('Jessie');
      expect(seen[0].record).toBe('Jessie');
      expect(seen[0].hasEl).toBe(true);
      expect(seen[0].isSelf).toBe(true);
    });

    it('ctx.value is the field value while ctx.record is the whole row', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Status: { name: 'Status', onRender: function (ctx) {
          window.__seen.push([ctx.value, typeof ctx.record, ctx.record.Gender]);
        } } }`),
        ONE_ROW
      );
      expect(w.__seen[0]).toEqual(['Married', 'object', 'Female']);
    });
  });

  describe('the `value` hook', () => {
    it('replaces the rendered value', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', value: function (ctx) { return 'REPLACED'; } } }`),
        ONE_ROW
      );
      expect(w.document.body.textContent).toContain('REPLACED');
      expect(w.document.body.textContent).not.toContain('Jessie');
    });

    it('honours an empty string, so a field can be blanked', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', value: function () { return ''; } } }`),
        ONE_ROW
      );
      // Previously a falsy return was ignored and the original value survived.
      expect(w.document.body.textContent).not.toContain('Jessie');
    });

    it('falls through to the default when it returns undefined', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', value: function () { return undefined; } } }`),
        ONE_ROW
      );
      expect(w.document.body.textContent).toContain('Jessie');
    });

    it('wins over dataType "Date" instead of being overwritten by it', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Born: { name: 'Born', dataType: 'Date', value: function () { return 'CUSTOM DATE'; } } }`),
        ONE_ROW
      );
      expect(w.document.body.textContent).toContain('CUSTOM DATE');
    });

    it('still renders the date template when the hook opts out', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Born: { name: 'Born', dataType: 'Date' } }`),
        ONE_ROW
      );
      expect(w.document.querySelector('.record-date')).toBeTruthy();
    });
  });

  describe('computed nouns', () => {
    it('accepts a function for icon', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', icon: function (ctx) { return ctx.record.Gender === 'Female' ? 'is-female' : 'is-male'; } } }`),
        ONE_ROW
      );
      expect(w.document.querySelector('.is-female')).toBeTruthy();
    });

    it('accepts a function for url and renders the href', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', url: function (ctx) { return '/p/' + ctx.record.Name; } } }`),
        ONE_ROW
      );
      const a = w.document.querySelector('a[href="/p/Jessie"]');
      expect(a).toBeTruthy();
    });

    it('a falsy url leaves no anchor, and never writes href="null"', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', url: function () { return null; } } }`),
        ONE_ROW
      );
      // Note: jsdom's [href="null"] selector also matches anchors with NO href
      // attribute, so read the attribute directly instead of using a selector.
      const literalNulls = [...w.document.querySelectorAll('a')].filter(
        (a) => a.getAttribute('href') === 'null'
      );
      expect(literalNulls).toHaveLength(0);
      expect(w.document.querySelectorAll('.field-component a')).toHaveLength(0);
    });

    it('accepts a function for visibility', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', visibility: function (ctx) { return ctx.record.Status ? 'hide' : 'show'; } } }`),
        ONE_ROW
      );
      // 'hide' marks the component with a class; it does not strip it from the
      // DOM, so assert on the marker rather than on the text.
      expect(w.document.querySelector('.field-component.hide')).toBeTruthy();
    });
  });

  describe('onClick', () => {
    const clickFirst = (w, sel) =>
      w.eval(`(function () {
        var el = document.querySelector('${sel}');
        if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      })();`);

    it('passes (component, record, event) with this bound to the component', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', onClick: function (component, record, event) {
          window.__seen.push({
            thisIs: this && this.constructor && this.constructor.name,
            arg1IsThis: component === this,
            recordName: record && record.Name,
            recordIsRow: typeof record === 'object' && record !== null,
            hasEvent: !!(event && event.type)
          });
        } } }`),
        ONE_ROW
      );
      clickFirst(w, '.field-component');
      expect(w.__seen).toHaveLength(1);
      expect(w.__seen[0].thisIs).toBe('Field');
      expect(w.__seen[0].arg1IsThis).toBe(true);
      expect(w.__seen[0].recordIsRow).toBe(true);
      expect(w.__seen[0].recordName).toBe('Jessie');
      expect(w.__seen[0].hasEvent).toBe(true);
    });

    it("a field's second argument is the ROW, not the field's value", async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', onClick: function (component, record) {
          window.__seen.push([typeof record, record.Gender, component.value]);
        } } }`),
        ONE_ROW
      );
      clickFirst(w, '.field-component');
      // Used to be the string "Jessie" - the field's own value.
      expect(w.__seen[0]).toEqual(['object', 'Female', 'Jessie']);
    });

    it('a record receives the same row', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name' } }`, `onClick: function (component, record) {
          window.__seen.push(record && record.Name);
        },`),
        ONE_ROW
      );
      clickFirst(w, '.record-component');
      expect(w.__seen[0]).toBe('Jessie');
    });

    it('reads cleanly when destructured', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', onClick: ({ value, record, el }) => {
          window.__seen.push([value, record.Status, !!(el && el.nodeType)]);
        } } }`),
        ONE_ROW
      );
      clickFirst(w, '.field-component');
      expect(w.__seen[0]).toEqual(['Jessie', 'Married', true]);
    });

    it('exposes the DOM event on the context so it can be destructured', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', onClick: ({ event }) => {
          window.__seen.push(event && event.type);
        } } }`),
        ONE_ROW
      );
      clickFirst(w, '.field-component');
      expect(w.__seen[0]).toBe('click');
    });

    it('a destructured event can stop propagation to the record', async () => {
      if (!available) return;
      const w = await boot(
        wrap(
          `{ Name: { name: 'Name', onClick: ({ event }) => {
            window.__seen.push('field');
            event.stopPropagation();
          } } }`,
          `onClick: () => { window.__seen.push('record'); },`
        ),
        ONE_ROW
      );
      clickFirst(w, '.field-component');
      expect(w.__seen).toEqual(['field']);
    });
  });

  describe('onRender', () => {
    it('fires exactly once per component instance', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', onRender: function (ctx) { window.__seen.push(ctx.uid); } } }`),
        ONE_ROW
      );
      // A field is built once for Card view and once for List view, so more
      // than one firing is expected - but no single instance may fire twice.
      // Before the duplicate, unbound call site was removed, each instance
      // fired twice (four firings for these two instances).
      expect(w.__seen.length).toBeGreaterThan(0);
      expect(new Set(w.__seen).size).toBe(w.__seen.length);
    });

    it('binds this to the component on every firing', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', onRender: function () {
          window.__seen.push(this && this.constructor && this.constructor.name);
        } } }`),
        ONE_ROW
      );
      expect(w.__seen.every((n) => n === 'Field')).toBe(true);
    });
  });

  describe('all three call styles are supported', () => {
    it('arrow function reads the context argument', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', value: (ctx) => 'ARROW:' + ctx.record.Name } }`),
        ONE_ROW
      );
      expect(w.document.body.textContent).toContain('ARROW:Jessie');
    });

    it('destructured arrow reads value and record', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', value: ({ value, record }) => value + '/' + record.Gender } }`),
        ONE_ROW
      );
      expect(w.document.body.textContent).toContain('Jessie/Female');
    });

    it('v1 positional signature still works', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', value: function (field, record) { return field.data + '|' + record.Status; } } }`),
        ONE_ROW
      );
      expect(w.document.body.textContent).toContain('Jessie|Married');
    });

    it('this-based signature still works', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', value: function () { return 'THIS:' + this.record.Status; } } }`),
        ONE_ROW
      );
      expect(w.document.body.textContent).toContain('THIS:Married');
    });
  });

  describe('deprecated aliases', () => {
    it('onGetValue still works and warns', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', onGetValue: function (field) { return 'LEGACY'; } } }`),
        ONE_ROW
      );
      expect(w.document.body.textContent).toContain('LEGACY');
      expect(w.__warnings.join(' ')).toContain('onGetValue');
      expect(w.__warnings.join(' ')).toContain('value');
    });

    it('onLoop still works and warns', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', onLoop: function (ctx) { window.__seen.push(ctx.uid); } } }`),
        ONE_ROW
      );
      expect(w.__seen.length).toBeGreaterThan(0);
      expect(new Set(w.__seen).size).toBe(w.__seen.length);
      expect(w.__warnings.join(' ')).toContain('onLoop');
      expect(w.__warnings.join(' ')).toContain('onRender');
    });

    it('an explicit new key wins over its deprecated alias', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', value: function () { return 'NEW'; }, onGetValue: function () { return 'OLD'; } } }`),
        ONE_ROW
      );
      expect(w.document.body.textContent).toContain('NEW');
      expect(w.document.body.textContent).not.toContain('OLD');
    });
  });

  describe('error containment', () => {
    it('a throwing value hook falls back to the default instead of breaking render', async () => {
      if (!available) return;
      const w = await boot(
        wrap(`{ Name: { name: 'Name', value: function () { throw new Error('boom'); } } }`),
        ONE_ROW
      );
      expect(w.document.body.textContent).toContain('Jessie');
    });
  });
});
