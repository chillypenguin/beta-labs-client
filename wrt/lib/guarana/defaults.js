;(function() {
	window.NOKIA_PATH_BASE = '../../';
	window.NOKIA_PATH_JAVASCRIPT = NOKIA_PATH_BASE + 'src/';
	window.NOKIA_PATH_STYLE_ROOT = NOKIA_PATH_BASE + 'themes/nokia/base/';

	var BLANK = '';

	window.NOKIA_DEFAULTS = {
		modules: {

			/*
			* Base
			*/
			'base': {
				getPath: function() { return BLANK; },
				requires: ['dom', 'util', 'device', 'animation']
			},

			'base-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'base.css'; },
				type: 'css'
			},

			/*
			* Animation
			*/
			'animation': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'animation.js'; }
			},

			/*
			* Device
			*/
			'device': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'device.js'; }
			},

			/*
			* DOM
			*/
			'dom': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'dom.js'; }
			},

			/*
			* Util
			*/
			'util': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'util.js'; }
			},

			/*
			* Widget
			*/
			'widget': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'widget.js'; },
				requires: ['base']
			},

			/*
			* Accordion
			*/
			'accordion': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'accordion.js'; },
				requires: ['widget', 'accordion-css']
			},

			'accordion-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'accordion.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* Busy
			*/
			'busy': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'busy.js'; },
				requires: ['widget', 'busy-css']
			},

			'busy-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'busy.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* Button
			*/
			'button': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'button.js'; },
				requires: ['widget', 'button-css']
			},

			'button-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'button.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* Carousel
			*/
			'carousel': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'carousel.js'; },
				requires: ['widget', 'carousel-css']
			},

			'carousel-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'carousel.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* Checkbox
			*/
			'checkbox': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'checkbox.js'; },
				requires: ['optionbox', 'checkbox-css']
			},

			'checkbox-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'checkbox.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* CustomizableList
			*/
			'customizablelist': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'customizablelist.js'; },
				requires: ['widget', 'customizablelist-css']
			},

			'customizablelist-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'customizablelist.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* DatePicker
			*/
			'datepicker': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'datepicker.js'; },
				requires: ['widget', 'datepicker-css']
			},

			'datepicker-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'datepicker.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* DropDown
			*/
			'dropdown': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'dropdown.js'; },
				requires: ['widget', 'dropdown-css']
			},

			'dropdown-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'dropdown.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* IconicMenu
			*/
			'iconicmenu': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'iconicmenu.js'; },
				requires: ['widget', 'iconicmenu-css']
			},

			'iconicmenu-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'iconicmenu.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* ImageDescription
			*/
			'imagedescription': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'imagedescription.js'; },
				requires: ['widget', 'imagedescription-css']
			},

			'imagedescription-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'imagedescription.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* LightBox
			*/
			'lightbox': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'lightbox.js'; },
				requires: ['widget', 'lightbox-css']
			},

			'lightbox-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'lightbox.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* MiniView
			*/
			'miniview': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'miniview.js'; },
				requires: ['widget', 'miniview-css']
			},

			'miniview-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'miniview.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* OptionBox
			*/
			'optionbox': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'optionbox.js'; },
				requires: ['widget']
			},

			/*
			* OptionGroup
			*/
			'optiongroup': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'optiongroup.js'; },
				requires: ['widget', 'optiongroup-css']
			},

			'optiongroup-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'optiongroup.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* OptionsMenu
			*/
			'optionsmenu': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'optionsmenu.js'; },
				requires: ['widget', 'optionsmenu-css']
			},

			'optionsmenu-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'optionsmenu.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* ProgressBar
			*/
			'progressbar': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'progressbar.js'; },
				requires: ['widget', 'progressbar-css']
			},

			'progressbar-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'progressbar.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* RadioBox
			*/
			'radiobox': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'radiobox.js'; },
				requires: ['optionbox', 'radiobox-css']
			},

			'radiobox-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'radiobox.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* Rating
			*/
			'rating': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'rating.js'; },
				requires: ['widget', 'rating-css']
			},

			'rating-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'rating.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* Scroll
			*/
			'scroll': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'scroll.js'; },
				requires: ['widget', 'scroll-css']
			},

			'scroll-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'scroll.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* Sortable
			*/
			'sortable': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'sortable.js'; },
				requires: ['widget', 'sortable-css']
			},

			'sortable-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'sortable.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* Tabs
			*/
			'tabs': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'tabs.js'; },
				requires: ['widget', 'tabs-css']
			},

			'tabs-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'tabs.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* TextLabel
			*/
			'textlabel': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'textlabel.js'; },
				requires: ['widget', 'textlabel-css']
			},

			'textlabel-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'textlabel.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* TextLink
			*/
			'textlink': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'textlink.js'; },
				requires: ['widget', 'textlink-css']
			},

			'textlink-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'textlink.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* ToolTip
			*/
			'tooltip': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'tooltip.js'; },
				requires: ['widget', 'tooltip-css']
			},

			'tooltip-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'tooltip.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* TransitionList
			*/
			'transitionlist': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'transitionlist.js'; },
				requires: ['widget', 'transitionlist-css']
			},

			'transitionlist-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'transitionlist.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* ViewManager
			*/
			'viewmanager': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'viewmanager.js'; },
				requires: ['view']
			},

			/*
			* View
			*/
			'view': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'view.js'; },
				requires: ['dom']
			},

			/*
			* Template
			*/
			'template': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'template.js'; },
				requires: ['dom', 'viewmanager']
			},

			'template-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'template.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* Template Default
			*/
			'template-default': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'templatedefault.js'; },
				requires: ['template', 'iconicmenu', 'topbar', 'floatingmenu', 'template-default-css']
			},

			'template-default-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'templatedefault.css'; },
				type: 'css',
				requires: ['template-css']
			},

			/*
			* Top Bar
			*/
			'topbar': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'topbar.js'; },
				requires: ['widget', 'topbar-css']
			},

			'topbar-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'topbar.css'; },
				type: 'css',
				requires: ['base-css']
			},

			/*
			* Floating Menu
			*/
			'floatingmenu': {
				getPath: function() { return NOKIA_PATH_JAVASCRIPT + 'floatingmenu.js'; },
				requires: ['widget', 'floatingmenu-css']
			},

			'floatingmenu-css': {
				getPath: function() { return NOKIA_PATH_STYLE_ROOT + 'floatingmenu.css'; },
				type: 'css',
				requires: ['base-css']
			}

		}
	}
})();