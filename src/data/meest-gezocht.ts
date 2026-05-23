export interface MeestGezocht {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  location: string;
  region: string;
  theme: 'algemeen' | 'villa' | 'woningbouw' | 'kantoor' | 'ambacht' | 'verbouwing';
  themeLabel: string;
  intro: string;
  body: string[];  // prefix "## " voor h2-tussenkopjes
  faq?: Array<{ question: string; answer: string }>;
}

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const locaties = [
  { location: 'Goirle',          region: 'Noord-Brabant' },
  { location: 'Oirschot',        region: 'Noord-Brabant' },
  { location: 'Udenhout',        region: 'Noord-Brabant' },
  { location: 'Haaren',          region: 'Noord-Brabant' },
  { location: 'Horst',           region: 'Limburg' },
  { location: 'Berkel-Enschot',  region: 'Noord-Brabant' },
];

// ── Architect algemeen ─────────────────────────────────────────────────────

const architectIntro =
  'Een goed ontwerp begint met luisteren. Niet met een standaard plattegrond of een prijslijst, maar met de vraag: wat moet dit gebouw voor u doen? Bij KA.architecten is dat de eerste stap bij elk project. En de laatste. En alle stappen daartussen. Of u nu een woning wilt laten bouwen, een aanbouw plant of een zakelijk pand zoekt dat echt past bij uw organisatie: een architect in {plaats} die uw wensen serieus neemt, maakt het verschil.';

const architectBody: string[] = [
  '## Wat doet een architect in {plaats}?',
  'Een architect in {plaats} vertaalt uw wensen naar een ontwerp dat klopt. Niet alleen op papier, maar ook in de ruimte: hoe valt het licht, hoe beweegt u door het gebouw, hoe voelt het over tien jaar nog aan? Dat zijn vragen die een architect stelt en beantwoordt.',
  'Bij KA.architecten beginnen we elk project op de locatie zelf. We lopen de kavel op, voelen hoe de zon valt en bekijken hoe de buurt eromheen is gebouwd. Of het nu gaat om nieuwbouw in {plaats} of een aanbouw aan een bestaand pand: het gebouw past vanzelfsprekend in zijn omgeving. Dat vraagt om inzicht in de lokale bouwtradities en het bebouwingspatroon van de gemeente. Dat inzicht heeft KA.architecten.',
  'Een architect bewaakt bovendien het gehele bouwproces. Van het eerste schetsontwerp tot de laatste inspectie op de bouwplaats. Dat geeft houvast en voorkomt dure verrassingen halverwege.',
  '## Waarom een architect inhuren in {plaats}?',
  'Een architect inhuren in {plaats} is een investering die zichzelf terugverdient. Een ontwerp dat van tevoren goed is doordacht, bespaart u problemen tijdens de bouw en ergernis in de jaren daarna. Bouwen zonder architect kan. Maar de kans op indelingen die later knellen, gemiste vergunningseisen of onverwachte meerkosten is reëel. Een ervaren architect in {plaats} overziet het geheel en stuurt bij voordat kleine fouten grote kosten worden.',
  'Concreet neemt een architect de volgende taken op zich: het vertalen van uw wensen naar een passend en doordacht ontwerp, het aanvragen en begeleiden van de omgevingsvergunning, het coördineren van aannemers, constructeurs en andere partijen, en het bewaken van kwaliteit, planning en budget gedurende de bouw. U houdt overzicht, ook als het op de bouwplaats druk wordt.',
  '## Wat kost een architect inhuren in {plaats}?',
  'De kosten voor een architect woning {plaats} liggen doorgaans tussen de 8 en 12 procent van de totale bouwsom. Bij grotere of complexere projecten kan dit percentage lager uitvallen. Naast een percentage werken sommige architecten ook met een vaste fee per projectfase. Bij KA.architecten bespreken we de kosten altijd in het eerste gesprek, zodat u direct weet waar u aan toe bent. Geen verrassingen achteraf.',
  '## Materialen die karakter krijgen door de tijd',
  'Bij KA.architecten kiezen we bewust voor materialen die mooi oud worden. Baksteen die meeleeft met de seizoenen. Hout dat egaal vergrijst en rustiger wordt naarmate de jaren verstrijken. Geen toepassingen die over vijf jaar gedateerd zijn, maar keuzes die over twintig jaar nog kloppen. Welke materialen passen bij uw locatie, uw smaak en uw budget? Die vraag stellen we vroeg in het ontwerp, als aanpassen nog weinig kost. Zo komen we later niet voor verrassingen te staan.',
  '## KA.architecten: architectenbureau actief in {regio}',
  'KA.architecten is gevestigd in Tilburg en werkt in heel {regio}, waaronder {plaats} en de omliggende gemeenten. Wij zijn ingeschreven bij de Branchevereniging Nederlandse Architectenbureaus (BNA). We werken voor particulieren, ondernemers en opdrachtgevers die zoeken naar een ontwerp dat klopt. Onze projecten variëren van compacte stadswoningen tot grotere gebouwen in de regio. Onze aanpak is direct: u spreekt altijd met de architect zelf, niet via een aanspreekpunt.',
  '## Van eerste gesprek tot oplevering',
  'Een eerste gesprek bij KA.architecten is vrijblijvend. We luisteren naar uw plannen, stellen gerichte vragen en geven u een eerlijk beeld van wat mogelijk is en wat het kost. Als u besluit samen te werken, verloopt het traject in vaste stappen: gesprek, schetsontwerp, uitwerking en vergunning, bouw met begeleiding, en oplevering. Bij elke stap weet u wat er komt en wat er van u gevraagd wordt. Transparant, zonder kleine lettertjes.',
  '## Licht, ruimte en rust in {plaats}',
  'Een goed gebouw voelt rustig van binnen, ook als de wereld buiten beweegt. Dat is geen toeval. Het is het resultaat van keuzes die we vroeg in het ontwerp maken: hoe valt het licht op welk moment van de dag? Welke zichtlijn wil je bewaren? Wat voelt logisch als je binnenstapt? Grote ramen die op het juiste moment de zon vangen. Een indeling die nooit knelt. Ruimtes die uitnodigen om er te zijn. Dat is wat KA.architecten nastreeft in elk project.',
  'Zoekt u een architect in {plaats}? Neem gerust contact op voor een vrijblijvend gesprek. Bij KA.architecten luisteren we graag naar uw plannen, hoe concreet of hoe pril die ook zijn.',
];

