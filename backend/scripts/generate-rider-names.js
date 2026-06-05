/**
 * generate-rider-names.js
 *
 * LLM-ähnliches Skript zur Generierung realistischer Vor- und Nachnamen
 * für alle in sta_country.csv enthaltenen Nationen.
 *
 * Aufruf:  node backend/scripts/generate-rider-names.js
 *
 * Output:  data/csv/rider_names.csv
 *          Format: country_id,type,value,weight
 *
 * Logik:
 *  - Jedes Land bekommt mind. 10 Vornamen und 10 Nachnamen.
 *  - Top-Länder (regen_rating >= 80) bekommen 30+30 Namen.
 *  - Kleine Länder (number_regen_max = 0) bekommen 10+10 Namen.
 *  - Länder ohne explizite Daten fallen auf einen sprachregionsbasierten Default zurück.
 */

const fs = require('fs');
const path = require('path');

const CSV_DIR = path.resolve(__dirname, '..', '..', 'data', 'csv');
const COUNTRIES_CSV = path.join(CSV_DIR, 'sta_country.csv');
const OUTPUT_CSV = path.join(CSV_DIR, 'rider_names.csv');

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    const n = line[i + 1];
    if (c === '"') {
      if (inQuotes && n === '"') { current += '"'; i += 1; }
      else { inQuotes = !inQuotes; }
      continue;
    }
    if (c === ',' && !inQuotes) { cells.push(current.trim()); current = ''; continue; }
    current += c;
  }
  cells.push(current.trim());
  return cells;
}

function readCountries() {
  const content = fs.readFileSync(COUNTRIES_CSV, 'utf8').replace(/^\uFEFF/, '').trim();
  const lines = content.split(/\r?\n/).filter(l => l.length > 0);
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map(line => {
    const vals = parseCsvLine(line);
    return headers.reduce((obj, h, i) => { obj[h] = vals[i] ?? ''; return obj; }, {});
  });
}

