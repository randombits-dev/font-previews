import workerpool from 'workerpool';
import fs from 'fs-extra';
import puppeteer from "puppeteer";
import sharp from "sharp";
import {convertFont} from "./convertFont.js";
import {woff2} from "fonteditor-core";

const getHTML = (name, weight, font, densityTest) => {
  return `<html>
    <head>
        <style>
            @font-face {
                font-family: ${name};
                font-style: normal;
                font-weight: ${weight};
                src: url(data:font/truetype;charset=utf-8;base64,${font.toString('base64')}) format('opentype');
            }
    
            html,body {
            margin: 0;
            }
            body {
                font-family: ${name}, monospace;
                font-weight: 400;
                font-size: 28px;
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

await woff2.init();

let browser = await puppeteer.launch({headless: 'new'});
let count = 0;

const handleFont = async (lowerCaseFontName, name, style, i) => {
  count++;
  if (count > 100) {
    await browser.close();
    count = 0;
    browser = await puppeteer.launch({headless: 'new'});
  }
  const font = fs.readFileSync(`F:/dev/google-fonts/${lowerCaseFontName}/${style.filename}`);

  convertFont(font, name, style, i);

  const page = await browser.newPage();
  await page.setViewport({width: 1500, height: 100, deviceScaleFactor: 1});
  await page.setContent(getHTML(name, 400, font, false));
  const out = await page.screenshot({omitBackground: true});

  await sharp(out).trim().resize({
    fit: 'contain',
    height: 36
  }).webp().toFile(`fonts/${name}/${i}.webp`);
};

workerpool.worker({
  handleFont
});


