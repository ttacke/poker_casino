package LOCAL::Casino::Croupier;
use strict;
use warnings;

my $JSON = JSON->new();

# VOID
sub _warteAufSpielerantwort {
	my ($class, $gibSpielerAntwortenFunc, $croupierVerbindung, $spielerName, $timeout) = @_;
	
	my $spielerAntwortDaten = &$gibSpielerAntwortenFunc();
	$SIG{'ALRM'} ||= sub {
		my $spielerAntwortDaten = &$gibSpielerAntwortenFunc();
		foreach my $spielerName (keys(%{$spielerAntwortDaten})) {
			my $erwarteteAntwort = $spielerAntwortDaten->{$spielerName};
			if($erwarteteAntwort->{'gueltigBis'} < Time::HiRes::time()) {
				$erwarteteAntwort->{'croupierVerbindung'}->antworte('timeout');
				delete($spielerAntwortDaten->{$spielerName});
			}
		}
	};
	my $timeoutTimestamp = Time::HiRes::time() + $timeout;
	$spielerAntwortDaten->{$spielerName} = {
		gueltigBis			=> $timeoutTimestamp,
		croupierVerbindung	=> $croupierVerbindung,
	};
	Time::HiRes::alarm($timeout * 1.01);
	return;
}
# \HASH || NULL
sub _gibMeinenTisch {
	my ($class, $tischDaten, $croupierVerbindung) = @_;
	
	foreach my $tischName (keys(%{$tischDaten})) {
		my $tisch = $tischDaten->{$tischName};
		if($tisch->{'croupier'}->{'verbindung'} == $croupierVerbindung) {
			return $tisch;
		}
	}
	return undef;
}
# HASH || NULL
sub _gibSpielerAnhandName {
	my ($class, $tisch, $spielerName) = @_;
	
	foreach my $spieler (@{$tisch->{'spieler'}}) {
		return $spieler if($spieler->{'name'} eq $spielerName);
	}
	return undef;
}
# VOID
sub zeigeSpielerDesTisches {
	my ($class, $tischDaten, $croupierVerbindung) = @_;
	
	my @liste = ();
	foreach my $tischName (keys(%{$tischDaten})) {
		my $tisch = $tischDaten->{$tischName};
		if($tisch->{'croupier'}->{'verbindung'} == $croupierVerbindung) {
			foreach my $spieler (@{$tisch->{'spieler'}}) {
				push(@liste, $spieler->{'name'});
			}
		}
	}
	return $croupierVerbindung->antworte('ok', $JSON->utf8->encode(\@liste));
}
# VOID
sub eroeffneTisch {
	my (
		$class, $tischDaten, $verbindung, $tischName, $nameDesSpiels, $croupierName,
		$croupierPasswort, $spielerTimeoutInMillisekunden
	) = @_;
	
	if($spielerTimeoutInMillisekunden <= 0) {
		$spielerTimeoutInMillisekunden = 1;
	}
	
	my $timeoutInSekunden = ($spielerTimeoutInMillisekunden / 1000) || 0.05;
	my $bestehenderTisch = $tischDaten->{$tischName};
	if(!$bestehenderTisch) {
		$tischDaten->{$tischName} = {
			name			=> $tischName,
			spieler			=> [],
			nameDesSpiels	=> $nameDesSpiels,
			spielerTimeout	=> $timeoutInSekunden,
			croupier		=> {
				name			=> $croupierName,
				passwort		=> $croupierPasswort,
				verbindung		=> $verbindung,
			},
		};
	} else {
		my $croupier = $bestehenderTisch->{'croupier'};
		if(
			$croupier->{'name'} eq $croupierName
			&& $croupier->{'passwort'} eq $croupierPasswort
		) {
			$croupier->{'verbindung'} = $verbindung;
			$bestehenderTisch->{'spielerTimeout'} = $timeoutInSekunden;
		} else {
			return $verbindung->antworte('fehler', 'Dieser Tisch gehoert jemand anderem');
		}
	}
	return $verbindung->antworte('ok');
}
# VOID
sub frageDenSpieler {
	my ($class, $gibSpielerAntwortenFunc, $tischDaten, $verbindung, $spielerName, $nachricht) = @_;
	
	my $tisch = $class->_gibMeinenTisch($tischDaten, $verbindung);
	my $spieler = $class->_gibSpielerAnhandName($tisch, $spielerName);
	if(!$spieler) {
		return $verbindung->antworte('timeout');
	}
	
	$spieler->{'verbindung'}->antworte('frageVonCroupier', $nachricht);
	$class->_warteAufSpielerantwort($gibSpielerAntwortenFunc, $verbindung, $spielerName, $tisch->{'spielerTimeout'});
	return;
}
1;
