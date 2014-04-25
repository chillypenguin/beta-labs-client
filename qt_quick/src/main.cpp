/**
 * Copyright (c) 2011-2014 Microsoft Mobile. All rights reserved.
 */

#include <QtDeclarative/QDeclarativeView>
#include <QtGui/QApplication>
#include <QtGui/QDesktopWidget>

#include <inneractiveplugin.h>

#include "componentloader.h"

const int SPLASH_SCREEN_DELAY = 1000;

int main(int argc, char* argv[])
{
    QApplication app(argc, argv);

    QDeclarativeView view;
    inneractivePlugin::initializeEngine(view.engine());

    view.setSource(QUrl::fromLocalFile("qml/SplashScreen.qml"));
    view.setResizeMode(QDeclarativeView::SizeRootObjectToView);

    QObject::connect((QObject*)view.engine(), SIGNAL(quit()),
                     &app, SLOT(quit()));

    // Ensure that the size of the view is calculated correctly.
    view.setGeometry(QApplication::desktop()->screenGeometry());
    view.showFullScreen();

    ComponentLoader componentLoader(view);
    componentLoader.load(SPLASH_SCREEN_DELAY);

    return app.exec();
}