// LLM-DATASET: Top-cycling nations
const NAME_DATA = {
  2:  { first: ['Marco','Francesco','Andrea','Alessandro','Lorenzo','Matteo','Davide','Simone','Stefano','Riccardo','Gianluca','Filippo','Luca','Alberto','Diego','Vincenzo','Paolo','Manuel','Mattia','Giulio','Salvatore','Nicolo','Edoardo','Cesare','Federico','Tommaso','Antonio','Pietro','Gabriele','Enrico'],
        last:  ['Rossi','Bianchi','Russo','Ferrari','Esposito','Conti','Romano','Colombo','Ricci','Marino','Greco','Bruno','Gallo','De Luca','Mancini','Costa','Giordano','Rizzo','Lombardi','Moretti','Barbieri','Fontana','Santoro','Mariani','Rinaldi','Leone','Palumbo','Testa','Caruso','Vitale'] },
  3:  { first: ['Julian','Thomas','Louis','Hugo','Lucas','Antoine','Maxime','Nathan','Theo','Mathis','Alexandre','Quentin','Valentin','Axel','Clement','Maxence','Enzo','Leo','Raphael','Paul','Pierre','Damien','Killian','Mathieu','Adrien','Sebastien','Florian','Remi','Tom','Loic'],
        last:  ['Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau','Simon','Laurent','Michel','Garcia','David','Bertrand','Roux','Vincent','Fournier','Morel','Girard','Andre','Lefebvre','Mercier','Blanc','Garnier','Faure','Rousseau','Marchand','Henry'] },
  4:  { first: ['Wout','Remco','Jasper','Thibau','Florian','Arnaud','Bjorg','Sep','Yves','Tim','Laurens','Edward','Aurélien','Quinten','Milan','Lian','Mats','Glenn','Staf','Xander','Aaron','Brent','Cedric','Dries','Gianni','Iljo','Kenny','Nils','Rune','Thierry'],
        last:  ['Van Aert','Evenepoel','Philipsen','De Lie','Lampaert','Merlier','Stuyven','Declercq','Vermeersch','Van der Poel','Van Avermaet','Gilbert','Van Emden','De Gendt','Boonen','Cancellara','Devolder','Waeytens','Serry','Hermans','Campenaerts','Keisse','Naesen','Wellens','Benoot','Quintana','Devenyns','De Vlaminck','Van Keirsbulck','De Ketele'] },
  5:  { first: ['Mathieu','Dylan','Fabio','Timo','Tom','Bauke','Robert','Koen','Ramon','Wout','Lars','Sebastian','Niek','Sjoerd','Daan','Mike','Jan','Bas','Hans','Steven','Pieter','Joris','Stijn','Bram','Coen','Frank','Maarten','Thijs','Wil','Kasper'],
        last:  ['Van der Poel','Haga','Van Baarle','Dumoulin','Slagter','Poels','Kelderman','Hoekstra','Bos','Ten Dam','Weening','De Vries','Kruijswijk','Van Emden','Bouwman','Lindeman','Van As','Bol','Wynants','Meyer','Kamp','Van den Berg','Stork','Roosen','Bouman','Tol','Verge','Arens','Bouwmeester','Eenkhoorn'] },
  7:  { first: ['Toni','Pascal','John','Jakob','Maximilian','Felix','Lennard','Emanuel','Nils','Simon','Lennart','Marc','Robert','Stefan','Rudy','Dominik','Phil','Andreas','Aleksandr','Bastian','Christopher','Dennis','Florian','Georg','Hendrik','Jens','Lukas','Martin','Roger','Andre'],
        last:  ['Albrecht','Denifl','Sagan','Ackermann','Schachmann','Degenkolb','Kittel','Gretsch','Meyer','Politt','Martin','Walscheid','Burghardt','Zabel','Arndt','Henig','Langeveld','Mohs','Peschel','Schiller','Steels','Voigt','Wagner','Buchmann','Schilling','Taucher','Westphal','Braun','Wiegand','Hentschel'] },
  8:  { first: ['Alejandro','Alberto','Pablo','Marc','Omar','Carlos','Ivan','Rafael','David','Daniel','Adriano','Samuel','Jonathan','Francisco','Manuel','Ruben','Jose','Antonio','Andoni','Benat','Enric','Egoitz','Gorka','Haimar','Igor','Jesus','Josu','Julen','Luis','Miguel'],
        last:  ['Rodriguez','Olano','Indurain','Valverde','Sastre','Purito','Landa','Quintana','Anton','Hernandez','Izagirre','Sanchez','Garcia','Fernandez','Jimenez','Perez','Gonzalez','Martinez','Romero','Vicente','Caballero','Castillo','Castro','Delgado','Esteve','Garrido','Lopez','Moreno','Nieto','Cano'] },
  10: { first: ['Michael','Mads','Soren','Kasper','Christopher','Alexander','Mathias','Niklas','Frederik','Lukas','Jonas','Magnus','Rasmus','Andreas','Emil','Henrik','Mikkel','Oliver','Patrick','Sebastian','Tobias','Victor','William','August','Christian','Erik','Jakob','Johannes','Lucas','Martin'],
        last:  ['Mork','Valgren','Hansen','Pedersen','Magnussen','Cort','Fuglsang','Bjerg','Andersen','Christensen','Holm','Jorgensen','Kristensen','Larsen','Nielsen','Olsen','Petersen','Rasmussen','Schmidt','Sorensen','Thomsen','Winther','Jacobsen','Lund','Vinther','Aagaard','Bach','Brandt','Dahl','Vestergaard'] },
  11: { first: ['Egan','Nairo','Fernando','Rigoberto','Esteban','Ivan','Juan','Julian','Miguel','Wilson','Sergio','Cristian','Jose','Darwin','Daniel','Andres','Carlos','Diego','Eduar','Felix','Hernan','Hover','Jaime','Jhonatan','Camilo','Sebastian','Santiago','Luis','Mateo','Nicolas'],
        last:  ['Quintero','Bernal','Lopez','Uran','Martinez','Higuita','Sosa','Chaves','Atapuma','Betancur','Anacona','Pedraza','Rubio','Rodriguez','Pena','Cardona','Ospina','Perez','Salazar','Agudelo','Arango','Castano','Colorado','Duque','Gaviria','Gonzalez','Mejia','Montoya','Munoz','Tejada'] },
  12: { first: ['Raul','Martin','Tarmo','Janar','Peeter','Riho','Andres','Taavi','Siim','Allan','Margus','Toomas','Urmas','Ain','Ants','Arvo','Enn','Gunnar','Heino','Kalev','Ott','Priit','Tiit','Toivo','Uno','Vello','Arne','Eduard','Rein','Hannes'],
        last:  ['Tamm','Sepp','Saar','Kukk','Magi','Parn','Kask','Rebane','Ilves','Teder','Kuusk','Oja','Tuvike','Vahtras','Aavik','Eskla','Harm','Jurisson','Kaasik','Koit','Laane','Meier','Nurk','Podersalu','Raudsepp','Saks','Tammik','Toom','Uibo','Veskimae'] },
  18: { first: ['Tom','Adam','Mark','Daniel','Ben','Ethan','Owen','Luke','James','George','Samuel','Oliver','Harry','Jack','Charlie','William','Edward','Henry','Alfie','Archie','Freddie','Jacob','Joe','Leo','Logan','Mason','Noah','Oscar','Ryan','Callum'],
        last:  ['Yates','Cavendish','Froome','Thomas','Swift','Stannard','Hayter','Steels','Millar','Armitstead','Blythe','Clancy','Dowsett','Dunbar','Kennaugh','Latham','Lloyd','McLaren','Opie','Porteous','Purvis','Russell','Smith','Stewart','Stokes','Walker','Ward','Wells','Wright','Sutton'] },
  20: { first: ['Caleb','Michael','Simon','Rohan','Richie','Ben','Lucas','Sam','Jay','Nathan','Jack','James','Leigh','Matthew','Mitchell','Patrick','Travis','William','Alexander','Angus','Brendan','Brent','Damien','Daniel','David','Edward','George','Henry','Jai','Oliver'],
        last:  ['Ewan','Matthews','Dennis','Clarke','Haig','Williams','Hamilton','McCarthy','Power','Bobridge','Durbridge','Hepburn','Howson','Kennaugh','McConnell','OBrien','OGrady','Porter','Renshaw','Scott','Smith','Sutton','Walker','Walls','Watson','Wells','West','Wight','Wilson','Storer'] },
  28: { first: ['Tadej','Primoz','Jan','Matej','Luka','Anze','Grega','Domen','Nik','Rok','Blaz','Jaka','Zak','Tim','Matic','Klemen','Aljaz','Bostjan','Jani','Andraz','Lovro','Tilen','Zan','Matevz','Mihael','Nejc','Vid','Zan','Gal','Miha'],
        last:  ['Pogacar','Roglic','Polanc','Mezgec','Mohoric','Tratnik','Spenst','Novak','Bozic','Korbar','Brajkovic','Bole','Fajt','Gorenc','Katrasnik','Pintar','Simon','Skok','Strancar','Sustic','Svab','Tasic','Tercek','Tibay','Trampusch','Vrecer','Zrimsek','Cerkovnik','Groselj','Murn'] },
  29: { first: ['Joao','Rui','Nelson','Andre','Pedro','Tiago','Filipe','Bruno','Diogo','Ricardo','Miguel','Hugo','Tomas','Jose','Carlos','Daniel','David','Marco','Paulo','Sergio','Vitor','Nuno','Rafael','Antonio','Eduardo','Jorge','Luis','Manuel','Ruben','Bernardo'],
        last:  ['Oliveira','Almeida','Castro','Costa','Fernandes','Goncalves','Lopes','Marques','Martins','Nunes','Pereira','Pinto','Ribeiro','Rocha','Santos','Silva','Sousa','Vieira','Carvalho','Cardoso','Correia','Dias','Faria','Ferreira','Freitas','Leal','Macedo','Magalhaes','Mateus','Mendes'] },
  30: { first: ['Rafal','Piotr','Tomasz','Michal','Kamil','Maciej','Kuba','Bartosz','Szymon','Adam','Dawid','Krzysztof','Lukasz','Marek','Marcin','Mateusz','Patryk','Pawel','Robert','Wojciech','Andrzej','Cezary','Dominik','Emil','Filip','Grzegorz','Igor','Jakub','Kacper','Karol'],
        last:  ['Kowalski','Nowak','Wisniewski','Wojcik','Kowalczyk','Kaminski','Lewandowski','Zielinski','Szymanski','Wozniak','Kozlowski','Jankowski','Mazur','Krawczyk','Piotrowski','Grabowski','Nowakowski','Pawlak','Michalski','Adamczyk','Dudek','Zajac','Wieczorek','Jablonski','Baran','Krol','Pietrzak','Sikora','Walczak','Stepien'] },
  31: { first: ['Sam','Ben','Dan','Ryan','Conor','Sean','Niall','Eoin','Brian','Mark','David','John','Michael','Paul','Patrick','Cathal','Declan','Donnacha','Eddie','Fionn','Jack','Liam','Luke','Matt','Oisin','Paddy','Rory','Stephen','Tom','Wayne'],
        last:  ['OBrien','Sullivan','Walsh','Smith','Murphy','Byrne','Ryan','Connor','ONeill','Reilly','Doyle','McCarthy','Gallagher','Doherty','Kennedy','Lynch','Murray','Quinn','Brennan','Mooney','Power','Fitzgerald','Daly','Carroll','Casserly','Caulfield','Clarke','Dunne','Flanagan','Gallagher'] },
};

