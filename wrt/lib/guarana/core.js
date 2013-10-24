;window.Nokia || (function() {

    window.Nokia = {
        version: '0.1',
        extend: jQuery.extend
    };

    // Nokia.Class

    Nokia.Class = function(properties) {
        var instance = this;

        var superclass = instance;

        if (typeof properties == 'function') {
            var initialize = properties;

            properties = properties.prototype;

            properties.initialize = initialize;

            superclass = initialize.superclass || superclass;
        }

        if (!properties.implement) {
            properties.implement = function(options) {
                var instance = this;

                var args = Array.prototype.slice.call(arguments, 0);

                args.unshift(instance);
                Nokia.extend.apply(instance, args);

                return instance;
            };
        }

        var Class = function(args) {
            if (this instanceof arguments.callee) {
                var instance = this;

                if (typeof properties == 'function') {
                    var initialize = properties;

                    properties = properties.prototype;

                    properties.initialize = initialize;
                }

                var formalArguments = arguments,
                    firstArgument = arguments[0];

                if (args && args.callee) {
                    formalArguments = args;

                    if (formalArguments[0]) {
                        firstArgument = formalArguments[0];
                    }
                }

                if (firstArgument != 'noinit' && instance.initialize) {
                    return instance.initialize.apply(instance, formalArguments);
                }
            }
            else {
                return new arguments.callee(arguments);
            }
        };

        Class.extend = this.extend;
        Class.implement = this.implement;
        Class.prototype = properties;

        Class.prototype.superclass = superclass;
        Class.superclass = superclass;

        Class.prototype.constructor = Class.prototype.constructor || Class;
        Class.constructor = Class.constructor || Class;

        return Class;
    };

    Nokia.Class.prototype = {
        extend: function(properties) {
            var instance = this;

            var proto = new instance('noinit');

            for (var property in properties) {
                var previous = proto[property];
                var current = properties[property];

                if (previous && typeof previous == 'function' && previous != current) {
                    current = Nokia.Class.createSuper(previous, current) || current;
                }

                proto[property] = current;
            }

            var Class = new Nokia.Class(proto);

            Class.prototype.superclass = instance;
            Class.superclass = instance;

            Class.prototype.constructor = Class.prototype.constructor || Class;
            Class.constructor = Class.constructor || Class;

            return Class;
        },

        implement: function(properties) {
            var instance = this;

            for (var property in properties) {
                instance.prototype[property] = properties[property];
            }
        }
    };

    // Array Util

    Array.prototype.unique = function () {
        var r = new Array();
        o:for(var i = 0, n = this.length; i < n; i++)
        {
            for(var x = 0, y = r.length; x < y; x++)
            {
                if(r[x]==this[i])
                {
                    continue o;
                }
            }
            r[r.length] = this[i];
        }
        return r;
    };

    Nokia.Class.createSuper = function(previous, current) {
        return function() {
            this._super = previous;

            return current.apply(this, arguments);
        }
    };

    Nokia.namespace = function(namespace) {
            var levels = namespace.split(".");
            var curLevel = Nokia;
            for (var i = (levels[0] == "Nokia") ? 1 : 0; i < levels.length; i++) {
                    curLevel[levels[i]] = curLevel[levels[i]] || {};
                    curLevel = curLevel[levels[i]];
            };
            return curLevel;
    };

    Nokia.injectSysinfoEmbed = function() {
        var isSymbian = /symbian/ig.test(navigator.userAgent);
        if ( isSymbian && jQuery('embed[type=application/x-systeminfo-widget]').size() == 0 ) {
            jQuery('body').append('<embed type="application/x-systeminfo-widget" hidden="yes"></embed>');
        }
    };

    Nokia.Load = function(options) {
        var instance = this;

        var defaults = {
            async: true,
            cache: true,
            dataType: "script",
            modules: [],
            type: "GET"
        },

        options = jQuery.extend(defaults, options);

        var complete = options.complete, error = options.error,
            modules = options.modules;

        if (modules) {

            var getThreadsByURL = function(findURL) {
                return jQuery.grep(Nokia.__waitingThreads, function(thread) {
                    return thread.path == findURL;
                });
            };

            var loadModule = function(threadModules, count) {

                var currentModule = threadModules[count],
                    type = currentModule.type

                var url;

                // fullPath has higher priority
                if (currentModule.fullPath) {
                    url = currentModule.fullPath;
                } else {
                    url = currentModule.getPath();
                }

                options = jQuery.extend(options, {
                    url: url,
                    error: function(data) {
                        if (error) error.apply(this, [url, data]);
                    },
                    success: function() {

                        Nokia.__lazyCache[url] = true;

                    },
                    complete: function() {

                        var loadedThreads = getThreadsByURL(url);

                        jQuery.each(loadedThreads, function(i, thread) {

                            if (thread.isLast && thread.complete) {
                                thread.complete.apply(instance, []);
                            } else {
                                thread.callback.apply(instance, []);
                            }

                        });

                        // Remove loaded threads
                        Nokia.__waitingThreads = jQuery.grep(Nokia.__waitingThreads, function(curThread) {
                            return curThread.path != url;
                        });

                    }
                });

                var isLast = modules.length - 1 == count;
                var alreadyInQueue = getThreadsByURL(url).length > 0;

                var pos = jQuery.inArray(currentModule, modules);

                var modulePath;

                // fullPath has higher priority
                if ( modules[pos].fullPath) {
                    modulePath =  modules[pos].fullPath;
                } else {
                    modulePath =  modules[pos].getPath();
                }

                Nokia.__waitingThreads.push({
                    path: modulePath,
                    count: pos,
                    isLast: isLast,
                    callback: function() {
                        loadModule.apply(instance, [modules, pos + 1]);
                    },
                    complete: isLast ? complete : false
                });

                // CSS Loading
                if (type == 'css') {

                    if (!alreadyInQueue && !Nokia.__lazyCache[url]) {
                        var head = jQuery('head'),
                            target = head.find('> *[nokialoadded!="true"]:first'),
                            link = jQuery('<link nokialoadded="true" rel="stylesheet" />').attr('href', url);

                        head[0].insertBefore(link[0], target[0]);
                    }

                    options.success.apply(this, [url, null]);
                    options.complete.apply(this, [url, null]);

                // Javascript Loading
                } else {

                    if (!Nokia.__lazyCache[url]) {

                        if (!alreadyInQueue) {

                            try {
                                netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
                            } catch (e) {};

                            jQuery.ajax(jQuery.extend({}, options));
                        }

                    } else {
                        options.success.apply(this, [url, null]);
                        options.complete.apply(this, [url, null]);
                    }

                }
            };

            // Start Loading
            loadModule(modules, 0);

        }

    };

    Nokia.listDependencies = function(moduleObject, array) {
        var dependencies = array || [],
            requirements = moduleObject['requires'];

        if (requirements) {

            jQuery.each(requirements, function(i, requirement) {
                var requirementModule = NOKIA_DEFAULTS.modules[requirement];

                Nokia.listDependencies(requirementModule, dependencies);
            });

        }

        if (moduleObject.fullPath || moduleObject.getPath()) {
            if (jQuery.inArray(moduleObject, dependencies) == -1) {
                dependencies.push(moduleObject);
            }
        }

        return dependencies;
    };

    Nokia.use = function() {
        var callback = arguments[arguments.length - 1];

        var dependencies = [];

        jQuery.each(arguments, function(i, module) {

            if (typeof module == 'string') {

                if (module == '*') {

                    jQuery.each(NOKIA_DEFAULTS.modules, function(curModule) {
                        var moduleMap = NOKIA_DEFAULTS.modules[curModule];

                        dependencies = dependencies.concat( Nokia.listDependencies(moduleMap) );
                    });

                } else {

                    var moduleMap = NOKIA_DEFAULTS.modules[module];

                    dependencies = dependencies.concat( Nokia.listDependencies(moduleMap) );

                }

            }

        });

        Nokia.Load({
            modules: dependencies.unique(),
            complete: function() {
                if (callback) {
                    callback.apply(window, []);
                }
            }
        });

    };

    Nokia.addModule = function(name, module) {

        NOKIA_DEFAULTS.modules[name] = module;

    };

    Nokia.showSplash = function(html) {

        Nokia.use('base-css', function() {

            Nokia.use('dom', function() {

                Nokia.splash = Nokia.dom.parseHTML('<div class="nokia-overflow"></div>');

                Nokia.splash.css({
                    position: 'absolute',
                    width: window.innerWidth,
                    height: window.innerHeight,
                    top: 0,
                    left: 0
                });

                Nokia.dom.append(document.body, Nokia.splash);

                if (html) {

                    var splashHTML = Nokia.dom.parseHTML(html);

                    Nokia.dom.append(Nokia.splash, splashHTML);

                    splashHTML.css({
                        position: 'absolute',
                        top: (Nokia.splash.height() - splashHTML.height()) / 2,
                        left: (Nokia.splash.width() - splashHTML.width()) / 2
                    });

                }

            });

        });

    };

    Nokia.hideSplash = function() {

        if (Nokia.splash) {
            Nokia.splash.remove();
        }

    };

    Nokia.__waitingThreads = [];

    Nokia.__lazyCache = {};

    Nokia.injectSysinfoEmbed();

    Nokia.__counter = 0;

    Nokia.namespace("Nokia.animation");
    Nokia.namespace("Nokia.device");
    Nokia.namespace("Nokia.dom");
    Nokia.namespace("Nokia.util");

})();