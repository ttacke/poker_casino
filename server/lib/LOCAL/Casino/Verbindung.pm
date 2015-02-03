package LOCAL::Casino::Verbindung;
use strict;
use warnings;

use Scalar::Util();
use JSON();

# CONSTRUCTOR
sub new {
	my ($class, $rawConnection) = @_;
	
	return bless({
		rawConnection	=> $rawConnection,
	}, $class);
}
# BOOLEAN
sub istGleich {
	my ($self, $rawConnection) = @_;
	
	return 1 if($rawConnection == $self->{'rawConnection'});
	
	return 0;
}
# BOOLEAN
sub istOffen {
	my ($self) = @_;
	
	my $fh = $self->{'rawConnection'}->socket();
	if(
		Scalar::Util::openhandle($fh)
		&&
		tell($fh) != -1
	) {
		return 1;
	}
	
	return 0;
}
# BOOLEAN
sub sende {
	my ($self, $nachricht) = @_;
	
	return 0 if(!$self->istOffen());
	
	$self->{'rawConnection'}->send_utf8($nachricht);
	return 1;
}
# VOID
sub antworte {
	my ($self, $status, $details) = @_;
	
	#TODO ohne JSON!!
	my $daten = {
		"status"	=> $status,# ok, fehler, timeout
		"details"	=> $details,
	};
	$self->sende(
		JSON->new()->utf8->encode($daten)
	);
	return;
}
1;