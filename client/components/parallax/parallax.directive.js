'use strict';

angular.module('winderfulApp')
  .directive('parallax', parallax);

/**
 * Add parallax effect to items
 */
function parallax() {
  return function(scope, element, attrs) {

    // Our requestFrame shim
    var requestFrame = window.requestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame ||
                  window.msRequestAnimationFrame ||
                  window.oRequestAnimationFrame ||
                  function(callback) {
                    return window.setTimeout(callback, 1000 / 60);
                  };

    var parallaxScroll = {
      scrollPos: 0,         // track the current scroll position
      _prevScrollPost: -1,  // track the previous scroll position
      $parallaxItem: false, // Object with element details

      init: function() {
        // cache the item's attributes for speedy animation
        this.cacheParallaxItem();

        // bind this to the scroll method
        this.scroll = this.scroll.bind(this);

        // lets start animating our parallax effects!
        if (this.$parallaxItem) {
          this.scroll();
        }

        return this;
      },

      scroll: function() {
        this.scrollPos = window.pageYOffset;

        if (this._prevScrollPost === this.scrollPos) {
          // position hasn't changed, lets not do anything else
          requestFrame(this.scroll);
          return;
        }

        // update previous scroll
        this._prevScrollPost = this.scrollPos;

        // parallax the item
        this.parallax();

        // request a new frame
        requestFrame(this.scroll);
      },

      cacheParallaxItem: function() {
        var el = element[0];
        var height = el.getBoundingClientRect().height;
        var fromTop = el.getBoundingClientRect().top + this.scrollPos;
        var top = typeof attrs.parallaxTop === 'undefined' ? fromTop : parseFloat(attrs.parallaxTop);
        var speed = typeof attrs.parallaxSpeed === 'undefined' ? 0.2 : parseFloat(attrs.parallaxSpeed);
        var speedB = typeof attrs.parallaxBlurSpeed === 'undefined' ? false : parseFloat(attrs.parallaxBlurSpeed);

        // our cache object with the element's details
        this.$parallaxItem = {
          bottom: fromTop + height, // bottom part of the element
          height: height,           // element's height
          item: el,                 // element
          parallaxing: false,       // is it currently parallaxing?
          speedB: speedB,
          speedP: speed,            // parallax speed
          top: top - 60             // top coordinate to scroll from
        };
      },

      parallax: function() {
        // if element is within the screen
        var shouldParallax = this.scrollPos > this.$parallaxItem.top && this.scrollPos < this.$parallaxItem.bottom;

        if (shouldParallax) {
          // set as parallaxing
          this.$parallaxItem.parallaxing = true;

          // update CSS to set transform
          var transform = (this.$parallaxItem.speedP * (this.scrollPos - this.$parallaxItem.top)).toFixed(0);
          this.$parallaxItem.item.style.transform = 'translate3d(0, ' + transform + 'px, 0)';
          this.$parallaxItem.item.style['-webkit-transform'] = 'translate3d(0, ' + transform + 'px, 0)';

          if (this.$parallaxItem.speedB) {
            var blurAmount = (this.$parallaxItem.speedB * (this.scrollPos - this.$parallaxItem.top)).toFixed(1);
            var blurStyle = `blur(${blurAmount}px)`;
            this.$parallaxItem.item.style.filter = blurStyle;
            this.$parallaxItem.item.style['-webkit-filter'] = blurStyle;
          }
        } else if (this.$parallaxItem.parallaxing && (this.scrollPos < this.$parallaxItem.top || this.scrollPos > this.$parallaxItem.bottom)) {
          // set as not parallaxing
          this.$parallaxItem.parallaxing = false;

          // update CSS to set transform to 0
          this.$parallaxItem.item.style.transform = 'translate3d(0, 0, 0)';
          this.$parallaxItem.item.style['-webkit-transform'] = 'translate3d(0, 0, 0)';
        }
      }
    };

    // Start it all up
    parallaxScroll.init();
  };
}
