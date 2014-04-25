/**
 * Copyright (c) 2011-2014 Microsoft Mobile.
 * All rights reserved.
 *
 * For the applicable distribution terms see the license text file included in
 * the distribution.
 */

import QtQuick 1.1

Item {   
    property alias titleImage: pageTitle.source

    Image {
        id: logo
        x: 10
        source: "qrc:/gfx/logo_112x60.png"
    }

    Image {
        id: pageTitle
        x: (logo.x + logo.width) + (parent.width - (logo.x + logo.width)) / 2
           -  pageTitle.width / 2;
        y: parent.height / 2 - pageTitle.height / 2;
    }

    // Separator line
    Rectangle {
        anchors.bottom: parent.bottom
        width: parent.width
        height: 2
        color: "#60bcec"
    }
}
