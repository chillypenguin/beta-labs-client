(function() {
    Nokia.Widget = new Nokia.Class({
        initialize: function(options) {
            var instance = this;

            instance.registerVibration = [];
            instance.defaultVibraval = 50;
            instance.defaultVibratime = 150;

            if (options && options.element) {
                instance.element = jQuery(options.element);
            }
        },

        registerData: function(name) {
            var instance = this;
            var options = instance.options;

            if (options && options.element) {
                instance.element = jQuery(options.element);

                instance.element.data(name, instance);
            }
        },

        setDefaultVibraval: function(value) {
            var instance = this;
            instance.defaultVibraval = value;
        },

        setDefaultVibratime: function(value) {
            var instance = this;
            instance.defaultVibratime = value;
        },

        getDefaultVibraval: function() {
            var instance = this;
            return instance.defaultVibraval;
        },

        getDefaultVibratime: function() {
            var instance = this;
            return instance.defaultVibratime;
        },

        setRightSoftkeyLabel: function(message, callback) {
            Nokia.device.setRightSoftkeyLabel.apply(this, arguments);
        },

        setLeftSoftkeyLabel: function(message, callback) {
            Nokia.device.setLeftSoftkeyLabel.apply(this, arguments);
        },

        getWrapper: function() {
            var instance = this;

            return instance.wrapper;
        },

        vibrate: function(vibraval, vibratime) {
            Nokia.device.vibrate.apply(this, arguments);
        },

        maximize: function(selector) {
            return Nokia.util.maximize.apply(this, arguments);
        },

        fireCallback: function(type) {
            var instance = this;
            var options = instance.options;
            var registerVibration = instance.registerVibration;

            if (jQuery.isFunction(options[type])) {
                var args = Array.prototype.slice.call(arguments, 1);

                options[type].apply(instance, args);

                if (registerVibration && jQuery.inArray(type, registerVibration) != -1) {
                    instance.vibrate(instance.getDefaultVibraval(), instance.getDefaultVibratime());
                }
            }
        },

        registerVibrationOn: function(types) {
            var instance = this;
            instance.registerVibration = types;
        },

        openURL: function(url) {
            if ( window.widget ) {
                widget.openURL(url);
            }
        },

        setOption: function(option, value) {
            var instance = this;

            instance.options[option] = value;
        },

        note: function(html) {
            var instance = this;

            if (!instance._noteDialog) {
                var container = Nokia.dom.parseHTML('<div></div>');

                instance._noteWrapper = Nokia.dom.parseHTML('<div></div>');

                Nokia.dom.append(document.body, container);
                Nokia.dom.append(container, instance._noteWrapper);

                instance._noteDialog = new Nokia.LightBox({
                    element: container,
                    height: '50%',
                    width: '50%',
                    buttonClose: true,
                    buttons: {
                        'Ok': function() {
                            this.close();
                        }
                    }
                });
            }

            var contentWrapper = Nokia.dom.parseHTML('<p></p>');
            var content = Nokia.dom.parseHTML(html);

            Nokia.dom.append(contentWrapper, content);
            Nokia.dom.append(instance._noteWrapper.empty(), contentWrapper);

            instance._noteDialog.open();
        },

        advice: function(html, timeout) {
            var instance = this;
            var timeout = timeout || 2000;

            if (!instance._adviceDialog) {
                var container = Nokia.dom.parseHTML('<div></div>');

                instance._adviceWrapper = Nokia.dom.parseHTML('<div></div>');

                Nokia.dom.append(document.body, container);
                Nokia.dom.append(container, instance._adviceWrapper);

                instance._adviceDialog = new Nokia.LightBox({
                    element: container,
                    height: '50%',
                    width: '50%',
                    buttonClose: true
                });
            }

            var contentWrapper = Nokia.dom.parseHTML('<p></p>');
            var content = Nokia.dom.parseHTML(html);

            Nokia.dom.append(contentWrapper, content);
            Nokia.dom.append(instance._adviceWrapper.empty(), contentWrapper);

            instance._adviceDialog.open();

            setTimeout(function(){
                instance._adviceDialog.close();
            }, timeout);
        },

        progress: function(time) {
            var instance = this;

            if (!instance._progressDialog) {
                var content = Nokia.dom.parseHTML('<div style="padding: 15px;"></div>');
                var progressBar = Nokia.dom.parseHTML('<div></div>');

                Nokia.dom.append(document.body, content);
                Nokia.dom.append(content, progressBar);

                instance._progress = new Nokia.ProgressBar({
                    element: progressBar,
                    label: true,
                    width: '200px',
                    complete: function() {
                        instance._progressDialog.close();

                        clearInterval(instance._progressThread);
                    }
                });

                instance._progressDialog = new Nokia.LightBox({
                    element: content,
                    height: '70px',
                    width: '232px'
                });

            }

            instance._progress.setValue(0);
            instance._progressDialog.open();

            instance._progressThread = setInterval(function() {
                instance._progress.setValue(instance._progress.getValue() + 5);
            }, parseInt(time/20, 10));

        },

        showLoading: function(loaderText) {
            var instance = this;

            if (!instance._loading) {
                instance._loading = new Nokia.Busy({
                    element: document.body,
                    loaderText: loaderText
                });
            }

            instance._loading.show();
        },

        hideLoading: function() {
            var instance = this;

            if (instance._loading) {
                instance._loading.hide();
            }
        }
    });

    Nokia.RoundedCornerWidget = Nokia.Widget.extend({
        setBorderColor: function() {
            var instance = this;
            var wrapper = instance.wrapper;
            var args = arguments;
            var color = args[0];
            var length = args.length;

            if (length == 2) {
                color = args[1];
                wrapper = args[0];
            }

            Nokia.util.changeRoundedCornersColor(wrapper, color);
        }
    });
})();