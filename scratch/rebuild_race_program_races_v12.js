const fs = require('fs');
const path = require('path');

const csvPath = 'c:/Users/mkrinninger/Downloads/velo-feature-riderdevelopment/data/csv/race_program_races.csv';

// 1. Read existing allowed_program_group_ids mapping per race_id
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
const headers = lines[0].split(',');
const raceAllowedMap = new Map();

lines.slice(1).forEach(line => {
  const cells = line.split(',');
  const raceId = parseInt(cells[headers.indexOf('race_id')], 10);
  const allowed = cells[headers.indexOf('allowed_program_group_ids')];
  if (allowed && allowed.trim() !== '') {
    raceAllowedMap.set(raceId, allowed.trim());
  }
});

// 2. Define the program mappings

// Program 1: Non_Cobble_Tour_1 (100 days, 85 WT / 15 Pro)
const prog1Races = [
  55, // Tour de France (21)
  1,  // Tour Down Under (6)
  10, // UAE Tour (7)
  50, // Volta Ciclista a Catalunya (7)
  18, // Tirreno-Adriatico (7)
  51, // Itzulia Basque Country (6)
  52, // Tour de Romandie (6)
  53, // Tour Auvergne - Rhône-Alpes (Dauphiné) (8)
  57, // Tour de Pologne (7)
  16, // Strade Bianche (1)
  17, // Milano-Sanremo (1)
  29, // Amstel Gold Race (1)
  30, // La Flèche Wallonne (1)
  28, // Liège-Bastogne-Liège (1)
  56, // Donostia San Sebastian Klasikoa (DSSK) (1)
  61, // Bretagne Classic (1)
  62, // Grand Prix de Québec (1)
  63, // Grand Prix de Montréal (1)
  64, // Il Lombardia (1)
  3,  // Volta Algarve (5)
  102, // Tour of the Alps (5)
  73, // Milano - Torino (1)
  88, // Giro dell'Emilia (1)
  91, // Tre Valli Varesine (1)
  13, // Faun-Ardèche (1)
  14  // Faun Drome (1)
];

// Program 2: Non_Cobble_Tour_2 (100 days, 85 WT / 15 Pro)
const prog2Races = [
  55, // Tour de France (21)
  1,  // Tour Down Under (6)
  10, // UAE Tour (7)
  50, // Volta Ciclista a Catalunya (7)
  19, // Paris-Nice (8)
  51, // Itzulia Basque Country (6)
  52, // Tour de Romandie (6)
  54, // Tour de Suisse (5)
  57, // Tour de Pologne (7)
  16, // Strade Bianche (1)
  17, // Milano-Sanremo (1)
  29, // Amstel Gold Race (1)
  30, // La Flèche Wallonne (1)
  28, // Liège-Bastogne-Liège (1)
  32, // Copenhagen Sprint ME (1)
  58, // ADAC Cyclassics (1)
  56, // Donostia San Sebastian Klasikoa (DSSK) (1)
  61, // Bretagne Classic (1)
  62, // Grand Prix de Québec (1)
  63, // Grand Prix de Montréal (1)
  64, // Il Lombardia (1)
  5,  // Volta a la Comunitat Valenciana (5)
  104, // Tour de Hongrie (5)
  13, // Faun-Ardèche (1)
  14, // Faun Drome (1)
  73, // Milano - Torino (1)
  88, // Giro dell'Emilia (1)
  91  // Tre Valli Varesine (1)
];

