import type { CodeLanguageId } from "@/lib/data/code-api";

/** "web" is the HTML/CSS/JS preview; the rest are the shared coding languages. */
export type PlaygroundLanguageId = CodeLanguageId | "web";

export interface PlaygroundFile {
  name: string;
  content: string;
}

export interface PlaygroundLanguage {
  id: PlaygroundLanguageId;
  label: string;
  /** Monaco language id for syntax highlighting. */
  monaco: string;
  /** Extension used when a new file is created. */
  ext: string;
  template: PlaygroundFile[];
}

const ABAP_TEMPLATE = `REPORT zhello.

CLASS lcl_greeter DEFINITION.
  PUBLIC SECTION.
    METHODS greet IMPORTING iv_name TYPE string RETURNING VALUE(rv_text) TYPE string.
ENDCLASS.

CLASS lcl_greeter IMPLEMENTATION.
  METHOD greet.
    rv_text = |Hello, { iv_name }!|.
  ENDMETHOD.
ENDCLASS.

DATA lo_greeter TYPE REF TO lcl_greeter.
DATA lt_numbers TYPE STANDARD TABLE OF i WITH DEFAULT KEY.
DATA lv_sum TYPE i.

START-OF-SELECTION.
  CREATE OBJECT lo_greeter.
  WRITE / lo_greeter->greet( 'JKS Learner' ).

  APPEND 10 TO lt_numbers.
  APPEND 20 TO lt_numbers.
  APPEND 30 TO lt_numbers.
  LOOP AT lt_numbers INTO DATA(lv_number).
    lv_sum = lv_sum + lv_number.
  ENDLOOP.
  WRITE / |Total: { lv_sum }|.
`;

export const PLAYGROUND_LANGUAGES: PlaygroundLanguage[] = [
  {
    id: "web",
    label: "Web (HTML, CSS, JS)",
    monaco: "html",
    ext: "html",
    template: [
      {
        name: "index.html",
        content:
          '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <title>Playground</title>\n  <link rel="stylesheet" href="styles.css" />\n</head>\n<body>\n  <h1>Hello, JKS Developer</h1>\n  <button id="btn">Clicked 0 times</button>\n  <script src="index.js"></script>\n</body>\n</html>\n',
      },
      {
        name: "styles.css",
        content: "body {\n  font-family: system-ui, sans-serif;\n  padding: 2rem;\n}\n\nbutton {\n  padding: 0.5rem 1rem;\n}\n",
      },
      {
        name: "index.js",
        content:
          'let count = 0;\nconst btn = document.getElementById("btn");\nbtn.addEventListener("click", () => {\n  count++;\n  btn.textContent = `Clicked ${count} times`;\n});\n',
      },
    ],
  },
  {
    id: "javascript",
    label: "JavaScript",
    monaco: "javascript",
    ext: "js",
    template: [{ name: "main.js", content: 'const names = ["Asha", "Ravi", "Meera"];\nfor (const n of names) {\n  console.log(`Hello, ${n}!`);\n}\n' }],
  },
  {
    id: "typescript",
    label: "TypeScript",
    monaco: "typescript",
    ext: "ts",
    template: [{ name: "main.ts", content: 'const greet = (name: string): string => `Hello, ${name}!`;\nconsole.log(greet("JKS"));\n' }],
  },
  {
    id: "python",
    label: "Python",
    monaco: "python",
    ext: "py",
    template: [{ name: "main.py", content: 'names = ["Asha", "Ravi", "Meera"]\nfor n in names:\n    print(f"Hello, {n}!")\n' }],
  },
  {
    id: "java",
    label: "Java",
    monaco: "java",
    ext: "java",
    template: [
      {
        name: "Main.java",
        content: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, JKS!");\n    }\n}\n',
      },
    ],
  },
  {
    id: "cpp",
    label: "C++",
    monaco: "cpp",
    ext: "cpp",
    template: [
      { name: "main.cpp", content: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, JKS!" << std::endl;\n    return 0;\n}\n' },
    ],
  },
  {
    id: "csharp",
    label: "C#",
    monaco: "csharp",
    ext: "cs",
    template: [
      {
        name: "Main.cs",
        content: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, JKS!");\n    }\n}\n',
      },
    ],
  },
  {
    id: "sql",
    label: "SQL",
    monaco: "sql",
    ext: "sql",
    template: [
      {
        name: "main.sql",
        content: "CREATE TABLE courses (id INTEGER, title TEXT);\nINSERT INTO courses VALUES (1, 'SAP ABAP'), (2, 'Java Full Stack');\nSELECT * FROM courses;\n",
      },
    ],
  },
  {
    id: "abap",
    label: "SAP ABAP",
    monaco: "abap",
    ext: "abap",
    template: [{ name: "zhello.abap", content: ABAP_TEMPLATE }],
  },
];

export const getLanguage = (id: PlaygroundLanguageId): PlaygroundLanguage =>
  PLAYGROUND_LANGUAGES.find((l) => l.id === id) ?? PLAYGROUND_LANGUAGES[1];

/** What each language really runs on, shown to the user instead of a vague "supported". */
export function describeRuntime(
  id: PlaygroundLanguageId,
  serverLanguages: Set<string>,
): { available: boolean; where: string; note?: string } {
  if (id === "web") return { available: true, where: "Browser preview (sandboxed)" };
  if (id === "javascript") return { available: true, where: "Browser (isolated worker)" };
  if (id === "abap") {
    return {
      available: true,
      where: "Browser (open-abap runtime)",
      note: "A limited subset of ABAP: reports, local classes, internal tables, structures and string templates. There is no SAP database, SAP UI or standard exception classes.",
    };
  }
  if (serverLanguages.has(id)) return { available: true, where: "Execution service" };
  return {
    available: false,
    where: "Not available",
    note: "Running this language needs the code execution service, which is not configured on this server.",
  };
}
