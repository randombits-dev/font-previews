import {Font as FEC} from "fonteditor-core";
import fs from "fs";

export const convertFont = (font, name, style, i) => {
  try {
    const fec = FEC.create(font, {
      type: 'ttf',
    });
    fs.mkdirSync(`output/${name}`, {recursive: true});
    fs.writeFileSync(`output/${name}/${i}.woff2`, fec.write({
      type: 'woff2',
    }));
  } catch (e) {
    console.error('error converting font', name, style);
    console.error(e);
  }
};