// Program 3: Non_Cobble_Tour_3 (145 days, 29 WT [20%] / 116 Pro [80%])
const prog3Races = [
  55, // Tour de France (21)
  1,  // Tour Down Under (6)
  4,  // Mapei Cadel Evans Great Ocean Road Race (1)
  16, // Strade Bianche (1)
  122, // AlUla Tour (5)
  5,   // Volta a la Comunitat Valenciana (5)
  9,   // Figueira Champions Classic (1)
  8,   // Clasica Almeria (1)
  3,   // Volta Algarve (5)
  13,  // Faun-Ardèche (1)
  14,  // Faun Drome (1)
  71,  // Trofeo Laigueglia (1)
  72,  // Danilith Nokere Koerse (1)
  74,  // Grand Prix de Denain - Porte du Hainaut (1)
  75,  // Bredene Koksijde Classic (1)
  76,  // Gran Premio Miguel Indurain (1)
  100, // Région Pays de la Loire Tour (4)
  101, // Tour of Hainan (5)
  102, // Tour of the Alps (5)
  103, // Presidential Cycling Tour of Türkiye (8)
  78,  // Grand Prix du Morbihan (1)
  79,  // Tro-Bro Léon (1)
  104, // Tour de Hongrie (5)
  80,  // Classique Dunkerque / Grand prix des Hauts de France (1)
  105, // 4 Jours de Dunkerque / GP des Hauts de France (5)
  106, // Boucles de la Mayenne - Crédit Mutuel (4)
  108, // Ethias-Tour de Wallonie (5)
  81,  // Brussels Cycling Classic (1)
  82,  // Circuit Franco-Belge (1)
  109, // Baloise Belgium Tour (5)
  112, // PostNord Tour of Denmark (5)
  113, // Vuelta a Burgos (5)
  114, // Arctic Race of Norway (4)
  116, // Lidl Deutschland Tour (5)
  117, // Lloyds Tour of Britain Men (5)
  84,  // Gran Premio città di Peccioli - Coppa Sabatini (1)
  85,  // GP de Fourmies / La Voix du Nord (1)
  119, // Skoda Tour de Luxembourg (5)
  121, // Petronas Le Tour de Langkawi (8)
  90,  // Coppa Bernocchi - GP Banco BPM (1)
  91   // Tre Valli Varesine (1)
];

// Program 4: Cobble_Giro_Tour_1 (120 days, 102 WT [85%] / 18 Pro [15%])
const prog4Races = [
  55, // Tour de France (21)
  23, // Giro d'Italia (21)
  15, // Omloop Nieuwsblad ME (1)
  21, // E3 Saxo Classic ME (1)
  45, // In Flanders Fields (Gent-Wevelgem) (1)
  46, // Dwars door Vlaanderen (1)
  25, // Ronde van Vlaanderen ME (1)
  27, // Paris-Roubaix (1)
  1,  // Santos Tour Down Under (6)
  4,  // Mapei Cadel Evans Great Ocean Road Race (1)
  10, // UAE Tour (7)
  16, // Strade Bianche (1)
  18, // Tirreno-Adriatico (7)
  17, // Milano-Sanremo (1)
  51, // Itzulia Basque Country (6)
  29, // Amstel Gold Race (1)
  30, // La Flèche Wallonne (1)
  28, // Liège-Bastogne-Liège (1)
  31, // Eschborn-Frankfurt (1)
  32, // Copenhagen Sprint ME (1)
  54, // Tour de Suisse (5)
  56, // Donostia San Sebastian Klasikoa (DSSK) (1)
  57, // Tour de Pologne (7)
  58, // ADAC Cyclassics (1)
  59, // Renewi Tour (5)
  61, // Bretagne Classic - CIC (1)
  2,  // Surf Coast Classic ME (1)
  5,  // Volta a la Comunitat Valenciana (5)
  70, // Kuurne - Brussel - Kuurne (1)
  72, // Danilith Nokere Koerse (1)
  79, // Tro-Bro Léon (1)
  87, // Flandrien 0.0 Classic (1)
  121 // Petronas Le Tour de Langkawi (8)
];

