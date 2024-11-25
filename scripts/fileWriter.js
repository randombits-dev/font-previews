import fs from "fs-extra";


const flattenDataWithoutStyles = (data) => {
  return data.map(font => {
    let regularStyle = font.styles.find(style => style.type === 'normal' && style.weight === 400);
    if (!regularStyle) {
      regularStyle = font.styles.find(style => style.type === 'normal');
      if (!regularStyle) {
        regularStyle = font.styles[0];
      }
    }

    return {
      n: font.apiData.family,
      c: font.apiData.category,
      p: font.apiData.popularity,
      t: font.apiData.trending,
      d: font.apiData.dateAdded,
      // f: regularStyle.f,
      // density: regularStyle.density,
      // base64: regularStyle.base64
    };
  });
};


export const writeFiles = (data) => {
  const validData = data.filter(font => font.styles.length > 0);

  const simpleData = validData.map(font => ({
    n: font.apiData.family,
    c: font.apiData.category,
    p: font.apiData.popularity,
    t: font.apiData.trending,
    d: font.apiData.dateAdded,
    f: font.styles,
  }));
  fs.writeFileSync('output/records.json', JSON.stringify(simpleData));

  // const dataWithoutStyles = flattenDataWithoutStyles(validData);
  // fs.writeFileSync('output/google-fonts.json', JSON.stringify(dataWithoutStyles));
};