// Default-Pools für Sprachregionen (Fallback für Länder ohne explizite Daten)
const REGION_DEFAULTS = {
  // Westeuropa
  western: { first: ['John','James','David','Michael','Robert','William','Daniel','Mark','Paul','Peter','Thomas','Richard','George','Charles','Edward','Andrew','Patrick','Stephen','Brian','Kevin','Ian','Alex','Ben','Luke','Jake','Sam','Max','Luke','Oliver','Lucas'],
             last:  ['Smith','Johnson','Williams','Brown','Jones','Miller','Davis','Wilson','Moore','Taylor','Anderson','Thomas','Jackson','White','Harris','Martin','Thompson','Garcia','Martinez','Robinson','Clark','Rodriguez','Lewis','Lee','Walker','Hall','Allen','Young','King','Wright'] },
  // Südeuropa
  southern: { first: ['Luca','Marco','Alessandro','Andrea','Francesco','Davide','Matteo','Lorenzo','Stefano','Simone','Diego','Federico','Riccardo','Antonio','Giuseppe','Giovanni','Paolo','Carlo','Roberto','Alberto','Manuel','Vincenzo','Salvatore','Bruno','Massimo','Mario','Sergio','Enrico','Domenico','Raffaele'],
              last:  ['Rossi','Ferrari','Bianchi','Romano','Colombo','Ricci','Marino','Greco','Bruno','Gallo','Costa','De Luca','Mancini','Giordano','Rizzo','Lombardi','Moretti','Barbieri','Fontana','Santoro','Mariani','Rinaldi','Leone','Palumbo','Testa','Caruso','Vitale','Russo','Conti','Esposito'] },
  // Osteuropa
  eastern: { first: ['Alexander','Dmitri','Sergei','Ivan','Mikhail','Alexei','Andrei','Nikolai','Pavel','Roman','Vladimir','Yevgeny','Igor','Maxim','Artem','Denis','Viktor','Boris','Gleb','Kirill','Konstantin','Leonid','Oleg','Petr','Stanislav','Valentin','Vasily','Yuri','Zakhar','Anton'],
              last:  ['Ivanov','Petrov','Smirnov','Kuznetsov','Popov','Sokolov','Lebedev','Kozlov','Novikov','Morozov','Volkov','Alekseev','Fedorov','Mikhailov','Belyaev','Tarasov','Gusev','Titov','Kuzmin','Sidorov','Romanov','Stepanov','Nikolaev','Orlov','Andreev','Makarov','Nikitin','Zakharov','Zaitsev','Kovalev'] },
  // Asien (allgemein)
  asian: { first: ['Wei','Min','Jun','Hyun','Sung','Won','Tae','Ho','Ki','Sang','Seung','Young','Chul','Dong','Hak','Jin','Kwang','Man','Myung','Nam','Pyung','Seok','Woo','Yang','Yong','Chan','Bum','Eun','Goo','Hwan'],
            last:  ['Kim','Lee','Park','Choi','Jung','Kang','Cho','Yoon','Jang','Lim','Han','Shin','Seo','Kwon','Yang','Son','Baek','Ahn','Heo','Ryu','Koh','Cha','Suh','Yoo','Bae','Min','Chun','Chung','Hong','Hwang'] },
  // Lateinamerika
  latin: { first: ['Juan','José','Luis','Carlos','Miguel','Antonio','Francisco','Diego','Pablo','Santiago','Mateo','Nicolás','Tomás','Pedro','Manuel','Rafael','Javier','Mario','Sergio','Ricardo','Andrés','Fernando','Eduardo','Alberto','Gabriel','Sebastián','Joaquín','Marcelo','Gonzalo','Esteban'],
            last:  ['González','Rodríguez','Gómez','Fernández','López','Díaz','Martínez','Pérez','Sánchez','Romero','Sosa','Alvarez','Benítez','Castro','Domínguez','Espinoza','Farias','Giménez','Heredia','Ibarra','Leiva','Luna','Maldonado','Mansilla','Mendoza','Morales','Ojeda','Pereyra','Quiroga','Ramos'] },
  // Afrika
  african: { first: ['Samuel','Pierre','Jean','Paul','André','Emmanuel','Eric','Daniel','David','Joseph','Michel','Alain','Marc','Patrick','Robert','Roger','Serge','Stéphane','Yann','Yves','Christian','Georges','Henri','Jacques','Laurent','Lionel','Nicolas','Olivier','Philippe','Pascal'],
              last:  ['Mensah','Asante','Owusu','Acheampong','Osei','Adjei','Boateng','Agyei','Amoah','Darko','Donkor','Kufuor','Agyeman','Agyekum','Appiah','Asare','Ata','Baffoe','Boakye','Bonsu','Dankwah','Fosu','Gyasi','Karikari','Kusi','Nkrumah','Nti','Opoku','Sarpong'] },
  // Arabisch / Naher Osten
  arabic: { first: ['Mohammed','Ahmed','Ali','Khalid','Hassan','Hussein','Omar','Ibrahim','Yusuf','Hamad','Fahad','Abdullah','Abdul','Saeed','Salem','Nasser','Talal','Faisal','Mishaal','Jassim','Sultan','Mubarak','Mohannad','Hamza','Khalifa','Ahmad','Saud','Abdulkareem','Hamdan','Bilal'],
            last:  ['Al-Saud','Al-Sheikh','Al-Mutairi','Al-Otaibi','Al-Harbi','Al-Ghamdi','Al-Qahtani','Al-Husseini','Al-Ali','Al-Sayed','Al-Mahmoud','Al-Hassan','Al-Rashid','Al-Najjar','Al-Khalil','Al-Sabbagh','Al-Saadi','Al-Sulaiti','Al-Mutlaq','Al-Masri','Al-Hamwi','Al-Bakri','Al-Hariri','Al-Ansari','Al-Hindi','Al-Malki','Al-Faraj','Al-Dosari','Al-Mutlaq','Al-Rashid'] },
};

