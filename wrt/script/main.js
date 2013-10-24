/**
 * The main JavaScript file.
 *
 * (c) Copyright 2010 Nokia Corporation. All rights reserved.
 */

var BETA_LABS_URL = "http://betalabs.nokia.com";
var BETA_LABS_API_URL = BETA_LABS_URL + "/access-api";
// See <http://betalabs.nokia.com/access-api/tags>, Platform group, for more
// information
var SUPPORTED_PLATFORMS =
    new Array("S60 3rd Edition", "S60 5th Edition", "Web browser");
var INFO_NOT_AVAILABLE = "N/A";
var DEFAULT_MATURITY = "Stable";
var DEFAULT_STATE = "Current";
var FREE_TEXT = "Free text search";

// The ID of the Beta currently on the screen
var betaId = -1;
// A collection of category check boxes
var cbCategories = [];
// A collection of search results
var searchResults = [];
var betaPollingTimer = null;
// Betas are polled once per day
var BETA_POLLING_INTERVAL = 1000 * 60 * 60 * 24;

// Device resolutions
var RESOLUTION_UNDEFINED = 0;
var RESOLUTION_NHD_PORTRAIT = 1;    // 360x640
var RESOLUTION_NHD_LANDSCAPE = 2;   // 640x360
var RESOLUTION_HOME_SCREEN = 3;     // Home screen
var resolution = RESOLUTION_NHD_PORTRAIT;
var timer = null;

var LATEST_TAB = "tabLatest";
var MOST_POPULAR_TAB = "tabMostPopular";
var SEARCH_TAB = "tabSearch";

var activeTabId = "";

window.onload = init;
window.onresize = windowResized;
window.ononline = onlineModeActivated;
window.onoffline = offlineModeActivated;

// Does initialization tasks for the widget
function init() {
    window.busyIndicator = new Nokia.Busy({
        element: "#busyIndicatorContainer",
        image: "style/themes/nokia/images/busyindicator.gif",
        width: 80,
        height: 81,
        autoOpen: false
    });

    window.ratingElement = new Nokia.Rating({
        element: "#betaRating",
        value: 2
    });

    // Call windowResized manually here, because it isn't called automatically
    // the first time
    windowResized();
    if (window.menu) {
        window.menu.hideSoftkeys();
    }
    
    var tabs = new Nokia.Tabs({
        element: '#tabs',
        itemWidth: '120px',
        animate: 'true',
        selected: 0,
        select: tabSelected
    });

    // The first view is the Latest tab if the home screen is not active
    if (resolution != RESOLUTION_HOME_SCREEN) {
        tabSelected(LATEST_TAB, 0);
    } else {
        activateView("homeScreenView");
    }
}

// Exits the application
function exit() {
    window.close();
}

// Called when the window is resized
function windowResized() {
    var prevResolution = resolution;

    // Detect the new resolution
    detectResolution();
    
    if (resolution == RESOLUTION_NHD_PORTRAIT) {
        setActiveStyleSheet("NHD Portrait");
    } else if (resolution == RESOLUTION_NHD_LANDSCAPE) {
        setActiveStyleSheet("NHD Landscape");
    } else if (resolution == RESOLUTION_HOME_SCREEN) {
        setActiveStyleSheet("Home Screen");
        activateView("homeScreenView");
    } else if (resolution == RESOLUTION_UNDEFINED) {
        // Let's assume an undefined resolution is an NHD resolution
        setActiveStyleSheet("NHD Portrait");
    }
    
    // If the previous resolution was the home screen, let's activate the
    // "Latest" view 
    if (prevResolution == RESOLUTION_HOME_SCREEN) {
        tabSelected(LATEST_TAB, 0);
    }
}

// Detects the current resolution
function detectResolution() {
    var screenWidth = screen.width;
    var screenHeight = screen.height;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    
    if ((windowHeight < (0.75 * screenHeight)) ||
        (windowWidth < (0.75 * screenWidth))) {
        // If the window width or height is less than 75 % of the screen width
        // or height, we assume the home screen view should be active
        resolution = RESOLUTION_HOME_SCREEN;
    } else if (screenWidth == 360 && screenHeight == 640) {
        resolution = RESOLUTION_NHD_PORTRAIT;
    } else if (screenWidth == 640 && screenHeight == 360) {
        resolution = RESOLUTION_NHD_LANDSCAPE;
    } else {
        resolution = RESOLUTION_UNDEFINED;
    }
}

