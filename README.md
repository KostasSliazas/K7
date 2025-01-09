# K7 Images Gallery — A Simple JavaScript Image Gallery

## Table of Contents
- [Custom Image Extensions and Other Configuration](#custom-image-extensions-and-other-configuration)
- [Build Instructions](#build-instructions)
- [About](#about)

## Custom Image Extensions and Other Configuration

To override the default extension, add a `data-ext` attribute to the `<img>` tag:
```html
<img src="photos/photo16.webp" loading="lazy" alt="photo16" data-ext="webp">
```
This replaces the default `.jpg` extension with `.webp` for higher-resolution loading. If the `data-ext` attribute is set, it overrides the default extension. If not, the extensions should match (e.g., `.jpg` remains `.jpg`). For optimization, the `index.dataset.ext` check can be removed if unnecessary, as a micro-optimization. Note: This does not apply to `.svg` files.

Configurations can be found in the code between lines **25** and **34** (`[// user config]`).

To adjust image proportions, you can add the following CSS rule:
```css
#k7 img {
  width: 100%;
  height: 100%;
}
```

To modify background colors, update the CSS variables like so:
```css
:root {
  --color1: #ee7;
  --color2: #777;
}
```

## Build Instructions

This gallery is compiled using Google Closure Compiler:
```bash
google-closure-compiler -O ADVANCED k7.js --js_output_file k7.min.js
```

## About

Check out the demo: [K7 Image Gallery](https://kostassliazas.github.io/K7/)

This image gallery includes the following features:
- **Full-window mode** with buttons that auto-hide when the cursor moves out of the window.
- **Transparent, clickable background** that disappears on click.
- **Autoplay support** with optional download buttons for images (can be hidden).
- Built with **vanilla JavaScript** for lightweight performance (~7.7KB in size).
- Tested and improved over the years for stability and ease of use.