// Program 5: Cobble_Giro_Tour_2 (120 days, 102 WT [85%] / 18 Pro [15%])
const prog5Races = [
  55, // Tour de France (21)
  23, // Giro d'Italia (21)
  15, // Omloop Nieuwsblad ME (1)
  21, // E3 Saxo Classic ME (1)
  45, // In Flanders Fields (Gent-Wevelgem) (1)
  46, // Dwars door Vlaanderen (1)
  25, // Ronde van Vlaanderen ME (1)
  27, // Paris-Roubaix (1)
  4,  // Mapei Cadel Evans Great Ocean Road Race (1)
  16, // Strade Bianche (1)
  19, // Paris-Nice (8)
  17, // Milano-Sanremo (1)
  52, // Tour de Romandie (6)
  53, // Tour Auvergne - Rhône-Alpes (Dauphiné) (8)
  60, // La Vuelta Ciclista a España (21)
  64, // Il Lombardia (1)
  65, // Tour of Guangxi (6)
  11, // Tour of Oman (5)
  8,  // Clasica Almeria (1)
  3,  // Volta Algarve (5)
  70, // Kuurne - Brussel - Kuurne (1)
  72, // Danilith Nokere Koerse (1)
  100, // Région Pays de la Loire Tour (4)
  93  // Paris - Tours Elite (1)
];

// Program 6: Cobble_Giro_Tour_3 (145 days, 58 WT [40%] / 87 Pro [60%])
const prog6Races = [
  55, // Tour de France (21)
  23, // Giro d'Italia (21)
  15, // Omloop Nieuwsblad ME (1)
  21, // E3 Saxo Classic ME (1)
  45, // In Flanders Fields (Gent-Wevelgem) (1)
  46, // Dwars door Vlaanderen (1)
  25, // Ronde van Vlaanderen ME (1)
  27, // Paris-Roubaix (1)
  1,  // Santos Tour Down Under (6)
  4,  // Mapei Cadel Evans Great Ocean Road Race (1)
  16, // Strade Bianche (1)
  17, // Milano-Sanremo (1)
  28, // Liège-Bastogne-Liège (1)
  122, // AlUla Tour (5)
  5,   // Volta a la Comunitat Valenciana (5)
  9,   // Figueira Champions Classic (1)
  8,   // Clasica Almeria (1)
  3,   // Volta Algarve (5)
  70,  // Kuurne - Brussel - Kuurne (1)
  71,  // Trofeo Laigueglia (1)
  72,  // Danilith Nokere Koerse (1)
  74,  // Grand Prix de Denain - Porte du Hainaut (1)
  75,  // Bredene Koksijde Classic (1)
  76,  // Gran Premio Miguel Indurain (1)
  100, // Région Pays de la Loire Tour (4)
  101, // Tour of Hainan (5)
  102, // Tour of the Alps (5)
  79,  // Tro-Bro Léon (1)
  108, // Ethias-Tour de Wallonie (5)
  81,  // Brussels Cycling Classic (1)
  82,  // Circuit Franco-Belge (1)
  109, // Baloise Belgium Tour (5)
  112, // PostNord Tour of Denmark (5)
  113, // Vuelta a Burgos (5)
  114, // Arctic Race of Norway (4)
  116, // Lidl Deutschland Tour (5)
  117, // Lloyds Tour of Britain Men (5)
  84,  // Gran Premio città di Peccioli - Coppa Sabatini (1)
  85,  // GP de Fourmies / La Voix du Nord (1)
  86,  // Lotto Grand Prix de Wallonie (1)
  87,  // Flandrien 0.0 Classic (1)
  121, // Petronas Le Tour de Langkawi (8)
  93   // Paris - Tours Elite (1)
];