// Called when the widget is set to online mode (network accessible)
function onlineModeActivated() {
    updateStatusIcon("connecting");
    window.busyIndicator.show();
    var func = null;
    if (resolution != RESOLUTION_HOME_SCREEN) {
        func = "getLatest();";
    } else {
        func = "showLatestOnHomeScreen();";
    }
    
    if (betaPollingTimer == null) {
        betaPollingTimer = setInterval(func,
            BETA_POLLING_INTERVAL);
    }
    eval(func);
}

// Called when the widget is set to offline mode (network not accessible)
function offlineModeActivated() {
    updateStatusIcon("disabled");
    window.busyIndicator.hide();
    clearInterval(betaPollingTimer);
    betaPollingTimer = null;
}

// Loads a new status icon to the status info image according to the parameter
function updateStatusIcon(status) {
    document.getElementById("statusInfo").setAttribute("src",
            "gfx/status_icon_" + status + ".png");
}

// Callback that is triggered when a tab is selected
function tabSelected(tab, index) {
    if (!tab) {
        return;
    }
    
    if (index == 0) {
        activeTabId = LATEST_TAB;
        buttonClicked("getLatest");
    } else if (index == 1) {
        activeTabId = MOST_POPULAR_TAB;
        buttonClicked("getMostPopular");
    } else if (index == 2) {
        activeTabId = SEARCH_TAB;
        fetchTags();
    }
}

// Gets the latest betas
function getLatest() {
    window.busyIndicator.show();
    
    var req = createXMLHttpRequest();
    if (req) {
        var url = BETA_LABS_API_URL +
            "/search?state=current&maturity=stable&order=updated";
        loadXMLDoc(req, url, cbSearch);
    }
}

// Gets the most popular betas
function getMostPopular(){
    window.busyIndicator.show();
    
    var req = createXMLHttpRequest();
    if(req) {
        var url = BETA_LABS_API_URL +
            "/search?state=current&maturity=stable&order=rating";
        loadXMLDoc(req, url, cbSearch);
    }
}

// Fetches the tags from the server
function fetchTags() {
    window.busyIndicator.show();

    var req = createXMLHttpRequest();
    
    if (req) {
        var url = BETA_LABS_API_URL + "/tags";
        loadXMLDoc(req, url, cbFetchTags);
    }
}

// Called when the server responds to the fetch tags call
function cbFetchTags(xml, text) {
    if (xml == null) {
        window.busyIndicator.hide();
        alert("Error when fetching tags");
        return;
    }
    
    var categories = xml.childNodes[0].getElementsByTagName("group")[1].getElementsByTagName("tag");
    var categoryAreaElement1 = document.getElementById("categoryAreaCol1");
    var categoryAreaElement2 = document.getElementById("categoryAreaCol2");
    
    categoryAreaElement1.innerHTML = "";
    categoryAreaElement2.innerHTML = ""; 
    
    cbCategories = [];
    for (var i = 0; i < categories.length; i++) {
        var category = categories[i].firstChild.nodeValue;
        var inputElement = document.createElement("input");
        inputElement.setAttribute("type", "checkbox");
        inputElement.setAttribute("id", "cbCat" + i);
        inputElement.setAttribute("name", category);
        inputElement.setAttribute("value", category);
        // Divide the checkboxes into two columns, starting from column 2
        var categoryAreaElement;
        if (i % 2 == 0) {
            categoryAreaElement = categoryAreaElement2;
        } else {
            categoryAreaElement = categoryAreaElement1;
        }
        categoryAreaElement.appendChild(inputElement);

        cbCategories[i] = new Nokia.CheckBox({
            element: "#cbCat" + i,
            label: category,
            wrapper: "div"
        });

        var brElement = document.createElement("br");
        categoryAreaElement.appendChild(brElement);
    }

    // Add event handlers to get notifications of clicking on a checkbox
    var categoryAreaElements = [categoryAreaElement1, categoryAreaElement2];
    for (var i = 0; i < categoryAreaElements.length; i++) {
        var catNodes = categoryAreaElements[i].childNodes;
        for (var j = 0; j < catNodes.length; j++) {
            if (catNodes[j].getAttribute("class") == "nokia-checkbox") {
                catNodes[j].setAttribute("onclick", "checkboxClicked();");
            }
        }
    }
    window.busyIndicator.hide();
    activateView("searchView");
}

