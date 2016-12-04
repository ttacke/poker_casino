use strict;
use warnings;
use lib 'lib';

use Data::Dumper;
use LOCAL::Gewinnermittlung();
use LOCAL::Spielkarte();

my $ermittler = LOCAL::Gewinnermittlung->new();

warn _gibBlattPunkte("A♠ K♠ Q♠ J♠ 10♠");

#BIGINT: 18.446.744.073.709.551.615
#Ist:        56.440.231.070.630.625

# INT
sub _gibBlattPunkte {
	my (@karten) = @_;
	
	my $set = [];
	foreach my $k (@karten) {
		my ($bezeichnung, $farbe) = $k =~ m#^([0-9JQKA]+)(.*)$#;
		push(@$set, LOCAL::Spielkarte->new($bezeichnung, $farbe));
	}
	return $ermittler->gibPunkte($set);
};