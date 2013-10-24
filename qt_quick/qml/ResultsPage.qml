/**
 * Copyright (c) 2011-2012 Nokia Corporation.
 * All rights reserved.
 *
 * For the applicable distribution terms see the license text file included in
 * the distribution.
 */

import QtQuick 1.1
import com.nokia.symbian 1.1

Page {
    id: resultsPage

    property alias resultsBetaView: resultsBetaView

    Background { anchors.fill: parent }

    BetaView {
        id: resultsBetaView
        anchors.fill: parent

        Component.onCompleted: getLatest();

        onItemClicked: {
            if (!resultsPage.pageStack.busy) {
                // Show the details view for the selected beta application
                var detailsPage =
                        resultsPage.pageStack.push(Qt.resolvedUrl("DetailsPage.qml"),
                                                   { betaId: id });
                detailsPage.fetchDetails(id);
            }
        }
    }

    tools: ToolBarLayout {
        ToolButton {
            iconSource: "toolbar-back"
            platformInverted: window.platformInverted

            onClicked: {
                busyIndicator.opacity = 0;
                resultsPage.pageStack.pop();

                // Workaround for bug QTCOMPONENTS-1178
                // (https://bugreports.qt.nokia.com/browse/QTCOMPONENTS-1178).
                // When the bug is fixed, this function call is no longer
                // needed.
                resultsPage.pageStack.currentPage.updateToolBarHighlight();
            }
        }
    }
}
