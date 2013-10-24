(function() {
    Nokia.extend(Nokia.dom,
        {
            domEl: function(element) {
                return jQuery(element)[0];
            },

            append: function(target, element) {
                target = Nokia.dom.domEl(target);
                element = Nokia.dom.domEl(element);

                target.appendChild(element);
            },

            prepend: function(target, element) {
                target = Nokia.dom.domEl(target);
                element = Nokia.dom.domEl(element);

                target.insertBefore(element, target.firstChild);
            },

            insertBefore: function(target, element) {
                target = Nokia.dom.domEl(target);
                element = Nokia.dom.domEl(element);

                target.parentNode.insertBefore(element, target);
            },

            insertAfter: function(target, element) {
                target = Nokia.dom.domEl(target);
                element = Nokia.dom.domEl(element);

                target.parentNode.insertBefore(element, target.nextSibling);
            },

            remove: function(element) {
                element = Nokia.dom.domEl(element);
                element.parentNode.removeChild(element);
            },

            wrap: function(target, element) {
                Nokia.dom.insertBefore(element, target);
                Nokia.dom.append(target, element);
            },

            parseHTML: function(html) {
                var temp = document.createElement('div');

                if (html.jquery) {
                    return html;
                }

                try {
                    temp.innerHTML = html;
                    return jQuery(temp.childNodes);
                }
                catch(err) {}
                finally {
                    temp = null;
                }
            }
        }
    );
})();