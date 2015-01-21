package LOCAL::Casino;
use strict;
use warnings;

use lib './lib';

use Data::Dumper();
BEGIN { $ENV{PERL_JSON_BACKEND} = 'JSON::PP' }
use JSON -support_by_pp, -no_export;

use LOCAL::Casino::Verbindung();


*OK = sub { {"erfolg" => \1, "details" => ""} };
*FEHLER = sub { {"erfolg" => \0, "details" => $_[0]} };


# CONSTRUCTOR
sub new {
	return bless({
		jsonParser		=> JSON->new(),
		verbindungen	=> {},
		tische			=> {},
	}, $_[0]);
}
# VOID
sub neueVerbindung {
	my ($self, $rawConnection) = @_;
	
	my $verbindung = LOCAL::Casino::Verbindung->new($rawConnection);
	$self->{'verbindungen'}->{$verbindung} = $verbindung;
	return;
}
# LOCAL::Casino::Verbindung
sub _gibVerbindungFuer {
	my ($self, $rawConnection) = @_;
	
	foreach my $bekannt (values(%{$self->{'verbindungen'}})) {
		return $bekannt if($bekannt->istGleich($rawConnection));
	}
	return LOCAL::Casino::Verbindung->new($rawConnection);
}
# SCALAR
sub _jsonToScalar {
	my ($self, $textNachricht) = @_;
	
	return eval {
		return $self->{'jsonParser'}->utf8->decode($textNachricht);
	};
}
# STRING
sub _scalarToJson {
	my ($self, $nachricht) = @_;
	
	return $self->{'jsonParser'}->utf8->encode($nachricht);
}
# VOID
sub _gibAntwort {
	my ($self, $verbindung, $nachricht) = @_;
	
	$verbindung->sende($self->_scalarToJson($nachricht));
}
# VOID
sub _eroeffneTisch {
	my ($self, $verbindung, $tischId, $croupierId, $geheimeCroupierId) = @_;
	
	$self->{'tische'}->{$tischId} = {
		id			=> $tischId,
		daten		=> {},
		spieler		=> [],
		croupier	=> {
			id			=> $croupierId,
			geheimeId	=> $geheimeCroupierId,
			verbindung	=> $verbindung,
		},
	};
	return $self->_gibAntwort($verbindung, OK());
}
# VOID
sub _spieleAnTisch {
	my ($self, $verbindung, $tischId, $spielerId, $geheimeSpielerId) = @_;
	
	my $tisch = $self->{'tische'}->{$tischId};
	push(@{$tisch->{'spieler'}}, {
		id			=> $spielerId,
		geheimeId	=> $geheimeSpielerId,
		verbindung	=> $verbindung,
		daten		=> {},
	});
	return $self->_gibAntwort($verbindung, OK());
}
# VOID
sub _zeigeSpielerDesTisches {
	my ($self, $verbindung) = @_;
	
	my @liste = ();
	foreach my $tischId (keys(%{$self->{'tische'}})) {
		my $tisch = $self->{'tische'}->{$tischId};
		if($tisch->{'croupier'}->{'verbindung'} == $verbindung) {
			foreach my $spieler (@{$tisch->{'spieler'}}) {
				push(@liste, $spieler->{'id'});
			}
		}
	}
	return $self->_gibAntwort($verbindung, \@liste);
}
# VOID
sub neueNachricht {
	my ($self, $rawConnection, $textNachricht) = @_;
	
	my $verbindung = $self->_gibVerbindungFuer($rawConnection);
	my $nachricht = $self->_jsonToScalar($textNachricht);
	
	my $aktion = $nachricht->{'aktion'};
	if($aktion eq 'eroeffneTisch') {
		return $self->_eroeffneTisch($verbindung, $nachricht->{'tischId'}, $nachricht->{'croupierId'}, $nachricht->{'geheimeCroupierId'});
	} elsif($aktion eq 'spieleAnTisch') {
		return $self->_spieleAnTisch($verbindung, $nachricht->{'tischId'}, $nachricht->{'spielerId'}, $nachricht->{'geheimeSpielerId'});
	} elsif($aktion eq 'zeigeSpielerDesTisches') {
		return $self->_zeigeSpielerDesTisches($verbindung);
	}
	
	$self->_gibAntwort($verbindung, FEHLER("Unbekannte Aktion"));
	return;
}

1;
