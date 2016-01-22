package LOCAL::Casino::Croupier;
use strict;
use warnings;

my $JSON = JSON->new();

# VOID
sub _erhoeheTimeoutzaehler {
	my ($class, $spielerName, $gibTischeFunc, $tischName) = @_;
	
	my $tischDaten = &$gibTischeFunc();
	foreach my $spieler (@{$tischDaten->{$tischName}->{'spieler'}}) {
		if($spieler->{'name'} eq $spielerName) {
			$spieler->{'timeoutDaten'}->{'timeoutsInFolge'}++;
			return;
		}
	}
	return;
}
# VOID
sub _warteAufSpielerantwort {
	my ($class, $gibSpielerAntwortenFunc, $croupierVerbindung, $spielerName, $timeout, $gibTischeFunc, $tischName) = @_;
	
	my $spielerAntwortDaten = &$gibSpielerAntwortenFunc();
	$SIG{'ALRM'} ||= sub {
		my $spielerAntwortDaten = &$gibSpielerAntwortenFunc();
		foreach my $spielerName (keys(%{$spielerAntwortDaten})) {
			my $erwarteteAntwort = $spielerAntwortDaten->{$spielerName};
			if($erwarteteAntwort->{'gueltigBis'} < Time::HiRes::time()) {
				$erwarteteAntwort->{'croupierVerbindung'}->antworte('timeout');
				$class->_erhoeheTimeoutzaehler($spielerName, $gibTischeFunc, $tischName);
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
		next if(!$tisch->{'croupier'}->{'verbindung'});
		
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
	my ($class, $gibSpielerAntwortenFunc, $tischDaten, $verbindung, $spielerName, $nachricht, $gibTischeFunc) = @_;
	
	my $tisch = $class->_gibMeinenTisch($tischDaten, $verbindung);
	my $spieler = $class->_gibSpielerAnhandName($tisch, $spielerName);
	if(!$spieler) {
		return $verbindung->antworte('timeout');
	}
	
	if($class->_zuVieleTimeoutsInFolge($spieler)) {
		if($class->_timeoutstrafzeitLaeuftNoch($spieler)) {
			return $verbindung->antworte('timeout');
		}
		$class->_timeoutStrafzeitNeuStarten($spieler);
	}
	$spieler->{'verbindung'}->antworte('frageVonCroupier', $nachricht);
	$class->_warteAufSpielerantwort($gibSpielerAntwortenFunc, $verbindung, $spielerName, $tisch->{'spielerTimeout'}, $gibTischeFunc, $tisch->{'name'});
	return;
}
# BOOLEAN
sub _zuVieleTimeoutsInFolge {
	my ($class, $spieler) = @_;
	
	return 1 if($spieler->{'timeoutDaten'}->{'timeoutsInFolge'} >= 10);
	
	return 0;
}
# VOID
sub _timeoutStrafzeitNeuStarten {
	my ($class, $spieler) = @_;
	
	$spieler->{'timeoutDaten'}->{'strafzeitStart'} = Time::HiRes::time();
	return;
}
# BOOLEAN
sub _timeoutstrafzeitLaeuftNoch {
	my ($class, $spieler) = @_;
	
	return 1 if(Time::HiRes::time() - $spieler->{'timeoutDaten'}->{'strafzeitStart'} < 10.0);
	
	return 0;
}
1;
