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