// Program 7: Cobble_Giro_Vuelta_1 (120 days, 102 WT [85%] / 18 Pro [15%])
const prog7Races = [
  60, // La Vuelta Ciclista a España (21)
  23, // Giro d'Italia (21)
  15, // Omloop Nieuwsblad ME (1)
  21, // E3 Saxo Classic ME (1)
  45, // In Flanders Fields (Gent-Wevelgem) (1)
  46, // Dwars door Vlaanderen (1)
  25, // Ronde van Vlaanderen ME (1)
  27, // Paris-Roubaix (1)
  1,  // Santos Tour Down Under (6)
  4,  // Mapei Cadel Evans Great Ocean Road Race (1)
  16, // Strade Bianche (1)
  17, // Milano-Sanremo (1)
  32, // Copenhagen Sprint ME (1)
  54, // Tour de Suisse (5)
  56, // Donostia San Sebastian Klasikoa (DSSK) (1)
  57, // Tour de Pologne (7)
  58, // ADAC Cyclassics (1)
  65, // Tour of Guangxi (6)
  18, // Tirreno-Adriatico (7)
  51, // Itzulia Basque Country (6)
  52, // Tour de Romandie (6)
  28, // Liège-Bastogne-Liège (1)
  70, // Kuurne - Brussel - Kuurne (1)
  72, // Danilith Nokere Koerse (1)
  79, // Tro-Bro Léon (1)
  87, // Flandrien 0.0 Classic (1)
  111, // Tour of Magnificent Qinghai (8)
  120  // CRO Race (6)
];

// Program 8: Cobble_Giro_Vuelta_2 (120 days, 102 WT [85%] / 18 Pro [15%])
const prog8Races = [
  60, // La Vuelta Ciclista a España (21)
  23, // Giro d'Italia (21)
  15, // Omloop Nieuwsblad ME (1)
  21, // E3 Saxo Classic ME (1)
  45, // In Flanders Fields (Gent-Wevelgem) (1)
  46, // Dwars door Vlaanderen (1)
  25, // Ronde van Vlaanderen ME (1)
  27, // Paris-Roubaix (1)
  1,  // Santos Tour Down Under (6)
  4,  // Mapei Cadel Evans Great Ocean Road Race (1)
  10, // UAE Tour (7)
  16, // Strade Bianche (1)
  19, // Paris-Nice (8)
  17, // Milano-Sanremo (1)
  28, // Liège-Bastogne-Liège (1)
  53, // Tour Auvergne - Rhône-Alpes (Dauphiné) (8)
  55, // Tour de France (21)
  2,  // Surf Coast Classic ME (1)
  5,  // Volta a la Comunitat Valenciana (5)
  8,  // Clasica Almeria (1)
  70, // Kuurne - Brussel - Kuurne (1)
  72, // Danilith Nokere Koerse (1)
  121, // Petronas Le Tour de Langkawi (8)
  93  // Paris - Tours Elite (1)
];

// Program 9: Cobble_Giro_Vuelta_3 (145 days, 58 WT [40%] / 87 Pro [60%])
const prog9Races = [
  60, // La Vuelta Ciclista a España (21)
  23, // Giro d'Italia (21)
  15, // Omloop Nieuwsblad ME (1)
  21, // E3 Saxo Classic ME (1)
  45, // In Flanders Fields (Gent-Wevelgem) (1)
  46, // Dwars door Vlaanderen (1)
  25, // Ronde van Vlaanderen ME (1)
  27, // Paris-Roubaix (1)
  1,  // Santos Tour Down Under (6)
  4,  // Mapei Cadel Evans Great Ocean Road Race (1)
  16, // Strade Bianche (1)
  17, // Milano-Sanremo (1)
  28, // Liège-Bastogne-Liège (1)
  122, // AlUla Tour (5)
  5,   // Volta a la Comunitat Valenciana (5)
  9,   // Figueira Champions Classic (1)
  8,   // Clasica Almeria (1)
  3,   // Volta Algarve (5)
  70,  // Kuurne - Brussel - Kuurne (1)
  71,  // Trofeo Laigueglia (1)
  72,  // Danilith Nokere Koerse (1)
  74,  // Grand Prix de Denain - Porte du Hainaut (1)
  75,  // Bredene Koksijde Classic (1)
  76,  // Gran Premio Miguel Indurain (1)
  100, // Région Pays de la Loire Tour (4)
  101, // Tour of Hainan (5)
  102, // Tour of the Alps (5)
  79,  // Tro-Bro Léon (1)
  108, // Ethias-Tour de Wallonie (5)
  81,  // Brussels Cycling Classic (1)
  82,  // Circuit Franco-Belge (1)
  109, // Baloise Belgium Tour (5)
  111, // Tour of Magnificent Qinghai (8)
  112, // PostNord Tour of Denmark (5)
  113, // Vuelta a Burgos (5)
  114, // Arctic Race of Norway (4)
  86,  // Lotto Grand Prix de Wallonie (1)
  87,  // Flandrien 0.0 Classic (1)
  121, // Petronas Le Tour de Langkawi (8)
  90,  // Coppa Bernocchi - GP Banco BPM (1)
  91,  // Tre Valli Varesine (1)
  92,  // Gran Piemonte (1)
  93,  // Paris - Tours Elite (1)
  94   // Giro del Veneto (1)
];

