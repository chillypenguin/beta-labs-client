/**
 * Copyright (c) 2011-2014 Microsoft Mobile.
 * All rights reserved.
 *
 * For the applicable distribution terms see the license text file included in
 * the distribution.
 */

import QtQuick 1.1
import com.nokia.symbian 1.1

import "../script/ajax.js" as AjaxScript
import "../script/common.js" as CommonScript

Page {
    id: detailsView

    property variant betaId; // The ID of the Beta currently on the screen
    property variant downloadInfo; // Pre-fetched download information

    Background { anchors.fill: parent }

    AdContainer {
        anchors {
            top: parent.top
            horizontalCenter: parent.horizontalCenter
            topMargin: 5
        }
    }

    Label {
        id: errorTextDetailsView
        width: parent.width - 20
        anchors.centerIn: parent
        opacity: 0
        platformInverted: window.platformInverted
        font.pixelSize: platformStyle.fontSizeLarge
        wrapMode: "WordWrap"
        text: "Unable to fetch details. Ensure that your device is connected to the Internet.";
    }

    Flickable {
        id: flickable
        anchors.fill: parent
        contentWidth: width
        contentHeight: detailsTopBar.height + betaTitle.height
                       + betaImg.height + betaOverview.height + 60;
        flickableDirection: "VerticalFlick"

        // Top bar
        TopBar {
            id: detailsTopBar
            width: parent.width
            height: 70
            titleImage: "qrc:/gfx/title_application_details.png"
        }

        Item {
            anchors {
                top: detailsTopBar.bottom
                left: parent.left
                right: parent.right
                topMargin: 20
                leftMargin: 10
                rightMargin: 10
            }

            Label {
                id: betaTitle

                anchors {
                    top: parent.top
                    left: parent.left
                    right: parent.right
                }

                platformInverted: window.platformInverted
                font.pixelSize: platformStyle.fontSizeLarge
                horizontalAlignment: "AlignHCenter"
                wrapMode: "WordWrap"
            }

            Image {
                id: betaImg
                width: 150
                height: 150

                anchors {
                    top: betaTitle.bottom
                    left: parent.left
                    topMargin: 20
                }

                fillMode: Image.PreserveAspectFit
                smooth: true
            }

            Button {
                id: downloadButton
                width: parent.width / 2.2

                anchors {
                    top: betaTitle.bottom
                    left: betaImg.right
                    topMargin: 20
                    leftMargin: 20
                }

                opacity: 0
                platformInverted: window.platformInverted
                text: qsTr("Download");

                onClicked: {
                    if (!detailsView.pageStack.busy) {
                        pageStack.push(Qt.resolvedUrl("DownloadInfoPage.qml"),
                                                      { text: downloadInfo });
                    }
                }
            }
            Button {
                id: reviewsButton
                width: parent.width / 2.2

                anchors {
                    top: downloadButton.bottom
                    left: betaImg.right
                    topMargin: 5
                    leftMargin: 20
                }

                opacity: 0
                platformInverted: window.platformInverted
                text: qsTr("View Reviews");

                onClicked: {
                    if (!detailsView.pageStack.busy) {
                        var reviewPage =
                            detailsView.pageStack.push(Qt.resolvedUrl("ReviewPage.qml"));
                        reviewPage.showReviews(betaId);
                    }
                }
            }

            Text {
                id: betaRating

                anchors {
                    top: reviewsButton.bottom
                    left: betaImg.right
                    topMargin: 10
                    leftMargin: 20
                }

                font.pointSize: 8
            }
            Text {
                id: betaOverview

                anchors {
                    top: betaImg.bottom
                    left: parent.left
                    right: parent.right
                    topMargin: 10
                }

                wrapMode: "WordWrap"
            }
        }
    }
    ScrollDecorator {
        flickableItem: flickable
    }

    tools: ToolBarLayout {
         ToolButton {
             iconSource: "toolbar-back"
             platformInverted: window.platformInverted

             onClicked: {
                 busyIndicator.opacity = 0;
                 detailsView.pageStack.pop();
             }
         }
    }

    function fetchDetails(betaId) {
        var req = AjaxScript.createXMLHttpRequest();

        if (req) {
            var url = CommonScript.BETA_LABS_API_URL + "/application/" + betaId;
            AjaxScript.loadXMLDoc(req, url, cbFetchDetails);
        }
    }

    // Called when the server responds to the fetch details call
    function cbFetchDetails(xml, text) {
        if (busyIndicator) {
            busyIndicator.opacity = 0;
            busyIndicator.running = false;
        }

        if (xml === null) {
            errorTextDetailsView.opacity = 1;
            return;
        }

        errorTextDetailsView.opacity = 0;

        betaId = CommonScript.getElementsByTagName(
                xml.documentElement, "id")[0].firstChild.nodeValue;

        var title = CommonScript.getElementsByTagName(
                xml.documentElement, "title")[0].firstChild.nodeValue;
        betaTitle.text = title;

        var imgSrc = CommonScript.getElementsByTagName(
                xml.documentElement, "image")[0].firstChild.nodeValue;
        betaImg.source = imgSrc;

        downloadButton.opacity = 1;
        reviewsButton.opacity = 1;

        var rating = CommonScript.getElementsByTagName(
                xml.documentElement, "rating")[0].firstChild.nodeValue;
        betaRating.text = "Rating: " + Math.round(rating);

        var overview = CommonScript.getElementsByTagName(
                xml.documentElement, "overview")[0].firstChild.nodeValue;

        // Remove objects from the HTML code.
        var objectStartInd;
        while ((objectStartInd = overview.indexOf("<object")) != -1) {
            var objectEndInd = overview.indexOf("</object>", objectStartInd)
                + "</object>".length;
            overview = overview.substring(0, objectStartInd)
                    + overview.substring(objectEndInd);
        }

        betaOverview.text = overview;

        // Load the download information into a variable even though the
        // download info view has not been activated yet. This saves bandwidth,
        // because no HTTP request is needed to fetch this same information
        // later.
        var downloadNode = CommonScript.getElementsByTagName(
                xml.documentElement, "download")[0];
        // Download info can be empty. In this case, disable the download button.
        if (downloadNode.firstChild === undefined) {
            downloadButton.enabled = false;
        } else {
            downloadInfo = downloadNode.firstChild.nodeValue;
        }
    }
}
