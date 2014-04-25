/**
 * Copyright (c) 2011-2014 Microsoft Mobile.
 * All rights reserved.
 *
 * For the applicable distribution terms see the license text file included in
 * the distribution.
 */

import QtQuick 1.1
import com.nokia.symbian 1.1

Page {
    id: downloadInfoPage

    property alias text: downloadInfoText.text

    Background { anchors.fill: parent }

    Flickable {
        id: flickable
        anchors.fill: parent
        contentWidth: width
        contentHeight: infoTopBar.height + downloadInfoText.height + 15

        TopBar {
            id: infoTopBar;
            width: parent.width
            height: 70
            titleImage: "qrc:/gfx/title_download_info.png";
        }

        // Container for the info text
        Item {
            height: downloadInfoText.height

            anchors {
                top: infoTopBar.bottom
                left: parent.left
                right: parent.right
                topMargin: 5
                leftMargin: 10
                rightMargin: 10
            }

            Text {
                id: downloadInfoText
                width: parent.width
                wrapMode: "WordWrap"
                onLinkActivated: Qt.openUrlExternally(link);
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
                 downloadInfoPage.pageStack.pop();
             }
         }
    }
}
