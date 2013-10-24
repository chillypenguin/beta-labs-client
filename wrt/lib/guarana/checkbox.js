(function() {
    Nokia.CheckBox = Nokia.OptionBox.extend({
        initialize: function(options) {
            var instance = this;

            instance.componentNamespace = 'checkbox';

            var defaults = {
                wrapper: 'div',
                disableLabelSelection: true
            };

            instance.options = jQuery.extend(defaults, options);

            instance._super.apply(instance, [instance.options]);

            instance.registerData("checkbox");

            instance._attachEvents();

            instance._loadDefaultStatus();

            instance.registerVibrationOn([ 'check', 'uncheck' ]);

            instance.fireCallback('create');
        },

        _attachEvents: function() {
            var instance = this;
            var element = instance.element;
            var options = instance.options;
            var wrapper = instance.wrapper;

            wrapper.bind('mouseenter.checkbox', function(event) {
                wrapper.addClass(instance.Styles.pushedClass);
            });

            var action = function(event) {
                instance.toggle(event);
            };

            wrapper.bind('click.checkbox', action);
            Nokia.util.bindEnter(wrapper, action);

            wrapper.bind('mouseleave.checkbox', function(event) {
                wrapper.removeClass(instance.Styles.pushedClass);
            });
        },

        toggle: function(event) {
            var instance = this;

            if (instance.isChecked()) {
                instance.uncheck(event);
            }
            else {
                instance.check(event);
            }

            instance.fireCallback('toggle', event);
        },

        Styles: {
            iconClass: 'nokia-checkbox-icon',
            labelClass: 'nokia-checkbox-label',
            prefixBaseClass: 'nokia-checkbox-',
            pushedClass: 'nokia-checkbox-pushed',
            wrapperClass: 'nokia-checkbox'
        }
    });
})();