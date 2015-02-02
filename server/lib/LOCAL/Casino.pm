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
	my ($class) = @_;
	
	my $self = bless({}, $class);
	$self->_init();
	return $self;
}
# VOID
sub _init {
	my ($self) = @_;
	
	foreach my $key (keys(%$self)) {
		delete($self->{'key'});
	}
	
	$self->{'jsonParser'}		= JSON->new();
	$self->{'verbindungen'}		= {};
	$self->{'tische'}			= {};
	$self->{'spielerAntwort'}	= {};
	return;
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
	
	my $bestehenderTisch = $self->{'tische'}->{$tischId};
	if(!$bestehenderTisch) {
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
	} else {
		my $croupier = $bestehenderTisch->{'croupier'};
		if(
			$croupier->{'id'} eq $croupierId
			&& $croupier->{'geheimeId'} eq $geheimeCroupierId
		) {
			$croupier->{'verbindung'} = $verbindung;
		} else {
			return $self->_gibAntwort($verbindung, FEHLER('Dieser Tisch gehoert jemand anderem'));
		}
	}
	return $self->_gibAntwort($verbindung, OK());
}
# VOID
sub _spieleAnTisch {
	my ($self, $verbindung, $tischId, $spielerId, $geheimeSpielerId) = @_;
	
	my $tisch = $self->{'tische'}->{$tischId};
	if(!$tisch) {
		return $self->_gibAntwort($verbindung, FEHLER("Der Tisch existiert nicht"));
	}
	
	foreach my $existierenderSpieler (@{$tisch->{'spieler'}}) {
		if($existierenderSpieler->{'id'} eq $spielerId) {
			if($existierenderSpieler->{'geheimeId'} eq $geheimeSpielerId) {
				$existierenderSpieler->{'verbindung'} = $verbindung;
				return $self->_gibAntwort($verbindung, OK());
			} else {
				return $self->_gibAntwort($verbindung, FEHLER("Der Spielername ist bereits vergeben"));
			}
		}
	}
	
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
	my ($self, $croupierVerbindung) = @_;
	
	my @liste = ();
	foreach my $tischId (keys(%{$self->{'tische'}})) {
		my $tisch = $self->{'tische'}->{$tischId};
		if($tisch->{'croupier'}->{'verbindung'} == $croupierVerbindung) {
			foreach my $spieler (@{$tisch->{'spieler'}}) {
				push(@liste, $spieler->{'id'});
			}
		}
	}
	return $self->_gibAntwort($croupierVerbindung, \@liste);
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
sub _frageDenSpieler {
	my ($self, $verbindung, $spielerId, $nachricht) = @_;
	
	my $tisch = $self->_gibMeinenTisch($verbindung);
	my $spieler = $self->_gibSpielerAnhandId($tisch, $spielerId);
	return if(!$spieler);
	
	$spieler->{'verbindung'}->sende(
		$self->_scalarToJson(
			{
				aktion		=> 'frageVonCroupier',
				nachricht	=> $nachricht
			}
		)
	);
	$self->_warteAufAntwortVon($verbindung, $spielerId, 0.08);
	return;
}
# VOID
sub _warteAufAntwortVon {
	my ($self, $croupierVerbindung, $spielerId, $timeout) = @_;
	
	$SIG{'ALRM'} ||= sub {
		foreach my $spielerId (keys(%{$self->{'spielerAntwort'}})) {
			my $erwarteteAntwort = $self->{'spielerAntwort'}->{$spielerId};
			if($erwarteteAntwort->{'gueltigBis'} < Time::HiRes::time()) {
				$self->_gibAntwort(
					$erwarteteAntwort->{'croupierVerbindung'},
					{
						antwort	=> undef,
						status	=> 'timeout',
					}
				);
				delete($self->{'spielerAntwort'}->{$spielerId});
			}
		}
	};
	my $timeoutTimestamp = Time::HiRes::time() + $timeout;
	$self->{'spielerAntwort'}->{$spielerId} = {
		gueltigBis			=> $timeoutTimestamp,
		croupierVerbindung	=> $croupierVerbindung,
	};
	Time::HiRes::alarm($timeout * 1.01);
	return;
}
# VOID
sub _antwortAnDenCroupier {
	my ($self, $verbindung, $nachricht) = @_;
	
	my $spieler = $self->_gibSpielerAnhandVerbindung($verbindung);
	return if(!$spieler);
	
	my $erwarteteAntwort = delete($self->{'spielerAntwort'}->{$spieler->{'id'}});
	if($erwarteteAntwort && $erwarteteAntwort->{'gueltigBis'} >= Time::HiRes::time()) {
		$self->_gibAntwort(
			$erwarteteAntwort->{'croupierVerbindung'},
			{
				antwort	=> $nachricht,
				status	=> 'OK',
			}
		);
	}
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
	} elsif($aktion eq 'frageDenSpieler') {
		return $self->_frageDenSpieler($verbindung, $nachricht->{'spielerId'}, $nachricht->{'nachricht'});
	} elsif($aktion eq 'antwortAnDenCroupier') {
		return $self->_antwortAnDenCroupier($verbindung, $nachricht->{'nachricht'});
	} elsif($aktion eq 'RESET') {
		$self->_init();
		$self->_gibAntwort($verbindung, OK());
		return;
	}
	
	$self->_gibAntwort($verbindung, FEHLER("Unbekannte Aktion"));
	return;
}

1;
