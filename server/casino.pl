use strict;
use lib './lib';

use Net::WebSocket::Server;
use LOCAL::Casino();

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
