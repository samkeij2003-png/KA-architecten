import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, PageBreak,
} from 'docx';
import { writeFileSync } from 'fs';

// ── Projectdata ────────────────────────────────────────────────────────────
const projects = [
  {
    title: 'Woonhuis Nieuwe Warande',
    location: 'Tilburg',
    type: 'Particuliere woning',
    year: '2022',
    intro: 'Een vrijstaande woning aan de rand van Tilburg, ingepast tussen lanen en open velden. Heldere volumes, lange zichtlijnen naar het landschap, en eerlijke materialen die mooier worden met de jaren.',
    body: [
      'De opgave vroeg om een ruime gezinswoning die rust uitstraalt en zich voegt naar de Brabantse omgeving. Door het hoofdvolume terug te leggen en een lager bijgebouw als tegenwicht te plaatsen, ontstaat een binnenhof: beschut, zonnig en privé.',
      'De keuze voor genuanceerd metselwerk, zink en eikenhouten kozijnen verankert het huis aan de plek. Binnen lopen de materialen door: een doorgaande betonvloer, gestucte wanden, eiken inbouwmeubels. Geen overtollige gebaren, alles dient het wonen.',
    ],
  },
  {
    title: 'Woonhuis Goirle',
    location: 'Goirle',
    type: 'Particuliere woning',
    year: '2020',
    intro: 'Een ingetogen gezinswoning in het buitengebied van Goirle, met een knipoog naar de traditionele Brabantse langgevelboerderij, maar in een eigentijdse, sobere taal.',
    body: [
      'Het ontwerp zet sterk in op de oriëntatie van de woning ten opzichte van de zon en het achterliggende landschap. Een doorlopende kap bindt hoofd- en bijgebouw aan elkaar; gevels zijn rustig gehouden zodat het dak het gesprek voert.',
      'Materialisering is robuust: handgevormde baksteen, verticale houten delen, antraciet detaillering. Het resultaat is een woning die ontspannen op zijn plek staat.',
    ],
  },
  {
    title: 'Woonhuis Waterrijk',
    location: 'Eindhoven',
    type: 'Particuliere woning',
    year: '2019',
    intro: 'Vrijstaande woning in de wijk Waterrijk in Eindhoven. Een compact, helder volume met een grote, beschutte buitenruimte aan het water.',
    body: [
      'De plot was smal en grenst aan een waterpartij. De woning is bewust enkelvoudig gehouden: één duidelijk volume met een sterke daksilhouet, dat zich in volle breedte opent richting het water.',
      'Door de woonruimte op de eerste verdieping te plaatsen ontstaat het gevoel van wonen tússen de boomtoppen, met spectaculaire zichten en optimale privacy.',
    ],
  },
  {
    title: 'Hoofdkantoor en opslag IGM',
    location: 'Waalwijk',
    type: 'Utiliteitsbouw',
    year: '2018',
    intro: 'Hoofdkantoor met aangrenzende opslag voor IGM. Een functioneel programma dat door zorgvuldige compositie en materiaalkeuze tóch een gezicht krijgt.',
    body: [
      'Het kantoorgedeelte koppelt zich helder aan het opslagvolume; door een verspringing in het dak en een diepe entreegevel ontstaat hiërarchie zonder te schreeuwen.',
      'Een rustige strokengevel, donker staal en grote glasvlakken geven het bedrijfsgebouw een herkenbaar karakter. De interne logistiek is leidend, maar nooit ten koste van de werkomgeving.',
    ],
  },
  {
    title: 'Betonnen woonhuis',
    location: 'Zeist',
    type: 'Particuliere woning',
    year: '2017',
    intro: 'Een vrijstaande woning waarin in-situ gestort beton de hoofdrol speelt. Sculpturale ruimtes, sterk daglicht en een zichtbare maakcultuur.',
    body: [
      'Beton, hout en glas vormen het materiële fundament. Een centrale, beeldbepalende trap snijdt door de plattegrond en verbindt de verdiepingen tot één doorlopende ruimte.',
      'Het huis is bewust massief van karakter; ramen worden uitsneden in de wand, geen invullingen daarin. Daardoor krijgt elk uitzicht het gewicht van een gekozen kader.',
    ],
  },
  {
    title: 'Transformatorfabriek Wijdeven',
    location: 'Oirschot',
    type: 'Utiliteitsbouw',
    year: '2016',
    intro: 'Productie- en kantoorgebouw voor Wijdeven, een Brabantse fabrikant van transformatoren. Een industrieel programma met de allure van een gebouwd visitekaartje.',
    body: [
      'Een lange, lage gevel definieert het bedrijfsperceel. Een teruggelegen entree in een diep zwart geverfde nis vertelt zonder bordjes waar de bezoeker hoort te zijn.',
      'De fabriekshal is opgezet als een flexibele kapconstructie zodat de productielogistiek op termijn kan groeien. Het kantoorgedeelte krijgt een eigen, fijnere maatvoering.',
    ],
  },
  {
    title: 'Woningbouwplan Suytkade',
    location: 'Helmond',
    type: 'Woningbouw',
    year: '2015',
    intro: 'Een blok eengezinswoningen langs het kanaal in Helmond, in de wijk Suytkade. Stedelijk wonen met een dorpse korrel.',
    body: [
      'De gevel is opgebouwd uit vier herkenbare types die telkens net iets verschillen zodat het ensemble leest als straat in plaats van rij.',
      'Aan het kanaal ontstaat een rustig, doorlopend silhouet; aan de straatkant wisselen voortuinen en entrees elkaar af. De materialen zijn gekozen op duurzame veroudering.',
    ],
  },
  {
    title: 'Woonhuis Udenhout',
    location: 'Udenhout',
    type: 'Particuliere woning',
    year: '2025',
    intro: 'Een nieuwbouwwoning in Udenhout, momenteel in uitvoering. Compact en ingetogen, met een opvallend doorlopend zadeldak.',
    body: [
      'De woning sluit aan op de Brabantse bouwtraditie maar interpreteert die in een hedendaagse, abstracte vorm: één kap, één doorgaande gevel, sterke openingen op gekozen plekken.',
      'Verschijnt op deze pagina in 2026 met fotografie na oplevering.',
    ],
  },
  {
    title: 'Woonhuis Haaren',
    location: 'Haaren',
    type: 'Particuliere woning',
    year: '2014',
    intro: 'Een gezinswoning in het buitengebied van Haaren. Stevig in zijn landschap, terughoudend in zijn vormgeving.',
    body: [
      'Door het hoofdvolume net iets te draaien ten opzichte van het kavel ontstaat een natuurlijke voor- en achterzijde, en blijft de bestaande boombeplanting maximaal behouden.',
      'Een lange luifel verbindt entree, terras en garage tot één gebaar.',
    ],
  },
];

