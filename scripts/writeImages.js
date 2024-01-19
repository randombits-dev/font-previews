import puppeteer from "puppeteer";
import sharp from "sharp";

import fs from 'fs-extra';

const base64s = [];
const errors = [];

const parseMetadata = (metadata) => {
  const nameIndex = metadata.indexOf('name: "');
  const nameStart = nameIndex + 7;
  const nameEnd = metadata.indexOf('"', nameStart);
  const name = metadata.slice(nameStart, nameEnd);

  const categoryIndex = metadata.indexOf('category: "');
  const categoryStart = categoryIndex + 11;
  const categoryEnd = metadata.indexOf('"', categoryStart);
  const category = metadata.slice(categoryStart, categoryEnd);

  const normalIndex = metadata.indexOf('style: "normal"', categoryEnd);
  if (normalIndex === -1) {
    return null;
  }
  const fileNameIndex = metadata.indexOf('filename: "', normalIndex);
  const fileNameStart = fileNameIndex + 11;
  const fileNameEnd = metadata.indexOf('"', fileNameStart);
  const fileName = metadata.slice(fileNameStart, fileNameEnd);
  return {
    name,
    category,
    fileName
  };
};

const writeFont = async (lowerCaseFontName) => {
  // const removedSpaces = fontName.replace(/\s/g, '');
  // const lowerCaseFontName = removedSpaces.toLowerCase();
  console.log(lowerCaseFontName);
  try {
    const metadataFile = fs.readFileSync(`F:/dev/google-fonts/${lowerCaseFontName}/METADATA.pb`);
    const metadata = parseMetadata(metadataFile.toString());

    const font = fs.readFileSync(`F:/dev/google-fonts/${lowerCaseFontName}/${metadata.fileName}`);
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    await page.setViewport({width: 300, height: 50, deviceScaleFactor: 1});
    await page.setContent(`<html>
    <head>
        <style>
            @font-face {
                font-family: ${metadata.name};
                font-style: normal;
                font-weight: 400;
                src: url(data:font/truetype;charset=utf-8;base64,${font.toString('base64')}) format('truetype');
            }
    
            html,body {
            margin: 0;
            }
            body {
                font-family: ${metadata.name}, monospace;
                font-weight: 400;
                font-size: 8px;
                height: 100vh;
                display: flex;
                align-items: center;
            }
</style>
    </head>
    <body>
        <h1>${metadata.name}</h1>
    </body></html>`);
    // await page.screenshot({omitBackground: false, path: `scripts/out/${lowerCaseFontName}.png`});
    const out = await page.screenshot({omitBackground: true});
    await browser.close();
    const trimmed = sharp(out).trim().webp();
    await trimmed.toFile(`scripts/out/${lowerCaseFontName}.webp`);
    const buf = await trimmed.toBuffer();
    const base64 = buf.toString('base64');
    base64s.push([metadata.name, metadata.category, base64]);
  } catch (e) {
    console.error(`Failed`);
    console.log(e);
  }
};

const fontList = fs.readdirSync('F:/dev/google-fonts');
for (const font of fontList) {
  await writeFont(font);
  fs.writeFileSync('scripts/base64s.json', JSON.stringify(base64s));
}

// fs.writeFileSync('scripts/base64s.json', JSON.stringify(base64s));
