import workerpool from 'workerpool';
import fs from 'fs-extra';
import puppeteer from "puppeteer";
import sharp from "sharp";
import {PNG} from "pngjs";
import {Readable} from "stream";

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
                font-size: ${densityTest ? '50vh' : '8px'};
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

const getDensity = (buf) => {
  return new Promise((resolve, reject) => {
    const readableStream = new Readable();
    readableStream._read = () => {
    }; // _read is required but you can noop it
    readableStream.push(buf);
    readableStream.push(null); // Indicates the end of the stream

    readableStream
        .pipe(new PNG())
        .on('parsed', function () {
          let count = 0;
          for (let i = 0; i < this.data.length; i += 4) {
            if (this.data[i + 3] !== 0) {
              count++;
            }
          }
          resolve(count / (this.data.length / 4));
        });
  });
};


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
  await page.setContent(getHTML(name, 400, font, false));
  const out = await page.screenshot({omitBackground: true});
  // await browser.close();

  const page2 = await browser.newPage();
  await page2.setViewport({width: 300, height: 50, deviceScaleFactor: 1});
  await page2.setContent(getHTML('abcdefg', 900, font, true));
  const out2 = await page2.screenshot({omitBackground: true});
  const png = sharp(out2).trim().png();
  const pngBuf = await png.toBuffer();
  const density = await getDensity(pngBuf);

  const trimmed = sharp(out).trim().webp();
  await trimmed.toFile(`output/images/${lowerCaseFontName}-${style.name}-${style.weight}.webp`);
  const buf = await trimmed.toBuffer();
  return [buf.toString('base64'), density];
};

workerpool.worker({
  handleFont
});


