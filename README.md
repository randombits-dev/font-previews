# Google Font DB 

A collection of metadata, preview images, and woff2 files for Google Fonts.

The `font/records.json` file contains metadata for the fonts:

```json
[{
  "n": "ABeeZee", // name
  "c": "Sans Serif", // category
  "p": 175, // popularity
  "t": 657, // trending
  "d": "2012-09-30", // date added
  "f": [[400], [400, "italic"], [500]] // list of files, see below
}, ...]
```

The previews and woff2 files are located in `fonts/[name]`. A lot of the fonts contain multiple styles for different weights (400, 600, etc) and types (italic vs normal). The files are named using an index system, where the first font style is `0.webp`, for the preview, and `0.woff2` for the font file. The second style is `1.webp` and `1.woff2`, and so on.

The array of files in `records.json` gives the weight of style, and the type if it is not normal. For example, in the `ABeeZee` metadata above, the font files are `[[400], [400, "italic"], [500]]`. This means that `0.webp` and `0.woff2` are the normal 400 weight, `1.webp` and `1.woff2` are the italic 400 weight, and `2.webp` and `2.woff2` are the normal 500 weight.

## How the images were generated

1. The entire Google Font data was downloaded from [here](https://github.com/google/fonts).
2. The METADATA.pb files for each font was parsed.
3. Using puppeteer, an HTML page was rendered for each font, displaying the font name in that font. The HTML page was then captured as a screenshot. 
4. The screenshot was saved as a webp image.
5. The ttf files were converted to woff2 files, using [fonteditor-core](https://github.com/kekee000/fonteditor-core)
6. The font list was written to the `records.json` file.

## How to use the data

Filter and sort the `records.json` data to include only the fonts you want to use, and the order you want. This could be based on category, popularity, etc. Then reduce the size of the data by removing unnecessary fields (e.g. you may not need the `trending` or `popularity` field anymore).

You can create a nodejs script in your project that imports the data, and modifies it:

```javascript
import fontList from 'google-font-db/records.json' assert {type: 'json'};
import fs from 'node:fs';

// sort by popularity, and only grap the top 100
const sorted = fontList.sort((a, b) => {
  return a.p - b.p;
}).slice(0, 100);

// only include data we need
const newData = sorted.map(font => {
  return [
    font.n,
    font.f,
  ];
});

fs.writeFileSync('newData.json', JSON.stringify(newData));
```
