# Copyright (c) 2011-2012 Nokia Corporation.

TARGET = betalabsclientqtquick
VERSION = 2.0.0
TEMPLATE = app

QT = core gui declarative webkit xml network
CONFIG += mobility
MOBILITY += systeminfo

HEADERS += src/componentloader.h

SOURCES += \
    src/main.cpp \
    src/componentloader.cpp

RESOURCES += BetaLabsClientQtQuick.qrc

OTHER_FILES += \
    qml/AdContainer.qml \
    qml/Background.qml \
    qml/BetaLabsClientQtQuick.qml \
    qml/BetaView.qml \
    qml/CloseAdButton.qml \
    qml/DetailsPage.qml \
    qml/DownloadInfoPage.qml \
    qml/LatestPage.qml \
    qml/PopularPage.qml \
    qml/ResultsPage.qml \
    qml/ReviewPage.qml \
    qml/SearchPage.qml \
    qml/SplashScreen.qml \
    qml/TopBar.qml \
    script/ajax.js \
    script/common.js

include(src/iaad/component/component.pri)

symbian {
    TARGET = BetaLabs
    TARGET.CAPABILITY = NetworkServices Location
    TARGET.EPOCHEAPSIZE = 0x100000 0x2000000
    TARGET.EPOCSTACKSIZE = 0x14000

    ICON = gfx/icon.svg

    qmlfiles.sources = qml
    scriptfiles.sources = script
    DEPLOYMENT += qmlfiles scriptfiles
}

simulator {
    # Modify the following path if necessary
    SHADOW_BLD_PATH_DEBUG = ..\\BetaLabsClientQtQuick-build-simulator-Simulator_Qt_for_MinGW_4_4__Qt_SDK__Debug
    SHADOW_BLD_PATH_RELEASE = ..\\BetaLabsClientQtQuick-build-simulator-Simulator_Qt_for_MinGW_4_4__Qt_SDK__Release

    CONFIG(debug, debug|release) {
        system(mkdir $${SHADOW_BLD_PATH_DEBUG}\\qml)
        system(mkdir $${SHADOW_BLD_PATH_DEBUG}\\script)
        system(xcopy /E /Y qml\\* $${SHADOW_BLD_PATH_DEBUG}\\qml)
        system(xcopy /E /Y script\\* $${SHADOW_BLD_PATH_DEBUG}\\script)
    }
    else {
        system(mkdir $${SHADOW_BLD_PATH_RELEASE}\\qml)
        system(mkdir $${SHADOW_BLD_PATH_RELEASE}\\script)
        system(xcopy /E /Y qml\\* $${SHADOW_BLD_PATH_RELEASE}\\qml)
        system(xcopy /E /Y script\\* $${SHADOW_BLD_PATH_RELEASE}\\script)
    }
}

contains(MEEGO_EDITION,harmattan) {
    error(MeeGo 1.2 Harmattan is not supported!)
}
