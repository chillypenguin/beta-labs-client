/**
 * Copyright (c) 2011-2014 Microsoft Mobile.
 * All rights reserved.
 *
 * For the applicable distribution terms see the license text file included in
 * the distribution.
 */

import QtQuick 1.1
import com.nokia.symbian 1.1

import "../script/common.js" as CommonScript

Page {
    id: reviewPage

    /*!
      Loads the reviews according to \a betaId.
    */
    function showReviews(betaId)
    {
        var url = CommonScript.BETA_LABS_URL + "/node/" + betaId
            + "/forum/rss?type=review";
        reviewsModel.source = url;
    }

    Background { anchors.fill: parent }

    Label {
        id: noReviewsInfo
        width: parent.width - 20
        anchors.centerIn: parent
        opacity: 0
        platformInverted: window.platformInverted
        font.pixelSize: platformStyle.fontSizeLarge
        wrapMode: "WordWrap"
        text: "No reviews found for this application."
    }

    XmlListModel {
        id: reviewsModel
        query: "/rss/channel/item"

        XmlRole {
            name: "title"
            query: "title/string()"
        }
        XmlRole {
            name: "description"
            query: "description/string()"
        }
        XmlRole {
            name: "category"
            query: "category/string()"
        }
        XmlRole {
            name: "guid"
            query: "guid/string()"
        }

        onStatusChanged: {
            if (status == XmlListModel.Loading) {
                busyIndicator.opacity = 1;
            }
            else {
                busyIndicator.opacity = 0;

                // If there are no reviews, tell it to the user.
                if (reviewsListView.count == 0) {
                    noReviewsInfo.opacity = 1;
                }
                else {
                    noReviewsInfo.opacity = 0;
                }
            }
        }
    }

    Component {
        id: reviewItem

        Item {
            width: parent.width
            height: reviewTitle.height + 20

            Label {
                id: reviewTitle

                anchors {
                    top: parent.top
                    left: parent.left
                    right: parent.right
                    topMargin: 10
                    leftMargin: 10
                    rightMargin: 10
                }

                platformInverted: window.platformInverted
                verticalAlignment: Text.AlignVCenter
                wrapMode: "WordWrap"
                text: title
            }

            // Border
            Rectangle {
                width: parent.width
                height: 1
                anchors.bottom: parent.bottom
                color: "#68c1ef"
            }

            MouseArea {
                anchors.fill: parent
                onClicked: Qt.openUrlExternally(guid);
            }
        }
    }

    ListView {
        id: reviewsListView
        anchors.fill: parent
        model: reviewsModel
        delegate: reviewItem
        snapMode: ListView.SnapToItem

        // The TopBar component is used as a header, so it will scroll nicely
        // along with the list content.
        header: TopBar {
            width: parent.width
            height: 70
            titleImage: "qrc:/gfx/title_reviews.png"
        }
    }
    ScrollDecorator {
        flickableItem: reviewsListView
    }


    tools: ToolBarLayout {
        ToolButton {
            iconSource: "toolbar-back"
            platformInverted: window.platformInverted

            onClicked: {
                busyIndicator.opacity = 0;
                reviewPage.pageStack.pop();
            }
        }
    }
}
