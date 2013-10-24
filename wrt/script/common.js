/**
 * Utility functions.
 *
 * (c) Copyright 2009 Nokia Corporation. All rights reserved.
 */

// Sets the active stylesheet for the HTML document according to the specified
// title.
function setActiveStyleSheet(title) {
    var stylesheets = document.getElementsByTagName("link");
    for (var i = 0; i < stylesheets.length; i++) {
        var stylesheet = stylesheets[i];
        // If the stylesheet doesn't contain the title attribute, assume it's
        // a persistent stylesheet and should not be disabled
        if (!stylesheet.getAttribute("title")) {
            continue;
        }
        // All other stylesheets than the one specified by "title" should be
        // disabled
        if (stylesheet.getAttribute("title") != title) {
            stylesheet.disabled = true;
        } else {
            stylesheet.disabled = false;
        }
    }
}

// Combines two arrays into one.
function combine(array1, array2) {
    var array = [];
    var i = 0;
    for (; i < array1.length; i++) {
        array[i] = array1[i];
    }
    for (var j = 0; j < array2.length; j++, i++) {
        array[i] = array2[j];
    }
    return array;
}

// Shortens a string so that it is of specified length
function clip(str, len) {
    if (str.length <= len) {
        return str;
    }
    return str.substr(0, len) + "...";
}
