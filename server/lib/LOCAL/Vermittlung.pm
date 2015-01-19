package LOCAL::Vermittlung;
use strict;
use warnings;

use lib './lib';

use Data::Dumper();
BEGIN { $ENV{PERL_JSON_BACKEND} = 'JSON::PP' }
use JSON -support_by_pp, -no_export;

use LOCAL::Verbindung();

my $MEISTER_TOKEN = 'ICHBINDERMEISTER_ESKANNNUREINENGEBEN';

# CONSTRUCTOR
sub new {
	return bless({
		jsonParser		=> JSON->new(),
		verbindungen	=> {},
		
		meister			=> undef,
		spieler			=> {},
	}, $_[0]);
}
# VOID
sub neueVerbindung {
	my ($self, $rawConnection) = @_;
	
	my $verbindung = LOCAL::Verbindung->new($rawConnection);
	$self->{'verbindungen'}->{$verbindung} = $verbindung;
	return;
}
# ARRAY
sub _gibAlleSpieler {
	my ($self) = @_;
	
	my @liste = ();
	foreach my $spielerToken (sort { $a cmp $b } keys(%{$self->{'spieler'}})) {
		push(@liste, $self->{'spieler'}->{$spielerToken});
	}
	return \@liste;
}
# VOID
sub _login {
	my ($self, $verbindung, $token) = @_;
	
	if(
		($self->{'meister'} && $self->{'meister'} == $verbindung)
		||
		($self->{'spieler'}->{$token} && $self->{'spieler'}->{$token} == $verbindung)
	) {
		return $verbindung->beantworteAnfrage(0, "Du bist bereits eingeloggt");
	}
	
	if(
		($token eq $MEISTER_TOKEN && $self->{'meister'} && $self->{'meister'}->istOffen())
		||
		($self->{'spieler'}->{$token} && $self->{'spieler'}->{$token}->istOffen())
	) {
		return $verbindung->beantworteAnfrage(0, "dieser Token wird derzeit von einem anderen genutzt");
	}
	
	if($token eq $MEISTER_TOKEN) {
		$self->{'meister'} = $verbindung;
		return $verbindung->beantworteAnfrage(1, "Du bist jetzt der Meister");;
	}
	
	if($token eq '') {
		return $verbindung->beantworteAnfrage(1, "Der Token '' ist nicht erlaubt");
	}
	
	$self->{'spieler'}->{$token} = $verbindung;
	return $verbindung->beantworteAnfrage(1, "Du bist jetzt ein Spieler");
}
# LOCAL::Verbindung
sub _gibVerbindungFuer {
	my ($self, $rawConnection) = @_;
	
	foreach my $bekannt (values(%{$self->{'verbindungen'}})) {
		return $bekannt if($bekannt->istGleich($rawConnection));
	}
	return LOCAL::Verbindung->new($rawConnection);
}
# VOID
sub _spielerUebersicht {
	my ($self, $verbindung) = @_;
	
	my @liste = ();
	foreach my $spielerVerbindung (@{$self->_gibAlleSpieler()}) {
		foreach my $spielerToken (keys(%{$self->{'spieler'}})) {
			if($spielerVerbindung == $self->{'spieler'}->{$spielerToken}) {
				push(@liste, {
					token	=> $spielerToken,
					aktiv	=> $spielerVerbindung->istOffen(),
				});
				last;
			}
		}
	}
	$verbindung->sende($self->{'jsonParser'}->utf8->encode(\@liste));
	return;
}
# VOID
sub neueAnfrage {
	my ($self, $rawConnection, $textNachricht) = @_;
	
	my $verbindung = $self->_gibVerbindungFuer($rawConnection);
	my $nachricht = eval {
		return $self->{'jsonParser'}->utf8->decode($textNachricht);
	};
	if(!$nachricht) {
		$verbindung->sende('{"erfolg":"false","nachricht":"Fehler in Nachricht"}');
		return;
	}
	
	my $erfolg = 0;
	my $aktion = $nachricht->{'aktion'};
	if($aktion eq 'login') {
		return $self->_login($verbindung, $nachricht->{'token'});
	} elsif($aktion eq 'gibSpielerUebersicht') {
		return $self->_spielerUebersicht($verbindung);
	}
	
	if($erfolg) {
		$verbindung->sende('{"erfolg":"true","nachricht":""}');
	} else {
		$verbindung->sende('{"erfolg":"false","nachricht":"fehler in \'aktion\'"}');
	}
	return;
}
1;
