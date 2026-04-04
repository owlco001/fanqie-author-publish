import fs from 'node:fs/promises';

const templatePath = new URL('../templates/task-template.txt', import.meta.url);
const outputPath = process.argv[2] || '/tmp/baidu-task.txt';

const vars = {
  BOOK_ID: process.env.BOOK_ID || '',
  TITLE: process.env.TITLE || '',
  BODY_PATH: process.env.BODY_PATH || '',
  AUTO_PUBLISH: process.env.AUTO_PUBLISH || 'false',
  MIN_WORDS: process.env.MIN_WORDS || '20'
};

const template = await fs.readFile(templatePath, 'utf8');
const output = template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');

await fs.writeFile(outputPath, output, 'utf8');
console.log(`Task written to ${outputPath}`);
