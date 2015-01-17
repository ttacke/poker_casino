use strict;
use lib './lib';
use Net::WebSocket::Server;

my $MESSAGES_TO = {
};
use Data::Dumper();

BEGIN { $ENV{PERL_JSON_BACKEND} = 'JSON::PP' }
use JSON -support_by_pp, -no_export;

my $json = JSON->new();
my $connections = [];

Net::WebSocket::Server->new(
	listen => 8080,
	on_connect => sub {
		my ($serv, $conn) = @_;
		
		# TODO Connection zu playerId zuordnen!
		# from, to, msg reichen aus, dann ist socket fertig
		# der rest wird vom server gemacht, der tacktet und steuert
		push(@$connections, $conn);
		
		# normaler ChildRequest
		$conn->on(
			utf8 => sub {
				my ($conn, $msg) = @_;
				
				
				my $data = eval {
					return $json->utf8->decode($msg);
				};
				if($data) {
					#if($data->{'from'} eq 's') {
						foreach my $c (@$connections) {
							next if($c == $conn);
							
							# Verbindung gerade verfuegbar?
							my $fh = $c->socket();
							if(tell($fh) != -1) {
								$c->send_utf8($data->{'msg'});
							}
						}
						$MESSAGES_TO->{$data->{'to'}} = '';
					#}
				}
				
				# TODO fehler immer abweisen!
				# 
				# Server sagt spieler 1 PING1
				# Spieler 1 kriegt PING1 und sagt PONG1
				# Spieler 2 bekommt keine Nachricht
				# Server kriegt PONG1
				
				# Server sagt spieler 2 PING2
				# Spieler 2 kriegt PING2 und sagt PONG2
				# Spieler 1 bekommt keine Nachricht
				# Server kriegt PONG2
				
				#$DATA->{$msg}++;
				#warn Data::Dumper::Dumper($DATA);
				#$conn->send_utf8("ENDE");
			},
		);
	},
)->start;