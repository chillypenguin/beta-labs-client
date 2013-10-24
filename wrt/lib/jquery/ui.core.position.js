/*
 * jQuery 1.2.6 - New Wave Javascript
 *
 * Copyright (c) 2008 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Permission is hereby granted, free of charge, to any person obtaining   
 * a copy of this software and associated documentation files (the 
 * "Software"), to deal in the Software without restriction, including     
 * without limitation the rights to use, copy, modify, merge, publish,     
 * distribute, sublicense, and/or sell copies of the Software, and to      
 * permit persons to whom the Software is furnished to do so, subject to   
 * the following conditions:       
 *                
 * The above copyright notice and this permission notice shall be  
 * included in all copies or substantial portions of the Software. 
 *                
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF      
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND   
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE  
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION  
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION   
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
;(function($) {
    
    $.fn.extend({

        scrollParent: function() {
    
            var scrollParent;
            if(($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
                scrollParent = this.parents().filter(function() {
                    return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
                }).eq(0);
            } else {
                scrollParent = this.parents().filter(function() {
                    return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
                }).eq(0);
            }
    
            return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
        }
    
    });
    
    $.fn.positionAround = function(event, o) {
    
        var options = $.extend({
            around: 'mouse',
            direction: 'default',
            forceDirection: false,
            offset: [0, 0]
        }, o);
    
        var leftOffset  = 0,
            topOffset   = 0,
            height      = this[0].offsetHeight,
            width       = this[0].offsetWidth,
            op          = this.offsetParent(),
            sp          = $(this.scrollParent().length ? this.scrollParent() : document.body),
            spBorderTop = parseInt(op.css('borderTopWidth'),10),
            spBorderLeft= parseInt(op.css('borderLeftWidth'),10),
            opBorderTop = parseInt(op.css('borderTopWidth'),10),
            opBorderLeft= parseInt(op.css('borderLeftWidth'),10),
            opOffset    = op.offset()
            //spOffset  = sp.offset()
        ;
    
        //Ugly fix for the issues of offset related to the body element
        opOffset = (/(html|body)/).test(op[0].tagName.toLowerCase()) ? { top: 0, left: 0 } : opOffset;
        spOffset = (/(html|body)/).test(op[0].tagName.toLowerCase()) ? { top: 0, left: 0 } : spOffset;
    
        var bottomEdge = (/(html|body)/).test(op[0].tagName.toLowerCase()) ? $(window).height() : spOffset.top + spBorderTop + sp.height();
        var rightEdge = (/(html|body)/).test(op[0].tagName.toLowerCase()) ? $(window).width() : spOffset.left + spBorderLeft + sp.width();
    
        if($(options.around).length && $(options.around)[0].nodeName) { //If around is an element
    
            var element = $(options.around),
                offset = element.offset(),
                relHeight = element[0].offsetHeight,
                relWidth = element[0].offsetWidth
            ;
    
            if((/(left|right)/).test(options.direction)) {
    
                leftOffset = ( options.direction == 'left' ? (offset.left - spOffset.left - spBorderLeft > width || options.forceDirection) : (rightEdge-offset.left-relWidth < width && !options.forceDirection) ) ? -(width) : relWidth;
                topOffset = event ? ( bottomEdge - offset.top < height ? -(height-relHeight) : 0 ) : 0;
            } else {
                topOffset = ( options.direction == 'above' ? (offset.top - spOffset.top - spBorderTop  > height || options.forceDirection) : (bottomEdge-offset.top-relHeight < height && !options.forceDirection) ) ? -(height) : relHeight;
            }
    
            this.css({
                left: offset.left - opOffset.left - opBorderLeft + leftOffset + options.offset[0],
                top: offset.top - opOffset.top - opBorderTop + topOffset + options.offset[1]
            });
    
        } else {
    
            if((/(below|default)/).test(options.direction)) {
                topOffset = bottomEdge - event.pageY < height && !options.forceDirection ? -(height) : 0;
            } else if ((/above/).test(options.direction)) {
                topOffset = (event.pageY - spOffset.top - spBorderTop) > height || options.forceDirection ? -(height) : 0;
            }
    
            if((/(right|default)/).test(options.direction)) {
                leftOffset = rightEdge - event.pageX < width && !options.forceDirection ? -(width) : 0;
            } else if ((/left/).test(options.direction)) {
                leftOffset = (event.pageX - spOffset.left - spBorderLeft) > width || options.forceDirection ? -(width) : 0;
            }
    
            this.css({
                left: event.pageX - opOffset.left - opBorderLeft + leftOffset + options.offset[0],
                top: event.pageY - opOffset.top - opBorderTop + topOffset + options.offset[1]
            });
    
        }
    
    };
    
})(jQuery);