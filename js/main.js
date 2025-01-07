 (function () {
      "use strict";
      var thro = function thro(fn, delay) {
        var last = 0;
        return function () {
          var now = new Date().getTime();
          if (now - last < delay) {
            return;
          }
          last = now;
          return fn.apply(void 0, arguments);
        };
      };
      var debounce = function debounce(fn, delay) {
        var timoutID;
        return function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          if (timoutID) {
            clearTimeout(timoutID);
          }
          timoutID = setTimeout(function () {
            fn.apply(void 0, args);
          }, delay);
        };
      };

      function ready(fn) {
        if (document.readyState != 'loading') {
          fn();
        } else if (document.addEventListener) {
          document.addEventListener('DOMContentLoaded', fn);
        } else {
          document.attachEvent('onreadystatechange', function () {
            if (document.readyState != 'loading')
              fn();
          });
        }
      }


      document.addEventListener('click', debounce((e) => {
        e.stopPropagation();
        e.target.id === "menu" ? e.target.classList.toggle("act") : document.getElementById("menu").classList
          .remove("act");
        if (e.target.classList.contains("sele")) {
          e.target.parentElement.classList.toggle("pasukti");
        }
      }, 100));

      function init() {
        const elems = document.getElementsByClassName("grid-container");
        let heda = document.getElementsByTagName("header")[0];
        window.addEventListener('scroll', debounce((e) => {
          let bottom_of_window = document.documentElement.offsetHeight / 2 + window.pageYOffset || document
            .documentElement.scrollTop;
          if (window.pageYOffset > 48) {
            heda.classList.add("hei3");
          } else {
            heda.classList.remove("hei3");
          }

          for (let i = 0; i < elems.length; i++) {
            let bottom_of_object = elems[i].offsetTop + elems[i].offsetHeight;
            if (bottom_of_window > bottom_of_object) {
              elems[i].classList.remove("transit");
            } else {
              elems[i].classList.add("transit");
            }
          }
        }, 100));
      }
      ready(init);
    })();