const architectFaq: Array<{ question: string; answer: string }> = [
  {
    question: 'Wat doet een architect in {plaats} precies?',
    answer: 'Een architect in {plaats} ontwerpt gebouwen en begeleidt bouwprojecten van begin tot eind. Dat omvat het vertalen van uw wensen naar een passend ontwerp, het aanvragen van vergunningen en het bewaken van kwaliteit en budget tijdens de bouw. Een architect kijkt niet alleen naar het technische verhaal, maar ook naar hoe een ruimte aanvoelt en hoe die door de jaren heen goed blijft functioneren.',
  },
  {
    question: 'Wanneer heb ik een architect nodig in {plaats}?',
    answer: 'U heeft een architect nodig zodra uw bouwplannen ingrijpender worden dan een standaard klus. Denk aan het bouwen van een nieuwe woning, het plaatsen van een aanbouw, het slopen van dragende muren of het aanpassen van de gevel. Een architect overziet de ruimtelijke, technische en juridische aspecten van uw project en voorkomt dat u halverwege tegen onverwachte problemen aanloopt.',
  },
  {
    question: 'Wat kost het om een architect in te huren in {plaats}?',
    answer: 'De kosten van een architect in {plaats} liggen doorgaans tussen de 8 en 12 procent van de totale bouwsom, afhankelijk van de complexiteit van het project. Een vrijblijvend gesprek bij KA.architecten geeft u snel inzicht in de verwachte kosten voor uw situatie.',
  },
  {
    question: 'Hoe kies ik een goede architect in {plaats}?',
    answer: 'Een goede architect in {plaats} luistert goed naar uw wensen en geeft u een eerlijk beeld van wat haalbaar is. Let bij het kiezen op eerdere projecten, de manier van communiceren en of u een goed gevoel heeft bij het eerste gesprek. Vraag naar referenties en bekijk of de stijl van het bureau past bij wat u voor ogen heeft.',
  },
  {
    question: 'Hoe lang duurt een architecttraject in {plaats}?',
    answer: 'De duur van een architecttraject in {plaats} hangt sterk af van de omvang van het project. Voor een nieuwe woning rekent u al snel op zes tot twaalf maanden voor het ontwerp- en vergunningstraject, waarna de bouw begint. Een kleinere aanbouw of verbouwing kan sneller verlopen. Bij KA.architecten bespreken we de verwachte planning in een van de eerste gesprekken.',
  },
];

// ── Architect verbouwing ───────────────────────────────────────────────────