// Program 10: Vuelta_Tour_1 (125 days, 85 WT [106 days] / 15 Pro [19 days])
const prog10Races = [
  1, 10, 23, 28, 29, 30, 52, 53, 54, 55, 56, 60, 64, 65, 86, 87, 90, 91, 92, 93, 108, 121
];

// Program 11: Vuelta_Tour_2 (125 days, 85 WT [106 days] / 15 Pro [19 days])
const prog11Races = [
  23, 26, 28, 29, 30, 50, 51, 52, 53, 54, 55, 56, 60, 64, 65, 87, 90, 91, 92, 93, 108, 121
];

// Program 12: Vuelta_Tour_3 (145 days, 35 WT [53 days] / 65 Pro [92 days])
const prog12Races = [
  1, 4, 8, 9, 11, 12, 13, 16, 22, 26, 28, 29, 30, 55, 60, 70, 71, 73, 74, 75, 76, 78, 79, 80, 81, 82, 90, 91, 92, 93, 94, 96, 100, 104, 105, 107, 108, 110, 112, 113, 115, 119, 121, 122
];

// Program 13: Cobble_Tour_1 (125 days, 85 WT [104 days] / 15 Pro [20 days])
const prog13Races = [
  8, 9, 10, 15, 18, 21, 23, 25, 27, 28, 45, 46, 52, 53, 54, 55, 56, 57, 59, 61, 63, 64, 65, 70, 72, 79, 84, 86, 87, 90, 91, 92, 93, 121
];

// Program 14: Cobble_Tour_2 (125 days, 85 WT [104 days] / 15 Pro [20 days])
const prog14Races = [
  1, 11, 15, 18, 21, 23, 25, 27, 45, 46, 51, 52, 53, 54, 55, 57, 59, 65, 70, 72, 89, 93, 119, 120
];

// Program 15: Cobble_Tour_3 (125 days, 35 WT [44 days] / 65 Pro [81 days])
const prog15Races = [
  5, 12, 15, 21, 25, 27, 45, 46, 54, 55, 57, 59, 71, 72, 74, 75, 76, 79, 82, 85, 87, 91, 93, 94, 96, 100, 101, 103, 105, 107, 108, 109, 114, 117, 121, 122
];

// Program 16: Non_Cobble Giro_Tour_1 (125 days, 85 WT [104 days] / 15 Pro [21 days])
const prog16Races = [
  16, 17, 18, 20, 23, 28, 29, 30, 51, 52, 53, 54, 55, 56, 57, 58, 59, 61, 62, 63, 64, 65, 84, 88, 90, 91, 92, 94, 96, 118, 119, 120
];

// Program 17: Non_Cobble Giro_Tour_2 (125 days, 85 WT [104 days] / 15 Pro [21 days])
const prog17Races = [
  10, 13, 14, 17, 19, 23, 28, 29, 30, 51, 52, 53, 54, 55, 57, 59, 65, 85, 117, 119, 121
];

