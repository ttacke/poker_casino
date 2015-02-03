package LOCAL::Casino::Croupier;
use strict;
use warnings;

# VOID
sub warteAufSpielerantwort {
	my ($class, $casino, $croupierVerbindung, $spielerName, $timeout) = @_;
	
	my $spielerAntwortDaten = $casino->gibSpielerAntwortDaten();
	$SIG{'ALRM'} ||= sub {
		my $spielerAntwortDaten = $casino->gibSpielerAntwortDaten();
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
sub gibMeinenTisch {
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
sub gibSpielerAnhandName {
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
	return $croupierVerbindung->antworte('ok', \@liste);
}
# VOID
sub eroeffneTisch {
	my (
		$class, $tischDaten, $verbindung, $tischName, $nameDesSpiels, $croupierName,
		$croupierPasswort, $spielerTimeoutInMillisekunden
	) = @_;
	
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
1;
