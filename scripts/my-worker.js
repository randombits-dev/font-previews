import fs from "fs-extra";
import puppeteer from "puppeteer";
import sharp from "sharp";

const getHTML = (name, font) => {
  return `<html>
    <head>
        <style>
            @font-face {
                font-family: ${name};
                font-style: normal;
                font-weight: 400;
                src: url(data:font/truetype;charset=utf-8;base64,${font.toString('base64')}) format('truetype');
            }
    
            html,body {
            margin: 0;
            }
            body {
                font-family: ${name}, monospace;
                font-weight: 400;
                font-size: 8px;
                height: 100vh;
                display: flex;
                align-items: center;
            }
</style>
    </head>
    <body>
        <h1>${name}</h1>
    </body></html>`;
};

self.addEventListener('message', async function ({data}) {
  const {lowerCaseFontName} = data;
  try {
    const metadataFile = fs.readFileSync(`F:/dev/google-fonts/${lowerCaseFontName}/METADATA.pb`);
    const metadata = parseMetadata(metadataFile.toString());

    const font = fs.readFileSync(`F:/dev/google-fonts/${lowerCaseFontName}/${metadata.fileName}`);
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    await page.setViewport({width: 300, height: 50, deviceScaleFactor: 1});
    await page.setContent(getHTML(metadata.name, font));
    // await page.screenshot({omitBackground: false, path: `scripts/out/${lowerCaseFontName}.png`});
    const out = await page.screenshot({omitBackground: true});
    await browser.close();
    const trimmed = sharp(out).trim().webp();
    await trimmed.toFile(`scripts/out/${lowerCaseFontName}.webp`);
    const buf = await trimmed.toBuffer();
    const base64 = buf.toString('base64');
    self.postMessage({base64, metadata});
    // base64s.push([metadata.name, metadata.category, base64]);
  } catch (e) {
    console.error(`Failed`);
    console.log(e);
  }
});
