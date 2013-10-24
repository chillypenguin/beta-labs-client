/**
 * Utility functions. Common to all QML files.
 *
 * (c) Copyright 2011 Nokia Corporation. All rights reserved.
 */

var BETA_LABS_URL = "http://betalabs.nokia.com";
var BETA_LABS_API_URL = BETA_LABS_URL + "/access-api";
var DEFAULT_MATURITY = "Stable";
var DEFAULT_STATE = "Current";
var FREE_TEXT = "Free text search";
var SUPPORTED_PLATFORMS =
    new Array("S60 3rd Edition", "S60 5th Edition", "Web browser");

// There's no getElementsByTagName method in QML
// ([http://www.mail-archive.com/qt-qml@trolltech.com/msg01024.html]), so we'll
// implement our own version.
function getElementsByTagName(rootElement, tagName) {
    var childNodes = rootElement.childNodes;
    var elements = [];
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeName == tagName) {
            elements.push(childNodes[i]);
        }
    }
    return elements;
}
