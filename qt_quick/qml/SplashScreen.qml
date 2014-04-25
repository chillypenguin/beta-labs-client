/**
 * Copyright (c) 2011-2014 Microsoft Mobile.
 * All rights reserved.
 *
 * For the applicable distribution terms see the license text file included in
 * the distribution.
 */

import QtQuick 1.1

Image {
    id: splashScreen

    signal hidden()

    /*!
      Hides the splash screen.
    */
    function hide()
    {
        hideAnimation.start();
    }

    z: 10
    source: "qrc:/gfx/background_360x640.png"

    Column {
        anchors.centerIn: parent
        spacing: 20

        Image {
            id: splashScreenImage
            x: (parent.width - width) / 2
            source: "qrc:/gfx/splash_screen.png"
        }
        Item {
            id: progressBarContainer
            height: 5
            width: splashScreen.width - 40

            Rectangle {
                id: progressBarRect
                width: 0
                height: parent.height
                anchors.left: parent.left
                color: "lightgreen"
            }

            SequentialAnimation {
                id: progressBarAnimation
                property int duration: 800 // In milliseconds

                PauseAnimation { duration: 100 }
                ParallelAnimation {
                    NumberAnimation {
                        target: progressBarRect
                        property: "width"
                        to: progressBarContainer.width
                        duration: progressBarAnimation.duration
                    }
                    ColorAnimation {
                        target: progressBarRect
                        property: "color"
                        to: "#68c1ef"
                        duration: progressBarAnimation.duration
                    }
                }
            }
        }
    }

    SequentialAnimation {
        id: hideAnimation

        NumberAnimation {
            target: splashScreen
            property: "opacity"
            to: 0
            duration: 300
        }
        ScriptAction {
            script: splashScreen.hidden();
        }
    }

    onWidthChanged: {
        if (width > 0) {
            progressBarContainer.width = width - 40;
            progressBarAnimation.restart();
        }
    }
}
