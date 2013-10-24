(function() {
    var STRING_BLANK = "";

    var ENTER_CODE = 63557;

    Nokia.extend(Nokia.util,
        {
            bindEnter: function(element, callback) {

                jQuery(element).bind('keypress', function(event) {

                    if (event.keyCode == ENTER_CODE) {
                        callback.apply(this, [event]);
                    }

                });

            },

            injectWBRTags: function(str, r) {
                if (!str) {
                    return STRING_BLANK;
                }

                r = r || 15;
                var t = str.length, out = STRING_BLANK;

                for (var i = 0; i < Math.ceil(t/r); i++)
                    out = [ out, [str.slice(i*r, i*r+r), i*r+r >= t ? "" : "<wbr/>"].join("") ].join("");

                return out;
            },

            setVoidHref: function(selector) {
                jQuery(selector).attr('href', 'javascript:void(0);');
            },

            maximize: function(selector) {
                var el = jQuery(selector);

                return el.css({
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    padding: 0,
                    margin: 0,
                    border: 0,
                    top: 0,
                    left: 0
                });
            },

            htmlUnentity: function(html) {
                var element = jQuery('<textarea></textarea>');
                var html = element.html(html).val();
                element = null;
                return html;
            },

            removeCDATA: function(text) {
                return jQuery.trim([text].join('').replace('<![CDATA[', '').replace(']]>', ''));
            },

            toggleClass: function(el, classe) {
                var className = el.className;
                var hasClass = jQuery.inArray(classe, className.split(' ')) > -1, outClass;

                if (hasClass) {
                    Nokia.util.removeClass(el, classe);
                }
                else {
                    Nokia.util.addClass(el, classe);
                }

            },

            addClass: function(el, classe) {
                var className = el.className;
                var hasClass = jQuery.inArray(classe, className.split(' ')) > -1, outClass;

                if ( !hasClass ) {
                    outClass = [className, classe].join(' ');

                    el.className = jQuery.trim(outClass);
                }

            },

            removeClass: function(el, classe) {
                var className = el.className;
                var hasClass = jQuery.inArray(classe, className.split(' ')) > -1, outClass;

                if ( hasClass ) {
                    outClass = className.replace(classe, '');

                    el.className = jQuery.trim(outClass);
                }

            },

            addBorderClass: function(container, stateClass) {
                var borders = container.find('.nokia-border-top, .nokia-border-bottom');

                borders.addClass( stateClass );
            },

            removeBorderClass: function(container, stateClass) {
                var borders = container.find('.nokia-border-top, .nokia-border-bottom');

                borders.removeClass( stateClass );
            },

            enableSelection: function(selector) {
                jQuery(selector)
                    .attr('unselectable', 'off')
                    .css('MozUserSelect', '')
                    .unbind('selectstart.ui');
            },

            disableSelection: function(selector) {
                jQuery(selector)
                    .attr('unselectable', 'on')
                    .css('MozUserSelect', 'none')
                    .bind('selectstart.ui', function() { return false; });
            },

            arrayRemove: function(array, from, to) {
              var rest = array.slice((to || from) + 1 || array.length);
              array.length = from < 0 ? array.length + from : from;
              return array.push.apply(array, rest);
            },

            isNumber: function(value) {
                return !isNaN(parseInt(value, 10));
            },

            applyRoundedCorners: function(selector, state, direction, applyStateInternally) {
                var container = jQuery(selector);
                var uiState = state || 'nokia-border-state-default';

                var boxTopBorder = Nokia.dom.parseHTML('<b class="nokia-border-top"><b class="nokia-b1"></b><b class="nokia-b2"></b><b class="nokia-b3"></b><b class="nokia-b4"></b></b>');
                var boxBottomBorder = Nokia.dom.parseHTML('<b class="nokia-border-bottom"><b class="nokia-b4"></b><b class="nokia-b3"></b><b class="nokia-b2"></b><b class="nokia-b1"></b></b>');

                if (applyStateInternally) {
                    boxTopBorder.find('b').addClass(uiState);
                    boxBottomBorder.find('b').addClass(uiState);
                }
                else {
                    boxTopBorder.addClass(uiState);
                    boxBottomBorder.addClass(uiState);
                }

                container.addClass('nokia-border-content');

                direction = direction || 'top bottom';

                if (/top/i.test(direction)) {
                    Nokia.dom.insertBefore(container, boxTopBorder);
                }

                if (/bottom/i.test(direction)) {
                    Nokia.dom.insertAfter(container, boxBottomBorder);
                }

            },

            hide: function(element) {
                Nokia.util.addClass(element, 'nokia-hidden');
            },

            show: function(element) {
                Nokia.util.removeClass(element, 'nokia-hidden');
            },

            shadow: function(selector) {
                var container = Nokia.dom.parseHTML('<div class="nokia-shadow"></div>');
                var el = jQuery(selector);
                var width = el.width();
                var height = el.height();

                container.appendTo('body');

                var top = Nokia.dom.parseHTML('<div class="nokia-shadow-top"><div class="nokia-shadow-tl"></div><div class="nokia-shadow-tc"></div><div class="nokia-shadow-tr"></div></div>');
                var middle = Nokia.dom.parseHTML('<div class="nokia-shadow-middle"><div class="nokia-shadow-ml"></div><div class="nokia-shadow-mc"></div><div class="nokia-shadow-mr"></div></div>');
                var bottom = Nokia.dom.parseHTML('<div class="nokia-shadow-bottom"><div class="nokia-shadow-bl"></div><div class="nokia-shadow-bc"></div><div class="nokia-shadow-br"></div></div>');

                container.append(top);
                container.append(middle);
                container.append(bottom);

                container.find('.nokia-shadow-tc,.nokia-shadow-mc,.nokia-shadow-bc').width(width + 4);
                container.find('.nokia-shadow-middle').height(height + 4);

                container.height(height);
                container.width(width + 16);

                container.css({
                    top: el.offset().top - 8,
                    left: el.offset().left - 8,
                    width: width + 16,
                    height: height + 16,
                    display: 'block',
                    zIndex: 99
                });

                el.css('z-index', 100);
            },

            createOverflow: function(visible) {
                var instance = this;
                var Styles = instance.Styles;

                var overflow = Nokia.dom.parseHTML('<div class="nokia-overflow"></div>');
                Nokia.dom.append('body', overflow);

                if (!visible) {
                    overflow.hide();
                }

                window.addEventListener('resize',function() {
                    Nokia.util.maximize(overflow);
                }, false);

                Nokia.util.maximize(overflow);

                return overflow;
            }

        }
    );
})();