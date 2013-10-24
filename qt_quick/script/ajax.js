/**
 * AJAX-related functions.
 *
 * (c) Copyright 2011 Nokia Corporation. All rights reserved.
 */

// Creates an XMLHttpRequest object
function createXMLHttpRequest() {
    var req = null;

    try {
        req = new XMLHttpRequest();
        // Make sure that the browser supports overrideMimeType
        if (typeof req.overrideMimeType != "undefined") {
            req.overrideMimeType("text/xml");
        }
    } catch (ex) {
        req = null;
    }

    return req;
}

// Loads target XML document into XMLHttpRequest
function loadXMLDoc(req, url, callback) {
    // Register a callback function which gets called when the request state
    // changes
    req.onreadystatechange = function() {
        processStateChange(req, callback);
    };
    // Open an asynchronous (asyncFlag = true) request to the specified URL
    req.open("GET", url, true);
    // Transmit the request
    req.send(null);
}

// Processes state changes of XMLHttpRequest
function processStateChange(req, callback) {
    // Request states are 0 through 4, where 4 equals complete
    if (req.readyState == 4) {
        // Server returns numeric code 200 for "OK".
        if (req.status == 200) {
            callback(req.responseXML, req.responseText);
        } else {
            callback(null, null);
        }
    }
}
