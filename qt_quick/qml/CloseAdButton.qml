/**
 * Copyright (c) 2012-2014 Microsoft Mobile.
 * All rights reserved.
 *
 * For the applicable distribution terms see the license text file included in
 * the distribution.
 */

import QtQuick 1.1

Item {
    id: closeAdButton

    signal animationComplete()
    signal clicked()

    /*!
      Starts the animation.
    */
    function startAnimation()
    {
        animationTimer.start();
    }

    width: 41
    height: 41

    Image {
        id: buttonImage
        anchors.fill: parent
        source: "qrc:/gfx/close-ad-1.png"
    }

    MouseArea {
        anchors.fill: parent

        onClicked: {
            animationTimer.stop();
            closeAdButton.clicked();
        }
    }

    Timer {
        id: animationTimer
        property int phase: 1
        interval: 1000 // 1 second
        running: false
        repeat: true

        onTriggered: {
            phase += 1;

            if (phase <= 9) {
                buttonImage.source = "qrc:/gfx/close-ad-" + phase + ".png";
            }

            if (phase > 9) {
                // We're done
                animationTimer.stop();
                closeAdButton.animationComplete();
            }
        }
    }
}