// Program 18: Non_Cobble Giro_Tour_3 (145 days, 45 WT [65 days] / 55 Pro [80 days])
const prog18Races = [
  2, 8, 9, 11, 12, 13, 14, 17, 18, 22, 23, 26, 28, 29, 55, 59, 63, 64, 65, 71, 73, 74, 75, 76, 81, 82, 84, 88, 90, 91, 92, 94, 96, 100, 102, 108, 110, 112, 113, 115, 117, 119, 120
];

// Program 19: Sprinter Non_Cobble_Giro_Vuelta_1 (125 days, 85 WT [103 days] / 15 Pro [18 days])
const prog19Races = [
  1, 10, 16, 17, 19, 23, 28, 29, 30, 32, 50, 52, 54, 56, 57, 58, 60, 64, 65, 77, 92, 111, 121
];

// Program 20: Sprinter Non_Cobble_Giro_Vuelta_2 (125 days, 85 WT [98 days] / 15 Pro [22 days])
const prog20Races = [
  1, 5, 10, 16, 17, 19, 23, 28, 29, 30, 31, 32, 50, 54, 56, 57, 58, 60, 64, 65, 77, 81, 82, 86, 121, 122
];

// Program 21: Sprinter Non_Cobble_Giro_Vuelta_3 (145 days, 45 WT [67 days] / 55 Pro [75 days])
const prog21Races = [
  3, 5, 8, 9, 13, 14, 23, 52, 54, 57, 60, 64, 65, 71, 73, 74, 75, 76, 77, 81, 82, 90, 91, 92, 101, 102, 108, 111, 112, 115, 119, 121, 122
];

// Program 22: Classic_Cobble_No Grand Tour_1 (120 days, 78 WT [65%] / 42 Pro [35%])
const prog22Races = [
  1, 4, 10, 11, 15, 19, 20, 21, 22, 24, 25, 27, 45, 46, 51, 52, 53, 54, 56, 57, 58, 59, 61, 62, 63, 65, 70, 72, 79, 80, 89, 101, 105, 106, 111, 118, 120
];

// Program 23: Classic_Cobble_No Grand Tour_2 (120 days, 78 WT [65%] / 42 Pro [35%])
const prog23Races = [
  1, 4, 5, 8, 9, 10, 15, 16, 17, 19, 20, 21, 24, 25, 27, 29, 30, 45, 46, 51, 52, 53, 56, 57, 58, 59, 61, 62, 63, 64, 65, 70, 72, 87, 89, 105, 106, 110, 111, 118, 120
];

// Program 24: Classic_Cobble_No Grand Tour_3 (145 days, 34 WT [23.4%] / 111 Pro [76.6%])
const prog24Races = [
  2, 3, 4, 9, 11, 15, 19, 21, 22, 25, 27, 45, 46, 51, 53, 59, 70, 71, 73, 74, 75, 76, 78, 79, 80, 84, 85, 90, 92, 93, 94, 95, 101, 102, 103, 104, 105, 106, 108, 110, 111, 112, 113, 115, 117, 119, 121
];

// Program 25: Classic_Non_Cobble_No Grand Tour_one day focus_1 (125 days, 52 WT / 73 Pro)
const prog25Races = [
  10, 11, 17, 18, 22, 26, 28, 29, 30, 50, 51, 53, 56, 59, 64, 65, 78, 80, 85, 89, 104, 105, 107, 108, 110, 111, 113, 115, 117, 119, 120, 122
];

// Program 26: Classic_Non_Cobble_No Grand Tour_one day focus_2 (125 days, 51 WT / 74 Pro)
const prog26Races = [
  1, 2, 5, 9, 12, 13, 14, 17, 19, 20, 24, 28, 29, 30, 52, 53, 54, 56, 57, 61, 62, 63, 64, 71, 73, 74, 75, 76, 84, 92, 94, 95, 100, 105, 106, 108, 111, 114, 116, 118, 119, 121
];

