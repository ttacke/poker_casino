use strict;
use warnings;
use lib './lib';

use Data::Dumper;
use LOCAL::Gewinnermittlung();
use LOCAL::Spielkarte();

my $ermittler = LOCAL::Gewinnermittlung->new();

# VOID
sub test {
	my ($setA, $soll, $setB) = @_;
	
	my ($blattA, @kartenA) = _erzeuge_set($setA);
	my ($blattB, @kartenB) = _erzeuge_set($setB);
	my $punkteA = _gibBlattPunkte(@kartenA);
	my $punkteB = _gibBlattPunkte(@kartenB);
	
	my $ist = '?';
	$ist = 'schlaegt' if($punkteA > $punkteB);
	$ist = 'splitted' if($punkteA == $punkteB);
	$ist = 'unterliegt' if($punkteA < $punkteB);
	
	if("$blattA $ist $blattB" ne "$blattA $soll $blattB") {
		die "IST: $setA $ist $setB --> SOLL: $setA $soll $setB";
	}
}
# ARRAY
sub _erzeuge_set {
	my ($set) = @_;
	
	my ($name, @karten) = split(/ +/, $set);
	return ($name, @karten);
}
# INT
sub _gibBesteKombination {
	my ($hand, $board) = @_;
	
	my @hand = ();
	foreach my $k (_erzeuge_set($hand)) {
		my ($bezeichnung, $farbe) = $k =~ m#^([0-9JQKA]+)(.*)$#;
		push(@hand, LOCAL::Spielkarte->new($bezeichnung, $farbe));
	}
	my @board = ();
	foreach my $k (_erzeuge_set($board)) {
		my ($bezeichnung, $farbe) = $k =~ m#^([0-9JQKA]+)(.*)$#;
		push(@board, LOCAL::Spielkarte->new($bezeichnung, $farbe));
	}
	my $blatt = $ermittler->gibBestesBlatt(
		\@hand,
		\@board
	);
	return $blatt;
};
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
# VOID
sub generateCombinationSpec {
	my ($soll, $text) = @_;
	
	my ($hand, $board) = $text =~ m/.*'([^']*)'.*'([^']*)'.*/;
	
	my @istBlatt = sort {
		return ($a->zahlwert() + ($a->farbwert() / 10)) <=> ($b->zahlwert() + ($b->farbwert() / 10))
	} @{ _gibBesteKombination($hand, $board) };
	
	my $ist = [];
	for(my $i = 0; $i < scalar(@istBlatt); $i++) {
		push(@$ist, $istBlatt[$i]->toString());
	}
	if(join(' ', @$ist) ne $soll) {
		die "Das Beste Blatt muss $soll sein, $text";
	}
}

test("HighCard A♦ 10♦ 9♠ 5♣ 4♣", 'schlaegt', "HighCard K♣ Q♦ J♣ 8♥ 7♥");
__END__
test("HighCard A♦ 10♦ 9♠ 5♣ 4♣", 'schlaegt', "HighCard A♣ 9♦ 8♥ 5♠ 4♠");
test("HighCard Q♣ J♣ 5♦", 'unterliegt', "HighCard K♦ 10♦ 5♣");
test("EinPaar 9♥ 9♣ 2♥ Q♦ 10♦", 'schlaegt', "HighCard A♦ Q♦ 9♠ 10♣ 4♣");
test("EinPaar 10♣ 10♠ 6♠ 4♥ 2♥", 'schlaegt', "EinPaar 9♥ 9♣ A♥ Q♦ 10♦");
test("EinPaar 10♥ 10♦ J♦ 3♥ 2♣", 'schlaegt', "EinPaar 10♣ 10♠ 6♠ 4♥ 2♥");
test("EinPaar 10♥ 10♦ J♦ 4♥ 3♣", 'schlaegt', "EinPaar 10♣ 10♠ J♠ 4♦ 2♥");
test("ZweiPaare  7♦ 7♠ 10♠ 10♣ 9♠", 'schlaegt', "EinPaar 10♥ 10♦ J♦ 4♥ 3♣");
test("ZweiPaare K♥ K♦ 2♣ 2♦ J♥", 'schlaegt', "ZweiPaare  J♦ J♠ 10♠ 10♣ 9♠");
test("ZweiPaare 4♠ 4♣ 3♠ 3♥ K♦", 'schlaegt', "ZweiPaare 4♥ 4♦ 3♦ 3♣ 10♠");
test("Drilling 5♣ 5♥ 5♦ Q♦ 10♣", 'schlaegt', "ZweiPaare 4♠ 4♣ 3♠ 3♥ K♦");
test("Drilling 8♠ 8♥ 8♦ 5♠ 3♣", 'schlaegt', "Drilling 5♣ 5♥ 5♦ Q♦ 10♣");
test("Drilling 8♠ 8♥ 8♦ A♣ 2♦", 'schlaegt', "Drilling 8♣ 8♥ 8♦ 5♠ 3♣");
test("Straight 6♦ 5♠ 4♦ 3♥ 2♣", 'schlaegt', "Drilling 8♠ 8♥ 8♦ A♣ 2♦");
test("Straight 5♠ 4♠ 3♥ 2♥ A♠", 'schlaegt', "Drilling 8♠ 8♥ 8♦ A♣ 2♦");
test("Straight 8♠ 7♠ 6♥ 5♥ 4♠", 'schlaegt', "Straight 6♦ 5♠ 4♦ 3♥ 2♣");
test("Straight 8♠ 7♠ 6♥ 5♥ 4♠", 'splitted', "Straight 8♥ 7♦ 6♣ 5♣ 4♥");
test("Flush K♠ Q♠ J♠ 9♠ 6♠", 'schlaegt', "Straight 8♠ 7♠ 6♥ 5♥ 4♠");
test("Flush A♥ Q♥ 10♥ 5♥ 3♥", 'schlaegt', "Flush K♠ Q♠ J♠ 9♠ 6♠");
test("Flush A♦ K♦ 7♦ 6♦ 2♦", 'schlaegt', "Flush A♥ Q♥ 10♥ 5♥ 3♥");
test("Flush Q♥ 10♥ 9♥ 5♥ 2♥", 'splitted', "Flush Q♠ 10♠ 9♠ 5♠ 2♠");
test("FullHouse  9♥ 9♣ 9♠ A♥ A♣", 'schlaegt', "Flush Q♥ 10♥ 9♥ 5♥ 2♥");
test("FullHouse 10♠ 10♥ 10♦ 4♠ 4♦", 'schlaegt', "FullHouse  9♥ 9♣ 9♠ A♥ A♣");
test("FullHouse 10♠ 10♥ 10♦ 4♠ 4♦", 'schlaegt', "FullHouse 10♥ 10♣ 10♠ 3♥ 3♣");
test("FullHouse Q♥ Q♦ Q♣ 8♥ 8♣", 'splitted', "FullHouse Q♥ Q♦ Q♠ 8♥ 8♣");
test("Vierling 6♦ 6♥ 6♠ 6♣ K♠", 'schlaegt', "FullHouse Q♥ Q♦ Q♣ 8♥ 8♣");
test("Vierling 10♣ 10♦ 10♥ 10♠ 5♦", 'schlaegt', "Vierling 6♦ 6♥ 6♠ 6♣ K♠");
test("Vierling 10♣ 10♦ 10♥ 10♠ Q♣", 'schlaegt', "Vierling 10♣ 10♦ 10♥ 10♠ 5♦");
test("Vierling 10♣ 10♦ 10♥ 10♠ Q♣", 'splitted', "Vierling 10♣ 10♦ 10♥ 10♠ Q♦");
test("StraightFlush 5♠ 4♠ 3♠ 2♠ A♠", 'schlaegt', "Vierling 10♣ 10♦ 10♥ 10♠ Q♣");
test("StraightFlush 5♠ 4♠ 3♠ 2♠ A♠", 'splitted', "StraightFlush 5♠ 4♠ 3♠ 2♠ A♠");
test("StraightFlush 7♥ 6♥ 5♥ 4♥ 3♥", 'schlaegt', "StraightFlush 5♠ 4♠ 3♠ 2♠ A♠");
test("StraightFlush J♣ 10♣ 9♣ 8♣ 7♣", 'splitted', "StraightFlush J♦ 10♦ 9♦ 8♦ 7♦");
test("RoyalFlush A♣ K♣ Q♣ J♣ 10♣", 'schlaegt', "StraightFlush K♠ Q♠ J♠ 10♠ 9♠");
test("RoyalFlush A♣ K♣ Q♣ J♣ 10♣", 'splitted', "RoyalFlush A♠ K♠ Q♠ J♠ 10♠");
test("FakeFlush 6♣ J♣ Q♥ 4♣ 7♣", 'unterliegt', "Flush Q♥ 10♥ 9♥ 5♥ 2♥");

my $soll = "8♦ 8♥ 8♠ A♠ A♣";
generateCombinationSpec($soll, "wenn man '2♦ 3♥' und '8♠ 8♥ 8♦ A♣ A♠' hat");
generateCombinationSpec($soll, "wenn man '2♦ 8♠' und '3♥ 8♥ 8♦ A♣ A♠' hat");
generateCombinationSpec($soll, "wenn man '2♦ 8♥' und '8♠ 3♥ 8♦ A♣ A♠' hat");
generateCombinationSpec($soll, "wenn man '2♦ 8♦' und '8♠ 8♥ 3♥ A♣ A♠' hat");
generateCombinationSpec($soll, "wenn man '2♦ A♣' und '8♠ 8♥ 8♦ 3♥ A♠' hat");
generateCombinationSpec($soll, "wenn man '2♦ A♠' und '8♠ 8♥ 8♦ A♣ 3♥' hat");
generateCombinationSpec($soll, "wenn man '8♠ 3♥' und '2♦ 8♥ 8♦ A♣ A♠' hat");
generateCombinationSpec($soll, "wenn man '8♥ 3♥' und '8♠ 2♦ 8♦ A♣ A♠' hat");
generateCombinationSpec($soll, "wenn man '8♦ 3♥' und '8♠ 8♥ 2♦ A♣ A♠' hat");
generateCombinationSpec($soll, "wenn man 'A♣ 3♥' und '8♠ 8♥ 8♦ 2♦ A♠' hat");
generateCombinationSpec($soll, "wenn man 'A♠ 3♥' und '8♠ 8♥ 8♦ A♣ 2♦' hat");
generateCombinationSpec($soll, "wenn man '8♠ 8♥' und '2♦ 3♥ 8♦ A♣ A♠' hat");
generateCombinationSpec($soll, "wenn man '8♠ 8♦' und '2♦ 8♥ 3♥ A♣ A♠' hat");
generateCombinationSpec($soll, "wenn man '8♠ A♣' und '2♦ 8♥ 8♦ 3♥ A♠' hat");
generateCombinationSpec($soll, "wenn man '8♠ A♠' und '2♦ 8♥ 8♦ A♣ 3♥' hat");
generateCombinationSpec($soll, "wenn man '8♥ 8♦' und '8♠ 2♦ 3♥ A♣ A♠' hat");
generateCombinationSpec($soll, "wenn man '8♥ A♣' und '8♠ 2♦ 8♦ 3♥ A♠' hat");
generateCombinationSpec($soll, "wenn man '8♥ A♠' und '8♠ 2♦ 8♦ A♣ 3♥' hat");
generateCombinationSpec($soll, "wenn man '8♦ A♣' und '8♠ 8♥ 2♦ 3♥ A♠' hat");
generateCombinationSpec($soll, "wenn man '8♦ A♠' und '8♠ 8♥ 2♦ A♣ 3♥' hat");
generateCombinationSpec($soll, "wenn man 'A♣ A♠' und '8♠ 8♥ 8♦ 2♦ 3♥' hat");
