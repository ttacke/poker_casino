package LOCAL::Casino::Besucher;
use strict;
use warnings;

my $JSON = JSON->new();

# VOID
sub zeigeOffeneTische {
	my ($class, $tischDaten, $verbindung) = @_;
	
	my $alleTische = $class->gibAlleTische($tischDaten);
	my @liste = ();
	foreach my $tisch (@{$alleTische}) {
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
	return $verbindung->antworte('ok', $JSON->utf8->encode(\@liste));
}
# \ARRAY
sub gibAlleTische {
	my ($class, $tischDaten) = @_;
	
	my @liste = ();
	foreach my $tischName (sort keys(%{$tischDaten})) {
		push(@liste, $tischDaten->{$tischName});
	}
	return \@liste;
}
# VOID
sub deponiereImSafe {
	my ($self, $safeDaten, $verbindung, $kombination, $schatz) = @_;
	
	$safeDaten->{$kombination} = $schatz;
	return $verbindung->antworte('ok');
}
# VOID
sub zeigeSafeInhalt {
	my ($self, $safeDaten, $verbindung, $kombination) = @_;
	
	my $schatz = $safeDaten->{$kombination} || '';
	return $verbindung->antworte('ok', $schatz);
}
1;