(function() {
    Nokia.Busy = Nokia.Widget.extend({
        initialize: function(options) {
            var instance = this;

            var defaults = {
                autoOpen: true,
                overflow: true,
                height: 108,
                width: 108,
                loaderText: false
            };

            instance.options = jQuery.extend(defaults, options);

            instance.element = jQuery( instance.options.element );

            instance._super.apply(instance, [instance.options]);

            instance.registerData("busy");

            instance._create();

            instance.registerVibrationOn(['show']);
            instance.fireCallback('create');
        },

        destroy: function() {
            var instance = this;

            instance.overflow.remove();
            instance.loader.remove();

            instance.fireCallback('destroy');
        },

        hide: function() {
            var instance = this;

            instance.overflow.hide();
            instance.loader.hide();

            instance.fireCallback('hide');
        },

        show: function() {
            var instance = this;
            var element = instance.element;

            instance._showOverflow();
            instance._showLoader();

            instance.fireCallback('show');
        },

        _create: function() {
            var instance = this;
            var options = instance.options;
            var element = instance.element;
            var Styles = instance.Styles;

            instance.isBody = (/(html|body)/).test(element[0].tagName.toLowerCase());

            instance.elementHeight = instance.isBody ? window.innerHeight : element.outerHeight();
            instance.elementWidth = instance.isBody ? window.innerWidth : element.outerWidth();

            element.each(function(i, el) {
                Nokia.util.addClass(el, Styles.busy);
            });

            instance._createOverflow();
            instance._createLoader();

            if ( options.autoOpen ) {
                instance.show();
            }
        },

        _createLoader: function(element) {
            var instance = this;
            var options = instance.options;
            var element = instance.element;
            var Styles = instance.Styles;
            var img = options.image;

            if (instance.loader) {
                instance.loader.remove();
            }

            if (options.loaderText) {
                instance.loader = Nokia.dom.parseHTML('<div class="' + Styles.busyTextLoader + '"><div>' + options.loaderText + '</div></div>');
            } else {
                instance.loader = Nokia.dom.parseHTML('<div class="' + Styles.busyLoader +'"></div>');
            }

            instance.loader.css({
                height: options.height,
                width: options.width
            });

            return instance.loader;
        },

        _createOverflow: function(element) {
            var instance = this;
            var element = instance.element;
            var Styles = instance.Styles;

            if (instance.overflow) {
                instance.overflow.remove();
            }

            instance.overflow = Nokia.util.createOverflow();

            return instance.overflow;
        },

        _showLoader: function() {
            var instance = this;
            var element = instance.element;
            var loader = instance.loader;
            var options = instance.options;

            var height = loader.outerHeight() || options.height;
            var width = loader.outerWidth() || options.width;
            var offset = element.offset();

            var overflowHeight = instance.isBody ? window.innerHeight : instance.element.outerHeight();
            var overflowWidth = instance.isBody ? window.innerWidth : instance.element.outerWidth();

            loader.css({
                top: offset.top + (overflowHeight - height) / 2,
                left: offset.left + (overflowWidth - width) / 2
            });

            Nokia.dom.append(document.body, instance.loader);
            loader.show();
        },

        _showOverflow: function() {
            var instance = this;
            var element = instance.element;
            var overflow = instance.overflow;
            var offset = element.offset();

            var overflowHeight = instance.isBody ? window.innerHeight : instance.element.outerHeight();
            var overflowWidth = instance.isBody ? window.innerWidth : instance.element.outerWidth();

            overflow.css({
                top: instance.isBody ? jQuery(window).scrollTop() : offset.top,
                left: offset.left,
                height: overflowHeight,
                width: overflowWidth
            });

            Nokia.dom.append(document.body, instance.overflow);
            overflow[0].style.display = 'block';
        },

        Styles: {
            busy: 'nokia-busy',
            busyLoader: 'nokia-busy-loader',
            busyTextLoader: 'nokia-busy-text-loader',
            nokiaOverflow: 'nokia-overflow'
        }
    });
})();