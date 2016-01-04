use strict;
use lib './lib';

use Net::WebSocket::Server;
use LOCAL::Casino();

my $IP = $ARGV[0] || '127.0.0.1';
my $PORT = $ARGV[1] || '8080';

while(1) {
	_logge("PARENT($$) forke server");
	my $pid = fork();
	if(!$pid) {# Child
		_logge("CHILD($$) starte Server auf $IP:$PORT");
		_starte_server();
		exit(0);
	}
	_logge("PARENT($$) ueberwache Server (PID:$pid) ...");
	wait();
	_logge("PARENT($$) Server ist gestorben; neustart");
}

# VOID
sub _logge {
	my ($msg) = @_;
	
	my $text = "\n" . localtime() . ' ' . $msg;
	print STDERR $text;
	open(my $fh, '>>', '/tmp/casino_server_error.log');
	print $fh $text;
	close($fh);
}
# VOID
sub _starte_server {
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
}
