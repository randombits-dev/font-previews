import fs from "fs-extra";

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
  fs.writeFileSync('fonts/records.json', JSON.stringify(simpleData));
};
