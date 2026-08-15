import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const sourcePath = path.join(process.cwd(), "lib", "academy-data.ts");
const outputPath = path.join(process.cwd(), "public", "course-content.json");
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const sandbox = { exports: {} };

vm.runInNewContext(compiled, sandbox, { filename: sourcePath });

const payload = {
  schema_version: 1,
  updated_date: new Date().toISOString().slice(0, 10),
  courses: sandbox.exports.courses,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);

console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
