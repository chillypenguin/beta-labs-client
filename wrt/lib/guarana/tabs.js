(function(){Nokia.Tabs=Nokia.Widget.extend({initialize:function(b){var a=this;var c={animation:false,itemWidth:"120px",maximize:true,selected:0,scrollDelay:250};a.options=jQuery.extend(c,b);a.element=jQuery(a.options.element);a._super.apply(a,[a.options]);a.registerData("tabs");a._create();a._attachEvents();a.registerVibrationOn([]);a.fireCallback("create")},_attachEvents:function(){var a=this;var b=a.options;jQuery(window).bind("resize",function(){a.listContainer.scrollTo(0,b.scrollDelay,function(){a._updateExtraTabs()})})},_create:function(){var k=this;var c=k.element;var l=k.options;var a=k.Styles;var g=jQuery("ul",c);var i=g.find("li");k.list=g;if(l.maximize){Nokia.util.maximize(c)}Nokia.util.addClass(c[0],a.tabs);var d=Nokia.dom.parseHTML('<div class="'+a.tabsListWrapper+'"></div>');Nokia.dom.wrap(d,g);k.listWrapper=d;var h=Nokia.dom.parseHTML('<div class="'+a.tabsListContainer+'"></div>');Nokia.dom.wrap(h,d);var f=Nokia.dom.parseHTML('<a href="javascript:void(0);" class="'+[a.tabsDropDownWrapper,a.tabsItem].join(" ")+'"></a>');Nokia.dom.append("body",f);k.dropDownWrapper=f;var b=Nokia.dom.parseHTML('<a href="javascript:void(0);" class="'+[a.tabsDropDown,a.uiStateDefault].join(" ")+'"></a>');Nokia.dom.append(f,b);Nokia.util.applyRoundedCorners(b,"","top");b.bind("click",function(){Nokia.util.show(k.extraTabsContainer[0])});Nokia.util.bindEnter(b,function(){Nokia.util.show(k.extraTabsContainer[0])});k.dropDown=b;var j=Nokia.dom.parseHTML('<div class="'+[a.tabsArrow,a.tabsArrowRight].join(" ")+'"></div>');Nokia.dom.append(b,j);k.listContainer=h;k.contents=jQuery([]);k.links=jQuery([]);Nokia.util.addClass(g[0],[a.uiClearfix].join(" "));i.each(function(o,n){Nokia.util.addClass(n,[a.tabsItem].join(" "));var r=jQuery(n);var q=r.find("a:first");Nokia.util.addClass(q[0],[a.uiStateDefault].join(" "));k.links=k.links.add(q);Nokia.util.applyRoundedCorners(q,"","top");q.bind("click.tabs",function(s){k.select(k.links.index(q),s)});Nokia.util.bindEnter(q,function(){k.select(k.links.index(q),event)});q.bind("focus.tabs",function(){var t=jQuery(k.contents[o]).is(":visible");if(t){Nokia.util.removeClass(q[0],[a.uiStateActive].join(" "))}Nokia.util.addClass(q[0],[a.uiStateHover].join(" "));var s=r.find("> ."+a.borderTop);Nokia.util.addClass(s[0],a.borderStateHover)});q.bind("blur.tabs",function(){var t=jQuery(k.contents[o]).is(":visible");if(t){Nokia.util.addClass(q[0],[a.uiStateActive].join(" "))}Nokia.util.removeClass(q[0],[a.uiStateHover].join(" "));var s=r.find("> ."+a.borderTop);Nokia.util.removeClass(s[0],a.borderStateHover)});q.hover(function(){jQuery(this).trigger("focus.tabs")},function(){jQuery(this).trigger("blur.tabs")});var m=q.attr("href");var p=jQuery(m,c);k.contents=k.contents.add(p);Nokia.util.addClass(p[0],[a.tabsContent,a.uiWidgetContent,a.uiClearfix].join(" "));r.width(l.itemWidth)});k._createExtraTabsContainer();k.select(l.selected)},_createExtraTabsContainer:function(){var a=this;var b=a.Styles;var c=Nokia.dom.parseHTML('<div class="'+[b.tabsItem,b.tabsExtraTabsContainer,b.uiStateDefault].join(" ")+'"></div>');Nokia.dom.append("body",c);a.extraTabsContainer=c},_updateExtraTabs:function(){var a=this;var g=a.Styles;var d=a.element;var c=a.list.find("li");a.isOut=false;Nokia.util.hide(a.extraTabsContainer[0]);Nokia.util.hide(a.dropDownWrapper[0]);a.extraTabsContainer[0].innerHTML="";var i=d.offset();var h=d.outerWidth();var b=0;var f=a.listContainer.scrollLeft();jQuery.each(c,function(n,o){var k=jQuery(o);var j=k.offset().left;var p=k.outerWidth();if(j>i.left+h||j+f<f+i.left){var l=k.find("a:first");var m=Nokia.dom.parseHTML('<a href="javascript:void(0);" class="'+g.tabsOutTabItem+'">'+l[0].innerHTML+"</a>");Nokia.dom.append(a.extraTabsContainer,m);m.bind("click",function(q){a.select(n,q);Nokia.util.hide(a.extraTabsContainer[0])});Nokia.util.bindEnter(m,function(){a.select(n,e);Nokia.util.hide(a.extraTabsContainer[0])});b++}});if(b>0){a.isOut=true;Nokia.util.show(a.dropDownWrapper[0])}},_updateScroll:function(c){var a=this;var b=a.options;a.listContainer.scrollTo(a.selectedItem,b.scrollDelay,function(){if(c){c.apply(a,[])}})},select:function(d,b){var j=this;var k=j.options;var i=j.element;var f=j.Styles;var h;jQuery.each(j.contents,function(l,m){Nokia.util.hide(m)});if(typeof d==="number"){h=jQuery(j.contents[d])}else{if(typeof d==="object"&&jQuery.inArray(jQuery(d).get(0),j.contents)>-1){h=jQuery(d)}else{h=jQuery(j.contents[0])}}if(j.selectedItem){Nokia.util.removeClass(j.selectedItem[0],f.tabsItemSelected);var a=j.selectedItem.find("> a");Nokia.util.removeClass(a[0],f.uiStateActive);var c=j.selectedItem.find("> ."+f.borderTop);Nokia.util.removeClass(c[0],f.borderStateActive)}var a=jQuery(j.links[j.contents.index(h)]);Nokia.util.addClass(a[0],f.uiStateActive);var g=a.parents("."+f.tabsItem);Nokia.util.addClass(g[0],f.tabsItemSelected);var c=g.find("> ."+f.borderTop);Nokia.util.addClass(c[0],f.borderStateActive);j.selectedItem=g;if(j.isOut){j._updateScroll(function(){j._updateExtraTabs()})}else{j._updateExtraTabs()}if(k.animation){Nokia.util.fadeIn(h)}else{Nokia.util.show(h[0])}j.fireCallback("select",b,d)},Styles:{borderStateActive:"nokia-border-state-active",borderStateDefault:"nokia-border-state-default",borderStateHover:"nokia-border-state-hover",borderTop:"nokia-border-top",tabs:"nokia-tabs",tabsItem:"nokia-tabs-item",tabsItemSelected:"nokia-tabs-item-selected",tabsContent:"nokia-tabs-content",tabsListContainer:"nokia-tabs-list-container",tabsListWrapper:"nokia-tabs-list-wrapper",tabsDropDown:"nokia-tabs-dropdown",tabsDropDownWrapper:"nokia-tabs-dropdown-wrapper",tabsExtraTabsContainer:"nokia-tabs-extra-tabs",tabsOutTabItem:"nokia-tabs-outtab-item",tabsArrow:"nokia-tabs-arrow",tabsArrowRight:"nokia-tabs-arrow-right",uiClearfix:"ui-helper-clearfix",uiStateDefault:"ui-state-default",uiStateActive:"ui-state-active",uiStateHover:"ui-state-hover",uiIcon:"ui-icon",uiIconTriagleW:"ui-icon-triangle-1-w",uiIconTriagleE:"ui-icon-triangle-1-e",uiIconTriagleS:"ui-icon-triangle-1-s",uiStateDisabled:"ui-state-disabled",uiWidgetContent:"ui-widget-content"}})})();