use strict;
use lib './lib';

use Net::WebSocket::Server;
use LOCAL::Casino();

my $IP = $ARGV[0] || '127.0.0.1';
my $PORT = $ARGV[1] || '8080';
warn "Starte Server auf $IP:$PORT ...";

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

warn "Server laeuft";