// Executes a search with the parameters specified by the user
function searchBetas() {
    window.busyIndicator.show();
    
    var searchView = document.getElementById("betaView");
    var searchSection = document.getElementById("tabSearch");
    searchSection.appendChild(searchView);
        
    var req = createXMLHttpRequest();
    if (!req) {
        // TODO: Error handling
        return;
    }
    
    clearSearchResults();
    
    var freeTextPhrase = document.getElementById("freeText").value;
    if (freeTextPhrase.length == 0 || freeTextPhrase == FREE_TEXT) {
        // Perform a search based on the parameters specified
        
        var strState = "state=" + DEFAULT_STATE;
        strState = strState.toLowerCase();

        var strMaturity = "maturity=" + DEFAULT_MATURITY;

        var strTags = "tags=";
        var categories1 =
            document.getElementById("categoryAreaCol1").getElementsByTagName("input");
        var categories2 =
            document.getElementById("categoryAreaCol2").getElementsByTagName("input");
        var categories = combine(categories1, categories2);
        var strCategory = "";
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].checked) {
                strCategory += categories[i].value + ",";
            }
        }
        
        if (strCategory.length > 0) {
            // Encode the category string into standard HTML URI format
            strCategory = escape(strCategory);
            strTags += strCategory;
        }

        var strPlatforms = "";
        for (var i = 0; i < SUPPORTED_PLATFORMS.length; i++) {
            strPlatforms += SUPPORTED_PLATFORMS[i] + ",";
        }

        if (strPlatforms.length > 0) {
            // Delete the last comma
            strPlatforms = strPlatforms.substring(0, strPlatforms.length - 1);
            // Encode the platform string into standard HTML URI format
            strPlatforms = escape(strPlatforms);
            strTags += strPlatforms;
        }
        
        var strOrder = "order=title";

        var url = BETA_LABS_API_URL + "/search?" + strState +
            "&" + strMaturity + "&" + strTags + "&" + strOrder;
        
        loadXMLDoc(req, url, cbSearch);
    } else {
        // Perform a free text search based on the search phrase written
        // in the text input
        
        // Encode the phrase string into standard HTML URI format
        freeTextPhrase = escape(freeTextPhrase);
        
        var url = BETA_LABS_API_URL + "/search-text/" + freeTextPhrase;
        loadXMLDoc(req, url, cbSearch);
    }
}

// Called when the server responds to the search call
function cbSearch(xml, text) {
    if (xml == null) {
        window.busyIndicator.hide();
        alert("Searching failed");
        return;
    }
    
    var activeTab = document.getElementById(activeTabId);
    var view = document.getElementById("betaView");
    activeTab.appendChild(view);
    
    searchResults = xml.childNodes[0].getElementsByTagName("beta");
    
    if (searchResults.length == 0) {
        document.getElementById("noResultsInfo").removeAttribute("class");
        document.getElementById("betaTable").setAttribute("class", "itemList hidden");
        timer = setTimeout("activateView('searchView')", 4000);
    } else if (searchResults.length == 1) {
        showDetails(searchResults[0]);
    } else {
        document.getElementById("noResultsInfo").setAttribute("class", "hidden");
        
        // Clear all child nodes first
        var list = document.getElementById("betaList");
        if(list.childNodes.length > 0) {
            while (list.childNodes[0]) {
                list.removeChild(list.childNodes[0]);
            }
        }
        
        for (var i = 0; i < searchResults.length; i++) {
            var trElement = document.createElement("tr");
            
            trElement.onclick = createShowDetailsListener(searchResults[i]);
            
            if (i % 2 == 0) {
                trElement.setAttribute("class", "even")
            } else {
                trElement.setAttribute("class", "odd");
            }
    
            var thumbnailSrc = searchResults[i].getElementsByTagName("thumb")[0].firstChild.nodeValue;
            var thumbnailImg = document.createElement("img");
            thumbnailImg.setAttribute("src", thumbnailSrc);
            var thumbnailTd = document.createElement("td");
            thumbnailTd.setAttribute("class", "thumbnailTd");
            thumbnailTd.appendChild(thumbnailImg);
            trElement.appendChild(thumbnailTd);
    
            var title = searchResults[i].getElementsByTagName("title")[0].firstChild.nodeValue;
            var titleText = document.createTextNode(title);
            var titleTd = document.createElement("td");
            titleTd.appendChild(titleText);
            trElement.appendChild(titleTd);
            
            document.getElementById("betaList").appendChild(trElement);
        }
        document.getElementById("betaTable").setAttribute("class", "itemList");
    }
    window.busyIndicator.hide();
}

