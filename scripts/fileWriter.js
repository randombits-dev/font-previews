import fs from "fs-extra";


const separateIntoCategories = (data) => {
  const sans = [], serif = [], display = [], handwriting = [], monospace = [];
  const getCatList = (font) => {

    switch (font[1]) {
      case 'sans':
        return sans;
      case 'serif':
        return serif;
      case 'display':
        return display;
      case 'handwriting':
        return handwriting;
      case 'monospace':
        return monospace;
      default:
        return [];
    }
  };

  data.forEach(font => {
    const catList = getCatList(font);
    font.splice(1, 1);
    catList.push(font);
  });

  return [sans, serif, display, handwriting, monospace];
};

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
      name: font.name,
      category: font.category,
      img: regularStyle.img,
      base64: regularStyle.base64
    };
  });
};

const writeWebpWithStyles = (data) => {
  const transformedData = data.map(font =>
      [
        font.name,
        font.category,
        font.styles.map(style => [
          style.type,
          style.weight,
          style.img
        ])
      ]
  );

  fs.writeFileSync('dist/webp/styles/all.json', JSON.stringify(transformedData));

  const top = transformedData.slice(0, 50);
  fs.writeFileSync('dist/webp/styles/top50.json', JSON.stringify(top));

  const [sans, serif, display, handwriting, monospace] = separateIntoCategories(transformedData);
  fs.writeFileSync('dist/webp/styles/sans.json', JSON.stringify(sans));
  fs.writeFileSync('dist/webp/styles/serif.json', JSON.stringify(serif));
  fs.writeFileSync('dist/webp/styles/display.json', JSON.stringify(display));
  fs.writeFileSync('dist/webp/styles/handwriting.json', JSON.stringify(handwriting));
  fs.writeFileSync('dist/webp/styles/monospace.json', JSON.stringify(monospace));
};

const writeWebpWithoutStyles = (data) => {
  const transformedData = data.map(font =>
      [
        font.name,
        font.category,
        font.img
      ]
  );
  fs.writeFileSync('dist/webp/normal/all.json', JSON.stringify(transformedData));

  const top = transformedData.slice(0, 50);
  fs.writeFileSync('dist/webp/normal/top50.json', JSON.stringify(top));

  const [sans, serif, display, handwriting, monospace] = separateIntoCategories(transformedData);
  fs.writeFileSync('dist/webp/normal/sans.json', JSON.stringify(sans));
  fs.writeFileSync('dist/webp/normal/serif.json', JSON.stringify(serif));
  fs.writeFileSync('dist/webp/normal/display.json', JSON.stringify(display));
  fs.writeFileSync('dist/webp/normal/handwriting.json', JSON.stringify(handwriting));
  fs.writeFileSync('dist/webp/normal/monospace.json', JSON.stringify(monospace));

  // joinImages(data.map(font => `./dist/webp/images/${font.img}`), {direction: 'vertical'}).then((img) => {
  //   void img.toFile('dist/webp/all.webp');
  // });
};

const writeBase64WithStyles = (data) => {
  const transformedData = data.map(font =>
      [
        font.name,
        font.category,
        font.styles.map(style => [
          style.type,
          style.weight,
          style.base64
        ])
      ]
  );
  fs.writeFileSync('dist/base64/styles/all.json', JSON.stringify(transformedData));

  const top = transformedData.slice(0, 50);
  fs.writeFileSync('dist/base64/styles/top50.json', JSON.stringify(top));

  const [sans, serif, display, handwriting, monospace] = separateIntoCategories(transformedData);
  fs.writeFileSync('dist/base64/styles/sans.json', JSON.stringify(sans));
  fs.writeFileSync('dist/base64/styles/serif.json', JSON.stringify(serif));
  fs.writeFileSync('dist/base64/styles/display.json', JSON.stringify(display));
  fs.writeFileSync('dist/base64/styles/handwriting.json', JSON.stringify(handwriting));
  fs.writeFileSync('dist/base64/styles/monospace.json', JSON.stringify(monospace));
};

const writeBase64WithoutStyles = (data, popularityData) => {
  const transformedData = data.map(font =>
      [
        font.name,
        font.category,
        font.base64
      ]
  );
  fs.writeFileSync('dist/base64/normal/all.json', JSON.stringify(transformedData));

  const top = transformedData.slice(0, 50);
  fs.writeFileSync('dist/base64/normal/top50.json', JSON.stringify(top));

  const [sans, serif, display, handwriting, monospace] = separateIntoCategories(transformedData);
  fs.writeFileSync('dist/base64/normal/sans.json', JSON.stringify(sans));
  fs.writeFileSync('dist/base64/normal/serif.json', JSON.stringify(serif));
  fs.writeFileSync('dist/base64/normal/display.json', JSON.stringify(display));
  fs.writeFileSync('dist/base64/normal/handwriting.json', JSON.stringify(handwriting));
  fs.writeFileSync('dist/base64/normal/monospace.json', JSON.stringify(monospace));
};

const writeNoImageWithStyles = (data) => {
  const transformedData = data.map(font =>
      [
        font.name,
        font.category,
        font.styles.map(style => [
          style.type,
          style.weight
        ])
      ]
  );
  fs.writeFileSync('dist/no-image/styles/all.json', JSON.stringify(transformedData));

  const top = transformedData.slice(0, 50);
  fs.writeFileSync('dist/no-image/styles/top50.json', JSON.stringify(top));

  const [sans, serif, display, handwriting, monospace] = separateIntoCategories(transformedData);
  fs.writeFileSync('dist/no-image/styles/sans.json', JSON.stringify(sans));
  fs.writeFileSync('dist/no-image/styles/serif.json', JSON.stringify(serif));
  fs.writeFileSync('dist/no-image/styles/display.json', JSON.stringify(display));
  fs.writeFileSync('dist/no-image/styles/handwriting.json', JSON.stringify(handwriting));
  fs.writeFileSync('dist/no-image/styles/monospace.json', JSON.stringify(monospace));
};

const writeNoImageWithoutStyles = (data) => {
  const transformedData = data.map(font =>
      [
        font.name,
        font.category
      ]
  );
  fs.writeFileSync('dist/no-image/normal/all.json', JSON.stringify(transformedData));

  const top = transformedData.slice(0, 50);
  fs.writeFileSync('dist/no-image/normal/top50.json', JSON.stringify(top));

  const [sans, serif, display, handwriting, monospace] = separateIntoCategories(transformedData);
  fs.writeFileSync('dist/no-image/normal/sans.json', JSON.stringify(sans));
  fs.writeFileSync('dist/no-image/normal/serif.json', JSON.stringify(serif));
  fs.writeFileSync('dist/no-image/normal/display.json', JSON.stringify(display));
  fs.writeFileSync('dist/no-image/normal/handwriting.json', JSON.stringify(handwriting));
  fs.writeFileSync('dist/no-image/normal/monospace.json', JSON.stringify(monospace));
};


export const writeFiles = (data) => {
  const validData = data.filter(font => font.styles.length > 0);
  const popularData = validData.sort((a, b) => {
    return a.apiData.popularity - b.apiData.popularity;
  });


  const dataWithoutStyles = flattenDataWithoutStyles(popularData);

  writeWebpWithStyles(popularData);
  writeWebpWithoutStyles(dataWithoutStyles);
  writeBase64WithStyles(popularData);
  writeBase64WithoutStyles(dataWithoutStyles);
  writeNoImageWithStyles(popularData);
  writeNoImageWithoutStyles(dataWithoutStyles);
};
