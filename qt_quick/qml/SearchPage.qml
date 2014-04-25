/**
 * Copyright (c) 2011-2014 Microsoft Mobile.
 * All rights reserved.
 *
 * For the applicable distribution terms see the license text file included in
 * the distribution.
 */

import QtQuick 1.1
import com.nokia.symbian 1.1
import com.nokia.extras 1.1

import "../script/ajax.js" as AjaxScript
import "../script/common.js" as CommonScript

// Search page
Page {
    id: searchPage
    anchors.fill: parent
    tools: toolBarLayout

    Component.onCompleted: fetchTags();

    Background { anchors.fill: parent }

    Label {
        id: errorTextsearchPage
        width: parent.width - 20
        anchors.centerIn: parent
        opacity: 0
        platformInverted: window.platformInverted
        wrapMode: "WordWrap"
        text: "Unable to fetch tags. Ensure that your device is connected to the Internet."
    }

    AdContainer {
        anchors {
            top: parent.top
            horizontalCenter: parent.horizontalCenter
            topMargin: 5
        }
    }

    // Category item containing the text and a check box
    Component {
        id: categoryItem

        Item {
            width: parent.width
            height: checkBox.height

            Row {
                anchors.fill: parent

                Label {
                    width: parent.width - checkBox.width - 10; // 10 px margin
                    height: parent.height
                    platformInverted: window.platformInverted
                    verticalAlignment: Text.AlignVCenter
                    text: category
                }
                CheckBox {
                    id: checkBox
                    checked: cbChecked
                    platformInverted: true
                    onClicked: checkBoxClicked(index);
                }
            }

            MouseArea {
                anchors.fill: parent;
                onClicked: checkBoxClicked(index);
            }
        }
    }

    // Model containing the search categories
    ListModel {
        id: categoryModel
    }

    // The container for the whole page content
    Flickable {
        id: flickable
        anchors.fill: parent
        contentHeight: searchTopBar.height + searchBoxContainer.height
                       + categoryView.height + toggleCategoriesButton.height + 40
        interactive: contentHeight > height

        TopBar {
            id: searchTopBar
            width: parent.width
            height: 70
            titleImage: "qrc:/gfx/title_search.png"
        }

        // Search box and a button for starting the search
        Image {
            id: searchBoxContainer
            height: searchBox.height

            anchors {
                top: searchTopBar.bottom
                left: parent.left
                right: parent.right
            }

            source: "qrc:/gfx/searchbox-bg.png"

            Row {
                width: parent.width
                height: parent.height

                anchors {
                    fill: parent
                    leftMargin: 10
                    rightMargin: 10
                }

                SearchBox {
                    id: searchBox
                    width: parent.width - startSearchButton.width
                    placeHolderText: CommonScript.FREE_TEXT
                    platformInverted: true
                }
                Button {
                    id: startSearchButton
                    y: (parent.height - height) / 2
                    text: qsTr("Search");
                    platformInverted: true

                    onClicked: {
                        if (!searchPage.pageStack.busy) {
                            searchBetas();
                        }
                    }
                }
            }
        }

        // Category view
        ListView {
            id: categoryView
            property int delegateHeight: 42
            width: parent.width
            height: delegateHeight * 7

            anchors {
                top: searchBoxContainer.bottom
                left: parent.left
                right: parent.right
                margins: 10
            }

            model: categoryModel
            delegate: categoryItem
            interactive: false
        }

        // Toggle categories button
        Button {
            id: toggleCategoriesButton
            width: 300

            anchors {
                top: categoryView.bottom
                horizontalCenter: parent.horizontalCenter
                topMargin: 10
            }

            visible: categoryView.count > 0
            text: "Unselect all categories"
            platformInverted: true
            onClicked: toggleCheckBoxes();
        }
    }
    ScrollDecorator {
        flickableItem: flickable
    }

    // Workaround for bug QTCOMPONENTS-1178
    // (https://bugreports.qt.nokia.com/browse/QTCOMPONENTS-1178). Forces the
    // highlight to search button. When the bug is fixed, this function is no
    // longer needed.
    function updateToolBarHighlight()
    {
        tabButtonRow.checkedButton = searchButton;
    }

    // Called when a checkbox is clicked.
    function checkBoxClicked(index)
    {
        var currentItem = categoryModel.get(index);
        currentItem.cbChecked = !currentItem.cbChecked;

        // If all checkboxes have been checked, change the toggle button to
        // "Unselect all categories"
        var checkboxesChecked = 0;

        for (var i = 0; i < categoryModel.count; i++) {
            var item = categoryModel.get(i);

            if (item.cbChecked) {
                checkboxesChecked++;
            }
        }
        if (checkboxesChecked == categoryModel.count) {
            toggleCategoriesButton.text = "Unselect all categories";
        }
        else {
            toggleCategoriesButton.text = "Select all categories";
        }
    }

    // Checks or unchecks all checkboxes based on the current state of the
    // toggle button.
    function toggleCheckBoxes()
    {
        if (toggleCategoriesButton.text == "Unselect all categories") {
            for (var i = 0; i < categoryModel.count; i++) {
                var item = categoryModel.get(i);
                item.cbChecked = false;
            }

            toggleCategoriesButton.text = "Select all categories";
        }
        else {
            for (var i = 0; i < categoryModel.count; i++) {
                var item = categoryModel.get(i);
                item.cbChecked = true;
            }

            toggleCategoriesButton.text = "Unselect all categories";
        }
    }

    // Fetches the tags (categories) from the server.
    function fetchTags()
    {
        var req = AjaxScript.createXMLHttpRequest();

        if (req) {
            var url = CommonScript.BETA_LABS_API_URL + "/tags";
            AjaxScript.loadXMLDoc(req, url, cbFetchTags);
        }
    }

    // Called when the server responds to the fetch tags call.
    function cbFetchTags(xml, text)
    {
        busyIndicator.opacity = 0;

        if (xml === null) {
            errorTextsearchPage.opacity = 1;
            return;
        }

        errorTextsearchPage.opacity = 0;

        var groups =
            CommonScript.getElementsByTagName(xml.documentElement, "group");
        var categories = CommonScript.getElementsByTagName(groups[1], "tag");

        for (var i = 0; i < categories.length; i++) {
            var category = categories[i].firstChild.nodeValue;
            categoryModel.append({"category": category, "cbChecked": true});
        }
    }

    // Searches betas based either on the search phrase or on the search
    // parameters.
    function searchBetas() {
        var resultsPage = searchPage.pageStack.push(Qt.resolvedUrl("ResultsPage.qml"));

        var freeTextPhrase = searchBox.searchText;
        if (freeTextPhrase.length !== 0 &&
                freeTextPhrase != CommonScript.FREE_TEXT) {
            // Perform a free text search based on the search phrase written
            // in the text input.
            resultsPage.resultsBetaView.getBasedOnFreeText(freeTextPhrase);
        } else {
            // Perform a search based on the parameters specified.
            var searchTags = createSearchTags();
            resultsPage.resultsBetaView.getBasedOnTags(searchTags);
        }
    }

    // Creates a string of tags that can be used to search beta applications.
    function createSearchTags()
    {
        var strTags = "";
        var strCategory = "";

        // Iterate through the checkboxes.
        for (var i = 0; i < categoryModel.count; i++) {
            var item = categoryModel.get(i);

            if (item.cbChecked) {
                // Remove commas from the categories, because they cause
                // incorrect search results with QtWebKit. Note, however,
                // that removing commas may render some categories useless.
                strCategory += item.category.replace(",", "") + ",";
            }
        }

        if (strCategory.length > 0) {
            strTags += strCategory;
        }

        var strPlatforms = "";

        for (var i = 0; i < CommonScript.SUPPORTED_PLATFORMS.length; i++) {
            strPlatforms += CommonScript.SUPPORTED_PLATFORMS[i] + ",";
        }

        if (strPlatforms.length > 0) {
            // Delete the last comma
            strPlatforms = strPlatforms.substring(0, strPlatforms.length - 1);
            strTags += strPlatforms;
        }

        return strTags;
    }
}
