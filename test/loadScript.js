// Loads a legacy "classic <script>" source file (function Foo(){} style,
// no module.exports/export) into the current global context, exactly like
// a <script src="..."> tag would in a browser.
//
// Reads the file's source text and executes it with Node's built-in
// vm.runInThisContext, which runs the code as top-level script code against
// globalThis - so the file's top-level function/var declarations land on
// globalThis instead of being scoped to a module wrapper (which is what
// require()/import would do, and which would make them inaccessible).
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

export function loadScript(relativePath) {
  const filename = path.resolve(process.cwd(), relativePath);
  const code = fs.readFileSync(filename, 'utf8');
  vm.runInThisContext(code, { filename });
}