const verbouwingIntro =
  'Een verbouwing verandert meer dan u denkt. Niet alleen de muren verschuiven, maar ook hoe u in de ruimte leeft of werkt. Dat vraagt om een ontwerp dat verder kijkt dan de puur technische kant. Een architect voor uw verbouwing in {plaats} maakt dat mogelijk. Bij KA.architecten begeleiden we verbouwingen van het eerste gesprek tot de oplevering.';

const verbouwingBody: string[] = [
  '## Wanneer heeft u een architect nodig voor een verbouwing in {plaats}?',
  'Een architect voor een verbouwing in {plaats} is niet bij elke klus noodzakelijk. Een nieuwe badkamertegel of een andere vloer regelt u prima zelf of via een aannemer. Maar zodra u muren wilt slopen, een aanbouw plant, de gevel wilt aanpassen of een ingrijpende nieuwe indeling overweegt, verandert dat. Een architect denkt mee over de ruimtelijke gevolgen van uw keuzes. Wat gebeurt er met het licht als u die muur weghaalt? Hoe houdt u de verhouding tussen ruimtes goed? En welke vergunning heeft u nodig? Dat zijn vragen die een architect vroeg stelt.',
  '## Een architect inhuren voor uw verbouwing in {plaats}: wat levert dat op?',
  'Een architect inhuren voor uw verbouwing in {plaats} levert u meer op dan een tekening. Het levert u een doordacht plan, een heldere aanpak en een onafhankelijke partij die uw belangen bewaakt tijdens de bouw. Concreet: het ontwerpen van een verbouwing die past bij het bestaande gebouw, het aanvragen van de omgevingsvergunning bij de gemeente, het coördineren van de aannemer en eventuele specialisten, en het bewaken van kwaliteit en budget tijdens de uitvoering. Een verbouwing zonder architect kan, maar de kans op keuzes die later spijt opleveren is groter als niemand het geheel overziet.',
  '## De verbouwing past op de plek en bewaart wat klopt',
  'Een goede verbouwing in {plaats} past bij de omgeving en bewaart wat al goed werkt. Hoe verhoudt de uitbreiding zich tot de straat? Welke ruimtes functioneren al goed? En hoe lossen we het probleem op zonder de sterke punten van het pand aan te tasten? Bij KA.architecten beginnen we met de plek zelf. We bekijken de omgeving, luisteren naar uw wensen en stellen de juiste vragen: wat stoort u aan de huidige indeling, wat wilt u beter maken, wat wilt u absoluut bewaren? Pas als die vragen beantwoord zijn, beginnen we te ontwerpen.',
  '## Licht en ruimte na de verbouwing',
  'Een verbouwing is geslaagd als de nieuwe indeling gewoon klopt, het licht precies goed valt en de ruimte aanvoelt alsof het altijd zo was. Grote ramen die de zon op het juiste moment binnenlaten, een zichtlijn die rust geeft, een doorloop die logisch voelt. Dat zijn de details die KA.architecten vroeg in het ontwerpproces vastlegt, als aanpassen nog weinig kost.',
  '## Materialen die passen bij het bestaande',
  'Een verbouwing vraagt om materialen die in gesprek gaan met wat er al staat. Nieuwe elementen die te hard schreeuwen, maken het geheel onrustig. Bij KA.architecten zoeken we de balans: materialen die de bestaande sfeer versterken zonder er een replica van te zijn. Hout, baksteen, metaal of glas: elk materiaal heeft zijn eigen manier van oud worden. Dat zetten we bewust in.',
  '## Wat kost een architect voor een verbouwing in {plaats}?',
  'De kosten voor een architect bij een verbouwing in {plaats} liggen doorgaans tussen de 8 en 12 procent van de bouwsom. Bij grotere of complexere renovaties kan dit percentage lager uitvallen. Bij KA.architecten bespreken we de kosten in het eerste gesprek, zodat u direct een realistisch beeld heeft van de totale investering.',
  '## KA.architecten: uw architect voor verbouwingen in {regio}',
  'KA.architecten begeleidt verbouwingen in {regio} al jarenlang, waaronder in {plaats} en omgeving. Van kleinere ingrepen aan een bestaande woning tot architecturale renovaties van bedrijfspanden. U spreekt altijd direct met de architect. Geen tussenpersoon, geen miscommunicatie. Dat maakt het traject overzichtelijker en prettiger voor u en voor ons.',
  '## Hoe verloopt een verbouwingstraject bij KA.architecten?',
  'Een verbouwingstraject verloopt in vaste stappen: gesprek, schetsontwerp, uitwerking, vergunningsaanvraag bij de gemeente, bouw met begeleiding op de bouwplaats en oplevering. Tijdens de uitvoering zijn we op vaste momenten aanwezig om kwaliteit en budget te bewaken en bij te sturen als dat nodig is. Bij oplevering bent u zeker dat de verbouwing is uitgevoerd zoals afgesproken.',
  'Heeft u plannen voor een verbouwing in {plaats} en vraagt u zich af of een architect toegevoegde waarde heeft? Neem gerust contact op voor een vrijblijvend gesprek. Een verbouwing die echt klopt, begint met een goed gesprek. Dat gesprek voeren we graag met u.',
];

