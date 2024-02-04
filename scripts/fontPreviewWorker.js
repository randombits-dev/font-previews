import workerpool from 'workerpool';
import fs from 'fs-extra';
import puppeteer from "puppeteer";
import sharp from "sharp";

const getHTML = (name, weight, font) => {
  return `<html>
    <head>
        <style>
            @font-face {
                font-family: ${name};
                font-style: normal;
                font-weight: ${weight};
                src: url(data:font/truetype;charset=utf-8;base64,${font.toString('base64')}) format('truetype');
            }
    
            html,body {
            margin: 0;
            }
            body {
                font-family: ${name}, monospace;
                font-weight: ${weight};
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

let browser = await puppeteer.launch({headless: 'new'});
let count = 0;

const handleFont = async (lowerCaseFontName, name, style) => {
  count++;
  if (count > 100) {
    await browser.close();
    count = 0;
    browser = await puppeteer.launch({headless: 'new'});
  }
  const font = fs.readFileSync(`F:/dev/google-fonts/${lowerCaseFontName}/${style.filename}`);
  const page = await browser.newPage();
  await page.setViewport({width: 300, height: 50, deviceScaleFactor: 1});
  await page.setContent(getHTML(name, style.weight, font));
  const out = await page.screenshot({omitBackground: true});
  // await browser.close();
  const trimmed = sharp(out).trim().webp();
  await trimmed.toFile(`output/images/${lowerCaseFontName}-${style.name}-${style.weight}.webp`);
  const buf = await trimmed.toBuffer();
  return buf.toString('base64');
};

workerpool.worker({
  handleFont
});


