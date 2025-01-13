/* jshint esversion: 6 */
((w, d) => {
  const de = d.documentElement; // Reference to the root <html> element
  const getLastPathSegment = path => path.split('/').pop();
  const append = (parentElement, ...childElements) => {
    // Iterate over all child elements passed to the function
    for (let i = 0; i < childElements.length; i++) {
      parentElement.appendChild(childElements[i]); // Append each child to the parent
    }
  };

  const element = (tagName, ...attributes) => {
    // Create a new element with the specified tag name
    const newElement = d.createElement(tagName);
    // Loop through the provided attributes and add them to the element
    for (let i = 0; i < attributes.length; i += 2) {
      // attributes are passed in pairs (attribute name and value)
      newElement.setAttribute(attributes[i], attributes[i + 1]);
    }
    return newElement; // Return the created element
  };

  class UI {
    constructor() {
      // user config
      this.delay = 1330; // Autoplay timeout
      this.showButtons = 1; // Display buttons by default. (true = 1 and false = 0)
      this.showButtonsOnPlay = 1; // Display buttons when autoplay is active.
      this.extension = 'jpg'; // Additional extension for large resolution (empty = same image extension).
      this.container = 'images'; // Class name for the image container. If empty, all images are selected.
      this.folder = 'l/'; // Folder name or image prefix (prefix should not include '/').

      // everything else for gallery (NO NEED TO CHANGE)
      this.imagesArray = []; // Stores all `img` elements found in the container
      this.indexOfImage = null; // Index of the current image (null default)
      this.isAutoPlayOn = false; // State to track autoplay functionality
      this.isActive = false; // State to check if UI is active
      this.timeOut = 0;
    }

    addImagesToArray() {
      const elements = d.getElementsByClassName(this.container);
      const container = elements.length > 0 ? elements : [d.body];
      const containerLength = container.length;

      for (let i = 0; i < containerLength; i++) {
        const images = container[i].getElementsByTagName('img');
        const imagesLength = images.length;

        for (let j = 0; j < imagesLength; j++) {
          const img = images[j];

          if (!(img.getAttribute('src') || '').trim()) {
            console.warn('Invalid src:', img); // Log a warning for debugging
            continue; // Skip adding this image to the array
          }
          this.imagesArray.push(img);
        }
      }

      const clickHandler = e => this.listenForIG(e);

      if (container[0] && container[0].tagName === 'BODY') {
        d.body.onclick = clickHandler;
      } else {
        for (let i = 0; i < containerLength; i++) {
          container[i].onclick = clickHandler;
        }
      }

      return this.imagesArray.length;
    }

    autoPlayLoop() {
      if (!this.isAutoPlayOn) {
        // If not set, set it to true once
        this.isAutoPlayOn = true;

        // Set the play button active for the first time (playing)
        if (this.showButtons) this.play.className = 'but bra brb opa tpo lft atc';

        if (!this.showButtonsOnPlay) {
          // Hide buttons if configured not to show during auto-play
          if (this.showButtons) {
            this.foot.className = this.onow.className = 'dpn';
          }
          this.left.className = this.rigt.className = this.clos.className = 'dpn';
        }
      }
      if (this.isAutoPlayOn) {
        // Clear any existing timeout before setting a new one
        clearTimeout(this.timeOut);

        // Set a timeout to move to the next image after a specified delay
        this.timeOut = setTimeout(() => {
          this.right().show();

          // Clear auto-play if the last image is reached
          if (this.indexOfImage === this.imagesArray.length - 1) {
            this.clear();
            return;
          }
        }, this.delay);
      }
    }

    // Trigger download of the current image
    downloads() {
      /*const a = */element('a', 'rel', 'noopener', 'download', getLastPathSegment(this.imgs.src), 'href', this.imgs.src, 'target', '_blank').click();
      // a.remove(); // don't always need to call .remove() for the temporary <a> element exists only in memory
    }

    // Move to the previous image
    lefts() {
      this.indexOfImage = this.indexOfImage > 0 ? this.indexOfImage - 1 : this.imagesArray.length - 1;
      return this;
    }

    // Move to the next image
    right() {
      this.indexOfImage = this.indexOfImage < this.imagesArray.length - 1 ? this.indexOfImage + 1 : 0;
      return this;
    }

    // Clear auto-play and reset UI state
    clear() {
      if (this.timeOut) {
        clearTimeout(this.timeOut); // Cancel the timeout
        this.timeOut = null; // Reset reference
      }
      this.isAutoPlayOn = false;
      //same classes names
      const classNames = 'but bra brb opa';
      // if show buttons compiled display them
      if (this.showButtons) {
        this.foot.className = this.onow.className = '';
        this.play.className = classNames + ' tpo lft';
      }
      // always show close button on clear
      this.clos.className = classNames + ' rtm rtp';
      this.leftRightButtonsVisibility();
    }

    leftRightButtonsVisibility() {
      // Adjust visibility of left and right buttons based on the current image index
      this.left.className = this.indexOfImage === 0 ? 'dpn' : 'but tpo hvr lft';
      this.rigt.className = this.indexOfImage === this.imagesArray.length - 1 ? 'dpn' : 'but tpo hvr rgt';
    }

    // Close the image viewer
    close() {
      this.isActive = false;
      this.imag.className = 'sca hdi w10 tpo lft';
      de.className = de.className.split('fff').join('').trim();
    }

    // Show the current image
    show() {
      const index = this.imagesArray[/** @type {number} */ (this.indexOfImage)];
      const imageSource = index.src;

      // Generate full file path with folder and extension
      const fileName = getLastPathSegment(imageSource);
      const arrayFileName = fileName.split('.');
      const fileNameWithExtension = arrayFileName[0] + '.' + (index.dataset.ext || this.extension || arrayFileName[1]);
      const fullNamePrefixed = arrayFileName === 'svg' ? imageSource : imageSource.replace(fileName, this.folder + fileNameWithExtension);

      // Activate the UI if not active
      if (!this.isActive) {
        this.isActive = true;
        de.className = de.className ? de.className + ' fff' : 'fff';
        this.imag.className = 'fff w10 tpo lft';
      }

      // Prevent reloading if the current image matches the source
      if (this.imgs.src === fullNamePrefixed || this.imgs.src === imageSource) return;

      // Update UI state and trigger image loading
      this.spin.className = 'bor';

      // Remove old image and append the new one
      this.insi.removeChild(this.imgs);
      this.imgs = element('img', 'src', arrayFileName[1] == 'svg' ? imageSource : fullNamePrefixed, 'alt', index.alt + ' selected');

      if (this.showButtons) {
          this.alts.innerText = getLastPathSegment(this.imgs.src); //.split('/').pop();
      }

      this.imgs.onload = e => {
        // Hide the spinner
        this.spin.className = 'dpn';
        //this.alts.innerText = getLastPathSegment(e.target.src); //outside used when changing image it change imediatly
        if (this.isAutoPlayOn) {
          this.autoPlayLoop();
        }
      };

      this.imgs.onerror = e => {
        e.target.onerror = null;
        e.target.src = imageSource;
        if (this.showButtons) {
          this.alts.innerText = getLastPathSegment(e.target.src); //.split('/').pop();
        }
      };

      if (this.fine) this.fine.innerText = Number(this.indexOfImage) + 1;
      append(this.insi, this.imgs);

      // don't change left right visibility'
      if (this.isAutoPlayOn && !this.showButtonsOnPlay) return;

      this.leftRightButtonsVisibility();
    }

    // Listen for clicks on images and show the corresponding image
    listenForIG(e) {
      const target = e.target;
      if (target.tagName === 'IMG') {
        this.indexOfImage = this.imagesArray.indexOf(target) > -1 ? this.imagesArray.indexOf(target) : 0;
        this.show();
        e.stopImmediatePropagation();
      }
    }

    listeners() {
      // prettier-ignore
      /** @suppress {missingProperties} */
      const k = {
        'blt': () => this.lefts().show(), // Move left action (chained methods)
        'btr': () => this.right().show(), // Move right action (chained methods)
        'pli': () => this.autoPlayLoop(), // Play/pause action
        'dlf': () => this.downloads(), // Download action
        'cls': () => this.close() // Close action
      };

      // Map additional keys to specific actions
      k[` `] = k['pli']; // Space for play/pause
      k[`ArrowLeft`] = k['blt']; // Left arrow for left navigation
      k[`ArrowRight`] = k['btr']; // Right arrow for right navigation
      // k[`Escape`] = k['cls']; // close gallery

      // Unified event handler
      const switcher = e => {
        // Only proceed if the gallery is active
        if (this.isActive) {
          // Prevent default behavior and stop event propagation
          e.preventDefault();
          e.stopImmediatePropagation();
          // Get the event key or target ID
          const ev = e.key || e.target.id;
          // Handle Escape and cls separately
          if (ev === 'Escape' || ev === 'cls') {
            this.close();
          }
          // Check for valid key and other conditions
          if (!k[ev] || this.isAutoPlayOn || e.isComposing) {
            this.clear(); // Execute the corresponding action or clear the state if no match
            return;
          }
          // Execute the corresponding action
          k[ev]();
        }
      };

      // Attach event listeners for click and keyboard events with correct context (bind this)
      this.imag.addEventListener('click', switcher.bind(this));
      w.addEventListener('keyup', switcher.bind(this));
    }

    init() {
      // Add inline CSS using base64 string dinamicaly (increases file size)
      const resource = element('link', 'rel', 'stylesheet', 'href', 'data:text/css;base64,QGtleWZyYW1lcyBye3Rve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19I2s3ICosI2s3IDo6YWZ0ZXIsI2s3IDo6YmVmb3Jle2JveC1zaXppbmc6Ym9yZGVyLWJveDtkaXNwbGF5OmlubGluZS1ibG9jaztmb250OjEycHgvNCBzYW5zLXNlcmlmO3Bvc2l0aW9uOmFic29sdXRlfSNrNyAuYnV0ICp7ei1pbmRleDotMTtwb2ludGVyLWV2ZW50czpub25lfSNrN3tiYWNrZ3JvdW5kOnZhcigtLWNvbG9yMiwgIzIyMyk7Y29sb3I6I2FhYTtwb3NpdGlvbjpmaXhlZDt0ZXh0LWFsaWduOmNlbnRlcjt0cmFuc2l0aW9uOnRyYW5zZm9ybSAuMnM7dXNlci1zZWxlY3Q6bm9uZTt6LWluZGV4Ojk5OTk5OX0jazcgI2lucyBpbWd7YmFja2dyb3VuZDp2YXIoLS1jb2xvcjEsICMzMzQpO21heC1oZWlnaHQ6MTAwJTttYXgtd2lkdGg6MTAwJX0jazcgI2ZsbiwjazcgI3BsYXt0ZXh0LWluZGVudDo1MHB4O3doaXRlLXNwYWNlOm5vd3JhcDtib3R0b206MjRweDtoZWlnaHQ6NDhweH0jazcgI2FsdHtyaWdodDo1MHB4fSNrNyAjYWx0LCNrNyAjaW5zLCNrNyAjaW5zIGltZywjazcgI3N0YXtwb3NpdGlvbjpyZWxhdGl2ZX0jazcgI3N0YXt0ZXh0LWluZGVudDowfSNrNyAjYmx0LCNrNyAjYnRye3dpZHRoOjIwJTttaW4td2lkdGg6OTZweDtib3JkZXI6MDtoZWlnaHQ6MTAwJTtib3JkZXItcmFkaXVzOjB9I2s3ICNsZnQ6OmFmdGVyLCNrNyAjcmd0OjphZnRlcntwYWRkaW5nOjlweDt0b3A6MTRweH0jazcgI2xmdDo6YWZ0ZXJ7Ym9yZGVyLXdpZHRoOjJweCAwIDAgMnB4O2xlZnQ6MTRweH0jazcgI3JndDo6YWZ0ZXJ7cmlnaHQ6MTRweDtib3JkZXItd2lkdGg6MnB4IDJweCAwIDB9I2s3ICNibHQ6aG92ZXIgI2xmdDo6YWZ0ZXJ7bGVmdDo5cHh9I2s3ICNidHI6aG92ZXIgI3JndDo6YWZ0ZXJ7cmlnaHQ6OXB4fSNrNyAjY2xzOjphZnRlciwjazcgI2Nsczo6YmVmb3Jle2JvcmRlci13aWR0aDowIDAgMCAycHg7aGVpZ2h0OjMwcHg7bGVmdDoyM3B4O3RvcDoxMHB4fSNrNyAjcGxpOjpiZWZvcmUsI2s3ICNzcG57Ym9yZGVyLXJhZGl1czo1MCU7aGVpZ2h0OjI0cHg7d2lkdGg6MjRweH0jazcgI3NwbnthbmltYXRpb246ciAuM3MgbGluZWFyIGluZmluaXRlO2JvcmRlci1jb2xvcjp0cmFuc3BhcmVudCAjYWFhO2xlZnQ6NTAlO21hcmdpbjotMTJweCAwIDAtMTJweDt0b3A6NTAlfSNrNyAjZHdse2JvcmRlci1yYWRpdXM6MCAwIDJweCAycHg7dG9wOjI3cHg7aGVpZ2h0OjZweDt3aWR0aDoyNHB4O2JvcmRlci10b3A6MH0jazcgI3BsaTo6YmVmb3Jle3RyYW5zaXRpb246LjJzIGJvcmRlci1yYWRpdXM7dG9wOjEycHh9I2s3ICNwbGkuYXRjOjpiZWZvcmV7Ym9yZGVyLXJhZGl1czo0cHh9I2s3ICNwbGk6OmFmdGVye2JvcmRlci1jb2xvcjp0cmFuc3BhcmVudCAjZmZmO2JvcmRlci13aWR0aDo1cHggMCA1cHggMTJweDtsZWZ0OjE5cHg7dG9wOjE5cHg7d2lkdGg6MTBweH0jazcgI3BsaS5hdGM6OmFmdGVye2JvcmRlci13aWR0aDowIDJweDtwYWRkaW5nLXRvcDoxMHB4fSNrNyAjZGxmOjphZnRlcntib3JkZXItd2lkdGg6MCAwIDJweCAycHg7Ym90dG9tOjIxcHg7aGVpZ2h0OjEycHg7bGVmdDoxOHB4O3dpZHRoOjEycHh9I2s3ICNkbGY6OmJlZm9yZXtiYWNrZ3JvdW5kOiNmZmY7aGVpZ2h0OjE4cHg7bGVmdDoyM3B4O3RvcDo5cHg7d2lkdGg6MnB4fSNrNyAjY2xze3RvcDoyNHB4fSNrNyAjZHdsLCNrNyAjcGxpOjpiZWZvcmV7bGVmdDoxMnB4fSNrNyAjY2xzLCNrNyAjZmxuLCNrNyAjcmd0e3JpZ2h0OjI0cHh9I2s3ICNsZnQsI2s3ICNwbGF7bGVmdDoyNHB4fSNrNyAjaW5zIGltZywjazcgLnRybnt0b3A6NTAlO3otaW5kZXg6LTE7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSl9I2s3IC5ydHA6OmFmdGVyLCNrNyAucnRwOjpiZWZvcmV7dHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyl9I2s3IC5ydG06OmFmdGVye3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0jazcgLncxMCwjazcudzEwe2hlaWdodDoxMDAlO3dpZHRoOjEwMCV9I2s3IC5ib3IsI2s3IC5icmE6OmFmdGVyLCNrNyAuYnJiOjpiZWZvcmV7Ym9yZGVyOjJweCBzb2xpZCAjZmZmfSNrNyAuYnV0e2JhY2tncm91bmQ6MCAwO2hlaWdodDo0OHB4O3dpZHRoOjQ4cHg7Ym9yZGVyLXJhZGl1czo1MCU7Ym9yZGVyOjA7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjpvcGFjaXR5IC4xcyAuMnM7bWFyZ2luOjA7cGFkZGluZzowfSNrNyAuYnV0OjphZnRlciwjazcgLmJ1dDo6YmVmb3Jle2NvbnRlbnQ6IiJ9I2s3IC5idXQ6Zm9jdXMsI2s3IC5idXQ6aG92ZXIsI2s3IC5idXQ6aG92ZXIgc3BhbntiYWNrZ3JvdW5kOnJnYmEoNyw3LDcsLjIpO29wYWNpdHk6MTtvdXRsaW5lOjB9I2s3ICNibHQ6Zm9jdXMsI2s3ICNidHI6Zm9jdXN7YmFja2dyb3VuZDowIDB9I2s3IC5idXQ6YWN0aXZle29wYWNpdHk6LjN9I2s3IC5kcG57ZGlzcGxheTpub25lfSNrNyAuaGRpLCNrNy5oZGl7b3BhY2l0eTowfSNrNyAub3Bhe29wYWNpdHk6Ljd9I2s3IC5yZ3R7cmlnaHQ6MH0jazcgLnRwbywjazcudHBve3RvcDowfSNrNyAubGZ0LCNrNy5sZnR7bGVmdDowfSNrNyAuZmZmLCNrNy5mZmYsaHRtbC5mZmZ7b3ZlcmZsb3c6aGlkZGVuIWltcG9ydGFudH0jazcuc2Nhe3RyYW5zZm9ybTpzY2FsZSgwKX1AbWVkaWEgKG1pbi13aWR0aDoxMDI0cHgpeyNrNzpub3QoOmhvdmVyKSAjY250fmRpdiwjazc6bm90KDpob3ZlcikgI2luc34uYnV0e29wYWNpdHk6MH19');
      append(d.getElementsByTagName('head')[0], resource);

      // DOM elements setup
      /** @type {HTMLElement} */
      this.clos = element('button', 'id', 'cls', 'class', 'bra rtp opa but rtm brb', 'aria-label', 'Close', 'title', 'Close (Esc)');
      /** @type {HTMLElement} */
      this.ilef = element('span', 'id', 'lft', 'class', 'bra rtm opa trn but');
      /** @type {HTMLElement} */
      this.irig = element('span', 'id', 'rgt', 'class', 'bra rtp opa but trn');
      /** @type {HTMLElement} */
      this.imag = element('div', 'id', 'k7', 'class', 'sca hdi fff w10 tpo lft', 'role', 'dialog', 'aria-label', 'Image Gallery');
      /** @type {HTMLElement} */
      this.cent = element('div', 'id', 'cnt', 'class', 'tpo lft w10');
      /** @type {HTMLElement} */
      this.left = element('button', 'id', 'blt', 'class', 'but tpo lft', 'aria-label', 'Previous (Left Arrow)');
      /** @type {HTMLElement} */
      this.rigt = element('button', 'id', 'btr', 'class', 'but tpo rgt', 'aria-label', 'Next (Right Arrow)');
      /** @type {HTMLElement} */
      this.insi = element('div', 'id', 'ins', 'class', 'w10');
      /** @type {HTMLElement} */
      this.spin = element('div', 'id', 'spn', 'class', 'dpn', 'aria-hidden', 'true');
      /** @type {HTMLElement} */
      this.imgs = element('img', 'src', 'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=', 'alt', '', 'loading', 'lazy');

      append(this.insi, this.imgs);
      append(this.rigt, this.irig);
      append(this.left, this.ilef);
      append(this.cent, this.insi, this.rigt, this.left, this.clos);
      append(this.imag, this.cent, this.spin);
      append(d.body, this.imag);

      if (this.showButtons) {
        /** @type {HTMLElement} */
        this.wdow = element('button', 'id', 'dlf', 'class', 'tpo rgt bra rtm opa but', 'aria-label', 'download');
        /** @type {HTMLElement} */
        this.play = element('button', 'id', 'pli', 'class', 'tpo lft bra brb opa but', 'aria-label', 'play');
        /** @type {HTMLElement} */
        this.foot = element('div', 'id', 'pla');
        /** @type {HTMLElement} */
        this.onow = element('div', 'id', 'fln');
        /** @type {HTMLElement} */
        this.alts = element('span', 'id', 'alt', 'class', 'fff');
        /** @type {HTMLElement} */
        this.fine = element('span', 'id', 'sta');
        /** @type {HTMLElement} */
        this.down = element('span', 'id', 'dwl', 'class', 'bor');

        append(this.onow, this.alts, this.wdow);
        append(this.imag, this.onow, this.foot);
        append(this.foot, this.play, d.createTextNode('Image '), this.fine, d.createTextNode(' of ' + this.imagesArray.length));
        append(this.wdow, this.down);
      }
    }
  }

  // Create a new UI (user interface) instance with default configurations
  const ui = new UI();
  // Populate the UI instance with images retrieved from the DOM
  const lengthOfImages = ui.addImagesToArray();
  // if found images, initialize the UI and add event listeners
  if (lengthOfImages) {
    // Initialize the UI, setting up initial configurations and state
    ui.init();
    // Add event listeners to enable user interactions like clicks on images
    ui.listeners();
  }
})(window, document);
