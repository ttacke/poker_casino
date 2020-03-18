# Poker-Casino

Ein Casino, um mehrere Poker-Bots gegeneinander antreten zu lassen

Die Bots müssen lediglich via Websocket mit dem Casino kommunizieren.

## Deployment

tar czf htdocs.tgz htdocs
scp htdocs.tgz teamrocket-feedbackdevice.smedia-1.gce.smhss.de:~
ssh teamrocket-feedbackdevice.smedia-1.gce.smhss.de
tar xzf htdocs.tgz
mv htdocs poker
mv htdocs /var/www/poker

