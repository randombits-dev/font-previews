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
      name: font.apiData.family,
      category: font.apiData.category,
      popularity: font.apiData.popularity,
      trending: font.apiData.trending,
      dateAdded: font.apiData.dateAdded,
      img: regularStyle.img,
      density: regularStyle.density,
      base64: regularStyle.base64
    };
  });
};


export const writeFiles = (data) => {
  const validData = data.filter(font => font.styles.length > 0);

  const simpleData = validData.map(font => ({
    name: font.apiData.family,
    category: font.apiData.category,
    popularity: font.apiData.popularity,
    trending: font.apiData.trending,
    dateAdded: font.apiData.dateAdded,
    styles: font.styles,
  }));
  fs.writeFileSync('output/google-fonts-all-styles.json', JSON.stringify(simpleData));

  const dataWithoutStyles = flattenDataWithoutStyles(validData);
  fs.writeFileSync('output/google-fonts.json', JSON.stringify(dataWithoutStyles));
};