// Mapping von Länder-Code-3 zu Default-Region
const REGION_BY_CODE3 = {
  // Westeuropa
  BEL: 'western', NED: 'western', GBR: 'western', IRL: 'western', SWE: 'western', FIN: 'western', AUT: 'western', SUI: 'western', LUX: 'western', DEN: 'western', NOR: 'western',
  // Südeuropa
  ITA: 'southern', ESP: 'southern', POR: 'southern', GRE: 'southern', MLT: 'southern', SMR: 'southern', AND: 'southern', CYP: 'southern',
  // Osteuropa
  POL: 'eastern', CZE: 'eastern', SVK: 'eastern', HUN: 'eastern', ROU: 'eastern', BUL: 'eastern', CRO: 'eastern', SRB: 'eastern', SVN: 'southern', BIH: 'southern', ALB: 'southern', MKD: 'southern', MNE: 'southern', KOS: 'southern', UKR: 'eastern', BLR: 'eastern', MDA: 'eastern', RUS: 'eastern', LTU: 'eastern', LVA: 'eastern', EST: 'eastern', GEO: 'eastern', ARM: 'eastern', AZE: 'eastern',
  // Asien
  JPN: 'asian', CHN: 'asian', KOR: 'asian', KAZ: 'asian', UZB: 'asian', KGZ: 'asian', MGL: 'asian', IND: 'asian', PAK: 'asian', THA: 'asian', VIE: 'asian', IDN: 'asian', MYS: 'asian', SGP: 'asian', PHI: 'asian', TWN: 'asian', HKG: 'asian', KHM: 'asian', LAO: 'asian', TLS: 'asian', KSA: 'arabic', ARE: 'arabic', QAT: 'arabic', BHR: 'arabic', KUW: 'arabic', OMA: 'arabic', YEM: 'arabic', JOR: 'arabic', IRQ: 'arabic', IRN: 'asian', ISR: 'western', TUR: 'southern', SYR: 'arabic', LBN: 'arabic', PLE: 'arabic', AFG: 'asian', BAN: 'asian', NEP: 'asian', SRI: 'asian', BRU: 'asian',
  // Lateinamerika
  MEX: 'latin', GUA: 'latin', CUB: 'latin', DOM: 'latin', PAN: 'latin', CRC: 'latin', HON: 'latin', SLV: 'latin', NIC: 'latin', ARG: 'latin', BOL: 'latin', BRA: 'latin', CHI: 'latin', COL: 'latin', ECU: 'latin', PAR: 'latin', PER: 'latin', URU: 'latin', VEN: 'latin', PUR: 'latin', JAM: 'latin', TTO: 'latin', BAH: 'latin', BAR: 'latin', CUB: 'latin', CAY: 'latin', GUY: 'latin', SUR: 'latin', HAI: 'latin',
  // Afrika
  CMR: 'african', BFA: 'african', RSA: 'african', MAR: 'arabic', ALG: 'arabic', TUN: 'arabic', EGY: 'arabic', LBY: 'arabic', COD: 'african', NGA: 'african', GHA: 'african', SEN: 'african', MLI: 'african', CIV: 'african', BEN: 'african', ETH: 'african', KEN: 'african', ERI: 'african', RWA: 'african', UGA: 'african', ZIM: 'african', ZAM: 'african', MOZ: 'african', MDG: 'african', TZA: 'african', NAM: 'african', BWA: 'african', MUS: 'african', TGO: 'african', GAB: 'african', COG: 'african', SLE: 'african', LBR: 'african', GMB: 'african', GNB: 'african', GNQ: 'african', CAF: 'african', TCD: 'african', NER: 'african', SDN: 'arabic', SSD: 'african', SOM: 'african', DJI: 'african', COM: 'african', CPV: 'latin', STP: 'latin', SYC: 'african', LES: 'african', SWZ: 'african', MWI: 'african', BDI: 'african',
  // Ozeanien
  AUS: 'western', NZL: 'western', GUM: 'asian', FIJ: 'african', PNG: 'african', SAM: 'african', TGA: 'asian', SOL: 'african', VAN: 'african', KIR: 'asian', TUV: 'asian', NRU: 'asian', PLW: 'asian', MHL: 'asian', FSM: 'asian',
  // USA/Canada
  USA: 'western', CAN: 'western',
};

