/* jshint esversion: 6 */
((w, d) => {
  const de = d.documentElement; // Reference to the root <html> element

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

      this.delay = 1510; // Autoplay timeout
      this.showButtons = 1; // Display buttons by default. (true = 1 and false = 0)
      this.showButtonsOnPlay = 1; // Display buttons when autoplay is active.
      this.extension = 'jpg'; // Additional extension for large resolution (empty = same image extension).
      this.imageContainer = 'images'; // Class name for the image container. If empty, all images are selected.
      this.folder = 'large/'; // Folder name or image prefix (prefix should not include '/').

      // everything else for gallery (NO NEED TO CHANGE)

      this.imagesArray = []; // Stores all `img` elements found in the container
      this.indexOfImage = null; // Index of the current image being viewed
      this.isAutoPlayOn = false; // State to track autoplay functionality
      this.isActive = false; // State to check if UI is active
      this.timeOut = 0;
    }

    addImagesToArray() {
      const container = d.getElementsByClassName(this.imageContainer).length > 0 ? d.getElementsByClassName(this.imageContainer) : d.getElementsByTagName('body');
      const containerLength = container.length;

      for (let i = 0; i < containerLength; i++) {
        const images = container[i].getElementsByTagName('img');
        for (let img of images) {
          if (!img.src) {
            console.warn(`Image missing 'src' attribute:`, img); // Log a warning for debugging
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
          if (this.indexOfImage === this.imagesArray.length - 1) return this.clear();
        }, this.delay);
      }
    }

    // Trigger download of the current image
    downloads() {
      const a = element('a', 'rel', 'noopener', 'download', this.imgs.src.split('/').pop(), 'href', this.imgs.src, 'target', '_blank');
      a.click();
      a.remove();
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
      return this;
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
      const fileName = imageSource.split('/').pop();
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

      this.imgs.onload = e => {
        // Hide the spinner
        this.spin.className = 'dpn';

        if (this.showButtons) {
          this.alts.innerText = e.target.src.split('/').pop();
        }
        if (this.isAutoPlayOn) {
          this.autoPlayLoop();
        }
      };

      this.imgs.onerror = e => {
        e.target.onerror = null;
        e.target.src = imageSource;
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
      /** @suppress {missingProperties} */
      const k = {
        'pli': () => {
          this.autoPlayLoop();
        }, // Play/pause action
        'blt': () => {
          this.lefts().show();
        }, // Move left action
        'btr': () => {
          this.right().show();
        }, // Move right action
        'cls': () => {
          this.close();
        }, // Close action
        'dlf': () => {
          this.downloads();
        }, // Download action
      };

      // Map additional keys to specific actions
      k[` `] = k['pli']; // Space for play/pause
      k[`ArrowLeft`] = k['blt']; // Left arrow for left navigation
      k[`ArrowRight`] = k['btr']; // Right arrow for right navigation

      // Key press handler
      const switcher = e => {
        // Get the event key or target ID
        const ev = e.key || e.target.id;

        // Handle Escape and cls separately
        if (ev === 'Escape' || ev === 'cls') {
          this.close();
        }

        // Check for valid key and other conditions
        if (!k[ev] || this.isAutoPlayOn || !this.isActive || e.isComposing) {
          this.clear(); // Execute the corresponding action or clear the state if no match
          return;
        }
        // Execute the corresponding action
        k[ev]();

        // Prevent default behavior and stop event propagation
        e.preventDefault();
        e.stopImmediatePropagation();
      };

      // Attach event listeners for click and keyboard events with correct context (bind this)
      this.imag.addEventListener('click', switcher.bind(this));
      w.addEventListener('keyup', switcher.bind(this));
    }

    init() {
      // Add inline CSS using base64 string (increases file size)
      const resource = element('link', 'rel', 'stylesheet', 'href', 'data:text/css;base64,QGtleWZyYW1lcyBye3Rve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19I2s3e3VzZXItc2VsZWN0Om5vbmU7YmFja2dyb3VuZDp2YXIoLS1jb2xvcjIsICMyMjMpO2NvbG9yOiNhYWE7cG9zaXRpb246Zml4ZWQ7ei1pbmRleDo5OTk5OTk7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjJzfSNrNyAjaW5zIGltZ3tiYWNrZ3JvdW5kOnZhcigtLWNvbG9yMSwgIzMzNCk7bWF4LWhlaWdodDoxMDAlO21heC13aWR0aDoxMDAlfSNrNyAqLCNrNyA6OmFmdGVyLCNrNyA6OmJlZm9yZXtmb250OjEycHgvNCBzYW5zLXNlcmlmO3Bvc2l0aW9uOmFic29sdXRlO2JveC1zaXppbmc6Ym9yZGVyLWJveDtkaXNwbGF5OmlubGluZS1ibG9ja30jazcgYnV0dG9uICp7ei1pbmRleDotMTtwb2ludGVyLWV2ZW50czpub25lfSNrNyAjaW5ze3RleHQtYWxpZ246Y2VudGVyfSNrNyAjZmxuLCNrNyAjcGxhe3RleHQtaW5kZW50OjUwcHg7d2hpdGUtc3BhY2U6bm93cmFwO2JvdHRvbToyNHB4O2hlaWdodDo0OHB4fSNrNyAjYWx0e3JpZ2h0OjUwcHh9I2s3ICNhbHQsI2s3ICNpbnMsI2s3ICNpbnMgaW1nLCNrNyAjc3Rhe3Bvc2l0aW9uOnJlbGF0aXZlfSNrNyAjc3Rhe3RleHQtaW5kZW50OjB9I2s3ICNibHQsI2s3ICNidHJ7d2lkdGg6MjAlO21pbi13aWR0aDo5NnB4O2JvcmRlcjowO2hlaWdodDoxMDAlO2JvcmRlci1yYWRpdXM6MH0jazcgI2xmdDo6YWZ0ZXIsI2s3ICNyZ3Q6OmFmdGVye3BhZGRpbmc6OXB4O3RvcDoxNHB4fSNrNyAjbGZ0OjphZnRlcntib3JkZXItd2lkdGg6MnB4IDAgMCAycHg7bGVmdDoxNHB4fSNrNyAjcmd0OjphZnRlcntyaWdodDoxNHB4O2JvcmRlci13aWR0aDoycHggMnB4IDAgMH0jazcgI2JsdDpob3ZlciAjbGZ0OjphZnRlcntsZWZ0OjlweH0jazcgI2J0cjpob3ZlciAjcmd0OjphZnRlcntyaWdodDo5cHh9I2s3ICNjbHM6OmFmdGVyLCNrNyAjY2xzOjpiZWZvcmV7Ym9yZGVyLXdpZHRoOjAgMCAwIDJweDtoZWlnaHQ6MzBweDtsZWZ0OjIzcHg7dG9wOjEwcHh9I2s3ICNwbGk6OmJlZm9yZSwjazcgI3Nwbntib3JkZXItcmFkaXVzOjUwJTtoZWlnaHQ6MjRweDt3aWR0aDoyNHB4fSNrNyAjc3Bue2FuaW1hdGlvbjpyIC4zcyBsaW5lYXIgaW5maW5pdGU7Ym9yZGVyLWNvbG9yOnRyYW5zcGFyZW50ICNhYWE7bGVmdDo1MCU7bWFyZ2luOi0xMnB4IDAgMC0xMnB4O3RvcDo1MCV9I2s3ICNkd2x7Ym9yZGVyLXJhZGl1czowIDAgMnB4IDJweDt0b3A6MjdweDtoZWlnaHQ6NnB4O3dpZHRoOjI0cHg7Ym9yZGVyLXRvcDowfSNrNyAjcGxpOjpiZWZvcmV7dHJhbnNpdGlvbjouMnMgYm9yZGVyLXJhZGl1czt0b3A6MTJweH0jazcgI3BsaS5hdGM6OmJlZm9yZXtib3JkZXItcmFkaXVzOjRweH0jazcgI3BsaTo6YWZ0ZXJ7Ym9yZGVyLWNvbG9yOnRyYW5zcGFyZW50ICNmZmY7Ym9yZGVyLXdpZHRoOjVweCAwIDVweCAxMnB4O2xlZnQ6MTlweDt0b3A6MTlweDt3aWR0aDoxMHB4fSNrNyAjcGxpLmF0Yzo6YWZ0ZXJ7Ym9yZGVyLXdpZHRoOjAgMnB4O3BhZGRpbmctdG9wOjEwcHh9I2s3ICNkbGY6OmFmdGVye2JvcmRlci13aWR0aDowIDAgMnB4IDJweDtib3R0b206MjFweDtoZWlnaHQ6MTJweDtsZWZ0OjE4cHg7d2lkdGg6MTJweH0jazcgI2RsZjo6YmVmb3Jle2JhY2tncm91bmQ6I2ZmZjtoZWlnaHQ6MThweDtsZWZ0OjIzcHg7dG9wOjlweDt3aWR0aDoycHh9I2s3ICNjbHN7dG9wOjI0cHh9I2s3ICNkd2wsI2s3ICNwbGk6OmJlZm9yZXtsZWZ0OjEycHh9I2s3ICNjbHMsI2s3ICNmbG4sI2s3ICNyZ3R7cmlnaHQ6MjRweDt0ZXh0LWFsaWduOnJpZ2h0fSNrNyAjbGZ0LCNrNyAjcGxhe2xlZnQ6MjRweH0jazcgI2lucyBpbWcsI2s3IC50cm57dG9wOjUwJTt6LWluZGV4Oi0xO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpfSNrNyAucnRwOjphZnRlciwjazcgLnJ0cDo6YmVmb3Jle3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpfSNrNyAucnRtOjphZnRlcnt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9I2s3IC53MTAsI2s3LncxMHtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlfSNrNyAuYm9yLCNrNyAuYnJhOjphZnRlciwjazcgLmJyYjo6YmVmb3Jle2JvcmRlcjoycHggc29saWQgI2ZmZn0jazcgLmJ1dHtiYWNrZ3JvdW5kOjAgMDtoZWlnaHQ6NDhweDt3aWR0aDo0OHB4O2JvcmRlci1yYWRpdXM6NTAlO2JvcmRlcjowO2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246b3BhY2l0eSAuMXMgLjJzO21hcmdpbjowO3BhZGRpbmc6MH0jazcgLmJ1dDo6YWZ0ZXIsI2s3IC5idXQ6OmJlZm9yZXtjb250ZW50OiIifSNrNyAuYnV0OmZvY3VzLCNrNyAuYnV0OmhvdmVyLCNrNyAuYnV0OmhvdmVyIHNwYW57YmFja2dyb3VuZDpyZ2JhKDcsNyw3LC4yKTtvcGFjaXR5OjE7b3V0bGluZTowfSNrNyAjYmx0OmZvY3VzLCNrNyAjYnRyOmZvY3Vze2JhY2tncm91bmQ6MCAwfSNrNyAuYnV0OmFjdGl2ZXtvcGFjaXR5Oi4zfSNrNyAuZHBue2Rpc3BsYXk6bm9uZX0jazcgLmhkaSwjazcuaGRpe29wYWNpdHk6MH0jazcgLm9wYXtvcGFjaXR5Oi43fSNrNyAucmd0e3JpZ2h0OjB9I2s3IC50cG8sI2s3LnRwb3t0b3A6MH0jazcgLmxmdCwjazcubGZ0e2xlZnQ6MH0jazcgLmZmZiwjazcuZmZmLGh0bWwuZmZme292ZXJmbG93OmhpZGRlbiFpbXBvcnRhbnR9I2s3LnNjYXt0cmFuc2Zvcm06c2NhbGUoMCl9QG1lZGlhIChtaW4td2lkdGg6MTAyNHB4KXsjazc6bm90KDpob3ZlcikgI2NudH5kaXYsI2s3Om5vdCg6aG92ZXIpICNpbnN+YnV0dG9ue29wYWNpdHk6MH19');
      append(d.getElementsByTagName('head')[0], resource);

      // DOM elements setup
      /** @type {HTMLElement} */
      this.clos = element('button', 'id', 'cls', 'class', 'bra rtp opa but rtm brb', 'aria-label', 'Close', 'title', 'Press Esc to close');
      /** @type {HTMLElement} */
      this.ilef = element('span', 'id', 'lft', 'class', 'bra rtm opa trn but');
      /** @type {HTMLElement} */
      this.irig = element('span', 'id', 'rgt', 'class', 'bra rtp opa but trn');
      /** @type {HTMLElement} */
      this.imag = element('div', 'id', 'k7', 'class', 'sca hdi fff w10 tpo lft', 'role', 'dialog' /*, 'aria-label', 'k7'*/);
      /** @type {HTMLElement} */
      this.cent = element('div', 'id', 'cnt', 'class', 'tpo lft w10');
      /** @type {HTMLElement} */
      this.left = element('button', 'id', 'blt', 'class', 'but tpo lft', 'aria-label', 'Previous');
      /** @type {HTMLElement} */
      this.rigt = element('button', 'id', 'btr', 'class', 'but tpo rgt', 'aria-label', 'Next');
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
