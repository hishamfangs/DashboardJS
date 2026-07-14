import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// DataManager and clone are loaded as ambient globals by test/setup.js
// (via vitest.config.js's setupFiles), exactly as they'd be available as
// globals after a <script src="helper.js"> + <script src="DataManager.js">
// page load. No import needed for them here.

function makeSampleData() {
  return [
    { Name: 'Alice Smith', Age: 30, Status: 'Active' },
    { Name: 'Bob Jones', Age: 25, Status: 'Inactive' },
    { Name: 'Carol White', Age: 40, Status: 'Active' },
    { Name: 'Dave Brown', Age: 35, Status: 'Active' },
    { Name: 'Eve Black', Age: 22, Status: 'Inactive' },
  ];
}

afterEach(() => {
  vi.restoreAllMocks();
  delete global.fetch;
});

describe('DataManager', () => {
  describe('local (in-memory) data pipeline', () => {
    let dm;

    beforeEach(() => {
      // itemsPerPage defaults to 12, so the whole 5-record sample fits on
      // page 1 - lets us assert on getData() directly without worrying
      // about pagination in the sorting/search/filter tests below.
      dm = new DataManager({}, makeSampleData());
    });

    it('populates all data buckets and count on construction', () => {
      expect(dm.count).toBe(5);
      expect(dm.data.raw).toHaveLength(5);
      expect(dm.data.searched).toHaveLength(5);
      expect(dm.data.filtered).toHaveLength(5);
      expect(dm.data.sorted).toHaveLength(5);
      expect(dm.data.paged).toHaveLength(5);
    });

    describe('sorting', () => {
      it('sorts ascending by a given field', async () => {
        await dm.sort({ sortBy: 'Age', sortDirection: 'asc' });
        expect(dm.getData().map((r) => r.Age)).toEqual([22, 25, 30, 35, 40]);
      });

      it('sorts descending by a given field', async () => {
        await dm.sort({ sortBy: 'Age', sortDirection: 'desc' });
        expect(dm.getData().map((r) => r.Age)).toEqual([40, 35, 30, 25, 22]);
      });
    });

    describe('keyword filtering', () => {
      it('addKeyword("active") matches both Active and Inactive records (plain substring match, no word boundaries)', async () => {
        await dm.addKeyword('active');
        // "Inactive" contains "active" as a substring, so it matches too -
        // this is the actual (if surprising) behavior of the substring
        // filter, not a bug to work around in the test.
        expect(dm.count).toBe(5);
        const statuses = dm.getData().map((r) => r.Status).sort();
        expect(statuses).toEqual(['Active', 'Active', 'Active', 'Inactive', 'Inactive']);
      });

      it('removeKeyword("active") restores all records', async () => {
        await dm.addKeyword('active');
        await dm.removeKeyword('active');
        expect(dm.count).toBe(5);
        expect(dm.getData()).toHaveLength(5);
      });

      it('a keyword that only appears in specific records narrows the result set', async () => {
        await dm.addKeyword('alice');
        expect(dm.count).toBe(1);
        expect(dm.getData()[0].Name).toBe('Alice Smith');
      });
    });

    describe('search', () => {
      it('narrows results to records whose field contains the search value (case-insensitive)', async () => {
        await dm.doSearch([{ field: 'Name', value: 'o' }]);
        const names = dm.getData().map((r) => r.Name).sort();
        expect(names).toEqual(['Bob Jones', 'Carol White', 'Dave Brown']);
      });

      it('wholeWordSearch requires an exact full-field match, not a substring', async () => {
        await dm.doSearch([
          { field: 'Status', value: 'active', options: { wholeWordSearch: true } },
        ]);
        // Without wholeWordSearch this would also match "Inactive"; with it,
        // only the exact "Active" records should remain.
        expect(dm.count).toBe(3);
        expect(dm.getData().every((r) => r.Status === 'Active')).toBe(true);
      });
    });

    it('getFieldsFromData returns an entry per field present on the data', () => {
      const fields = dm.getFieldsFromData();
      expect(Object.keys(fields).sort()).toEqual(['Age', 'Name', 'Status']);
    });

    describe('pagination clamping', () => {
      let pagedDm;

      beforeEach(() => {
        // 5 records, 2 per page -> 3 pages, with no sort/filter applied so
        // the sorted order matches the original insertion order.
        pagedDm = new DataManager({ itemsPerPage: 2 }, makeSampleData());
      });

      it('clamps goToPage(0) to page 1 and returns the first 2 records', async () => {
        await pagedDm.goToPage(0);
        expect(pagedDm.page).toBe(1);
        expect(pagedDm.getData().map((r) => r.Name)).toEqual(['Alice Smith', 'Bob Jones']);
      });

      it('clamps goToPage(-5) to page 1 and returns the first 2 records', async () => {
        await pagedDm.goToPage(-5);
        expect(pagedDm.page).toBe(1);
        expect(pagedDm.getData().map((r) => r.Name)).toEqual(['Alice Smith', 'Bob Jones']);
      });

      it('clamps goToPage(999) to the last valid page', async () => {
        await pagedDm.goToPage(999);
        expect(pagedDm.page).toBe(3);
        expect(pagedDm.getData()).toHaveLength(1);
        expect(pagedDm.getData()[0].Name).toBe('Eve Black');
      });
    });
  });

  describe('remote (fetch-backed) pipeline', () => {
    it('falls back to native fetch when no fetchFunction is configured (regression: fetchFunction used to default to an always-truthy stub, making this branch dead code)', async () => {
      global.fetch = vi.fn(async () => ({
        json: async () => ({ data: [{ Name: 'X' }], count: 1 }),
      }));

      const dm = new DataManager({ fetch: { url: 'http://fake.test/api' } });
      await dm.refresh();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [calledUrl] = global.fetch.mock.calls[0];
      expect(String(calledUrl)).toContain('http://fake.test/api');
      expect(dm.count).toBe(1);
      expect(dm.getData()).toEqual([{ Name: 'X' }]);
    });

    it('calls a custom fetchFunction with a single params object (not url, options), with sortBy reflecting current sorting state', async () => {
      const fetchFunction = vi.fn(async () => ({ data: [], count: 0 }));
      const dm = new DataManager({
        fetch: { url: 'http://fake.test/api' },
        fetchFunction,
      });

      await dm.sort({ sortBy: 'Age', sortDirection: 'desc' });

      expect(fetchFunction).toHaveBeenCalledTimes(1);
      const call = fetchFunction.mock.calls[0];
      // A single plain object argument, not (url, options).
      expect(call).toHaveLength(1);
      const params = call[0];
      expect(params).toMatchObject({
        page: 1,
        itemsPerPage: 12,
        getCount: false,
        tabName: '',
      });
      expect(params).toHaveProperty('filterBy');
      // Regression: this used to reference a nonexistent `this.sortBy` and
      // always send `undefined`.
      expect(params.sortBy).toBe(JSON.stringify(dm.sorting));
    });

    it('remaps parameter names via fetch.dashboardParameters (regression: remap used to be silently ignored)', async () => {
      const fetchFunction = vi.fn(async () => ({ data: [], count: 0 }));
      const dm = new DataManager({
        fetch: {
          url: 'http://fake.test/api',
          dashboardParameters: { page: 'pageNumber' },
        },
        fetchFunction,
      });

      await dm.refresh();

      const params = fetchFunction.mock.calls[0][0];
      expect(params).toHaveProperty('pageNumber');
      expect(params).not.toHaveProperty('page');
    });

    it('does not throw and logs a warning when fetchFunction rejects (regression: try/catch fix)', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const fetchFunction = vi.fn(async () => {
        throw new Error('network down');
      });
      const dm = new DataManager({
        fetch: { url: 'http://fake.test/api' },
        fetchFunction,
      });

      // If refresh() rejected, this await would throw and fail the test.
      await dm.refresh();

      expect(warnSpy).toHaveBeenCalled();
    });

    it('goToPage triggers a new fetchFunction call reflecting the updated page (regression: pagination was previously dead/commented-out code for remote data)', async () => {
      const fetchFunction = vi.fn(async (params) => ({
        data: [{ tag: 'page' + params.page }],
        count: 5,
      }));
      const dm = new DataManager({
        itemsPerPage: 2,
        fetch: { url: 'http://fake.test/api' },
        fetchFunction,
      });

      // Seed count/pages with an initial load (5 records, 2/page -> 3 pages).
      await dm.refresh();
      expect(fetchFunction).toHaveBeenCalledTimes(1);

      await dm.goToPage(3);

      expect(fetchFunction).toHaveBeenCalledTimes(2);
      const lastParams = fetchFunction.mock.calls[1][0];
      expect(lastParams.page).toBe(3);
      expect(dm.getData()).toEqual([{ tag: 'page3' }]);
    });
  });

  describe('concurrency / runExclusive', () => {
    function deferred() {
      let resolve;
      const promise = new Promise((r) => {
        resolve = r;
      });
      return { promise, resolve };
    }

    it('coalesces calls that arrive while one is in flight into a single trailing call (not one-per-call, not dropped)', async () => {
      const deferreds = [];
      const fetchFunction = vi.fn(async (params) => {
        const d = deferred();
        deferreds.push(d);
        await d.promise;
        return { data: [{ sortBy: params.sortBy }], count: 1 };
      });
      const dm = new DataManager({
        fetch: { url: 'http://fake.test/api' },
        fetchFunction,
      });

      // Both calls start while nothing has resolved yet.
      const p1 = dm.sort({ sortBy: 'Age' });
      const p2 = dm.addKeyword('x');

      // The first call fires immediately; the second, arriving while the
      // first is still in flight, should be queued as a single trailing
      // task rather than firing its own overlapping request.
      await vi.waitFor(() => expect(fetchFunction).toHaveBeenCalledTimes(1));

      // Let the in-flight call finish, which should kick off exactly one
      // coalesced trailing call.
      deferreds[0].resolve();
      await vi.waitFor(() => expect(deferreds).toHaveLength(2));
      deferreds[1].resolve();

      await p1;
      await p2;

      // Exactly 2 calls total: the original in-flight one, plus a single
      // coalesced trailing call - never 3 (no coalescing) and never 1
      // (second call dropped).
      expect(fetchFunction).toHaveBeenCalledTimes(2);
    });

    it('final state reflects the last call made, never an earlier one resolving later (stale-response race)', async () => {
      const deferreds = [];
      const fetchFunction = vi.fn(async (params) => {
        const d = deferred();
        deferreds.push({ d, params });
        return await d.promise;
      });
      const dm = new DataManager({
        fetch: { url: 'http://fake.test/api' },
        fetchFunction,
      });

      const pA = dm.sort({ sortBy: 'Age' }); // fires immediately (call #1)
      const pB = dm.sort({ sortBy: 'Name' }); // queued as trailing task while #1 is in flight

      await vi.waitFor(() => expect(deferreds).toHaveLength(1));

      // Resolve the earlier call first. Per runExclusive's trailing logic,
      // this both finishes call A AND immediately kicks off call B's real
      // request.
      deferreds[0].d.resolve({ data: [{ tag: 'A' }], count: 1 });
      await vi.waitFor(() => expect(deferreds).toHaveLength(2));

      // Resolve the later call last.
      deferreds[1].d.resolve({ data: [{ tag: 'B' }], count: 1 });

      await pA;
      await pB;

      expect(fetchFunction).toHaveBeenCalledTimes(2);
      // The final state must correspond to the LAST call made (tag B),
      // never the earlier one (tag A), regardless of resolution timing.
      expect(dm.getData()).toEqual([{ tag: 'B' }]);
    });
  });
});