function weightForPosition(index) {
  if (index === 0) return 18;
  if (index === 1) return 14;
  if (index === 2) return 11;
  if (index === 3) return 9;
  if (index === 4) return 8;
  if (index === 5) return 7;
  if (index === 6) return 6;
  if (index === 7) return 5;
  if (index === 8) return 4;
  if (index === 9) return 4;
  if (index === 10) return 3;
  if (index === 11) return 3;
  if (index === 12) return 2;
  if (index === 13) return 2;
  if (index >= 14 && index <= 19) return 2;
  return 1;
}

function buildRows() {
  const countries = readCountries();
  const lines = ['country_id,type,value,weight'];
  let missingCount = 0;

  for (const country of countries) {
    const id = Number(country.id);
    const regenRating = Number(country.regen_rating);
    const regenMax = Number(country.number_regen_max);
    const code3 = country.code_3;

    let data = NAME_DATA[id];

    // Fallback auf Region-Default
    if (!data) {
      const region = REGION_BY_CODE3[code3] ?? 'western';
      data = REGION_DEFAULTS[region];
      missingCount += 1;
    }

    // Zielgröße: viele Namen für Top-Länder, weniger für kleine
    let targetSize;
    if (regenMax === 0) targetSize = 10;
    else if (regenRating >= 80) targetSize = 30;
    else if (regenRating >= 60) targetSize = 25;
    else if (regenRating >= 40) targetSize = 20;
    else targetSize = 15;

    const first = data.first.slice(0, targetSize);
    const last = data.last.slice(0, targetSize);

    for (let i = 0; i < first.length; i += 1) {
      lines.push(`${id},first,${first[i]},${weightForPosition(i)}`);
    }
    for (let i = 0; i < last.length; i += 1) {
      lines.push(`${id},last,${last[i]},${weightForPosition(i)}`);
    }
  }

  if (missingCount > 0) {
    console.log(`Hinweis: ${missingCount} L\u00e4nder haben keine expliziten Daten und nutzen den Region-Default.`);
  }
  return lines.join('\n') + '\n';
}

function main() {
  console.log('Generiere rider_names.csv ...');
  const output = buildRows();
  fs.writeFileSync(OUTPUT_CSV, output, 'utf8');
  const countryCount = readCountries().length;
  const dataCount = Object.keys(NAME_DATA).length;
  console.log(`\u2705 ${OUTPUT_CSV} geschrieben (${countryCount} L\u00e4nder, ${dataCount} mit expliziten Daten, ${output.split('\n').length - 1} Zeilen)`);
}

main();
