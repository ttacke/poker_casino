package LOCAL::Casino;
use strict;
use warnings;

use lib './lib';

use Data::Dumper();
BEGIN { $ENV{PERL_JSON_BACKEND} = 'JSON::PP' }
use JSON -support_by_pp, -no_export;
use Time::HiRes();

use LOCAL::Casino::Verbindung();


*OK = sub { {"erfolg" => \1, "details" => ""} };
*FEHLER = sub { {"erfolg" => \0, "details" => $_[0]} };


# CONSTRUCTOR
sub new {
	return bless({
		jsonParser		=> JSON->new(),
		verbindungen	=> {},
		tische			=> {},
		spielerAntwort	=> {},
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
	my ($self, $verbindung, $tischId, $nameDesSpiels, $croupierId, $geheimeCroupierId) = @_;
	
	$self->{'tische'}->{$tischId} = {
		id				=> $tischId,
		daten			=> {},
		spieler			=> [],
		nameDesSpiels	=> $nameDesSpiels,
		croupier		=> {
			id				=> $croupierId,
			geheimeId		=> $geheimeCroupierId,
			verbindung		=> $verbindung,
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
sub _zeigeOffeneTische {
	my ($self, $verbindung) = @_;
	
	my @liste = ();
	foreach my $tisch (@{$self->_gibAlleTische()}) {
		my $daten = {
			nameDesSpiels	=> $tisch->{'nameDesSpiels'},
			tischId			=> $tisch->{'id'},
			spielerAnzahl	=> scalar(@{$tisch->{'spieler'}}),
			croupierId		=> $tisch->{'croupier'}->{'id'},
			wertung			=> [],
		};
		foreach my $spieler (@{$tisch->{'spieler'}}) {
			push(@{$daten->{'wertung'}}, {
				id		=> $spieler->{'id'},
				punkte	=> 0,
			});
		}
		push(@liste, $daten);
	}
	return $self->_gibAntwort($verbindung, \@liste);
}
# \ARRAY
sub _gibAlleTische {
	my ($self) = @_;
	
	my @liste = ();
	foreach my $tischId (sort keys(%{$self->{'tische'}})) {
		push(@liste, $self->{'tische'}->{$tischId});
	}
	return \@liste;
}
# HASH || NULL
sub _gibSpielerAnhandId {
	my ($self, $tisch, $spielerId) = @_;
	
	foreach my $spieler (@{$tisch->{'spieler'}}) {
		return $spieler if($spieler->{'id'} eq $spielerId);
	}
	return undef;
}
# \HASH || NULL
sub _gibMeinenTisch {
	my ($self, $croupierVerbindung) = @_;
	
	foreach my $tischId (keys(%{$self->{'tische'}})) {
		my $tisch = $self->{'tische'}->{$tischId};
		if($tisch->{'croupier'}->{'verbindung'} == $croupierVerbindung) {
			return $tisch;
		}
	}
	return undef;
}
# VOID
sub _frageSpieler {
	my ($self, $verbindung, $spielerId, $nachricht) = @_;
	
	my $tisch = $self->_gibMeinenTisch($verbindung);
	my $spieler = $self->_gibSpielerAnhandId($tisch, $spielerId);
	
	$spieler->{'verbindung'}->sende(
		$self->_scalarToJson(
			{
				aktion		=> 'frageVonCroupier',
				nachricht	=> $nachricht
			}
		)
	);
	$self->_warteAufAntwortVon($verbindung, $spielerId, 0.01);
	return;
}
# VOID
sub _warteAufAntwortVon {
	my ($self, $croupierVerbindung, $spielerId, $timeout) = @_;
	
	$SIG{'ALRM'} ||= sub {
		foreach my $spielerId (keys(%{$self->{'spielerAntwort'}})) {
			my $erwarteteAntwort = $self->{'spielerAntwort'}->{$spielerId};
			if(
				defined($erwarteteAntwort->{'antwort'})
			) {
				$self->_gibAntwort($
					erwarteteAntwort->{'croupierVerbindng'},
					{
						antwort	=> $erwarteteAntwort->{'antwort'},
						status	=> 'OK',
					}
				);
			}
#			if(
#				!defined($erwarteteAntwort->{'antwort'})
#				&& Time::HiRes::time() > $erwarteteAntwort->{'gueltigBis'}
#			) {
#				$self->_gibAntwort(
#					$erwarteteAntwort->{'croupierVerbindng'},
#					{
#						antwort	=> undef,
#						status	=> 'timeout',
#					}
#				);
#				delete($self->{'spielerAntwort'}->{$spielerId});
#			}
		}
	};

	my $timeoutTimestamp = Time::HiRes::time() + $timeout;
	$self->{'spielerAntwort'}->{$spielerId} = {
		antwort				=> undef,
		gueltigBis			=> $timeoutTimestamp,
		croupierVerbindng	=> $croupierVerbindung,
	};
	Time::HiRes::alarm($timeout * 1.01);
}
# VOID
sub _antwortAnCroupier {
	my ($self, $verbindung, $nachricht) = @_;
	
	my $spieler = $self->_gibSpielerAnhandVerbindung($verbindung);
	my $erwarteteAntwort = $self->{'spielerAntwort'}->{$spieler->{'id'}};
	my $now = Time::HiRes::time();
	if($erwarteteAntwort && $erwarteteAntwort->{'gueltigBis'} > $now) {
		$erwarteteAntwort->{'antwort'} = $nachricht;
	}
	#TODO Timeout melden??
	return;
}
# \HASH || NULL
sub _gibSpielerAnhandVerbindung {
	my ($self, $verbindung) = @_;
	
	foreach my $tisch (@{$self->_gibAlleTische()}) {
		foreach my $spieler (@{$tisch->{'spieler'}}) {
			return $spieler if($spieler->{'verbindung'} == $verbindung);
		}
	}
	return undef;
}
# VOID
sub neueNachricht {
	my ($self, $rawConnection, $textNachricht) = @_;
	
	my $verbindung = $self->_gibVerbindungFuer($rawConnection);
	my $nachricht = $self->_jsonToScalar($textNachricht);
	
	my $aktion = $nachricht->{'aktion'};
	if($aktion eq 'eroeffneTisch') {
		return $self->_eroeffneTisch(
			$verbindung, $nachricht->{'tischId'}, $nachricht->{'nameDesSpiels'},
			$nachricht->{'croupierId'}, $nachricht->{'geheimeCroupierId'}
		);
	} elsif($aktion eq 'zeigeOffeneTische') {
		return $self->_zeigeOffeneTische($verbindung);
	} elsif($aktion eq 'spieleAnTisch') {
		return $self->_spieleAnTisch(
			$verbindung, $nachricht->{'tischId'}, $nachricht->{'spielerId'},
			$nachricht->{'geheimeSpielerId'}
		);
	} elsif($aktion eq 'zeigeSpielerDesTisches') {
		return $self->_zeigeSpielerDesTisches($verbindung);
	} elsif($aktion eq 'frageSpieler') {
		return $self->_frageSpieler($verbindung, $nachricht->{'spielerId'}, $nachricht->{'nachricht'});
	} elsif($aktion eq 'antwortAnCroupier') {
		return $self->_antwortAnCroupier($verbindung, $nachricht->{'nachricht'});
	}
	
	$self->_gibAntwort($verbindung, FEHLER("Unbekannte Aktion"));
	return;
}

1;
