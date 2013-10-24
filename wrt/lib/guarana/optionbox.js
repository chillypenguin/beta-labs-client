(function() {
    Nokia.OptionBox = Nokia.Widget.extend({
        initialize: function(options) {
            var instance = this;

            var defaults = {
                wrapper: 'div',
                disableLabelSelection: true,
                checked: false
            };

            instance.options = jQuery.extend(defaults, options);

            instance._super.apply(instance, [instance.options]);

            instance._applyStyle();
        },

        isChecked: function() {
            var instance = this;
            return instance.element.is(':checked');
        },

        push: function(event) {
            var instance = this;
            var wrapper = instance.wrapper;

            wrapper.addClass(instance.Styles.pushedClass);

            instance.fireCallback('push', event);
        },

        check: function(event) {
            var instance = this;
            var element = instance.element;
            var wrapper = instance.wrapper;
            var icon = wrapper.find('.' + instance.Styles.iconClass);

            wrapper.removeClass(instance.Styles.pushedClass);

            icon.removeClass();
            icon.addClass('nokia-icon ' + instance.Styles.iconClass);
            icon.addClass(instance.Styles.prefixBaseClass + 'checked');

            element[0].checked = true;

            instance.fireCallback('check', event);
        },

        uncheck: function(event) {
            var instance = this;
            var element = instance.element;
            var wrapper = instance.wrapper;
            var icon = wrapper.find('.' + instance.Styles.iconClass);

            wrapper.removeClass(instance.Styles.pushedClass);

            icon.removeClass();
            icon.addClass('nokia-icon ' + instance.Styles.iconClass);
            icon.addClass(instance.Styles.prefixBaseClass + 'unchecked');

            element[0].checked = false;

            instance.fireCallback('uncheck', event);
        },

        _loadDefaultStatus: function() {
            var instance = this;

            if (instance.isChecked()) {
                instance.check();
            }
            else {
                instance.uncheck();
            }
        },

        _applyStyle: function() {
            var instance = this;
            var element = instance.element;
            var options = instance.options;
            var label = options.label;

            element.attr('checked', options.checked);

            var wrapperHTML = '<a class="ui-helper-clearfix" href="javascript:void(0);"></a>';

            if (/span/i.test(options.wrapper)) {
                wrapperHTML = '<span></span>'
            }

            instance.wrapper = Nokia.dom.parseHTML(wrapperHTML);

            instance.wrapper.addClass(instance.Styles.wrapperClass);

            instance.wrapper[0].innerHTML = '<div class="nokia-icon ' + instance.Styles.iconClass + '"></div><div class="' + instance.Styles.labelClass + '"></div>';

            if (label) {
                instance.wrapper.find('.' + instance.Styles.labelClass).html(label);
            }

            Nokia.dom.insertBefore(element, instance.wrapper);

            Nokia.dom.append(instance.wrapper, element);

            element.hide();

            // simulating display: block; when the wrapper is a div
            if (options.wrapper.toLowerCase() == 'div') {
                var br = Nokia.dom.parseHTML('<br class="nokia-clear" />');
                Nokia.dom.append(instance.wrapper, br);
            }

            if (options.disableLabelSelection) {
                Nokia.util.disableSelection(instance.wrapper);
            }
        },

        Styles: {
            iconClass: '',
            labelClass: '',
            prefixBaseClass: '',
            pushedClass: '',
            wrapperClass: ''
        }
    });
})();