// Clears the search results
function clearSearchResults() {
    var tableElement = document.getElementById("betaList");
    var itemElements = tableElement.childNodes;
    var itemsToRemove = itemElements.length;
    for (var i = 0; i < itemsToRemove; i++) {
        tableElement.removeChild(itemElements[0]);
    }
}

// Creates a function pointer for showing the details of the element
function createShowDetailsListener(element) {
    return function() { showDetails(element); }
}

// Shows detailed information about the "Beta" (application)
function showDetails(betaNode) {
    var activeTab = document.getElementById(activeTabId);
    
    // Move the detailsView to the currently active tab
    var view = document.getElementById("detailsView");
    activeTab.appendChild(view);
    
    // Move the downloadInfoView to the currently active tab
    var downloadInfoView = document.getElementById("downloadInfoView");
    activeTab.appendChild(downloadInfoView);
    
    betaId = betaNode.getElementsByTagName("id")[0].firstChild.nodeValue;
    
    var req = createXMLHttpRequest();
    if (req) {
        window.busyIndicator.show();
        
        var url = BETA_LABS_API_URL + "/application/" + betaId;
        loadXMLDoc(req, url, cbFetchDetails);
    } else {
        // TODO: Error handling
        return;
    }
}

// Called when the server responds to the fetch details call
function cbFetchDetails(xml, text) {
    if (xml == null) {
        window.busyIndicator.hide();
        alert("Error when fetching details");
        return;
    }
    
    var title = xml.getElementsByTagName("title")[0].firstChild.nodeValue;
    document.getElementById("betaTitle").innerHTML = title;
    
    var imgSrc = xml.getElementsByTagName("image")[0].firstChild.nodeValue;
    document.getElementById("betaImg").setAttribute("src", imgSrc);
    
    var rating = xml.getElementsByTagName("rating")[0].firstChild.nodeValue;
    window.ratingElement.setValue(Math.round(rating));
    
    var overview = xml.getElementsByTagName("overview")[0].firstChild.nodeValue;
    
    var objectStartInd;
    while ((objectStartInd = overview.indexOf("<object")) != -1) {
        var objectEndInd = overview.indexOf("</object>", objectStartInd) + "</object>".length;
        overview = overview.substring(0, objectStartInd) + overview.substring(objectEndInd);
    }
    
    document.getElementById("betaOverview").innerHTML = overview;
    
    // Load the download information into the download info view even though
    // the view has not been activated yet. This saves bandwidth, because
    // no HTTP request is needed to fetch this same information later.
    var downloadNode = xml.getElementsByTagName("download")[0];
    // Download info can be empty. In this case, just mark the component so
    // that the download button can be disabled.
    if (downloadNode.firstChild == undefined) {
        document.getElementById("betaDownloadInfo").innerHTML = INFO_NOT_AVAILABLE;
    } else {
        var downloadInfo = downloadNode.firstChild.nodeValue;
        document.getElementById("betaDownloadInfo").innerHTML = downloadInfo;
    }
    
    window.busyIndicator.hide();
    activateView("detailsView");
}

// Fetches the reviews (user comments) from the server
function fetchReviews() {
    var req = createXMLHttpRequest();
    if (req) {
        window.busyIndicator.show();

        var url = BETA_LABS_URL + "/forums/" + betaId + "/rss?type=review";
        loadXMLDoc(req, url, cbFetchReviews);
    } else {
        alert("Unable to get reviews for this widget.");
        window.busyIndicator.hide();
        return;
    }
}

// Called when the server responds to the fetch reviews call
function cbFetchReviews(xml, text) {
    if (xml == null) {
        window.busyIndicator.hide();
        alert("Unable to get reviews for this widget.");
        return;
    }
    
    var activeTab = document.getElementById(activeTabId);
    var view = document.getElementById("reviewView");
    activeTab.appendChild(view);

    var reviewsContainer = document.getElementById("betaReviews");
    reviewsContainer.innerHTML = "";

    var reviewItems = xml.getElementsByTagName("item");
    for (var i = 0; i < reviewItems.length; i++) {
        var title = reviewItems[i].getElementsByTagName("title")[0].firstChild.nodeValue;
        var link = reviewItems[i].getElementsByTagName("link")[0].firstChild.nodeValue;
        var titleElement = document.createElement("h2");
        var anchorElement = document.createElement("a");
        anchorElement.href = link;
        anchorElement.innerHTML = title;
        titleElement.appendChild(anchorElement);
        reviewsContainer.appendChild(titleElement);

        var pubDate = reviewItems[i].getElementsByTagName("pubDate")[0].firstChild.nodeValue;
        var dateElement = document.createElement("p");
        dateElement.innerHTML = pubDate;
        reviewsContainer.appendChild(dateElement);
        
        var desc = reviewItems[i].getElementsByTagName("description")[0].firstChild.nodeValue;
        var descElement = document.createElement("div");
        descElement.innerHTML = desc;
        reviewsContainer.appendChild(descElement);
    }

    window.busyIndicator.hide();

    if (reviewItems.length == 0) {
        reviewsContainer.innerHTML = "<p class='noReviews'>No reviews available.</p>";
    }
    activateView("reviewView");
}

