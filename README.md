# Poker-Casino

Ein Casino, um mehrere Poker-Bots gegeneinander antreten zu lassen

Die Bots müssen lediglich via Websocket mit dem Casino kommunizieren.

## Deployment

tar czf htdocs.tgz htdocs
scp htdocs.tgz teamrocket-feedbackdevice.smedia-1.gce.smhss.de:~
ssh teamrocket-feedbackdevice.smedia-1.gce.smhss.de
tar xzf htdocs.tgz
sudo mv htdocs /var/www/poker
sudo chown -R www-data:www-data /var/www/poker

tar czf server.tgz server
scp server.tgz teamrocket-feedbackdevice.smedia-1.gce.smhss.de:~
ssh teamrocket-feedbackdevice.smedia-1.gce.smhss.de
tar xzf server.tgz
sudo mv server /var/www/poker_server

## Server online starten
cd /var/www/poker_server
perl casino.pl 10.7.0.34 8080 &
