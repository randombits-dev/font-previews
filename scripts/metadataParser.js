import fs from "fs-extra";

export const parseMetadata = (font) => {
  const raw = fs.readFileSync(`F:/dev/google-fonts/${font}/METADATA.pb`).toString();
  let index = 0;
  const getProperty = (key) => {
    const keyStart = raw.indexOf(`${key}: "`, index);
    if (keyStart === -1) {
      return null;
    }
    const valueStart = keyStart + key.length + 3;
    const valueEnd = raw.indexOf('"', valueStart);
    index = valueEnd + 1;
    return raw.slice(valueStart, valueEnd);
  };

  const getNextStyle = () => {
    const keyStart = raw.indexOf(`fonts {`, index);
    if (keyStart === -1) {
      return null;
    }
    const valueStart = keyStart + 7;
    const valueEnd = raw.indexOf('}', valueStart);
    const value = raw.slice(valueStart, valueEnd);
    index = valueEnd + 1;
    return value;
  };


  const name = getProperty('name');
  const license = getProperty('license');
  const category = getProperty('category');

  const styles = [];
  let style = getNextStyle();
  while (style) {
    styles.push(parseStyle(style));
    style = getNextStyle();
  }

  const classes = [];
  let classification = getProperty('classifications');
  while (classification) {
    classes.push(classification);
    classification = getProperty('classifications');
  }

  return {
    name,
    license,
    category,
    classes,
    styles
  };
};


const parseStyle = (raw) => {
  let index = 0;
  const getProperty = (key) => {
    const keyStart = raw.indexOf(`${key}: "`, index);
    const valueStart = keyStart + key.length + 3;
    const valueEnd = raw.indexOf('"', valueStart);
    index = valueEnd + 1;
    return raw.slice(valueStart, valueEnd);
  };

  const getPropertyInt = (key) => {
    const keyStart = raw.indexOf(`${key}: `, index);
    const valueStart = keyStart + key.length + 2;
    const valueEnd = raw.indexOf('\n', valueStart);
    index = valueEnd + 1;
    return parseInt(raw.slice(valueStart, valueEnd));
  };

  const name = getProperty('style');
  const weight = getPropertyInt('weight');
  const filename = getProperty('filename');
  return {
    name,
    weight,
    filename
  };
};