// Shows the latest Betas on the home screen
function showLatestOnHomeScreen() {
    if (resolution != RESOLUTION_HOME_SCREEN) {
        return;
    }

    // Get the latest Betas
    window.busyIndicator.show();
    
    var req = createXMLHttpRequest();
    if (req) {
        var url = BETA_LABS_API_URL +
            "/search?state=current&maturity=stable&order=updated";
        loadXMLDoc(req, url, cbShowLatestOnHomeScreen);
    }
}

// Called when the server responds to the search call (from
// showLatestOnHomeScreen())
function cbShowLatestOnHomeScreen(xml, text) {
    if (xml == null) {
        document.getElementById("homeScreenInfo").removeAttribute("class");
        window.busyIndicator.hide();
        return;
    }

    updateStatusIcon("active");

    searchResults = xml.childNodes[0].getElementsByTagName("beta");
    
    if (searchResults.length == 0) {
        document.getElementById("homeScreenInfo").removeAttribute("class");
    } else {
        document.getElementById("homeScreenInfo").setAttribute("class",
            "hidden");
        
        var thumbnailSrc = searchResults[0].getElementsByTagName("thumb")[0].firstChild.nodeValue;
        document.getElementById("homeScreenImg").setAttribute("src", thumbnailSrc);
    
        var title = searchResults[0].getElementsByTagName("title")[0].firstChild.nodeValue;
        document.getElementById("homeScreenTitle").innerHTML =
            "Latest:<br />" + clip(title, 60);
    }
    
    window.busyIndicator.hide();
}

// Called when a checkbox has been clicked
function checkboxClicked() {
    // If all checkboxes have been checked, change the toggle button to
    // "Unselect all categories"
    var checkboxesChecked = 0;
    for (var i = 0; i < cbCategories.length; i++) {
        if (cbCategories[i].isChecked()) {
            checkboxesChecked++;
        }
    }
    if (checkboxesChecked == cbCategories.length) {
        document.getElementById("btnSelect").setAttribute("class", "hidden");
        document.getElementById("btnUnselect").removeAttribute("class");
    } else {
        document.getElementById("btnUnselect").setAttribute("class", "hidden");
        document.getElementById("btnSelect").removeAttribute("class");
    }
}

// Clears the free text phrase
function clearText() {
    document.getElementById("freeText").value = "";
}

// Checks all category boxes
function checkBoxes(){
    for (var i = 0; i < cbCategories.length; i++) {
        cbCategories[i].check();
    }
    document.getElementById("btnSelect").setAttribute("class", "hidden");
    document.getElementById("btnUnselect").removeAttribute("class");
}

// Unchecks all category boxes
function uncheckBoxes() {    
    for (var i = 0; i < cbCategories.length; i++) {
        cbCategories[i].uncheck();
    }
    document.getElementById("btnUnselect").setAttribute("class", "hidden");
    document.getElementById("btnSelect").removeAttribute("class");
}

