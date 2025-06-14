/* jshint esversion: 6 */
;(function(w, d){
  'use strict'
  /** @const @type {!Element} */
  const de = d.documentElement // Reference to the root <html>

  /** @noinline */
  function getLastPathSegment (path){
    return path.split('/').slice(-1)[0]
  };

  function append(parentElement, ...childElements) {
    // Iterate over all child elements passed to the function
    for (let index = 0; index < childElements.length; index += 1) {
      parentElement.appendChild(childElements[index]) // Append each child to the parent
    }
  }

  function element(tagName, ...attributes) {
    // Create a new element with the specified tag name
    const newElement = d.createElement(tagName)
    // Loop through the provided attributes and add them to the element
    for (let index = 0; index < attributes.length; index += 2) {
      // attributes are passed in pairs (attribute name and value)
      newElement.setAttribute(attributes[index], attributes[index + 1])
    }
    return newElement // Return the created element
  }

  class UI {
    constructor () {
      // user config
      this.delayShow = 1330 // Autoplay timeout
      // this.showButtons = 1 // Display buttons by default. (true = 1 and false = 0)
      // this.showButtonsOnPlay = 1 // Display buttons when autoplay is active.
      this.extension = 'jpg' // Additional extension for large resolution (empty = same image extension).
      this.container = 'images' // Class name for the image container. If empty, all images are selected.
      this.folder = 'large/' // Folder name or image prefix (prefix should not include '/').

      // everything else for gallery (NO NEED TO CHANGE)
      this.imagesArray = [] // Stores all `img` elements found in the container
      this.isAutoPlayOn = false // State to track autoplay functionality
      this.isActive = false // State to check if UI is active
      this.indexOfImage = 0 // Index of the current image
      this.timeOut = 0
    }

    addImagesToArray () {
      // class name for the image container. If empty, all images are selected.
      const elements = d.getElementsByClassName(this.container)
      const container = elements.length > 0 ? elements : [d.body]
      const containerLength = container.length
      const clickHandler = e => this.listenForIG(e)

      for (let i = 0; i < containerLength; i++) {
        const images = container[i].getElementsByTagName('img')
        const imagesLength = images.length
        for (let j = 0; j < imagesLength; j++) {
          const img = images[j]
          const src = (img.getAttribute('src') || '').trim()
          if (src) {
            this.imagesArray.push(img)
          } else {
            console.warn('Invalid src:', img) // Log a warning for debugging
          }
        }
      }

      if (container[0] && container[0].tagName === 'BODY') {
        d.body.onclick = clickHandler
      } else {
        for (let i = 0; i < containerLength; i++) {
          container[i].onclick = clickHandler
        }
      }

      return this.imagesArray.length
    }

    autoPlayLoop () {
      if (!this.isAutoPlayOn) {
        // If not set, set it to true once
        this.isAutoPlayOn = true

        // Set the play button active for the first time (playing)
        /*if (this.showButtons) */this.play.className = 'b a s o c q'

        // if (!this.showButtonsOnPlay) {
          // Hide buttons if configured not to show during auto-play
          // if (this.showButtons) {
            this.foot.className = this.onow.className = 'n'
          // }
          this.left.className = this.rigt.className = this.clos.className = 'n'
        // }
      }
      if (this.isAutoPlayOn) {
        // Clear any existing timeout before setting a new one
        clearTimeout(this.timeOut)

        // Set a timeout to move to the next image after a specified delay
        this.timeOut = setTimeout(() => {
          this.right().showGallery()

          // Clear auto-play if the last image is reached
          if (this.indexOfImage === this.imagesArray.length - 1) {
            this.clear()
          }
        }, this.delayShow)
      }
    }

    // Trigger download of the current image with default file name or (with src commented out)
    downloads () {
      const a = element('a', 'rel', 'noopener', 'download', '' /*getLastPathSegment(this.imgs.src)*/, 'href', this.imgs.src, 'target', '_blank')
      a.click()
      //a.remove() // don't always need to call .remove() for the temporary <a> element exists only in memory
    }

    // Move to the previous image
    lefts () {
      this.indexOfImage = this.indexOfImage > 0 ? this.indexOfImage - 1 : this.imagesArray.length - 1
      return this
    }

    // Move to the next image
    right () {
      this.indexOfImage = this.indexOfImage < this.imagesArray.length - 1 ? this.indexOfImage + 1 : 0
      return this
    }

    // Clear auto-play and reset UI state
    clear () {
      this.isAutoPlayOn = false
      if (this.timeOut) {
        clearTimeout(this.timeOut) // Cancel the timeout
        this.timeOut = null // Reset reference
      }
      // same classes names
      const classNames = 'b a s o'
      // if show buttons compiled display them
      // if (this.showButtons) {
        // [this.foot, this.onow].forEach(el => el.className = '')
        this.foot.className = 'd e'
        this.onow.className = 'd k'
        this.play.className = classNames + ' c'
      // }
      // always show close button on clear
      this.clos.className = classNames + ' j p k'
      this.leftRightButtonsVisibility()
    }

    leftRightButtonsVisibility () {
      // Adjust visibility of left and right buttons based on the current image index
      this.left.className = this.indexOfImage === 0 ? 'n' : 'b y l'
      this.rigt.className = this.indexOfImage === this.imagesArray.length - 1 ? 'n' : 'b y r'
    }

    // Close the image viewer
    closeModal () {
      this.isActive = false
      this.imag.className = 'g h w y l'
      //de.classList.remove('f'); //de.className.split('f').join('').trim()
      de.removeAttribute('data-f');
    }

    // Show the current image
    showGallery () {
      // Retrieve the image object from imagesArray using the current indexOfImage
      const index = this.imagesArray[/** @type {number} */ (this.indexOfImage)]

      // if (!index) return; // Prevent errors if index is undefined

      // Get the source URL of the selected image
      const imageSource = index.src

      // Extract the file name from the image source URL using getLastPathSegment function
      const fileName = getLastPathSegment(imageSource)

      // Split the file name into an array using '.' as the delimiter to separate name and extension
      const arrayFileName = fileName.split('.')

      // Construct the file name with the correct extension:
      // - arrayFileName[0] is the base name of the file (everything before the first dot)
      // - index.dataset.ext (if available) is used as the extension
      // - Otherwise, this.extension is used if defined
      // - If neither is available, fallback to the original extension (arrayFileName[1])
      const fileExtension = arrayFileName[0] + '.' + (index.dataset.ext || this.extension || arrayFileName[1])

      // Check if the file extension starts with 'svg' (supports both 'svg' and 'svgz'):
      // - arrayFileName.slice(-1)[0] gets the last element (the file extension)
      // - .slice(0, 3) ensures we only check the first three characters
      // - .toLowerCase() makes the comparison case-insensitive
      const isSvg = arrayFileName.slice(-1)[0].slice(0, 3).toLowerCase() === 'svg'

      // Determine the full image path, considering whether it's an SVG:
      // - If the file is an SVG, keep the original imageSource (no changes).
      // - Otherwise, replace the file name in imageSource with the folder path + modified file name.
      const fullNamePrefixed = isSvg ? imageSource : imageSource.replace(fileName, this.folder + fileExtension)

      // Activate the UI if not active
      if (!this.isActive) {
        this.isActive = true
        //de.classList.add('f');
        de.setAttribute('data-f', 'hidden');
        this.imag.className = 'f w y l'
      }

      // Prevent reloading if the current image matches the source
      if (!this.imgs || this.imgs.src === fullNamePrefixed) return;

      // Update UI state and trigger image loading
      this.spin.className = 'u'

      // Remove old image and append the new one
      this.insi.removeChild(this.imgs)
      this.imgs = element('img', 'src', fullNamePrefixed, 'class', 'c', 'alt', index.alt + ' selected')

      this.setDownloadText(fullNamePrefixed)

      this.imgs.onload = () => {
        // Hide the spinner
        this.spin.className = 'n'
        if (this.isAutoPlayOn) {
          this.autoPlayLoop()
        }
      }

      this.imgs.onerror = e => {
        e.target.onerror = null
        e.target.src = imageSource
        this.setDownloadText(fileName)
      }

      if (this.fine) this.fine.textContent = this.indexOfImage + 1
      append(this.insi, this.imgs)

      // don't change left right visibility'
      if (this.isAutoPlayOn /*&& !this.showButtonsOnPlay*/) return

      this.leftRightButtonsVisibility()
    }

    // Listen for clicks on images and show the corresponding image
    listenForIG (e) {
      const target = e.target
      if (target.tagName === 'IMG') {
        const imgIndex = this.imagesArray.indexOf(target);
        this.indexOfImage = imgIndex > -1 ? imgIndex : 0;
        this.showGallery()
        e.stopImmediatePropagation()
      }
    }

    // change image text (file name)
    setDownloadText(target){
      // if (this.showButtons) {
        this.alts.textContent = getLastPathSegment(target)
      // }
    }

    listeners () {
      // prettier-ignore
      /** @suppress {missingProperties} */
      const k = {
        'bl': () => this.lefts().showGallery(), // Move left action (chained methods)
        'bt': () => this.right().showGallery(), // Move right action (chained methods)
        'pu': () => this.autoPlayLoop(), // Play/pause action
        'dl': () => this.downloads(), // Download action
        'cl': () => this.closeModal() // Close action
      }

      // Map additional keys to specific actions
      k[' '] = k['pu'] // Space for play/pause
      k['ArrowLeft'] = k['bl'] // Left arrow for left navigation
      k['ArrowRight'] = k['bt'] // Right arrow for right navigation
      // k[`Escape`] = k['cl'] // close gallery

      // Unified event handler
      const switcher = e => {
        // Only proceed if the gallery is active
        if (this.isActive) {
          // Prevent default behavior and stop event propagation
          e.preventDefault()
          e.stopImmediatePropagation()
          // Get the event key or target ID
          const ev = e.key || e.target.id
          // Handle Escape and cl separately
          if (ev === 'Escape' || ev === 'cl') {
            this.closeModal()
          }
          // Check for valid key and other conditions
          if (!k[ev] || this.isAutoPlayOn || e.isComposing) {
            this.clear() // Execute the corresponding action or clear the state if no match
            return
          }
          // Execute the corresponding action
          k[ev]()
        }
      }

      // Attach event listeners for click and keyboard events with correct context (bind this)
      this.imag.addEventListener('click', switcher.bind(this))
      w.addEventListener('keyup', switcher.bind(this))

      // Attach events for touch
      let touchStartX = 0;

      this.imag.addEventListener("touchstart", e => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });

      this.imag.addEventListener("touchend", e => {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diffX) > 50) {
          // clear if loop exists (autoplay)
          this.clear()
          diffX > 0 ?  this.lefts().showGallery() : this.right().showGallery();
        }
      });
    }

    init () {
      // Add inline CSS using base64 string dynamically (increases file size)
      const resource = element(
        'link',
        'rel',
        'stylesheet',
        'href',
        'data:text/css;base64,QGtleWZyYW1lcyBrNy1ye3Rve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19I2s3ICosI2s3IDo6YWZ0ZXIsI2s3IDo6YmVmb3Jle2JveC1zaXppbmc6Ym9yZGVyLWJveDtkaXNwbGF5OmlubGluZS1ibG9jaztmb250OjEycHgvNCBzYW5zLXNlcmlmO3Bvc2l0aW9uOmFic29sdXRlfSNrNyAuY3twb3NpdGlvbjpyZWxhdGl2ZX0jazcgLmIgKnt6LWluZGV4Oi0xO3BvaW50ZXItZXZlbnRzOm5vbmV9I2s3e2JhY2tncm91bmQ6dmFyKC0tY29sb3IyLCAjMjIzKTtjb2xvcjojYWFhO3Bvc2l0aW9uOmZpeGVkO3RleHQtYWxpZ246Y2VudGVyO3RyYW5zaXRpb246dHJhbnNmb3JtIC4yczt1c2VyLXNlbGVjdDpub25lO3otaW5kZXg6OTk5OTk5fSNrNyBpbWd7YmFja2dyb3VuZDp2YXIoLS1jb2xvcjEsICMzMzQpO21heC1oZWlnaHQ6MTAwJTttYXgtd2lkdGg6MTAwJTt0cmFuc2l0aW9uOi4ycyBvcGFjaXR5fSNrNyAjYmwsI2s3ICNidHt3aWR0aDoxNjBweDtib3JkZXI6MDtoZWlnaHQ6MTAwJTtib3JkZXItcmFkaXVzOjB9I2s3ICNsZjo6YWZ0ZXIsI2s3ICNyZzo6YWZ0ZXJ7cGFkZGluZzo5cHg7dG9wOjE0cHh9I2s3ICNsZjo6YWZ0ZXJ7Ym9yZGVyLXdpZHRoOjJweCAwIDAgMnB4O2xlZnQ6MTRweH0jazcgI3JnOjphZnRlcntyaWdodDoxNHB4O2JvcmRlci13aWR0aDoycHggMnB4IDAgMH0jazcgI2JsOmhvdmVyICNsZjo6YWZ0ZXJ7bGVmdDo5cHh9I2s3ICNidDpob3ZlciAjcmc6OmFmdGVye3JpZ2h0OjlweH0jazcgI2NsOjphZnRlciwjazcgI2NsOjpiZWZvcmV7Ym9yZGVyLXdpZHRoOjAgMCAwIDJweDtoZWlnaHQ6MzBweDtsZWZ0OjIzcHg7dG9wOjEwcHh9I2s3ICNwdTo6YmVmb3JlLCNrNyAjc3B7Ym9yZGVyLXJhZGl1czo1MCU7aGVpZ2h0OjI0cHg7d2lkdGg6MjRweH0jazcgI3Nwe2FuaW1hdGlvbjprNy1yIC4zcyBsaW5lYXIgaW5maW5pdGU7Ym9yZGVyLWNvbG9yOnRyYW5zcGFyZW50ICNhYWE7bGVmdDo1MCU7bWFyZ2luOi0xMnB4IDAgMC0xMnB4O3RvcDo1MCV9I2s3ICNkd3tib3JkZXItcmFkaXVzOjAgMCA0cHggNHB4O3RvcDoyN3B4O2hlaWdodDo2cHg7d2lkdGg6MjRweDtib3JkZXItdG9wOjB9I2s3ICNwdTo6YmVmb3Jle3RyYW5zaXRpb246LjJzIGJvcmRlci1yYWRpdXM7dG9wOjEycHh9I2s3ICNwdS5xOjpiZWZvcmV7Ym9yZGVyLXJhZGl1czo0cHh9I2s3ICNwdTo6YWZ0ZXJ7Ym9yZGVyLWNvbG9yOnRyYW5zcGFyZW50ICNlZWU7Ym9yZGVyLXdpZHRoOjRweCAwIDRweCA5cHg7bGVmdDoyMHB4O3RvcDoyMHB4O3dpZHRoOjhweH0jazcgI3B1LnE6OmFmdGVye2JvcmRlci13aWR0aDowIDJweDtwYWRkaW5nLXRvcDo4cHh9I2s3ICNkbDo6YWZ0ZXJ7Ym9yZGVyLXdpZHRoOjAgMCAycHggMnB4O2JvdHRvbToyMXB4O2hlaWdodDoxMnB4O2xlZnQ6MThweDt3aWR0aDoxMnB4fSNrNyAjZGw6OmJlZm9yZXtiYWNrZ3JvdW5kOiNlZWU7aGVpZ2h0OjE4cHg7bGVmdDoyM3B4O3RvcDo5cHg7d2lkdGg6MnB4fSNrNyAjY2x7dG9wOjI0cHh9I2s3ICNkdywjazcgI3B1OjpiZWZvcmV7bGVmdDoxMnB4fSNrNyAua3tyaWdodDoyNHB4fSNrNyAuZXtsZWZ0OjI0cHh9I2s3IC50LCNrNyBpbWd7dG9wOjUwJTt6LWluZGV4Oi0xO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpfSNrNyAucDo6YWZ0ZXIsI2s3IC5wOjpiZWZvcmV7dHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyl9I2s3IC5qOjphZnRlcnt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9I2s3IC53LCNrNy53e2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMGR2aH0jazcgLmE6OmFmdGVyLCNrNyAuczo6YmVmb3JlLCNrNyAudXtib3JkZXI6MnB4IHNvbGlkICNlZWV9I2s3IC5ie2JhY2tncm91bmQ6MCAwO2hlaWdodDo0OHB4O3dpZHRoOjQ4cHg7Ym9yZGVyLXJhZGl1czo3cHg7Ym9yZGVyOjA7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjpvcGFjaXR5IC4zcyAuMXM7bWFyZ2luOjA7cGFkZGluZzowO3ZlcnRpY2FsLWFsaWduOnRvcDtjb2xvcjppbmhlcml0fSNrNyAuYjo6YWZ0ZXIsI2s3IC5iOjpiZWZvcmV7Y29udGVudDoiIn0jazcgLmI6Zm9jdXMsI2s3IC5iOmhvdmVyLCNrNyAuYjpob3ZlciBzcGFue2JhY2tncm91bmQ6IzA3MDcwNzMzO29wYWNpdHk6MTtvdXRsaW5lOjB9I2s3ICNibDpmb2N1cywjazcgI2J0OmZvY3Vze2JhY2tncm91bmQ6MCAwfSNrNyAuYjphY3RpdmV7b3BhY2l0eTouM30jazcgLm57ZGlzcGxheTpub25lfSNrNyAuaCwjazcuaHtvcGFjaXR5OjB9I2s3IC5ve29wYWNpdHk6Ljd9I2s3IC5ye3JpZ2h0OjB9I2s3IC55LCNrNy55e3RvcDowfSNrNyAubCwjazcubHtsZWZ0OjB9I2s3LmYsW2RhdGEtZj1oaWRkZW5de292ZXJmbG93OmhpZGRlbiFpbXBvcnRhbnR9I2s3Lmd7dHJhbnNmb3JtOnNjYWxlKDApfSNrNyAuZHtib3R0b206MjRweDtoZWlnaHQ6NDhweH0jc3AudStkaXY+ZGl2IGltZ3tvcGFjaXR5Oi4xfUBtZWRpYSAobWluLXdpZHRoOjEwMjRweCl7I2s3Om5vdCg6aG92ZXIpICNjbn5kaXYsI2s3Om5vdCg6aG92ZXIpICNpbn4uYntvcGFjaXR5OjB9fUBtZWRpYSAobWF4LXdpZHRoOjMyMHB4KXsjazcgLmR7Y29sb3I6dHJhbnNwYXJlbnR9fQ=='
      )
      append(d.getElementsByTagName('head')[0], resource)

      // DOM elements setup
      /** @type {HTMLElement} */
      this.clos = element('button', 'id', 'cl', 'class', 'a p o b j s k', 'aria-label', 'Close', 'title', 'Close (Esc)')
      /** @type {HTMLElement} */
      this.ilef = element('span', 'id', 'lf', 'class', 'a j o b t e')
      /** @type {HTMLElement} */
      this.irig = element('span', 'id', 'rg', 'class', 'a p o b t k')
      /** @type {HTMLElement} */
      this.imag = element('div', 'id', 'k7', 'class', 'g h f w y l', 'role', 'dialog', 'aria-label', 'Gallery')
      /** @type {HTMLElement} */
      this.cent = element('div', 'id', 'cn', 'class', 'y l w')
      /** @type {HTMLElement} */
      this.left = element('button', 'id', 'bl', 'class', 'b y l', 'aria-label', 'Previous (Left Arrow)')
      /** @type {HTMLElement} */
      this.rigt = element('button', 'id', 'bt', 'class', 'b y r', 'aria-label', 'Next (Right Arrow)')
      /** @type {HTMLElement} */
      this.insi = element('div', 'id', 'in', 'class', 'c w')
      /** @type {HTMLElement} */
      this.spin = element('div', 'id', 'sp', 'class', 'n', 'aria-hidden', 'true')
      /** @type {HTMLElement} */
      this.imgs = element('img', 'class', 'c', 'src', 'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=', 'alt', '', 'loading', 'lazy')
      // append(this.left, d.createTextNode('Previous')); // to add text to button for Previous
      // append(this.rigt, d.createTextNode('Next'));  // to add text to button for Next
      append(this.insi, this.imgs)
      append(this.rigt, this.irig)
      append(this.left, this.ilef)
      append(this.imag, this.spin, this.cent)
      append(this.cent, this.insi, this.rigt, this.left, this.clos)
      append(d.body, this.imag)

      // if (this.showButtons) {
        /** @type {HTMLElement} */
        this.wdow = element('button', 'id', 'dl', 'class', 'b a j o c', 'aria-label', 'download')
        /** @type {HTMLElement} */
        this.play = element('button', 'id', 'pu', 'class', 'b a s o c', 'aria-label', 'play')
        /** @type {HTMLElement} */
        this.foot = element('div', 'class', 'd e')
        /** @type {HTMLElement} */
        this.onow = element('div', 'class', 'd k')
        /** @type {Text} */
        this.alts = d.createTextNode('')
        /** @type {Text} */
        this.fine = d.createTextNode('')
        /** @type {HTMLElement} */
        this.down = element('span', 'id', 'dw', 'class', 'u')
        append(this.onow, d.createTextNode('Image '), this.fine, d.createTextNode(' of ' + this.imagesArray.length), this.play)
        append(this.foot, this.wdow, this.alts)
        append(this.imag, this.onow, this.foot)
        append(this.wdow, this.down)
      // }
    }
  }

  // Create a new UI (user interface) instance with default configurations
  const ui = new UI()
  // Populate the UI instance with images retrieved from the DOM
  const lengthOfImages = ui.addImagesToArray()
  // if found images, initialize the UI and add event listeners
  if (lengthOfImages) {
    // Initialize the UI, setting up initial configurations and state and
    // Add event listeners to enable user interactions like clicks on images
    ui.init()
    ui.listeners()
  }
})(window, document)
