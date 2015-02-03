package LOCAL::Casino::Verbindung;
use strict;
use warnings;

use Scalar::Util();

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
	
	return $self->_sende(
		# JSON->new()->utf8->encode(
		$self->_uebersetzeHashInKuerzel(
			{
				"status"	=> $status,# ok, fehler, timeout, frageVonCroupier
				"details"	=> $details,
			}
		)
	);
}
# STRING
sub _uebersetzeHashInKuerzel {
	my ($self, $daten) = @_;
	
	my $uebersetzung = {
		'ok'				=> 'o',
		'fehler'			=> 'e',
		'timeout'			=> 't',
		'frageVonCroupier'	=> 'q',
	};
	if(!$uebersetzung->{$daten->{'status'}}) {
		warn "Unbekannte Antwort: $daten->{'status'}";
		return '';
	}
	return $uebersetzung->{$daten->{'status'}} . ($daten->{'details'} || '');
}
1;
