(function() {
    Nokia.Rating = Nokia.Widget.extend({
        initialize: function(options) {
            var instance = this;

            var defaults = {
                stars: 5,
                value: 0,
                readonly: false
            };

            instance.options = jQuery.extend(defaults, options);

            instance.element = jQuery( instance.options.element );

            instance._super.apply(instance, [instance.options]);

            instance.registerData("rating");

            instance._create();

            instance._setValue(instance.options.value);

            instance.registerVibrationOn([ ]);

            instance.fireCallback('create');
        },

        getValue: function() {
            var instance = this;

            return instance.value;
        },

        setValue: function(value) {
            var instance = this;

            instance._setValue(value);
        },

        _create: function() {
            var instance = this;
            var options = instance.options;
            var stars = options.stars;
            var element = instance.element;
            var Styles = instance.Styles;

            element.each(function(i, el) {
                Nokia.util.addClass(el, Styles.rating);
            });

            for ( var i = 1; i < stars + 1; i++ ) {
                (function(i) {
                    var starEl = Nokia.dom.parseHTML('<a href="javascript:void(0);" class="nokia-rating-star"></a>');

                    if (!options.readonly) {

                        var action = function(e) {
                            instance._setValue(i, true);
                            instance.fireCallback('change', e, i);

                            return false;
                        };

                        starEl.bind('click.rating', action);
                        Nokia.util.bindEnter(starEl, action);

                        starEl.hover(function() {
                            Nokia.util.addClass(this, Styles.stateHover);
                        }, function() {
                            Nokia.util.removeClass(this, Styles.stateHover);
                        });

                    }

                    element.append(starEl);
                })(i);
            }

        },

        _setValue: function(value, isClick) {
            var instance = this;
            var Styles = instance.Styles;
            var options = instance.options;
            var element = instance.element;
            var stars = element.find('.' + Styles.star);

            if (value > options.stars) {
                value = options.stars;
            }

            if (isClick && value == 1 && instance.value == 1) {
                Nokia.util.toggleClass(stars[0], Styles.starFull);
                Nokia.util.toggleClass(stars[0], Styles.stateHover);

                instance.value = 0;

                return;
            }

            instance.value = value;

            stars.each(function(i, star) {
                if ( i < value) {
                    Nokia.util.addClass(star, Styles.starFull);
                    return;
                }
                Nokia.util.removeClass(star, Styles.starFull);
            });
        },

        Styles: {
            rating: 'nokia-rating',
            star: 'nokia-rating-star',
            starFull: 'nokia-rating-star-full',
            stateHover: 'nokia-rating-star-full-hover'
        }
    });
})();