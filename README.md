# Font Previews

Preview images of Google Fonts, for use in font pickers, etc.

## Output Files

The `output/google-fonts.json` file contains metadata for the normal style/weight of all the fonts:

```json
{
  "name": "ABeeZee",
  "category": "Sans Serif",
  "popularity": 175,
  "trending": 657,
  "dateAdded": "2012-09-30",
  "img": "abeezee-normal-400.webp",
  "base64": "UklGRqQCAABXRUJQ..."
}
```

The `output/google-fonts-all-styles.json` file contains metadata for every style/weight of every font:

```json
{
  "name": "ABeeZee",
  "category": "Sans Serif",
  "popularity": 175,
  "trending": 657,
  "dateAdded": "2012-09-30",
  "styles": [
    {
      "img": "abeezee-normal-400.webp",
      "type": "normal",
      "weight": 400,
      "img": "abeezee-normal-400.webp",
      "base64": "UklGRqQCAABXRUJQ..."
    },
    {
      "img": "abeezee-italic-400.webp",
      "type": "italic",
      "weight": 400,
      "base64": "UklGRqQCAABXRUJQ..."
    }
  ]
}
```

Each font references the `webp` image name, and also includes the `base64` encoded image data. 

## How the images were generated

1. The entire Google Font data was downloaded from [here](https://github.com/google/fonts).
2. The METADATA.pb files for each font was parsed.
3. Using puppeteer, an HTML page was rendered for each font, displaying the font name in that font. The HTML page was then captured as a screenshot. 
4. The screenshot was saved as both a webp image and a base64 encoded string.
5. The font list was written to a JSON file, which included the base64 encoded image data, and references the name of the webp image.

## How to use the data

It is recommended that you filter and/or condense the data to reduce the file size. For example, you will want to choose to either the webp or base64 image data, and remove the other. You probably also want to remove the extra metadata that is not needed for your use case.

You can create a nodejs script in your project that imports the data, and modifies it:

```javascript
import fontList from 'font-previews/output/google-fonts.json' assert {type: 'json'};
import fs from 'node:fs';

// sort by popularity
const sorted = fontList.sort((a, b) => {
  return a.popularity - b.popularity;
});

// only include data we need
const newData = sorted.map(font => {
  return [
    font.name,
    font.category,
    font.base64
  ];
});

fs.writeFileSync('newData.json', JSON.stringify(newData));
```