// ── Hulpfuncties ───────────────────────────────────────────────────────────
const h1 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
});

const h2 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 320, after: 160 },
});

const h3 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 240, after: 120 },
});

const label = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 20, color: '7B7A75' })],
  spacing: { before: 200, after: 60 },
});

const body = (text) => new Paragraph({
  text,
  spacing: { after: 160 },
  style: 'Normal',
});

const spacer = () => new Paragraph({ text: '', spacing: { after: 120 } });

const divider = () => new Paragraph({
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D8D5CD' } },
  spacing: { before: 320, after: 320 },
  text: '',
});

const pageBreak = () => new Paragraph({
  children: [new PageBreak()],
});

// ── Document opbouwen ──────────────────────────────────────────────────────
const children = [];

// Titelpagina
children.push(
  new Paragraph({
    children: [new TextRun({ text: 'KA.architecten', bold: true, size: 56 })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 1200, after: 200 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Websiteteksten — ter beoordeling', size: 28, color: '7B7A75' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Peter Keijsers · Tilburg', size: 24, color: '7B7A75' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 1200 },
  }),
  pageBreak(),
);

// ── 1. Hoofdpagina ─────────────────────────────────────────────────────────
children.push(
  h1('1. Hoofdpagina'),
  divider(),

  label('HERO — eyebrow'),
  body('Architectuur als ambacht · Tilburg'),
  spacer(),

  label('HERO — koptitel'),
  body('KA.architecten'),
  spacer(),

  label('HERO — badges'),
  body('Ruim 30 jaar ervaring · Particuliere woningen · Verbouwing & transformatie · Utiliteitsbouw'),
  spacer(),

  label('BUREAU — lead tekst'),
  body('Wij zijn gevestigd in Tilburg en werkzaam in heel Brabant. Met ruim 30 jaar ervaring ontwerpen wij woningen, verbouwingen en utiliteitsgebouwen, sober van opzet en met aandacht voor materiaal en context.'),
  spacer(),

  label('BUREAU — bodytekst'),
  body('Architectuur als ambacht: het scheppen van ruimte met eerlijke materialen en zorgvuldige details. Ruimtes die mooier worden met de tijd.'),
  spacer(),

  label('WERKWIJZE — blok 1: koptitel'),
  body('Eén aanspreekpunt'),
  label('WERKWIJZE — blok 1: tekst'),
  body('Van schetsontwerp tot oplevering werkt u rechtstreeks met Peter Keijsers. Korte lijnen, persoonlijk, betrokken.'),
  spacer(),

  label('WERKWIJZE — blok 2: koptitel'),
  body('Plek & programma'),
  label('WERKWIJZE — blok 2: tekst'),
  body('Ieder ontwerp begint met een grondige analyse van de locatie en de wensen van de bewoner. Het ontwerp volgt de plek, niet andersom.'),
  spacer(),

  label('WERKWIJZE — blok 3: koptitel'),
  body('Eerlijk materiaal:'),
  label('WERKWIJZE — blok 3: tekst'),
  body('Hout · baksteen · beton · glas. Materialen die mooier worden met de jaren en passen bij het ambacht.'),

  pageBreak(),
);

