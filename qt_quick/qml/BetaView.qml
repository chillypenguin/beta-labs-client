/**
 * Copyright (c) 2011-2014 Microsoft Mobile.
 * All rights reserved.
 *
 * For the applicable distribution terms see the license text file included in
 * the distribution.
 */

import QtQuick 1.1
import com.nokia.symbian 1.1
import "inneractive"

import "../script/common.js" as CommonScript

Item {
    id: betaViewContainer

    // Signalled when an item is selected from the list.
    signal itemClicked(int id);

    Label {
        id: noResultsInfo
        width: parent.width - 20
        anchors.centerIn: parent
        opacity: 0
        platformInverted: window.platformInverted
        font.pixelSize: platformStyle.fontSizeLarge
        wrapMode: "WordWrap"
        text: "No search results found matching your search criteria."
    }

    XmlListModel {
        id: betaModel
        query: "/betalist/beta"

        XmlRole {
            name: "id"
            query: "id/string()"
        }
        XmlRole {
            name: "title"
            query: "title/string()"
        }
        XmlRole {
            name: "thumb"
            query: "thumb/string()"
        }

        onStatusChanged: {
            if (status == XmlListModel.Loading) {
                busyIndicator.opacity = 1;
            }
            else {
                busyIndicator.opacity = 0;

                // If there are no search results, tell it to the user.
                if (betaListView.count == 0) {
                    noResultsInfo.opacity = 1;
                }
                else {
                    noResultsInfo.opacity = 0;
                }
            }
        }
    }

    // A delegate for the list view.
    // Can contain an add.
    Component {
        id: betaItem

        Item {
            width: parent.width
            height: adListItem.visible ?
                        (adListItem.height + betaListItem.height) :
                        betaListItem.height;

            // The ad
            ListItem {
                id: adListItem
                width: parent.width
                height: 60

                // The first and every seventh list item contains an ad
                visible: index % 7 === 0;

                subItemIndicator: false

                // Background to show while the ad is loaded: border and a
                // placeholder image
                Image {
                    anchors.fill: parent
                    fillMode: Image.Tile
                    source: "qrc:/gfx/ad-placeholder.png"
                }
                Rectangle {
                    height: 1
                    width: parent.width
                    anchors.top: parent.top
                    color: "#44000000"
                }

                AdItem {
                    id: adItem
                    anchors.fill: parent
                    showText: false
                    scaleAd: true

                    parameters: AdParameters {
                        applicationId: "Test_BetaLabsClient_OVI";
                    }
                }
            }

            // The actual list item
            ListItem {
                id: betaListItem
                width: parent.width
                height: 70
                anchors.top: adListItem.visible ? adListItem.bottom : parent.top
                subItemIndicator: true
                platformInverted: true

                Row {
                    id: itemRow

                    anchors {
                        fill: parent
                        leftMargin: 10
                        rightMargin: 30
                    }

                    spacing: 10

                    Image {
                        id: thumbnailImage
                        width: sourceSize.width
                        anchors.verticalCenter: parent.verticalCenter
                        source: thumb
                    }
                    Label {
                        width: parent.width - thumbnailImage.width - 10
                        height: parent.height
                        platformInverted: window.platformInverted
                        verticalAlignment: Text.AlignVCenter
                        wrapMode: "WordWrap"
                        text: title
                    }
                }

                onClicked: {
                    // Item selected
                    betaListView.currentIndex = index;
                    busyIndicator.opacity = 1;
                    betaViewContainer.itemClicked(id);
                }
            }
        }
    }

    ListView {
        id: betaListView

        // The image to be shown in the list's header.
        property string headerImage

        anchors.fill: parent
        model: betaModel
        delegate: betaItem
        snapMode: ListView.SnapToItem
        cacheBuffer: 30 * 70 // Keep in around 30 list delegates in memory

        // The TopBar component is used as a header, so it will scroll nicely
        // along with the list content.
        header: TopBar {
            width: parent.width
            height: 70

            // Bind the top bar's title image to the custom "headerImage"
            // property to offer a way to change the list's title.
            titleImage: betaListView.headerImage;
        }
    }
    ScrollDecorator {
        flickableItem: betaListView
    }


    /*!
      Gets the latest betas.
    */
    function getLatest()
    {
        betaListView.headerImage = "qrc:/gfx/title_latest_applications.png";
        var url = CommonScript.BETA_LABS_API_URL + "/search"
                + "?state=" + CommonScript.DEFAULT_STATE
                //+ "&maturity=" + CommonScript.DEFAULT_MATURITY
                + "&order=updated";
        betaModel.source = url;
    }

    /*!
      Gets the most popular betas.
    */
    function getMostPopular()
    {
        betaListView.headerImage = "qrc:/gfx/title_most_popular_applications.png";
        var url = CommonScript.BETA_LABS_API_URL + "/search"
                + "?state=" + CommonScript.DEFAULT_STATE
                //+ "&maturity=" + CommonScript.DEFAULT_MATURITY
                + "&order=rating";
        betaModel.source = url;
    }

    /*!
      Gets betas based on the specified tags.
    */
    function getBasedOnTags(tags)
    {
        betaListView.headerImage = "qrc:/gfx/title_search.png";
        var url = CommonScript.BETA_LABS_API_URL + "/search"
                + "?state=" + CommonScript.DEFAULT_STATE
                //+ "&maturity=" + CommonScript.DEFAULT_MATURITY
                + "&tags=" + tags
                + "&order=title";
        betaModel.source = url;
    }

    /*!
      Gets betas based on the specified free text phrase.
    */
    function getBasedOnFreeText(freeTextPhrase)
    {
        betaListView.headerImage = "qrc:/gfx/title_search.png";
        // Encode the phrase string into standard HTML URI format
        freeTextPhrase = escape(freeTextPhrase);

        var url = CommonScript.BETA_LABS_API_URL + "/search-text/"
            + freeTextPhrase;
        betaModel.source = url;
    }
}
