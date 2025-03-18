/* jshint esversion: 6 */
;((w, d) => {
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
      this.showButtons = 1 // Display buttons by default. (true = 1 and false = 0)
      this.showButtonsOnPlay = 1 // Display buttons when autoplay is active.
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
        if (this.showButtons) this.play.className = 'b a s o y l q'

        if (!this.showButtonsOnPlay) {
          // Hide buttons if configured not to show during auto-play
          if (this.showButtons) {
            this.foot.className = this.onow.className = 'n'
          }
          this.left.className = this.rigt.className = this.clos.className = 'n'
        }
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
      if (this.showButtons) {
        // [this.foot, this.onow].forEach(el => el.className = '')
        this.foot.className = ''
        this.onow.className = ''
        this.play.className = classNames + ' y l'
      }
      // always show close button on clear
      this.clos.className = classNames + ' j p'
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
      de.className = de.classList.remove('f'); //de.className.split('f').join('').trim()
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
        de.classList.add('f');
        this.imag.className = 'f w y l'
      }

      // Prevent reloading if the current image matches the source
      if (!this.imgs || this.imgs.src === fullNamePrefixed) return;

      // Update UI state and trigger image loading
      this.spin.className = 'u'

      // Remove old image and append the new one
      this.insi.removeChild(this.imgs)
      this.imgs = element('img', 'src', fullNamePrefixed, 'alt', index.alt + ' selected')

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
      if (this.isAutoPlayOn && !this.showButtonsOnPlay) return

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
      if (this.showButtons) {
        this.alts.textContent = getLastPathSegment(target)
      }
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
      const options = { passive: true };
      let touchStartX = 0;

      this.imag.addEventListener("touchstart", e => {
        touchStartX = e.touches[0].clientX;
      }, options);

      this.imag.addEventListener("touchend", e => {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diffX) > 50) {
          // clear if loop exists (autoplay)
          this.clear()
          diffX > 0 ?  this.lefts().showGallery() : this.right().showGallery();
        }
      }, options);
    }

    init () {
      // Add inline CSS using base64 string dynamically (increases file size)
      const resource = element(
        'link',
        'rel',
        'stylesheet',
        'href',
        'data:text/css;base64,QGtleWZyYW1lcyBrNy1ye3Rve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19I2s3ICosI2s3IDo6YWZ0ZXIsI2s3IDo6YmVmb3Jle2JveC1zaXppbmc6Ym9yZGVyLWJveDtkaXNwbGF5OmlubGluZS1ibG9jaztmb250OjEycHgvNCBzYW5zLXNlcmlmO3Bvc2l0aW9uOmFic29sdXRlfSNrNyAuYiAqe3otaW5kZXg6LTE7cG9pbnRlci1ldmVudHM6bm9uZX0jazd7YmFja2dyb3VuZDp2YXIoLS1jb2xvcjIsICMyMjMpO2NvbG9yOiNhYWE7cG9zaXRpb246Zml4ZWQ7dGV4dC1hbGlnbjpjZW50ZXI7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjJzO3VzZXItc2VsZWN0Om5vbmU7ei1pbmRleDo5OTk5OTl9I2s3IGltZ3tiYWNrZ3JvdW5kOnZhcigtLWNvbG9yMSwgIzMzNCk7bWF4LWhlaWdodDoxMDAlO21heC13aWR0aDoxMDAlO3RyYW5zaXRpb246LjJzIG9wYWNpdHl9I2s3ICNmbCwjazcgI3Bse3RleHQtaW5kZW50OjUwcHg7d2hpdGUtc3BhY2U6bm93cmFwO2JvdHRvbToyNHB4O2hlaWdodDo0OHB4fSNrNyAjYWx7cmlnaHQ6NTBweH0jazcgI2FsLCNrNyAjaW4sI2s3ICNpbiBpbWcsI2s3ICNzdHtwb3NpdGlvbjpyZWxhdGl2ZX0jazcgI3N0e3RleHQtaW5kZW50OjB9I2s3ICNibCwjazcgI2J0e3dpZHRoOjE2MHB4O2JvcmRlcjowO2hlaWdodDoxMDAlO2JvcmRlci1yYWRpdXM6MH0jazcgI2xmOjphZnRlciwjazcgI3JnOjphZnRlcntwYWRkaW5nOjlweDt0b3A6MTRweH0jazcgI2xmOjphZnRlcntib3JkZXItd2lkdGg6MnB4IDAgMCAycHg7bGVmdDoxNHB4fSNrNyAjcmc6OmFmdGVye3JpZ2h0OjE0cHg7Ym9yZGVyLXdpZHRoOjJweCAycHggMCAwfSNrNyAjYmw6aG92ZXIgI2xmOjphZnRlcntsZWZ0OjlweH0jazcgI2J0OmhvdmVyICNyZzo6YWZ0ZXJ7cmlnaHQ6OXB4fSNrNyAjY2w6OmFmdGVyLCNrNyAjY2w6OmJlZm9yZXtib3JkZXItd2lkdGg6MCAwIDAgMnB4O2hlaWdodDozMHB4O2xlZnQ6MjNweDt0b3A6MTBweH0jazcgI3B1OjpiZWZvcmUsI2s3ICNzcHtib3JkZXItcmFkaXVzOjUwJTtoZWlnaHQ6MjRweDt3aWR0aDoyNHB4fSNrNyAjc3B7YW5pbWF0aW9uOms3LXIgLjNzIGxpbmVhciBpbmZpbml0ZTtib3JkZXItY29sb3I6dHJhbnNwYXJlbnQgI2FhYTtsZWZ0OjUwJTttYXJnaW46LTEycHggMCAwLTEycHg7dG9wOjUwJX0jazcgI2R3e2JvcmRlci1yYWRpdXM6MCAwIDRweCA0cHg7dG9wOjI3cHg7aGVpZ2h0OjZweDt3aWR0aDoyNHB4O2JvcmRlci10b3A6MH0jazcgI3B1OjpiZWZvcmV7dHJhbnNpdGlvbjouMnMgYm9yZGVyLXJhZGl1czt0b3A6MTJweH0jazcgI3B1LnE6OmJlZm9yZXtib3JkZXItcmFkaXVzOjRweH0jazcgI3B1OjphZnRlcntib3JkZXItY29sb3I6dHJhbnNwYXJlbnQgI2VlZTtib3JkZXItd2lkdGg6NHB4IDAgNHB4IDlweDtsZWZ0OjIwcHg7dG9wOjIwcHg7d2lkdGg6OHB4fSNrNyAjcHUucTo6YWZ0ZXJ7Ym9yZGVyLXdpZHRoOjAgMnB4O3BhZGRpbmctdG9wOjhweH0jazcgI2RsOjphZnRlcntib3JkZXItd2lkdGg6MCAwIDJweCAycHg7Ym90dG9tOjIxcHg7aGVpZ2h0OjEycHg7bGVmdDoxOHB4O3dpZHRoOjEycHh9I2s3ICNkbDo6YmVmb3Jle2JhY2tncm91bmQ6I2VlZTtoZWlnaHQ6MThweDtsZWZ0OjIzcHg7dG9wOjlweDt3aWR0aDoycHh9I2s3ICNjbHt0b3A6MjRweH0jazcgI2R3LCNrNyAjcHU6OmJlZm9yZXtsZWZ0OjEycHh9I2s3ICNjbCwjazcgI2ZsLCNrNyAjcmd7cmlnaHQ6MjRweH0jazcgI2xmLCNrNyAjcGx7bGVmdDoyNHB4fSNrNyAudCwjazcgaW1ne3RvcDo1MCU7ei1pbmRleDotMTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX0jazcgLnA6OmFmdGVyLCNrNyAucDo6YmVmb3Jle3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpfSNrNyAuajo6YWZ0ZXJ7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfSNrNyAudywjazcud3toZWlnaHQ6MTAwJTt3aWR0aDoxMDAlfSNrNyAuYTo6YWZ0ZXIsI2s3IC5zOjpiZWZvcmUsI2s3IC51e2JvcmRlcjoycHggc29saWQgI2VlZX0jazcgLmJ7YmFja2dyb3VuZDowIDA7aGVpZ2h0OjQ4cHg7d2lkdGg6NDhweDtib3JkZXItcmFkaXVzOjdweDtib3JkZXI6MDtjdXJzb3I6cG9pbnRlcjt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIC4xczttYXJnaW46MDtwYWRkaW5nOjA7Y29sb3I6aW5oZXJpdH0jazcgLmI6OmFmdGVyLCNrNyAuYjo6YmVmb3Jle2NvbnRlbnQ6IiJ9I2s3IC5iOmZvY3VzLCNrNyAuYjpob3ZlciwjazcgLmI6aG92ZXIgc3BhbntiYWNrZ3JvdW5kOiMwNzA3MDczMztvcGFjaXR5OjE7b3V0bGluZTowfSNrNyAjYmw6Zm9jdXMsI2s3ICNidDpmb2N1c3tiYWNrZ3JvdW5kOjAgMH0jazcgLmI6YWN0aXZle29wYWNpdHk6LjN9I2s3IC5ue2Rpc3BsYXk6bm9uZX0jazcgLmgsI2s3Lmh7b3BhY2l0eTowfSNrNyAub3tvcGFjaXR5Oi43fSNrNyAucntyaWdodDowfSNrNyAueSwjazcueXt0b3A6MH0jazcgLmwsI2s3Lmx7bGVmdDowfSNrNyAuZiwjazcuZixodG1sLmZ7b3ZlcmZsb3c6aGlkZGVuIWltcG9ydGFudH0jazcuZ3t0cmFuc2Zvcm06c2NhbGUoMCl9I3NwLnUrZGl2PmRpdiBpbWd7b3BhY2l0eTouMX1AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6MzIwcHgpeyNrNyAjZmw+c3BhbntkaXNwbGF5Om5vbmV9fUBtZWRpYSAobWluLXdpZHRoOjEwMjRweCl7I2s3Om5vdCg6aG92ZXIpICNjbnR+ZGl2LCNrNzpub3QoOmhvdmVyKSAjaW5+LmJ7b3BhY2l0eTowfX0='
      )
      append(d.getElementsByTagName('head')[0], resource)

      // DOM elements setup
      /** @type {HTMLElement} */
      this.clos = element('button', 'id', 'cl', 'class', 'a p o b j s', 'aria-label', 'Close', 'title', 'Close (Esc)')
      /** @type {HTMLElement} */
      this.ilef = element('span', 'id', 'lf', 'class', 'a j o b t')
      /** @type {HTMLElement} */
      this.irig = element('span', 'id', 'rg', 'class', 'a p o b t')
      /** @type {HTMLElement} */
      this.imag = element('div', 'id', 'k7', 'class', 'g h f w y l', 'role', 'dialog', 'aria-label', 'Image Gallery')
      /** @type {HTMLElement} */
      this.cent = element('div', 'id', 'cnt', 'class', 'y l w')
      /** @type {HTMLElement} */
      this.left = element('button', 'id', 'bl', 'class', 'b y l', 'aria-label', 'Previous (Left Arrow)')
      /** @type {HTMLElement} */
      this.rigt = element('button', 'id', 'bt', 'class', 'b y r', 'aria-label', 'Next (Right Arrow)')
      /** @type {HTMLElement} */
      this.insi = element('div', 'id', 'in', 'class', 'w')
      /** @type {HTMLElement} */
      this.spin = element('div', 'id', 'sp', 'class', 'n', 'aria-hidden', 'true')
      /** @type {HTMLElement} */
      this.imgs = element('img', 'src', 'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=', 'alt', '', 'loading', 'lazy')
      // append(this.left, d.createTextNode('Previous')); // to add text to button for Previous css can be added for better UI ->text-indent: 50px;
      // append(this.rigt, d.createTextNode('Next'));  // to add text to button for Next css can be added for better UI ->text-indent: -50px;
      append(this.insi, this.imgs)
      append(this.rigt, this.irig)
      append(this.left, this.ilef)
      append(this.imag, this.spin, this.cent)
      append(this.cent, this.insi, this.rigt, this.left, this.clos)
      append(d.body, this.imag)

      if (this.showButtons) {
        /** @type {HTMLElement} */
        this.wdow = element('button', 'id', 'dl', 'class', 'y r a j o b', 'aria-label', 'download')
        /** @type {HTMLElement} */
        this.play = element('button', 'id', 'pu', 'class', 'y l a s o b', 'aria-label', 'play')
        /** @type {HTMLElement} */
        this.foot = element('div', 'id', 'pl')
        /** @type {HTMLElement} */
        this.onow = element('div', 'id', 'fl')
        /** @type {HTMLElement} */
        this.alts = element('span', 'id', 'al', 'class', 'f')
        /** @type {HTMLElement} */
        this.fine = element('span', 'id', 'st')
        /** @type {HTMLElement} */
        this.down = element('span', 'id', 'dw', 'class', 'u')

        append(this.onow, this.alts, this.wdow)
        append(this.imag, this.onow, this.foot)
        append(this.foot, this.play, d.createTextNode('Image '), this.fine, d.createTextNode(' of ' + this.imagesArray.length))
        append(this.wdow, this.down)
      }
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
