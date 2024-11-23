import fs from 'fs-extra';
import workerpool from 'workerpool';
import {parseMetadata} from "./metadataParser.js";
import {writeFiles} from "./fileWriter.js";
import sharp from "sharp";

const pool = workerpool.pool('./scripts/fontPreviewWorker.js', {
  minWorkers: 4
});

// const nonCharClasses = ["SYMBOLS",

const getIgnored = (apiData) => {
  if (!apiData) {
    return 'no api data';
  }
  if (apiData.isNoto) {
    return 'noto';
  }
  if (apiData.colorCapabilities?.length > 0) {
    return 'color';
  }
  if (apiData.classifications.includes('Symbols')) {
    return 'symbols';
  }
  return '';
};

const convertCategory = (cat) => {
  switch (cat) {
    case 'SANS_SERIF':
      return 'sans';
    case 'SERIF':
      return 'serif';
    case 'DISPLAY':
      return 'display';
    case 'HANDWRITING':
      return 'handwriting';
    case 'MONOSPACE':
      return 'monospace';
    default:
      return '';
  }
};

async function run() {

  const promises = [];

  const fontList = fs.readdirSync('F:/dev/google-fonts');
  const first10 = fontList.slice(0, 10);
  const subset = fontList.filter(font => font === 'abrilfatface' || font === 'dancingscript' || font === 'roboto' || font === 'rubik');

  const apiResult = await fetch('https://fonts.google.com/metadata/fonts').then(raw => raw.json());
  const apiDatas = {};
  apiResult.familyMetadataList.forEach(font => {
    apiDatas[font.family] = font;
  });

  for (const font of fontList) {
    let metadata = null;
    try {
      metadata = parseMetadata(font);
    } catch (e) {
      console.error('bad metadata: ' + font);
      continue;
    }

    const apiData = apiDatas[metadata.name];
    const ignored = getIgnored(apiData);
    if (ignored) {
      console.log('ignored: ' + font + ' - ' + ignored);
      continue;
    }

    // let heavyStyles = metadata.styles.filter(style => style.name === 'normal').sort((a, b) => b.weight - a.weight);
    // if (heavyStyles.length === 0) {
    //   console.log('no normal: ' + font);
    //   continue;
    // }
    //
    // heavyStyles = [heavyStyles[0]];

    const stylePromises = metadata.styles.map((style) => {
      console.log(metadata.name, style.weight);
      return pool.exec('handleFont', [font, metadata.name, style])
          .then(([base64, density]) => ({
            img: `${font}-${style.name}-${style.weight}.webp`,
            type: style.name,
            weight: style.weight,
            density,
            base64,
          })).catch((err) => {
            console.error(err);
          });
    });

    promises.push(new Promise((resolve) => {
      Promise.all(stylePromises).then((results) => {
        console.log(font);
        resolve({
          name: metadata.name,
          category: convertCategory(metadata.category),
          apiData,
          // classes: metadata.classes,
          styles: results
        });
      });
    }));

  }
  return Promise.all(promises);
}

run().then(async (results) => {

  writeFiles(results);

  const sprite = await sharp({
    create: {
      width: 500,
      height: results.length * 40,
      channels: 3,
      background: {r: 255, g: 255, b: 255},
    },
  })
      .composite(
          results.map((result, index) => ({
            input: Buffer.from(result.styles[0].base64, 'base64'),
            left: 0,
            top: index * 40 + 12,
          }))
      )
      .toFormat('webp', {quality: 100})
      .toBuffer();
  fs.writeFileSync('sprite.webp', sprite);


  pool.terminate().then(() => {
    console.log('Terminated');
  });


}).catch((err) => {
  console.error(err);
});

