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
sub _sende {
	my ($self, $nachricht) = @_;
	
	return if(!$self->istOffen());
	
	$self->{'rawConnection'}->send_utf8($nachricht);
	return;
}
# VOID
sub antworte {
	my ($self, $status, $details) = @_;
	
	#TODO ohne JSON!!
	return $self->_sende(
		JSON->new()->utf8->encode({
			"status"	=> $status,# ok, fehler, timeout, frageVonCroupier
			"details"	=> $details,
		})
	);
}
1;