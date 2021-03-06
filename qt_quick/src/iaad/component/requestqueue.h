#ifndef REQUESTQUEUE_H
#define REQUESTQUEUE_H

#include <QObject>
#include <QQueue>
#include <QNetworkSession>

class QNetworkAccessManager;
class QNetworkReply;
class AdInterface;
class QNetworkSession;
class QNetworkConfigurationManager;
class RequestQueue : public QObject
{
    Q_OBJECT
public:
    explicit RequestQueue(AdInterface *parent = 0);
    ~RequestQueue();

    void setUserAgent(const QByteArray &ua) { m_userAgent = ua; }

    bool isOnline() const;
signals:

public slots:
    void addToQueue(QObject *object);

private:

private slots:
    void handleRequests();
    void adRequestFinished(QNetworkReply *req);
    void netSessionStateChanged(QNetworkSession::State state = QNetworkSession::Connected);
    void cancelRequest(QObject* adItem);

signals:
    void requestReady();

private:
    QQueue<QObject*> m_adItemQueue;
    QNetworkAccessManager *m_nam;
    QByteArray m_userAgent;
    QObject* m_runningRequest;
    QNetworkConfigurationManager *m_confman;
    QNetworkSession *m_nsession;
    bool m_onlineCheck;
    bool m_networkError;
    QString m_clientId;
};

#endif // REQUESTQUEUE_H
