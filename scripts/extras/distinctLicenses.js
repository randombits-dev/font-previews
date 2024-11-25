import fs from 'fs-extra';
import {parseMetadata} from "../metadataParser.js";

const fontList = fs.readdirSync('F:/dev/google-fonts');

const licenses = new Set();
const cats = new Set();

for (const font of fontList) {
  let metadata = null;
  try {
    metadata = parseMetadata(font);
    licenses.add(metadata.license);
    cats.add(metadata.category);
  } catch (e) {
    console.error('bad metadata: ' + font);
    continue;
  }
}

console.log(licenses);
console.log(cats);
