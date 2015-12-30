use strict;
use lib './lib';

use Net::WebSocket::Server;
use LOCAL::Casino();

my $IP = $ARGV[0] || '127.0.0.1';
my $PORT = $ARGV[1] || '8080';

#TODO Tipp von Ben: der Server geht aus, wenn sich jemand disconnected. Es gibt dann keine Meldung
while(1) {
	warn "Starte Server auf $IP:$PORT ...";
	eval {
		my $vermittlung = LOCAL::Casino->new();
		Net::WebSocket::Server->new(
			listen => 8080,
			on_connect => sub {
				my ($serv, $conn) = @_;
				
				$vermittlung->neueVerbindung($conn);
				$conn->on(
					utf8 => sub {
						my ($conn, $msg) = @_;
						$vermittlung->neueNachricht($conn, $msg);
					},
				);
			},
		)->start;
	};
	sleep(1);
	my $error = $@;
	eval {
		open(my $fh, '>>', '/tmp/casino_server_error.log');
		print $fh localtime() . "Server gestorben: $@";
		close($fh);
	};
	warn "Server gestorben, neustart!";
}