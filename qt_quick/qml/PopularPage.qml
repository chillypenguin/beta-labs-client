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
    id: popularPage
    tools: toolBarLayout

    Background { anchors.fill: parent }

    BetaView {
        id: popularBetaView
        anchors.fill: parent

        Component.onCompleted: getMostPopular();

        onItemClicked: {
            if (!popularPage.pageStack.busy) {
                // Show the details view for the selected beta application
                var detailsPage =
                        popularPage.pageStack.push(Qt.resolvedUrl("DetailsPage.qml"),
                                                   { betaId: id });
                detailsPage.fetchDetails(id);
            }
        }
    }
}