// Activates a view (see the HTML file)
function activateView(view) {
    document.getElementById("searchView").setAttribute("class", "view hidden");
    document.getElementById("betaView").setAttribute("class", "view hidden");
    document.getElementById("detailsView").setAttribute("class", "view hidden");
    document.getElementById("downloadInfoView").setAttribute("class", "view hidden");
    document.getElementById("reviewView").setAttribute("class", "view hidden");
    document.getElementById("homeScreenView").setAttribute("class", "view hidden");
    
    switch (view) {
        case "searchView":
            // Activate the search view
            document.getElementById("searchView").setAttribute("class", "view");
            document.getElementById("btnBack").setAttribute("class", "hidden");
            document.getElementById("btnExit").removeAttribute("class");
            document.getElementById("tabsMenu").removeAttribute("class");
            document.getElementById("topBar").setAttribute("class", "topFixed bottomSeparator");
            document.getElementById("noResultsInfo").setAttribute("class", "hidden");
            uncheckBoxes();
            break;
        case "betaView":
            // Activate the Beta view
            document.getElementById("betaView").setAttribute("class", "view");
            document.getElementById("tabsMenu").removeAttribute("class");
            if (activeTabId == LATEST_TAB || activeTabId == MOST_POPULAR_TAB) {
                document.getElementById("btnBack").setAttribute("class", "hidden");
                document.getElementById("btnExit").removeAttribute("class");
            } else if (activeTabId == SEARCH_TAB) {
                document.getElementById("btnBack").removeAttribute("class");
                document.getElementById("btnBack").setAttribute("onclick", "buttonClicked('backBeta');");
                document.getElementById("btnExit").setAttribute("class", "hidden");
            }
            document.getElementById("topBar").setAttribute("class", "topFixed bottomSeparator");
            break;
        case "detailsView":
            // Activate the details view
            document.getElementById("detailsView").setAttribute("class", "view");
            document.getElementById("btnBack").removeAttribute("class");
            document.getElementById("btnBack").setAttribute("onclick", "buttonClicked('backDetails');");
            document.getElementById("btnExit").setAttribute("class", "hidden");
            document.getElementById("topBar").setAttribute("class", "topFixed bottomSeparator");
            document.getElementById("tabsMenu").setAttribute("class", "hidden");
            // If download info is not available or could not be fetched, disable
            // the download button
            if (document.getElementById("betaDownloadInfo").innerHTML == INFO_NOT_AVAILABLE) {
                document.getElementById("btnDownload").setAttribute("class", "hidden");
                document.getElementById("btnDownloadDisabled").removeAttribute("class");
            } else {
                document.getElementById("btnDownloadDisabled").setAttribute("class", "hidden");
                document.getElementById("btnDownload").removeAttribute("class");
            }
            break;
        case "downloadInfoView":
            // Activate the download info view
            document.getElementById("downloadInfoView").setAttribute("class", "view");
            document.getElementById("btnBack").removeAttribute("class");
            document.getElementById("btnBack").setAttribute("onclick", "buttonClicked('backDownloadInfo');");
            document.getElementById("btnExit").setAttribute("class", "hidden");
            document.getElementById("tabsMenu").setAttribute("class", "hidden");
            document.getElementById("topBar").setAttribute("class", "topFixed bottomSeparator");
            break;
        case "reviewView":
            // Activate the review view
            document.getElementById("reviewView").setAttribute("class", "view");
            document.getElementById("btnBack").removeAttribute("class");
            document.getElementById("btnBack").setAttribute("onclick", "buttonClicked('backReview');");
            document.getElementById("btnExit").setAttribute("class", "hidden");
            document.getElementById("tabsMenu").setAttribute("class", "hidden");
            document.getElementById("topBar").setAttribute("class", "topFixed bottomSeparator");
            break;
        case "homeScreenView":
            // Activate the home screen view
            document.getElementById("homeScreenView").setAttribute("class", "view");
            showLatestOnHomeScreen();
            break;
    }
}

// Called when a button is clicked
function buttonClicked(button) {
    window.busyIndicator.hide();
    
    switch (button) {
        case "search":
            searchBetas();
            activateView("betaView");
            break;
        case "backBeta":
            activateView("searchView");
            break;
        case "download":
            activateView("downloadInfoView");
            break;
        case "backDetails":
            // If there is more than one search result, activate the beta view;
            // otherwise, activate the search view
            if (searchResults.length > 1) {
                activateView("betaView");
            } else {
                clearTimeout(timer);
                activateView("searchView");
            }
            break;
        case "backDownloadInfo":
            activateView("detailsView");
            break;
        case "backReview":
            activateView("detailsView");
            break;
        case "getLatest":
            if (betaPollingTimer == null) {
                betaPollingTimer = setInterval("getLatest()",
                    BETA_POLLING_INTERVAL);
            }
            getLatest();
            activateView("betaView");
            break;
        case "getMostPopular":
            getMostPopular();
            activateView("betaView");
            break;
    }
}

// Called when the logo is clicked
function logoClicked() {
    window.busyIndicator.hide();
    tabSelected(LATEST_TAB, 0);
}
