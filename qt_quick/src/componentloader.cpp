/**
 * Copyright (c) 2011-2014 Microsoft Mobile.
 * All rights reserved.
 */

#include <QDebug>
#include <QDeclarativeComponent>
#include <QDeclarativeItem>
#include <QDeclarativeView>
#include <QTimer>

#include "componentloader.h"

/*!
  Constructor.
*/
ComponentLoader::ComponentLoader(QDeclarativeView &view, QObject *parent)
    : QObject(parent),
      m_component(0),
      m_item(0),
      m_splashScreen(0),
      m_view(view)
{
    if (m_view.rootObject()) {
        m_splashScreen = qobject_cast<QDeclarativeItem*>(m_view.rootObject());
        connect(m_splashScreen, SIGNAL(hidden()), this, SLOT(deleteSplashScreen()));
    }
    else {
        qDebug() << "ComponentLoader::ComponentLoader():"
                 << "Failed to get the splash screen instance!";
    }

    m_component = new QDeclarativeComponent(m_view.engine(),
                                            QUrl::fromLocalFile(MAIN_QML_PATH),
                                            this);
}

/*!
  Loads the component after \a delayInMs milliseconds.
*/
void ComponentLoader::load(int delayInMs /* = 0 */)
{
    QTimer::singleShot(delayInMs, this, SLOT(createComponent()));
}

/*!
  Creates and displays the main component of the application.
*/
void ComponentLoader::createComponent(QDeclarativeComponent::Status status)
{
    if (!m_component->isReady()) {
        // The component is not ready. Connect to the status changed signal.
        connect(m_component,
                SIGNAL(statusChanged(QDeclarativeComponent::Status)),
                this,
                SLOT(createComponent(QDeclarativeComponent::Status)),
                Qt::UniqueConnection);
        return;
    }

    if (m_item) {
        // The component is already created. No need to do anything.
        return;
    }

    if (status == QDeclarativeComponent::Error) {
        qDebug() << "Error(s): " << m_component->errors();
        return;
    }

    if (status == QDeclarativeComponent::Ready) {
        // Create the component
        m_item = qobject_cast<QDeclarativeItem*>(m_component->create());

        if (m_item) {
            m_view.scene()->addItem(m_item);
            QMetaObject::invokeMethod(m_splashScreen, "hide");
        }
    }
}


/*!
  Deletes the splash screen.
*/
void ComponentLoader::deleteSplashScreen()
{
    qDebug() << "ComponentLoader::deleteSplashScreen()";

    if (m_splashScreen) {
        m_splashScreen->deleteLater();
    }
}
