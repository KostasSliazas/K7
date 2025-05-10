# Image Gallery

## Table of Contents
- [Custom Image Extensions and Other Configuration](#custom-image-extensions-and-other-configuration)
- [Build Instructions](#build-instructions)
- [About](#about)
- [Contributors](#Contributors)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/KostasSliazas/K7.git
```

### Open the Gallery

Open `index.html` in your preferred browser for example:

```bash
firefox index.html   # Linux
```
## Custom Image Extensions and Other Configuration

To override the default extension, add a `data-ext` attribute to the `<img>` tag:
```html
<img src="photos/photo16.webp" loading="lazy" alt="photo16" data-ext="webp">
```
This replaces the default `.jpg` extension with `.webp` for higher-resolution loading. If the `data-ext` attribute is set, it overrides the default extension. If not, the extensions should match (e.g., `.jpg` remains `.jpg`). For optimization, the `index.dataset.ext` check can be removed if unnecessary, as a micro-optimization. Note: This does not apply to `.svg` files.

Configurations can be found in the code (`[// user config]`

CSS background colors, update the CSS variables like so:
```css
:root {
  --color1: #ee7;
  --color2: #777;
}
```
CSS is encoded in Base64, which typically increases the file size. However, the CSS file is still included and can be separated from the JavaScript.

Note: There's no need to include a separate stylesheet; all styles are managed directly in JavaScript.

## Build Instructions

This gallery is compiled using Google Closure Compiler:
```bash
google-closure-compiler -O ADVANCED k7.js --js_output_file k7.min.js
```
Without recompiling, just need to change (a.dataset.ext || "jpg") to set a default extension, for example, (a.dataset.ext || "webp"), and "large/" for greater resolutions, for example, "larger-" as a prefix or "hd1080/" as a folder.
There is another version available—if you have issues with fullscreen in "Project -Kitten", you can use the version with height: 100dvh compiled in css.https://raw.githubusercontent.com/KostasSliazas/project-kitten/refs/heads/main/js/gall7.min.v7.js

## About
Check out the demo: [K7 Image Gallery](https://kostassliazas.github.io/K7/)

- Built with **vanilla JavaScript** (~7.7KB in size).

## Contributors ✨

Thanks goes to these wonderful people:

## Contributors ✨

<table>
  <tr>
    <td align="center"><a href="https://github.com/KostasSliazas"><img src="https://avatars.githubusercontent.com/u/31342007?v=4" width="80px;" style="border-radius:50%;" alt="KostasSliazas"/><br /><sub><b>KostasSliazas</b></sub></a></td>
    <td align="center"><a href="https://github.com/syed-ghufran-hassan"><img src="https://avatars.githubusercontent.com/u/20126545?v=4" width="80px;" style="border-radius:50%;" alt="syed-ghufran-hassan"/><br /><sub><b>syed-ghufran-hassan</b></sub></a></td>
  </tr>
</table>
