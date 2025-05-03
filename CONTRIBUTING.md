# Contributing to K7 Images Gallery

**K7 Images Gallery** is a simple, lightweight JavaScript image gallery designed for flexibility and ease of integration. Whether you're customizing the look, changing extensions, or improving the script, contributions are welcome!

---

## Table of Contents

- [Custom Image Extensions and Other Configuration](#custom-image-extensions-and-other-configuration)  
- [Build Instructions](#build-instructions)  
- [About](#about)

---

## Custom Image Extensions and Other Configuration

To customize which image extension is used, you can override the default by adding a `data-ext` attribute to any `<img>` tag:

```html
<img src="photos/photo16.webp" loading="lazy" alt="photo16" data-ext="webp">
```

- If `data-ext` is present, it overrides the default `.jpg`.
- If not, `.jpg` is assumed.
- This logic can be optimized by removing the `index.dataset.ext` check if not needed.
- **Note:** `.svg` images are not affected by this configuration.

Custom configuration is marked in the source code with comments like:

```js
// [// user config]
```

### Customizing Colors

To change background or theme colors, modify the CSS variables in JavaScript (encoded as Base64):

```css
:root {
  --color1: #ee7;
  --color2: #777;
}
```

You **do not need an external stylesheet** — all styles are embedded in the JavaScript.

---

## Build Instructions

The gallery uses **Google Closure Compiler** with `ADVANCED` optimizations:

```bash
google-closure-compiler -O ADVANCED k7.js --js_output_file k7.min.js
```

To change default behavior (without rebuilding):
- Set a default extension manually, e.g.:
  ```js
  (a.dataset.ext || "webp")
  ```
- Use a different path or prefix for large images, such as `"large/"`, `"larger-"`, or `"hd1080/"`.

If you experience issues with fullscreen in the “Project -Kitten” context, try the alternative version with `height: 100dvh` compiled CSS:

[Alternative Version](https://raw.githubusercontent.com/KostasSliazas/project-kitten/refs/heads/main/js/gall7.min.v7.js)

---

## About

**K7 Image Gallery** features:

- Full-window viewing with auto-hiding UI buttons.
- Clickable, transparent background that closes the view.
- Autoplay and optional image download buttons (can be hidden).
- Fully written in **vanilla JavaScript**, ~7.7KB minified.
- Optimized for performance and refined over time for reliability.


