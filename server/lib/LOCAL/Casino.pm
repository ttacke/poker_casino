package LOCAL::Casino;
use strict;
use warnings;

use lib './lib';

BEGIN { $ENV{PERL_JSON_BACKEND} = 'JSON::PP' }
use JSON -support_by_pp, -no_export;
use Time::HiRes();

use LOCAL::Casino::Verbindung();
use LOCAL::Casino::Croupier();
use LOCAL::Casino::Besucher();
use LOCAL::Casino::Spieler();
my $CROUPIER = 'LOCAL::Casino::Croupier';
my $BESUCHER = 'LOCAL::Casino::Besucher';
my $SPIELER = 'LOCAL::Casino::Spieler';

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
#sub _jsonToScalar {
#	my ($self, $textNachricht) = @_;
#	
#	return eval {
#		return JSON->new()->utf8->decode($textNachricht);
#	};
#}
# \HASH || NULL
sub _gibSpielerAnhandVerbindung {
	my ($self, $verbindung) = @_;
	
	my $alleTische = $BESUCHER->gibAlleTische($self->{'tische'});
	foreach my $tisch (@{$alleTische}) {
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
	# my $nachricht = $self->_jsonToScalar($textNachricht);
	my $nachricht = $self->_uebersetzeKuerzelZuHash($textNachricht);
	my $aktion = $nachricht->{'aktion'};
	if($aktion eq 'zeigeOffeneTische') {
		return $BESUCHER->zeigeOffeneTische(
			$self->{'tische'},
			$verbindung
		);
	} elsif($aktion eq 'deponiereImSafe') {
		return $BESUCHER->deponiereImSafe(
			$self->{'safe'},
			$verbindung,
			$nachricht->{'kombination'},
			$nachricht->{'schatz'}
		);
	} elsif($aktion eq 'zeigeSafeInhalt') {
		return $BESUCHER->zeigeSafeInhalt(
			$self->{'safe'},
			$verbindung,
			$nachricht->{'kombination'}
		);
		
	} elsif($aktion eq 'eroeffneTisch') {
		return $CROUPIER->eroeffneTisch(
			$self->{'tische'},
			$verbindung,
			$nachricht->{'tischName'},
			$nachricht->{'nameDesSpiels'},
			$nachricht->{'croupierName'},
			$nachricht->{'croupierPasswort'},
			$nachricht->{'spielerTimeout'}
		);
	} elsif($aktion eq 'zeigeSpielerDesTisches') {
		return $CROUPIER->zeigeSpielerDesTisches(
			$self->{'tische'},
			$verbindung
		);
	} elsif($aktion eq 'frageDenSpieler') {
		return $CROUPIER->frageDenSpieler(
			sub {
				return $self->{'spielerAntwort'};
			},
			$self->{'tische'},
			$verbindung,
			$nachricht->{'spielerName'},
			$nachricht->{'nachricht'},
			sub {
				return $self->{'tische'};
			}
		);
		
	} elsif($aktion eq 'spieleAnTisch') {
		return $SPIELER->spieleAnTisch(
			$self->{'tische'},
			$verbindung,
			$nachricht->{'tischName'},
			$nachricht->{'spielerName'},
			$nachricht->{'spielerPasswort'}
		);
	} elsif($aktion eq 'antwortAnDenCroupier') {
		return $SPIELER->antwortAnDenCroupier(
			$self->_gibSpielerAnhandVerbindung($verbindung),
			$self->{'spielerAntwort'},
			$nachricht->{'nachricht'}
		);
		
	} elsif($aktion eq 'RESET-ef84ab0c-5df1-4ff3-811b-706c3c92c6f5') {
		$self->_init();
		$verbindung->antworte('ok');
		return;
	}
	
	$verbindung->antworte('fehler', "Unbekannte Aktion");
	return;
}
# \HASH
sub _uebersetzeKuerzelZuHash {
	my ($self, $kuerzel) = @_;
	
	$kuerzel =~ s/^(.)//;
	my ($aktion) = $1;
	
	my @p = split(/\n/, $kuerzel);
	if($aktion eq 'o') {
		return {
			"aktion"			=> "eroeffneTisch",
			"tischName"			=> $p[0],
			"nameDesSpiels"		=> $p[1],
			"croupierName"		=> $p[2],
			"croupierPasswort"	=> $p[3],
			"spielerTimeout"	=> $p[4],
		};
	} elsif($aktion eq 'd') {
		return {
			"aktion"		=> "deponiereImSafe",
			"kombination"	=> $p[0],
			"schatz"		=> $p[1],
		};
	} elsif($aktion eq 'g') {
		return {
			"aktion"		=> "zeigeSafeInhalt",
			"kombination"	=> $p[0],
		};
	} elsif($aktion eq 'l') {
		return {
			"aktion"	=> "zeigeOffeneTische"
		};
	} elsif($aktion eq 'p') {
		return {
			"aktion"			=> "spieleAnTisch",
			"tischName"			=> $p[0],
			"spielerName"		=> $p[1],
			"spielerPasswort"	=> $p[2],
		};
	} elsif($aktion eq 'v') {
		return {
			"aktion"	=> "zeigeSpielerDesTisches",
		};
	} elsif($aktion eq 'q') {
		return {
			"aktion"		=> "frageDenSpieler",
			"spielerName"	=> $p[0],
			"nachricht"		=> $p[1],
		};
	} elsif($aktion eq 'r') {
		return {
			"aktion"	=> "antwortAnDenCroupier",
			"nachricht"	=> $p[0],
		};
	} elsif($aktion eq 'x') {
		return {
			'aktion'	=> 'RESET' . $p[0],
		};
	}
	return {};
}

1;