// Program 27: Classic_Non_Cobble_No Grand Tour_one day focus_3 (145 days, 65 WT / 80 Pro)
const prog27Races = [
  1, 8, 10, 11, 13, 14, 17, 19, 22, 26, 28, 29, 30, 32, 50, 51, 52, 56, 57, 59, 64, 65, 73, 75, 76, 78, 80, 81, 82, 84, 85, 90, 91, 104, 105, 107, 108, 109, 111, 115, 117, 119, 121, 122
];

// Program 28: Classic_Non_Cobble_No Grand Tour_stage race focus_1 (124 days, 55 WT / 69 Pro)
const prog28Races = [
  10, 11, 17, 19, 28, 29, 30, 50, 51, 53, 56, 57, 64, 65, 104, 105, 107, 108, 110, 111, 114, 116, 117, 119, 121, 122
];

// Program 29: Classic_Non_Cobble_No Grand Tour_stage race focus_2 (123 days, 54 WT / 69 Pro)
const prog29Races = [
  1, 2, 5, 8, 9, 12, 13, 14, 17, 18, 24, 26, 28, 29, 30, 50, 52, 53, 54, 56, 59, 61, 62, 63, 64, 71, 73, 74, 75, 76, 78, 80, 84, 86, 89, 90, 92, 94, 95, 100, 105, 106, 111, 113, 115, 118, 120
];

// Program 30: Classic_Non_Cobble_No Grand Tour_stage race focus_3 (144 days, 68 WT / 76 Pro)
const prog30Races = [
  1, 4, 9, 10, 11, 13, 14, 17, 19, 20, 22, 26, 28, 29, 30, 51, 52, 53, 56, 57, 58, 59, 64, 65, 71, 73, 74, 75, 76, 78, 80, 84, 85, 91, 92, 104, 105, 107, 108, 109, 111, 117, 119, 121, 122
];



const newMappings = [];
let nextId = 1;

function addProgRaces(programId, racesList) {
  racesList.forEach(raceId => {
    newMappings.push({
      id: nextId++,
      program_id: programId,
      race_id: raceId,
      allowed_program_group_ids: raceAllowedMap.get(raceId) || ''
    });
  });
}

addProgRaces(1, prog1Races);
addProgRaces(2, prog2Races);
addProgRaces(3, prog3Races);
addProgRaces(4, prog4Races);
addProgRaces(5, prog5Races);
addProgRaces(6, prog6Races);
addProgRaces(7, prog7Races);
addProgRaces(8, prog8Races);
addProgRaces(9, prog9Races);
addProgRaces(10, prog10Races);
addProgRaces(11, prog11Races);
addProgRaces(12, prog12Races);
addProgRaces(13, prog13Races);
addProgRaces(14, prog14Races);
addProgRaces(15, prog15Races);
addProgRaces(16, prog16Races);
addProgRaces(17, prog17Races);
addProgRaces(18, prog18Races);
addProgRaces(19, prog19Races);
addProgRaces(20, prog20Races);
addProgRaces(21, prog21Races);
addProgRaces(22, prog22Races);
addProgRaces(23, prog23Races);
addProgRaces(24, prog24Races);
addProgRaces(25, prog25Races);
addProgRaces(26, prog26Races);
addProgRaces(27, prog27Races);
addProgRaces(28, prog28Races);
addProgRaces(29, prog29Races);
addProgRaces(30, prog30Races);

// 3. Write back to CSV
let outputContent = 'id,program_id,race_id,allowed_program_group_ids\n';
newMappings.forEach(m => {
  outputContent += `${m.id},${m.program_id},${m.race_id},${m.allowed_program_group_ids}\n`;
});

fs.writeFileSync(csvPath, outputContent, 'utf8');
console.log(`Successfully populated ${newMappings.length} mappings into ${csvPath}`);
