(function () {
  'use strict'

  function debounce (fn, delay) {
    let timer
    return function (...args) {
      // Clear the previous timer if the function is called again
      clearTimeout(timer)

      // Set a new timer to call the function after the delay
      timer = setTimeout(() => {
        fn(...args)
      }, delay)
    }
  }

  function ready (fn) {
    if (document.readyState !== 'loading') {
      fn()
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fn)
    } else {
      document.attachEvent('onreadystatechange', function () {
        if (document.readyState === 'loading') { fn() }
      })
    }
  }

  document.addEventListener('click', debounce((e) => {
    e.stopPropagation()
    e.target.id === 'menu'
      ? e.target.classList.toggle('act')
      : document.getElementById('menu').classList
        .remove('act')
    if (e.target.classList.contains('sele')) {
      e.target.parentElement.classList.toggle('pasukti')
    }
  }, 100))

  function init () {
    const elems = document.getElementsByClassName('grid-container')
    const heda = document.getElementsByTagName('header')[0]
    window.addEventListener('scroll', debounce((e) => {
      const bottomOfWindow = document.documentElement.offsetHeight / 2 + window.pageYOffset || document
        .documentElement.scrollTop
      if (window.pageYOffset > 48) {
        heda.classList.add('hei3')
      } else {
        heda.classList.remove('hei3')
      }

      for (let i = 0; i < elems.length; i++) {
        const bottomOfObject = elems[i].offsetTop + elems[i].offsetHeight
        if (bottomOfWindow > bottomOfObject) {
          elems[i].classList.remove('transit')
        } else {
          elems[i].classList.add('transit')
        }
      }
    }, 100))
  }
  ready(init)
})()
