# Image gallery

K7 Gallery is a simple image gallery built with vanilla JavaScript (~7.7KB in size). It’s lightweight, responsive, and feature-packed, offering a seamless experience for viewing images.

## 📚 Table of Contents
- [Features](#-features)
- [Installation](#️-installation)
- [Configuration](#-configuration)
- [Build](#-build)
- [License](#-license)
- [Contributing](#-contributing)
- [Author](#-author)
- [Contributors](#-contributors)
- [Badges](#-badges)

[![License](https://img.shields.io/github/license/KostasSliazas/K7)](LICENSE)
[![Stars](https://img.shields.io/github/stars/KostasSliazas/K7?style=social)](https://github.com/KostasSliazas/K7/stargazers)
[![Forks](https://img.shields.io/github/forks/KostasSliazas/K7?style=social)](https://github.com/KostasSliazas/K7/forks)
[![Issues](https://img.shields.io/github/issues/KostasSliazas/K7)](https://github.com/KostasSliazas/K7/issues)
[![Last Commit](https://img.shields.io/github/last-commit/KostasSliazas/K7)](https://github.com/KostasSliazas/K7/commits)
<!-- Uncomment if using GitHub Actions -->
<!-- [![CI](https://github.com/KostasSliazas/K7/actions/workflows/ci.yml/badge.svg)](https://github.com/KostasSliazas/K7/actions) -->

## 🚀 Features

- Responsive Design: Works seamlessly on all screen sizes, from mobile to desktop.
- Keyboard Navigation: Navigate through images using keyboard arrow keys for a more interactive experience.
- Download Button: Users can easily download the gallery images with a click of a button.
- Autoplay Button: Automatically cycle through images when the autoplay button is clicked.

## 🛠️ Installation

Include the gallery in your HTML:
Link the necessary JS file in your HTML. Add this script to the <head> of your HTML:

```
<script defer src="src/k7.min.js?v=7"></script>
```

## 🔧 Configuration

Custom Image Extensions and Other Configuration

To override the default extension, add a data-ext attribute to the <img> tag:

```
<img src="photos/photo16.webp" loading="lazy" alt="photo16" data-ext="webp">
```

This replaces the default .jpg extension with .webp for higher-resolution loading. If the data-ext attribute is set, it overrides the default extension. If not, the extensions should match (e.g., .jpg remains .jpg). For optimization, the index.dataset.ext check can be removed if unnecessary, as a micro-optimization. Note: This does not apply to .svg files.

Configurations can be found in the code ([// user config]

CSS background colors, update the CSS variables like so:

:root {
  --color1: #ee7;
  --color2: #777;
}

CSS is encoded in Base64, which typically increases the file size. However, the CSS file is still included and can be separated from the JavaScript.

Note: There's no need to include a separate stylesheet; all styles are managed directly in JavaScript.

## 🔨 Build

```
This gallery is compiled using Google Closure Compiler:

google-closure-compiler -O ADVANCED k7.js --js_output_file k7.min.js

Without recompiling, just need to change (a.dataset.ext || "jpg") to set a default extension, for example, (a.dataset.ext || "webp"), and "large/" for greater resolutions, for example, "larger-" as a prefix or "hd1080/" as a folder. There is another version available—if you have issues with fullscreen in "Project -Kitten", you can use the version with height: 100dvh compiled in css.https://raw.githubusercontent.com/KostasSliazas/project-kitten/refs/heads/main/js/gall7.min.v7.js
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 💬 Contributing

To contribute to this project, fork this repository, create a new branch, and submit a pull request.

Clone the repository with the following command:

```bash
git clone https://github.com/KostasSliazas/K7
```

## 👤 Author

Kostas Šliažas
## 👥 Contributors

| Username | Profile |
|----------|---------|
| [KostasSliazas](https://github.com/KostasSliazas) | https://github.com/KostasSliazas |
| [syed-ghufran-hassan](https://github.com/syed-ghufran-hassan) | https://github.com/syed-ghufran-hassan |
