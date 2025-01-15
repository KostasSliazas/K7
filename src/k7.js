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
      const resource = element('link', 'rel', 'stylesheet', 'href', 'data:text/css;base64,QGtleWZyYW1lcyBye3Rve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19I2s3ICosI2s3IDo6YWZ0ZXIsI2s3IDo6YmVmb3Jle2JveC1zaXppbmc6Ym9yZGVyLWJveDtkaXNwbGF5OmlubGluZS1ibG9jaztmb250OjEycHgvNCBzYW5zLXNlcmlmO3Bvc2l0aW9uOmFic29sdXRlfSNrNyAuYiAqe3otaW5kZXg6LTE7cG9pbnRlci1ldmVudHM6bm9uZX0jazd7YmFja2dyb3VuZDp2YXIoLS1jb2xvcjIsICMyMjMpO2NvbG9yOiNhYWE7cG9zaXRpb246Zml4ZWQ7dGV4dC1hbGlnbjpjZW50ZXI7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjJzO3VzZXItc2VsZWN0Om5vbmU7ei1pbmRleDo5OTk5OTl9I2s3ICNpbnMgaW1ne2JhY2tncm91bmQ6dmFyKC0tY29sb3IxLCAjMzM0KTttYXgtaGVpZ2h0OjEwMCU7bWF4LXdpZHRoOjEwMCV9I2s3ICNmbG4sI2s3ICNwbGF7dGV4dC1pbmRlbnQ6NTBweDt3aGl0ZS1zcGFjZTpub3dyYXA7Ym90dG9tOjI0cHg7aGVpZ2h0OjQ4cHh9I2s3ICNhbHR7cmlnaHQ6NTBweH0jazcgI2FsdCwjazcgI2lucywjazcgI2lucyBpbWcsI2s3ICNzdGF7cG9zaXRpb246cmVsYXRpdmV9I2s3ICNzdGF7dGV4dC1pbmRlbnQ6MH0jazcgI2JsdCwjazcgI2J0cnt3aWR0aDoyMCU7bWluLXdpZHRoOjk2cHg7Ym9yZGVyOjA7aGVpZ2h0OjEwMCU7Ym9yZGVyLXJhZGl1czowfSNrNyAjbGZ0OjphZnRlciwjazcgI3JndDo6YWZ0ZXJ7cGFkZGluZzo5cHg7dG9wOjE0cHh9I2s3ICNsZnQ6OmFmdGVye2JvcmRlci13aWR0aDoycHggMCAwIDJweDtsZWZ0OjE0cHh9I2s3ICNyZ3Q6OmFmdGVye3JpZ2h0OjE0cHg7Ym9yZGVyLXdpZHRoOjJweCAycHggMCAwfSNrNyAjYmx0OmhvdmVyICNsZnQ6OmFmdGVye2xlZnQ6OXB4fSNrNyAjYnRyOmhvdmVyICNyZ3Q6OmFmdGVye3JpZ2h0OjlweH0jazcgI2Nsczo6YWZ0ZXIsI2s3ICNjbHM6OmJlZm9yZXtib3JkZXItd2lkdGg6MCAwIDAgMnB4O2hlaWdodDozMHB4O2xlZnQ6MjNweDt0b3A6MTBweH0jazcgI3BsaTo6YmVmb3JlLCNrNyAjc3Bue2JvcmRlci1yYWRpdXM6NTAlO2hlaWdodDoyNHB4O3dpZHRoOjI0cHh9I2s3ICNzcG57YW5pbWF0aW9uOnIgLjNzIGxpbmVhciBpbmZpbml0ZTtib3JkZXItY29sb3I6dHJhbnNwYXJlbnQgI2FhYTtsZWZ0OjUwJTttYXJnaW46LTEycHggMCAwLTEycHg7dG9wOjUwJX0jazcgI2R3bHtib3JkZXItcmFkaXVzOjAgMCAycHggMnB4O3RvcDoyN3B4O2hlaWdodDo2cHg7d2lkdGg6MjRweDtib3JkZXItdG9wOjB9I2s3ICNwbGk6OmJlZm9yZXt0cmFuc2l0aW9uOi4ycyBib3JkZXItcmFkaXVzO3RvcDoxMnB4fSNrNyAjcGxpLnE6OmJlZm9yZXtib3JkZXItcmFkaXVzOjRweH0jazcgI3BsaTo6YWZ0ZXJ7Ym9yZGVyLWNvbG9yOnRyYW5zcGFyZW50ICNmZmY7Ym9yZGVyLXdpZHRoOjVweCAwIDVweCAxMnB4O2xlZnQ6MTlweDt0b3A6MTlweDt3aWR0aDoxMHB4fSNrNyAjcGxpLnE6OmFmdGVye2JvcmRlci13aWR0aDowIDJweDtwYWRkaW5nLXRvcDoxMHB4fSNrNyAjZGxmOjphZnRlcntib3JkZXItd2lkdGg6MCAwIDJweCAycHg7Ym90dG9tOjIxcHg7aGVpZ2h0OjEycHg7bGVmdDoxOHB4O3dpZHRoOjEycHh9I2s3ICNkbGY6OmJlZm9yZXtiYWNrZ3JvdW5kOiNmZmY7aGVpZ2h0OjE4cHg7bGVmdDoyM3B4O3RvcDo5cHg7d2lkdGg6MnB4fSNrNyAjY2xze3RvcDoyNHB4fSNrNyAjZHdsLCNrNyAjcGxpOjpiZWZvcmV7bGVmdDoxMnB4fSNrNyAjY2xzLCNrNyAjZmxuLCNrNyAjcmd0e3JpZ2h0OjI0cHh9I2s3ICNsZnQsI2s3ICNwbGF7bGVmdDoyNHB4fSNrNyAjaW5zIGltZywjazcgLnR7dG9wOjUwJTt6LWluZGV4Oi0xO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpfSNrNyAucDo6YWZ0ZXIsI2s3IC5wOjpiZWZvcmV7dHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyl9I2s3IC5qOjphZnRlcnt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9I2s3IC53LCNrNy53e2hlaWdodDoxMDAlO3dpZHRoOjEwMCV9I2s3IC5hOjphZnRlciwjazcgLnM6OmJlZm9yZSwjazcgLnV7Ym9yZGVyOjJweCBzb2xpZCAjZmZmfSNrNyAuYntiYWNrZ3JvdW5kOjAgMDtoZWlnaHQ6NDhweDt3aWR0aDo0OHB4O2JvcmRlci1yYWRpdXM6NTAlO2JvcmRlcjowO2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246b3BhY2l0eSAuMXMgLjJzO21hcmdpbjowO3BhZGRpbmc6MH0jazcgLmI6OmFmdGVyLCNrNyAuYjo6YmVmb3Jle2NvbnRlbnQ6IiJ9I2s3IC5iOmZvY3VzLCNrNyAuYjpob3ZlciwjazcgLmI6aG92ZXIgc3BhbntiYWNrZ3JvdW5kOnJnYmEoNyw3LDcsLjIpO29wYWNpdHk6MTtvdXRsaW5lOjB9I2s3ICNibHQ6Zm9jdXMsI2s3ICNidHI6Zm9jdXN7YmFja2dyb3VuZDowIDB9I2s3IC5iOmFjdGl2ZXtvcGFjaXR5Oi4zfSNrNyAubntkaXNwbGF5Om5vbmV9I2s3IC5oLCNrNy5oe29wYWNpdHk6MH0jazcgLm97b3BhY2l0eTouN30jazcgLnJ7cmlnaHQ6MH0jazcgLnksI2s3Lnl7dG9wOjB9I2s3IC5sLCNrNy5se2xlZnQ6MH0jazcgLmYsI2s3LmYsaHRtbC5me292ZXJmbG93OmhpZGRlbiFpbXBvcnRhbnR9I2s3Lmd7dHJhbnNmb3JtOnNjYWxlKDApfUBtZWRpYSAobWluLXdpZHRoOjEwMjRweCl7I2s3Om5vdCg6aG92ZXIpICNjbnR+ZGl2LCNrNzpub3QoOmhvdmVyKSAjaW5zfi5ie29wYWNpdHk6MH19');
      append(d.getElementsByTagName('head')[0], resource);

      // DOM elements setup
      /** @type {HTMLElement} */
      this.clos = element('button', 'id', 'cls', 'class', 'a p o b j s', 'aria-label', 'Close', 'title', 'Close (Esc)');
      /** @type {HTMLElement} */
      this.ilef = element('span', 'id', 'lft', 'class', 'a j o t b');
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
