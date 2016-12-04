package LOCAL::Gewinnermittlung;
use strict;
use warnings;
use Data::Dumper;

# CONSTRUCTOR
sub new {
	my ($class) = @_;
	return bless({}, $class);
}
# ARRAY
sub _clone {
	my ($self, $array) = @_;
	
	return [@$array];
}
# INT
sub gibPunkte {
	my ($self, $blatt) = @_;
	
	$blatt = $self->_sortiereKartenHoechsteZuerst($blatt);
	my $punkte = 0
		+ ($self->_gibRoyalFlushPunkte($blatt)		* (15 ** 14))
		+ ($self->_gibStraightFlushPunkte($blatt)	* (15 ** 13))
		+ ($self->_gibVierlingPunkte($blatt)		* (15 ** 12))
		+ ($self->_gibFlullhousePunkte($blatt)		* (15 ** 10))
		+ ($self->_gibFlushPunkte($blatt)			* (15 ** 9))
		+ ($self->_gibStraightPunkte($blatt)		* (15 ** 8))
		+ ($self->_gibDrillingPunkte($blatt)		* (15 ** 7))
		+ ($self->_gibZweiPaerchenPunkte($blatt)	* (15 ** 6))
		+ ($self->_gibEinPaerchenPunkte($blatt)	* (15 ** 5))
		+ ($self->_gibHighCardPunkte(1, $blatt)	* (15 ** 4))
		+ ($self->_gibHighCardPunkte(2, $blatt)	* (15 ** 3))
		+ ($self->_gibHighCardPunkte(3, $blatt)	* (15 ** 2))
		+ ($self->_gibHighCardPunkte(4, $blatt)	* (15 ** 1))
		+ ($self->_gibHighCardPunkte(5, $blatt)	* (15 ** 0))
	;
	return $punkte;
}
# ARRAY
sub _sortiereKartenHoechsteZuerst {
	my ($self, $blatt) = @_;
	
	return [ sort { $b->zahlwert() - $a->zahlwert() } @$blatt ];
}
# INT
sub _gibHighCardPunkte {
	my ($self, $kartenNr, $blatt) = @_;
	
	return 0 if(scalar(@$blatt) < $kartenNr);
	
	return $blatt->[$kartenNr - 1]->zahlwert();
};
# INT
sub _gibEinPaerchenPunkte {
	my ($self, $blatt) = @_;
	
	my $eins = $self->_gibMehrlingPunkte($blatt, 2, 1);
	my $zwei = $self->_gibMehrlingPunkte($blatt, 2, 2);
	return 0 if($zwei > 0);
	
	return $eins;
}
# INT
sub _gibMehrlingPunkte {
	my ($self, $blatt, $gesuchte_mehrling_anzahl, $gesuchteMehrlingNummer) = @_;
	
	my $mehrlingListe = $self->_gibWertMehrlingKarten($blatt, $gesuchte_mehrling_anzahl);
	$mehrlingListe = $self->_sortiereKartenHoechsteZuerst($mehrlingListe);
	if(scalar(@$mehrlingListe) < $gesuchteMehrlingNummer) {
		return 0;
	}
	return $mehrlingListe->[$gesuchteMehrlingNummer - 1]->zahlwert();
}
# INT
sub _gibWertMehrlingKarten {
	my ($self, $blatt, $gesuchte_mehrling_anzahl) = @_;
	
	my $mehrlinge = $self->_gruppiereZahlwerte($blatt);
	my $gefundene_mehrlinge = [];
	foreach my $zahlwert (keys(%$mehrlinge)) {
		if(scalar(@{$mehrlinge->{$zahlwert}}) == $gesuchte_mehrling_anzahl) {
			push(@$gefundene_mehrlinge, $mehrlinge->{$zahlwert}->[0]);
		}
	}
	return $gefundene_mehrlinge;
}
# HASH
sub _gruppiereZahlwerte {
	my ($self, $blatt) = @_;
	
	my $zahlwerte = {};
	foreach my $karte (@$blatt) {
		$zahlwerte->{$karte->zahlwert()} ||= [];
		push(@{$zahlwerte->{$karte->zahlwert()}}, $karte);
	}
	return $zahlwerte;
}
# INT
sub _gibZweiPaerchenPunkte {
	my ($self, $blatt) = @_;
	
	my $eins = $self->_gibMehrlingPunkte($blatt, 2, 1);
	my $zwei = $self->_gibMehrlingPunkte($blatt, 2, 2);
	
	return 0 if($eins == 0 || $zwei == 0);
	
	return $eins;
}
# INT
sub _gibVierlingPunkte {
	my ($self, $blatt) = @_;
	
	return $self->_gibMehrlingPunkte($blatt, 4, 1);
}
# INT
sub _gibDrillingPunkte {
	my ($self, $blatt) = @_;
	
	return $self->_gibMehrlingPunkte($blatt, 3, 1);
}
# ARRAY
sub _kombiniereAlleElemente {
	my ($self, $hand, $board) = @_;
	
	my $kombinationen = [];
	for(my $hand_i = 0; $hand_i < scalar(@$hand); $hand_i++) {
		for(my $board_i = 0; $board_i < scalar(@$board); $board_i++) {
			my $tmp = [@$board];
			$tmp->[$board_i] = $hand->[$hand_i];
			push(@$kombinationen, $tmp);
		}
	}
	for(my $i = 0; $i < scalar(@$board); $i++) {
		for(my $ii = $i + 1; $ii < scalar(@$board); $ii++) {
			my $tmp = [@$board];
			$tmp->[$i] = $hand->[0];
			$tmp->[$ii] = $hand->[1];
			push(@$kombinationen, $tmp);
		}
	}
	return $kombinationen;
}
# ARRAY
sub gibBestesBlatt {
	my ($self, $hand, $board) = @_;
	
	my $kombinationen = $self->_kombiniereAlleElemente($hand, $board);
	push(@$kombinationen, $board);
	
	my $maxPunkte = 0;
	my $maxBlatt = undef;
	for(my $i = 0; $i < scalar(@$kombinationen); $i++) {
		my $blatt = $kombinationen->[$i];
		my $punkte = $self->gibPunkte($blatt);
		if($punkte > $maxPunkte) {
			$maxPunkte = $punkte;
			$maxBlatt = $blatt;
		}
	}
	return $maxBlatt;
}
# INT
sub _gibFlullhousePunkte {
	my ($self, $blatt) = @_;
	
	my $drilling = $self->_gibWertMehrlingKarten($blatt, 3);
	return 0 if(scalar(@$drilling) == 0);
	
	my $paar = $self->_gibWertMehrlingKarten($blatt, 2);
	return 0 if(scalar(@$paar) == 0);
	
	return ($drilling->[0]->zahlwert() * 15) + ($paar->[0]->zahlwert() * 1);
}
# INT
sub _gibRoyalFlushPunkte {
	my ($self, $blatt) = @_;
	
	my $punkte = $self->_gibStraightFlushPunkte($blatt);
	return 0 if($punkte != 14);
	
	return 1;
}
# INT
sub _gibStraightFlushPunkte {
	my ($self, $blatt) = @_;
	
	my $straightPunkte = $self->_gibStraightPunkte($blatt);
	my $flushPunkte = $self->_gibFlushPunkte($blatt);
	return 0 if($straightPunkte == 0 || $flushPunkte == 0);
	
	return $straightPunkte;# Wegen assStraight
}
# INT
sub _gibFlushPunkte {
	my ($self, $blatt) = @_;
	
	my $letzteKarte = undef;
	for(my $i = 0; $i < scalar(@$blatt); $i++) {
		if(!defined($letzteKarte)) {
			$letzteKarte = $blatt->[$i];
			next;
		}
		if($letzteKarte->farbe() ne $blatt->[$i]->farbe()) {
			return 0;
		}
	}
	return $blatt->[0]->zahlwert();
};
# INT
sub _gibStraightPunkte {
	my ($self, $blatt) = @_;
	
	my $punkte = $self->_gibNormaleStraightPunkte($blatt);
	$punkte = $self->_gibAssStraightPunkte($blatt) if(!$punkte);
	return $punkte;
}
# INT
sub _gibAssStraightPunkte {
	my ($self, $blatt) = @_;
	
	return 0 if($blatt->[0]->bezeichnung() ne 'A');
	
	my $assStraightBlatt = [];
	for(my $i = 1; $i < scalar(@$blatt); $i++) {
		push(@$assStraightBlatt, $blatt->[$i]);
	}
	push(@$assStraightBlatt, LOCAL::Spielkarte->new('1', '?'));
	return $self->_gibNormaleStraightPunkte($assStraightBlatt);
}
# INT
sub _gibNormaleStraightPunkte {
	my ($self, $blatt) = @_;
	
	my $vorherigeKarte = undef;
	for(my $i = 0; $i < scalar(@$blatt); $i++) {
		my $karte = $blatt->[$i];
		if($vorherigeKarte) {
			if($vorherigeKarte->zahlwert() != $karte->zahlwert() + 1) {
				return 0;
			}
		}
		$vorherigeKarte = $karte;
	}
	return $blatt->[0]->zahlwert() * 1;
}
1;