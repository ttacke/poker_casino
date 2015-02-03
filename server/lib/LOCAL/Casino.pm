package LOCAL::Casino;
use strict;
use warnings;

use lib './lib';

BEGIN { $ENV{PERL_JSON_BACKEND} = 'JSON::PP' }
use JSON -support_by_pp, -no_export;
use Time::HiRes();

use LOCAL::Casino::Verbindung();
use LOCAL::Casino::Croupier();
my $CROUPIER = 'LOCAL::Casino::Croupier';

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
	
	$self->{'safe'} = {};
	$self->{'jsonParser'}		= JSON->new();
	$self->{'verbindungen'}		= {};
	$self->{'tische'}			= {};
	$self->{'spielerAntwort'}	= {};
	return;
}
# \HASH
sub gibTischDaten {
	my ($self) = @_;
	
	return $self->{'tische'};
}
# \HASH
sub gibSpielerAntwortDaten {
	my ($self) = @_;
	
	return $self->{'spielerAntwort'};
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
# VOID
sub _eroeffneTisch {
	my ($self, $verbindung, $tischName, $nameDesSpiels, $croupierName, $croupierPasswort, $spielerTimeoutInMillisekunden) = @_;
	
	return $CROUPIER->eroeffneTisch($self->gibTischDaten(), $verbindung, $tischName, $nameDesSpiels, $croupierName, $croupierPasswort, $spielerTimeoutInMillisekunden);
	
}
# VOID
sub _spieleAnTisch {
	my ($self, $verbindung, $tischName, $spielerName, $spielerPasswort) = @_;
	
	my $tisch = $self->gibTischDaten()->{$tischName};
	if(!$tisch) {
		return $verbindung->antworte('fehler', "Der Tisch existiert nicht");
	}
	
	foreach my $existierenderSpieler (@{$tisch->{'spieler'}}) {
		if($existierenderSpieler->{'name'} eq $spielerName) {
			if($existierenderSpieler->{'passwort'} eq $spielerPasswort) {
				$existierenderSpieler->{'verbindung'} = $verbindung;
				return $verbindung->antworte('ok');
			} else {
				return $verbindung->antworte('fehler', "Der Spielername ist bereits vergeben");
			}
		}
	}
	
	push(@{$tisch->{'spieler'}}, {
		name			=> $spielerName,
		passwort	=> $spielerPasswort,
		verbindung	=> $verbindung,
	});
	return $verbindung->antworte('ok');
}
# VOID
sub _zeigeSpielerDesTisches {
	my ($self, $croupierVerbindung) = @_;
	
	return $CROUPIER->zeigeSpielerDesTisches($self->gibTischDaten(), $croupierVerbindung);
}
# VOID
sub _zeigeOffeneTische {
	my ($self, $verbindung) = @_;
	
	my @liste = ();
	foreach my $tisch (@{$self->_gibAlleTische()}) {
		my $daten = {
			nameDesSpiels	=> $tisch->{'nameDesSpiels'},
			tischName		=> $tisch->{'name'},
			spielerAnzahl	=> scalar(@{$tisch->{'spieler'}}),
			croupierName	=> $tisch->{'croupier'}->{'name'},
			wertung			=> [],
		};
		foreach my $spieler (@{$tisch->{'spieler'}}) {
			push(@{$daten->{'wertung'}}, {
				name	=> $spieler->{'name'},
				punkte	=> 0,
			});
		}
		push(@liste, $daten);
	}
	return $verbindung->antworte('ok', \@liste);
}
# \ARRAY
sub _gibAlleTische {
	my ($self) = @_;
	
	my @liste = ();
	foreach my $tischName (sort keys(%{$self->gibTischDaten()})) {
		push(@liste, $self->gibTischDaten()->{$tischName});
	}
	return \@liste;
}
# VOID
sub _frageDenSpieler {
	my ($self, $verbindung, $spielerName, $nachricht) = @_;
	
	my $tisch = $CROUPIER->gibMeinenTisch($self->gibTischDaten(), $verbindung);
	my $spieler = $CROUPIER->gibSpielerAnhandName($tisch, $spielerName);
	if(!$spieler) {
		return $verbindung->antworte('timeout');
	}
	
	$spieler->{'verbindung'}->antworte('frageVonCroupier', $nachricht);
	$CROUPIER->warteAufSpielerantwort($self, $verbindung, $spielerName, $tisch->{'spielerTimeout'});
	return;
}
# VOID
sub _antwortAnDenCroupier {
	my ($self, $verbindung, $nachricht) = @_;
	
	my $spieler = $self->_gibSpielerAnhandVerbindung($verbindung);
	return if(!$spieler);
	
	my $erwarteteAntwort = delete($self->{'spielerAntwort'}->{$spieler->{'name'}});
	if($erwarteteAntwort && $erwarteteAntwort->{'gueltigBis'} >= Time::HiRes::time()) {
		$erwarteteAntwort->{'croupierVerbindung'}->antworte('ok', $nachricht);
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
sub _deponiereImSafe {
	my ($self, $verbindung, $kombination, $schatz) = @_;
	
	$self->{'safe'}->{$kombination} = $schatz;
	return $verbindung->antworte('ok');
}
# VOID
sub _schaueInSafe {
	my ($self, $verbindung, $kombination) = @_;
	
	my $schatz = $self->{'safe'}->{$kombination} || '';
	return $verbindung->antworte('ok', $schatz);
}
# VOID
sub neueNachricht {
	my ($self, $rawConnection, $textNachricht) = @_;
	
	my $verbindung = $self->_gibVerbindungFuer($rawConnection);
	#TOTO JSON entfernen
	my $nachricht = $self->_jsonToScalar($textNachricht);
	
	my $aktion = $nachricht->{'aktion'};
	if($aktion eq 'eroeffneTisch') {
		return $self->_eroeffneTisch(
			$verbindung, $nachricht->{'tischName'}, $nachricht->{'nameDesSpiels'},
			$nachricht->{'croupierName'}, $nachricht->{'croupierPasswort'},
			$nachricht->{'spielerTimeout'}
		);
	} elsif($aktion eq 'zeigeOffeneTische') {
		return $self->_zeigeOffeneTische($verbindung);
	} elsif($aktion eq 'spieleAnTisch') {
		return $self->_spieleAnTisch(
			$verbindung, $nachricht->{'tischName'}, $nachricht->{'spielerName'},
			$nachricht->{'spielerPasswort'}
		);
	} elsif($aktion eq 'zeigeSpielerDesTisches') {
		return $self->_zeigeSpielerDesTisches($verbindung);
	} elsif($aktion eq 'frageDenSpieler') {
		return $self->_frageDenSpieler($verbindung, $nachricht->{'spielerName'}, $nachricht->{'nachricht'});
	} elsif($aktion eq 'antwortAnDenCroupier') {
		return $self->_antwortAnDenCroupier($verbindung, $nachricht->{'nachricht'});
	} elsif($aktion eq 'deponiereImSafe') {
		return $self->_deponiereImSafe($verbindung, $nachricht->{'kombination'}, $nachricht->{'schatz'});
	} elsif($aktion eq 'schaueInSafe') {
		return $self->_schaueInSafe($verbindung, $nachricht->{'kombination'});
	} elsif($aktion eq 'RESET') {
		$self->_init();
		$verbindung->antworte('ok');
		return;
	}
	
	$verbindung->antworte('fehler', "Unbekannte Aktion");
	return;
}

1;
