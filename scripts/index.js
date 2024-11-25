import fs from 'fs-extra';
import workerpool from 'workerpool';
import {parseMetadata} from "./metadataParser.js";
import {writeFiles} from "./fileWriter.js";

const pool = workerpool.pool('./scripts/fontPreviewWorker.js', {
  minWorkers: 4
});

const IGNORE = ["BIZ UDGothic", "BIZ UDPGothic", "BIZ UDMincho", "BIZ UDPMincho", "Klee One", "Splash"];

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
    const ignored = IGNORE.includes(metadata.name) || getIgnored(apiData);
    if (ignored) {
      console.log('ignored: ' + font + ' - ' + ignored);
      continue;
    }

    const stylePromises = metadata.styles.map((style, i) => {
      return pool.exec('handleFont', [font, metadata.name, style, i])
          .then(() => {
            const styleOut = [style.weight];
            if (style.name !== 'normal') {
              styleOut.push(style.name);
            }
            return styleOut;
          }).catch((err) => {
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
          styles: results
        });
      });
    }));

  }
  return Promise.all(promises);
}

run().then(async (results) => {

  writeFiles(results);

  pool.terminate().then(() => {
    console.log('Terminated');
  });


}).catch((err) => {
  console.error(err);
});

