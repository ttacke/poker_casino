package LOCAL::Spielkarte;
use strict;
use warnings;

# CONSTRUCTOR
sub new {
	my ($class, $bezeichnung, $farbe) = @_;
	return bless({
		zahlwert	=> $class->_berechne_zahlwert($bezeichnung),
		farbwert	=> $class->_berechne_farbwert($farbe),
		bezeichnung	=> $bezeichnung,
		farbe		=> $farbe,
	}, $class);
}
# STRING
sub farbe {
	my ($self) = @_;
	
	return $self->{'farbe'};
}
# STRING
sub bezeichnung {
	my ($self) = @_;
	
	return $self->{'bezeichnung'};
}
# INT
sub zahlwert {
	my ($self) = @_;
	
	return $self->{'zahlwert'};
}
# INT
sub farbwert {
	my ($self) = @_;
	
	return $self->{'farbwert'};
}
# INT
sub _berechne_zahlwert {
	my ($class, $bezeichnung) = @_;
	return 14 if($bezeichnung eq 'A');
	return 13 if($bezeichnung eq 'K');
	return 12 if($bezeichnung eq 'Q');
	return 11 if($bezeichnung eq 'J');
	return $bezeichnung * 1;
}
# INT
sub _berechne_farbwert {
	my ($class, $farbe) = @_;
	return 1 if($farbe eq '♦');
	return 2 if($farbe eq '♥');
	return 3 if($farbe eq '♠');
	return 4 if($farbe eq '♣');
}
# STRING
sub toString {
	my ($self) = @_;
	
	return $self->{'bezeichnung'} . $self->{'farbe'};
}
1;
