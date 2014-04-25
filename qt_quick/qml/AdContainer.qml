/**
 * Copyright (c) 2012-2014 Microsoft Mobile.
 * All rights reserved.
 *
 * For the applicable distribution terms see the license text file included in
 * the distribution.
 */

import QtQuick 1.1
import com.nokia.symbian 1.1
import "inneractive"


// Container for an ad
Item {
    id: adContainer

    // Default width and height
    property int targetWidth: 355
    property int targetHeight: hideButton.height / 4 + targetWidth / 5 - 12;

    signal adReady()

    /*!
      Hides the ad.
    */
    function hide()
    {
        showAndHideAnimation.show = false;
        showAndHideAnimation.start();
    }

    z: 5
    opacity: 0

    onAdReady: {
        // Show the container and start the timer
        showAndHideAnimation.show = true;
        showAndHideAnimation.start();
    }

    Rectangle {
        anchors {
            fill: parent
            topMargin: hideButton.height / 4
            leftMargin: 10
            rightMargin: hideButton.width / 4
        }

        color: "#1671a0"

        AdItem {
            id: adItem

            anchors {
                fill: parent
                margins: 2
            }

            showText: false
            scaleAd: true

            parameters: AdParameters {
                applicationId: "Test_BetaLabsClient_OVI";
            }

            onAdLoaded: adContainer.adReady();
        }
    }

    CloseAdButton {
        id: hideButton

        anchors {
            top: parent.top
            right: parent.right
        }

        opacity: 0

        onOpacityChanged: {
            if (opacity == 1) {
                hideButton.startAnimation();
            }
        }
        onAnimationComplete: adContainer.hide();
        onClicked: adContainer.hide();
    }

    // Animation for showing and hiding the container
    SequentialAnimation {
        id: showAndHideAnimation
        property bool show: true
        property int duration: 500
        property int easingType: Easing.InOutBack
        property real easingOvershoot: 2.0

        ScriptAction {
            script: {
                if (!showAndHideAnimation.show) {
                    hideButton.opacity = 0;
                }
            }
        }
        ParallelAnimation {
            NumberAnimation {
                target: adContainer
                property: "opacity"
                to: showAndHideAnimation.show ? 1 : 0;
                duration: showAndHideAnimation.show ?
                              showAndHideAnimation.duration
                            : showAndHideAnimation.duration - 200;
            }
            NumberAnimation {
                target: adItem
                property: "opacity"
                to: showAndHideAnimation.show ? 1 : 0;
                duration: showAndHideAnimation.show ?
                              showAndHideAnimation.duration
                            : showAndHideAnimation.duration - 200;
            }
            NumberAnimation {
                target: adItem
                property: "height"
                to: showAndHideAnimation.show ? 70 : 0;
                duration: showAndHideAnimation.duration
                easing.type: showAndHideAnimation.easingType
                easing.overshoot: showAndHideAnimation.easingOvershoot
            }
            NumberAnimation {
                target: adContainer
                property: "width"
                to: showAndHideAnimation.show ? adContainer.targetWidth : 0;
                duration: showAndHideAnimation.duration
                easing.type: showAndHideAnimation.easingType
                easing.overshoot: showAndHideAnimation.easingOvershoot
            }
            NumberAnimation {
                target: adContainer
                property: "height"
                to: showAndHideAnimation.show ? adContainer.targetHeight : 0;
                duration: showAndHideAnimation.duration
                easing.type: showAndHideAnimation.easingType
                easing.overshoot: showAndHideAnimation.easingOvershoot
            }
        }
        ScriptAction {
            script: {
                if (showAndHideAnimation.show) {
                    hideButton.opacity = 1;
                }
            }
        }
    }
}