const verbouwingFaq: Array<{ question: string; answer: string }> = [
  {
    question: 'Wanneer heb ik een architect nodig voor een verbouwing in {plaats}?',
    answer: 'U heeft een architect nodig voor een verbouwing in {plaats} zodra de ingreep ingrijpend van aard is. Denk aan het slopen van dragende muren, het realiseren van een aanbouw, het aanpassen van de gevel of het wijzigen van de indeling op een manier die vergunningplichtig is. Voor kleinere aanpassingen zoals schilderwerk of een nieuwe badkamertegel heeft u geen architect nodig.',
  },
  {
    question: 'Wat kost een architect voor een verbouwing in {plaats}?',
    answer: 'De kosten van een architect voor een verbouwing in {plaats} liggen doorgaans tussen de 8 en 12 procent van de bouwsom. Een vrijblijvend gesprek bij KA.architecten geeft u snel inzicht in de verwachte kosten voor uw situatie.',
  },
  {
    question: 'Heeft een architect verstand van verbouwingen van bestaande woningen?',
    answer: 'Ja. Het verbouwen van bestaande woningen en panden vraagt om andere kennis dan nieuwbouw. Een architect voor verbouwingen in {plaats} weet hoe u bestaande kwaliteiten bewaart, hoe u slim omgaat met de bestaande constructie en welke materialen aansluiten bij wat er al staat. KA.architecten werkt regelmatig aan verbouwingsprojecten in de regio.',
  },
  {
    question: 'Hoe lang duurt een verbouwingstraject met een architect in {plaats}?',
    answer: 'De doorlooptijd hangt af van de omvang van de verbouwing. Een kleinere aanbouw of indelingswijziging kan binnen drie tot zes maanden worden ontworpen en uitgevoerd. Grotere verbouwingen vragen meer tijd, mede omdat de vergunningsprocedure doorgaans acht tot twaalf weken in beslag neemt.',
  },
  {
    question: 'Regelt een architect ook de vergunning voor mijn verbouwing in {plaats}?',
    answer: 'Ja. Een van de taken van een architect bij een verbouwing in {plaats} is het aanvragen van de benodigde omgevingsvergunning bij de gemeente. De architect stelt daarvoor de vereiste tekeningen en documenten op en dient de aanvraag in. Dat bespaart u veel werk en voorkomt dat de vergunning vertraging oploopt.',
  },
];

// ── Exporteer gecombineerde array ──────────────────────────────────────────

export const meestGezocht: MeestGezocht[] = [
  ...locaties.map(loc => ({
    slug: `architect-${slugify(loc.location)}`,
    title: 'Architect in {plaats}',
    metaTitle: 'Architect {plaats} | KA.architecten',
    metaDescription: 'Op zoek naar een architect in {plaats}? KA.architecten begeleidt nieuwbouw en verbouwingen met vakmanschap en oog voor detail. Bel of mail vrijblijvend.',
    location: loc.location,
    region: loc.region,
    theme: 'algemeen' as const,
    themeLabel: 'Architect',
    intro: architectIntro,
    body: architectBody,
    faq: architectFaq,
  })),
  ...locaties.map(loc => ({
    slug: `architect-verbouwing-${slugify(loc.location)}`,
    title: 'Architect voor verbouwing in {plaats}',
    metaTitle: 'Architect Verbouwing {plaats} | KA.architecten',
    metaDescription: 'Verbouwing in {plaats} gepland? KA.architecten begeleidt uw project van schets tot oplevering. Licht, ruimte en materialen die kloppen. Bel vrijblijvend.',
    location: loc.location,
    region: loc.region,
    theme: 'verbouwing' as const,
    themeLabel: 'Verbouwing',
    intro: verbouwingIntro,
    body: verbouwingBody,
    faq: verbouwingFaq,
  })),
];
