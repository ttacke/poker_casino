use strict;
use lib './lib';
use Net::WebSocket::Server;

my $DATA = {};
use Data::Dumper();

BEGIN { $ENV{PERL_JSON_BACKEND} = 'JSON::PP' }
use JSON -support_by_pp, -no_export;

my $json = JSON->new();

Net::WebSocket::Server->new(
	listen => 8080,
	on_connect => sub {
		my ($serv, $conn) = @_;
		$conn->on(
			utf8 => sub {
				my ($conn, $msg) = @_;
				
				my $data = eval {
					return $json->decode($msg);
				};
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
				
				$DATA->{$msg}++;
				#warn Data::Dumper::Dumper($DATA);
				$conn->send_utf8($msg);
			},
		);
	},
)->start;