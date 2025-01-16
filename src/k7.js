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
      this.folder = 'large/'; // Folder name or image prefix (prefix should not include '/').

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
        if (this.showButtons) this.play.className = 'b a s o y l q';

        if (!this.showButtonsOnPlay) {
          // Hide buttons if configured not to show during auto-play
          if (this.showButtons) {
            this.foot.className = this.onow.className = 'n';
          }
          this.left.className = this.rigt.className = this.clos.className = 'n';
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
      const classNames = 'b a s o';
      // if show buttons compiled display them
      if (this.showButtons) {
        this.foot.className = this.onow.className = '';
        this.play.className = classNames + ' y l';
      }
      // always show close button on clear
      this.clos.className = classNames + ' j p';
      this.leftRightButtonsVisibility();
    }

    leftRightButtonsVisibility() {
      // Adjust visibility of left and right buttons based on the current image index
      this.left.className = this.indexOfImage === 0 ? 'n' : 'b y l';
      this.rigt.className = this.indexOfImage === this.imagesArray.length - 1 ? 'n' : 'b y r';
    }

    // Close the image viewer
    close() {
      this.isActive = false;
      this.imag.className = 'g h w y l';
      de.className = de.className.split('f').join('').trim();
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
        de.className = de.className ? de.className + ' f' : 'f';
        this.imag.className = 'f w y l';
      }

      // Prevent reloading if the current image matches the source
      if (this.imgs.src === fullNamePrefixed || this.imgs.src === imageSource) return;

      // Update UI state and trigger image loading
      this.spin.className = 'u';

      // Remove old image and append the new one
      this.insi.removeChild(this.imgs);
      this.imgs = element('img', 'src', arrayFileName[1] == 'svg' ? imageSource : fullNamePrefixed, 'alt', index.alt + ' selected');

      if (this.showButtons) {
          this.alts.innerText = getLastPathSegment(this.imgs.src); //.split('/').pop();
      }

      this.imgs.onload = e => {
        // Hide the spinner
        this.spin.className = 'n';
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
      const resource = element('link', 'rel', 'stylesheet', 'href', 'data:text/css;base64,QGtleWZyYW1lcyBrNy1ye3Rve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19I2s3ICosI2s3IDo6YWZ0ZXIsI2s3IDo6YmVmb3Jle2JveC1zaXppbmc6Ym9yZGVyLWJveDtkaXNwbGF5OmlubGluZS1ibG9jaztmb250OjEycHgvNCBzYW5zLXNlcmlmO3Bvc2l0aW9uOmFic29sdXRlfSNrNyAuYiAqe3otaW5kZXg6LTE7cG9pbnRlci1ldmVudHM6bm9uZX0jazd7YmFja2dyb3VuZDp2YXIoLS1jb2xvcjIsICMyMjMpO2NvbG9yOiNhYWE7cG9zaXRpb246Zml4ZWQ7dGV4dC1hbGlnbjpjZW50ZXI7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjJzO3VzZXItc2VsZWN0Om5vbmU7ei1pbmRleDo5OTk5OTl9I2s3ICNpbnMgaW1ne2JhY2tncm91bmQ6dmFyKC0tY29sb3IxLCAjMzM0KTttYXgtaGVpZ2h0OjEwMCU7bWF4LXdpZHRoOjEwMCV9I2s3ICNmbG4sI2s3ICNwbGF7dGV4dC1pbmRlbnQ6NTBweDt3aGl0ZS1zcGFjZTpub3dyYXA7Ym90dG9tOjI0cHg7aGVpZ2h0OjQ4cHh9I2s3ICNhbHR7cmlnaHQ6NTBweH0jazcgI2FsdCwjazcgI2lucywjazcgI2lucyBpbWcsI2s3ICNzdGF7cG9zaXRpb246cmVsYXRpdmV9I2s3ICNzdGF7dGV4dC1pbmRlbnQ6MH0jazcgI2JsdCwjazcgI2J0cnt3aWR0aDoxNjBweDtib3JkZXI6MDtoZWlnaHQ6MTAwJTtib3JkZXItcmFkaXVzOjB9I2s3ICNsZnQ6OmFmdGVyLCNrNyAjcmd0OjphZnRlcntwYWRkaW5nOjlweDt0b3A6MTRweH0jazcgI2xmdDo6YWZ0ZXJ7Ym9yZGVyLXdpZHRoOjJweCAwIDAgMnB4O2xlZnQ6MTRweH0jazcgI3JndDo6YWZ0ZXJ7cmlnaHQ6MTRweDtib3JkZXItd2lkdGg6MnB4IDJweCAwIDB9I2s3ICNibHQ6aG92ZXIgI2xmdDo6YWZ0ZXJ7bGVmdDo5cHh9I2s3ICNidHI6aG92ZXIgI3JndDo6YWZ0ZXJ7cmlnaHQ6OXB4fSNrNyAjY2xzOjphZnRlciwjazcgI2Nsczo6YmVmb3Jle2JvcmRlci13aWR0aDowIDAgMCAycHg7aGVpZ2h0OjMwcHg7bGVmdDoyM3B4O3RvcDoxMHB4fSNrNyAjcGxpOjpiZWZvcmUsI2s3ICNzcG57Ym9yZGVyLXJhZGl1czo1MCU7aGVpZ2h0OjI0cHg7d2lkdGg6MjRweH0jazcgI3NwbnthbmltYXRpb246azctciAuM3MgbGluZWFyIGluZmluaXRlO2JvcmRlci1jb2xvcjp0cmFuc3BhcmVudCAjYWFhO2xlZnQ6NTAlO21hcmdpbjotMTJweCAwIDAtMTJweDt0b3A6NTAlfSNrNyAjZHdse2JvcmRlci1yYWRpdXM6MCAwIDJweCAycHg7dG9wOjI3cHg7aGVpZ2h0OjZweDt3aWR0aDoyNHB4O2JvcmRlci10b3A6MH0jazcgI3BsaTo6YmVmb3Jle3RyYW5zaXRpb246LjJzIGJvcmRlci1yYWRpdXM7dG9wOjEycHh9I2s3ICNwbGkucTo6YmVmb3Jle2JvcmRlci1yYWRpdXM6NHB4fSNrNyAjcGxpOjphZnRlcntib3JkZXItY29sb3I6dHJhbnNwYXJlbnQgI2VlZTtib3JkZXItd2lkdGg6NXB4IDAgNXB4IDEycHg7bGVmdDoxOXB4O3RvcDoxOXB4O3dpZHRoOjEwcHh9I2s3ICNwbGkucTo6YWZ0ZXJ7Ym9yZGVyLXdpZHRoOjAgMnB4O3BhZGRpbmctdG9wOjEwcHh9I2s3ICNkbGY6OmFmdGVye2JvcmRlci13aWR0aDowIDAgMnB4IDJweDtib3R0b206MjFweDtoZWlnaHQ6MTJweDtsZWZ0OjE4cHg7d2lkdGg6MTJweH0jazcgI2RsZjo6YmVmb3Jle2JhY2tncm91bmQ6I2VlZTtoZWlnaHQ6MThweDtsZWZ0OjIzcHg7dG9wOjlweDt3aWR0aDoycHh9I2s3ICNjbHN7dG9wOjI0cHh9I2s3ICNkd2wsI2s3ICNwbGk6OmJlZm9yZXtsZWZ0OjEycHh9I2s3ICNjbHMsI2s3ICNmbG4sI2s3ICNyZ3R7cmlnaHQ6MjRweH0jazcgI2xmdCwjazcgI3BsYXtsZWZ0OjI0cHh9I2s3ICNpbnMgaW1nLCNrNyAudHt0b3A6NTAlO3otaW5kZXg6LTE7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSl9I2s3IC5wOjphZnRlciwjazcgLnA6OmJlZm9yZXt0cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKX0jazcgLmo6OmFmdGVye3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0jazcgLncsI2s3Lnd7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJX0jazcgLmE6OmFmdGVyLCNrNyAuczo6YmVmb3JlLCNrNyAudXtib3JkZXI6MnB4IHNvbGlkICNlZWV9I2s3IC5ie2JhY2tncm91bmQ6MCAwO2hlaWdodDo0OHB4O3dpZHRoOjQ4cHg7Ym9yZGVyLXJhZGl1czo1MCU7Ym9yZGVyOjA7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjpvcGFjaXR5IC4zcyAuMXM7bWFyZ2luOjA7cGFkZGluZzowO2NvbG9yOmluaGVyaXR9I2s3IC5iOjphZnRlciwjazcgLmI6OmJlZm9yZXtjb250ZW50OiIifSNrNyAuYjpmb2N1cywjazcgLmI6aG92ZXIsI2s3IC5iOmhvdmVyIHNwYW57YmFja2dyb3VuZDpyZ2JhKDcsNyw3LC4yKTtvcGFjaXR5OjE7b3V0bGluZTowfSNrNyAjYmx0OmZvY3VzLCNrNyAjYnRyOmZvY3Vze2JhY2tncm91bmQ6MCAwfSNrNyAuYjphY3RpdmV7b3BhY2l0eTouM30jazcgLm57ZGlzcGxheTpub25lfSNrNyAuaCwjazcuaHtvcGFjaXR5OjB9I2s3IC5ve29wYWNpdHk6Ljd9I2s3IC5ye3JpZ2h0OjB9I2s3IC55LCNrNy55e3RvcDowfSNrNyAubCwjazcubHtsZWZ0OjB9I2s3IC5mLCNrNy5mLGh0bWwuZntvdmVyZmxvdzpoaWRkZW4haW1wb3J0YW50fSNrNy5ne3RyYW5zZm9ybTpzY2FsZSgwKX1AbWVkaWEgKG1pbi13aWR0aDoxMDI0cHgpeyNrNzpub3QoOmhvdmVyKSAjY250fmRpdiwjazc6bm90KDpob3ZlcikgI2luc34uYntvcGFjaXR5OjB9fQ==');
      append(d.getElementsByTagName('head')[0], resource);

      // DOM elements setup
      /** @type {HTMLElement} */
      this.clos = element('button', 'id', 'cls', 'class', 'a p o b j s', 'aria-label', 'Close', 'title', 'Close (Esc)');
      /** @type {HTMLElement} */
      this.ilef = element('span', 'id', 'lft', 'class', 'a j o b t');
      /** @type {HTMLElement} */
      this.irig = element('span', 'id', 'rgt', 'class', 'a p o b t');
      /** @type {HTMLElement} */
      this.imag = element('div', 'id', 'k7', 'class', 'g h f w y l', 'role', 'dialog', 'aria-label', 'Image Gallery');
      /** @type {HTMLElement} */
      this.cent = element('div', 'id', 'cnt', 'class', 'y l w');
      /** @type {HTMLElement} */
      this.left = element('button', 'id', 'blt', 'class', 'b y l', 'aria-label', 'Previous (Left Arrow)');
      /** @type {HTMLElement} */
      this.rigt = element('button', 'id', 'btr', 'class', 'b y r', 'aria-label', 'Next (Right Arrow)');
      /** @type {HTMLElement} */
      this.insi = element('div', 'id', 'ins', 'class', 'w');
      /** @type {HTMLElement} */
      this.spin = element('div', 'id', 'spn', 'class', 'n', 'aria-hidden', 'true');
      /** @type {HTMLElement} */
      this.imgs = element('img', 'src', 'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=', 'alt', '', 'loading', 'lazy');
      // append(this.left, d.createTextNode('Previous')); // to add text to button for Previous
      // append(this.rigt, d.createTextNode('Next'));  // to add text to button for Next
      append(this.insi, this.imgs);
      append(this.rigt, this.irig);
      append(this.left, this.ilef);
      append(this.cent, this.insi, this.rigt, this.left, this.clos);
      append(this.imag, this.cent, this.spin);
      append(d.body, this.imag);

      if (this.showButtons) {
        /** @type {HTMLElement} */
        this.wdow = element('button', 'id', 'dlf', 'class', 'y r a j o b', 'aria-label', 'download');
        /** @type {HTMLElement} */
        this.play = element('button', 'id', 'pli', 'class', 'y l a s o b', 'aria-label', 'play');
        /** @type {HTMLElement} */
        this.foot = element('div', 'id', 'pla');
        /** @type {HTMLElement} */
        this.onow = element('div', 'id', 'fln');
        /** @type {HTMLElement} */
        this.alts = element('span', 'id', 'alt', 'class', 'f');
        /** @type {HTMLElement} */
        this.fine = element('span', 'id', 'sta');
        /** @type {HTMLElement} */
        this.down = element('span', 'id', 'dwl', 'class', 'u');

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
