/**
 * Copyright (c) 2011-2012 Nokia Corporation.
 * All rights reserved.
 *
 * For the applicable distribution terms see the license text file included in
 * the distribution.
 */

import QtQuick 1.1
import com.nokia.symbian 1.1

// The main QML file.
PageStackWindow {
    id: window

    showStatusBar: true
    showToolBar: true
    initialPage: Qt.resolvedUrl("LatestPage.qml");

    // General busy indicator which can be actived by the pages in the page
    // stack
    BusyIndicator {
        id: busyIndicator
        width: 100
        height: 100
        anchors.centerIn: parent
        opacity: 0
        running: opacity > 0
        Behavior on opacity { NumberAnimation { duration: 300; } }
    }

    ToolBarLayout {
        id: toolBarLayout

        // Exit/back button
        ToolButton {
            iconSource: "toolbar-back"
            platformInverted: window.platformInverted
            onClicked: Qt.quit();
        }

        // Controls for changing the current tab
        ButtonRow {
            id: tabButtonRow

            // Latest button
            ToolButton {
                id: latestButton
                iconSource: "qrc:/gfx/tb-popular-inv.png"
                platformInverted: window.platformInverted

                onClicked: {
                    if (tabButtonRow.checkedButton !== latestButton) {
                        busyIndicator.opacity = 1;
                        pageStack.replace(Qt.resolvedUrl("LatestPage.qml"));
                    }
                }
            }
            // Popular button
            ToolButton {
                id: popularButton
                iconSource: "qrc:/gfx/tb-latest-inv.png"
                platformInverted: window.platformInverted

                onClicked: {
                    if (tabButtonRow.checkedButton !== popularButton) {
                        busyIndicator.opacity = 1;
                        pageStack.replace(Qt.resolvedUrl("PopularPage.qml"));
                    }
                }

            }
            // Search button
            ToolButton {
                id: searchButton
                iconSource: "toolbar-search"
                platformInverted: window.platformInverted

                onClicked: {
                    if (tabButtonRow.checkedButton !== searchButton) {
                        busyIndicator.opacity = 1;
                        pageStack.replace(Qt.resolvedUrl("SearchPage.qml"));
                    }
                }
            }
        }
    }

    // Use the light theme
    Component.onCompleted: window.platformInverted = true;
}
