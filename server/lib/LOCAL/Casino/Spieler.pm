package LOCAL::Casino::Spieler;
use strict;
use warnings;

# VOID
sub spieleAnTisch {
	my ($class, $tischDaten, $verbindung, $tischName, $spielerName, $spielerPasswort) = @_;
	
	my $tisch = $tischDaten->{$tischName};
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
		passwort		=> $spielerPasswort,
		verbindung		=> $verbindung,
		timeoutDaten	=> {
			timeoutsInFolge	=> 0,
			strafzeitStart	=> 0,
		},
	});
	return $verbindung->antworte('ok');
}
# VOID
sub _setzeTimeoutStrafeZurueck {
	my ($class, $spieler) = @_;
	
	$spieler->{'timeoutDaten'}->{'timeoutsInFolge'} = 0;
	$spieler->{'timeoutDaten'}->{'strafzeitStart'} = 0;
	return;
}
# VOID
sub antwortAnDenCroupier {
	my ($class, $spieler, $spielerAntwortDaten, $nachricht) = @_;
	
	return if(!$spieler);
	
	my $erwarteteAntwort = delete($spielerAntwortDaten->{$spieler->{'name'}});
	if($erwarteteAntwort && $erwarteteAntwort->{'gueltigBis'} >= Time::HiRes::time()) {
		$class->_setzeTimeoutStrafeZurueck($spieler);
		$erwarteteAntwort->{'croupierVerbindung'}->antworte('ok', $nachricht);
	}
	return;
}
1;