// ── 2. Bureau pagina ───────────────────────────────────────────────────────
children.push(
  h1('2. Bureau'),
  divider(),

  label('INTRO — koptitel'),
  body('Architectuur als ambacht.'),
  spacer(),

  label('INTRO — lead tekst'),
  body('Wij zijn gevestigd in Tilburg en werken voor opdrachtgevers in Brabant en daarbuiten. Woningen, verbouwingen en utiliteitsgebouwen — sober, persoonlijk en met respect voor de plek.'),
  spacer(),

  label('INTRO — KA-betekenis'),
  body('KA staat voor ziel — architectuur met lading en betekenis.'),
  spacer(),

  label('INTRO — naam onderaan'),
  body('Peter Keijsers'),
  spacer(),

  label('WERKWIJZE — alinea 1'),
  body('Een goed ontwerp begint met luisteren. De plek wordt in kaart gebracht, de wensen van de opdrachtgever, het programma, getoetst aan een heldere ambitie. Pas dan komt de eerste schets.'),
  spacer(),

  label('WERKWIJZE — alinea 2'),
  body('Er is altijd één aanspreekpunt: u praat direct met de architect. Dat bewaakt de samenhang, van eerste massastudie tot bouwbegeleiding op de werf. Korte lijnen, eerlijk overleg, geen verrassingen achteraf.'),
  spacer(),

  label('WERKWIJZE — alinea 3'),
  body('Materialen worden gekozen op duurzame veroudering: handgevormde baksteen, eikenhout, in-situ beton, zink. Ze rijpen mee met het gebouw. Een woning of bedrijfspand dat over twintig jaar nog vertrouwd voelt.'),
  spacer(),

  label('ARCHITECT — bio alinea 1'),
  body('Peter Keijsers studeerde architectuur aan de HTS Bouwkunde en de Academie voor Bouwkunst. Na jarenlange werkervaring in de Brabantse architectuurpraktijk richtte hij KA.architecten op als zelfstandig bureau in Tilburg.'),
  spacer(),

  label('ARCHITECT — bio alinea 2'),
  body('Met ruim 30 jaar ervaring in het vak, van particuliere villa\'s en woningbouw tot kantoor- en bedrijfsgebouwen, brengt hij een brede kennis mee naar elk project. Architectuur is een ambacht: een precieze omgang met materiaal, maatvoering en context.'),
  spacer(),

  label('WERKGEBIED — tekst'),
  body('Wij werken vanuit Tilburg in heel Noord-Brabant, met regelmatige opdrachten in onder andere Eindhoven, Helmond, Den Bosch, Breda, Goirle, Oirschot, Udenhout en Haaren. Voor goede opdrachten ook buiten de provincie, zoals het betonnen woonhuis in Zeist.'),

  pageBreak(),
);

// ── 3. Projecten pagina ────────────────────────────────────────────────────
children.push(
  h1('3. Projecten — overzichtspagina'),
  divider(),

  label('KOPTITEL'),
  body('Werken in Tilburg, Brabant en daarbuiten.'),
  spacer(),

  label('LEAD TEKST'),
  body('Een selectie van projecten waarbij wij als architect betrokken waren: woningen, verbouwingen, utiliteitsbouw en woningbouw. Het portfolio omvat werk uit onze volledige loopbaan, waarvan een deel ontworpen is bij eerdere bureaus.'),

  pageBreak(),
);

// ── 4. Projecten (individueel) ─────────────────────────────────────────────
children.push(h1('4. Projecten — individuele pagina\'s'));

projects.forEach((project, i) => {
  children.push(
    divider(),
    h2(`${i + 1}. ${project.title} · ${project.location}`),
    new Paragraph({
      children: [new TextRun({ text: `${project.type} · ${project.year}`, size: 20, color: '7B7A75' })],
      spacing: { after: 200 },
    }),

    label('INTRO (korte omschrijving)'),
    body(project.intro),
    spacer(),

    label('BODYTEKST'),
    ...project.body.map(p => body(p)),
    spacer(),
  );
});

// ── Document aanmaken ──────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 22 },
      },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        run: { bold: true, size: 36, color: '1F1E1B' },
        paragraph: { spacing: { before: 400, after: 200 } },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        run: { bold: true, size: 28, color: '1F1E1B' },
        paragraph: { spacing: { before: 320, after: 160 } },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        run: { bold: true, size: 24, color: '3A3934' },
        paragraph: { spacing: { before: 240, after: 120 } },
      },
    ],
  },
  sections: [{ children }],
});

const buffer = await Packer.toBuffer(doc);
const outputPath = 'KA-architecten-teksten.docx';
writeFileSync(outputPath, buffer);
console.log(`✓ Bestand aangemaakt: ${outputPath}`);
