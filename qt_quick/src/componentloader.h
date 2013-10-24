/**
 * Copyright (c) 2011-2012 Nokia Corporation. All rights reserved.
 */

#ifndef COMPONENTLOADER_H
#define COMPONENTLOADER_H

#include <QDeclarativeComponent>
#include <QDeclarativeView>
#include <QObject>

// Forward declarations
class QDeclarativeItem;

const QString MAIN_QML_PATH = "qml/BetaLabsClientQtQuick.qml";

class ComponentLoader : public QObject
{
    Q_OBJECT
public:
    explicit ComponentLoader(QDeclarativeView &view, QObject *parent = 0);

public slots:
    void load(int delayInMs = 0);

private slots:
    void createComponent(QDeclarativeComponent::Status status =
            QDeclarativeComponent::Ready);
    void deleteSplashScreen();

private:  // Data
    QDeclarativeComponent *m_component; // Owned
    QDeclarativeItem *m_item; // Not owned
    QDeclarativeItem *m_splashScreen; // Ownership taken
    QDeclarativeView &m_view;
};

#endif // COMPONENTLOADER_H
