import { loadScript } from './loadScript.js';

// helper.js contains two top-level `function clone(obj) {...}` declarations
// (this is pre-existing production source, not something introduced here).
// Because both are plain function declarations with the same name in the
// same scope, the second one wins (later declarations overwrite earlier
// ones of the same name during hoisting) - so the *second* definition is
// the one that actually runs whenever DataManager.js calls the global
// clone(). That second definition does:
//
//   if (... || obj.templateManager instanceof TemplateManager || obj instanceof Dashboard) {...}
//
// `TemplateManager` and `Dashboard` are separate application classes
// defined in their own <script> files (TemplateManager.js / Dashboard.js).
// In the full app they're loaded as siblings on the same page and are
// therefore always present as globals by the time clone() runs. Here we
// intentionally load only helper.js + DataManager.js (DataManager has no
// DOM dependency of its own; the other files pull in far more of the DOM
// surface than we need for these tests), so without a stand-in for those
// two identifiers, the `instanceof` checks above throw
// "ReferenceError: TemplateManager is not defined" on *every* call to
// clone() - including the one inside DataManager's own constructor.
//
// These stubs are just empty constructor functions so `instanceof` can be
// evaluated (and will simply be false for the plain objects/arrays used in
// these tests, letting clone() fall through to its normal Array/Object
// deep-clone branches - the actual behavior under test).
globalThis.TemplateManager = globalThis.TemplateManager || function TemplateManager() {};
globalThis.Dashboard = globalThis.Dashboard || function Dashboard() {};

// Order matters: DataManager.js calls the global clone() defined in
// helper.js, so helper.js must be loaded first.
loadScript('src/dashboardjs/js/helper.js');
loadScript('src/dashboardjs/js/DataManager.js');
