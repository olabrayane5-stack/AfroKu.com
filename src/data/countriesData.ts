export interface CountryInfo {
  name: string;
  code: string;
  flag: string;
  phoneCode: string;
  cities: string[];
}

export const COUNTRIES_LIST: CountryInfo[] = [
  {
    name: 'Bénin',
    code: 'BJ',
    flag: '🇧🇯',
    phoneCode: '+229',
    cities: [
      'Cotonou',
      'Porto-Novo',
      'Abomey-Calavi',
      'Ouidah',
      'Abomey',
      'Parakou',
      'Natitingou',
      'Grand-Popo',
      'Ganvié',
      'Bohicon',
      'Dassa-Zoumé',
      'Kandi',
      'Djougou',
      'Lokossa',
      'Pobè'
    ]
  },
  {
    name: 'Togo',
    code: 'TG',
    flag: '🇹🇬',
    phoneCode: '+228',
    cities: ['Lomé', 'Kara', 'Sokodé', 'Kpalimé', 'Atakpamé', 'Aného', 'Dapaong']
  },
  {
    name: 'Côte d\'Ivoire',
    code: 'CI',
    flag: '🇨🇮',
    phoneCode: '+225',
    cities: ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro', 'Korhogo', 'Man', 'Grand-Bassam', 'Assinie']
  },
  {
    name: 'Sénégal',
    code: 'SN',
    flag: '🇸🇳',
    phoneCode: '+221',
    cities: ['Dakar', 'Saint-Louis', 'Thiès', 'Mbour', 'Saly', 'Ziguinchor', 'Cap Skirring', 'Touba']
  },
  {
    name: 'Ghana',
    code: 'GH',
    flag: '🇬🇭',
    phoneCode: '+233',
    cities: ['Accra', 'Kumasi', 'Cape Coast', 'Tamale', 'Takoradi', 'Tema', 'Elmina']
  },
  {
    name: 'Nigéria',
    code: 'NG',
    flag: '🇳🇬',
    phoneCode: '+234',
    cities: ['Lagos', 'Abuja', 'Ibadan', 'Port Harcourt', 'Kano', 'Enugu', 'Calabar']
  },
  {
    name: 'Burkina Faso',
    code: 'BF',
    flag: '🇧🇫',
    phoneCode: '+226',
    cities: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora', 'Kaya']
  },
  {
    name: 'Mali',
    code: 'ML',
    flag: '🇲🇱',
    phoneCode: '+223',
    cities: ['Bamako', 'Ségou', 'Sikasso', 'Mopti', 'Tombouctou', 'Kayes']
  },
  {
    name: 'Niger',
    code: 'NE',
    flag: '🇳🇪',
    phoneCode: '+227',
    cities: ['Niamey', 'Maradi', 'Zinder', 'Agadez', 'Tahoua']
  },
  {
    name: 'Cameroun',
    code: 'CM',
    flag: '🇨🇲',
    phoneCode: '+237',
    cities: ['Douala', 'Yaoundé', 'Garoua', 'Kribi', 'Bamenda', 'Bafoussam', 'Limbé']
  },
  {
    name: 'Gabon',
    code: 'GA',
    flag: '🇬🇦',
    phoneCode: '+241',
    cities: ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Lambaréné']
  },
  {
    name: 'Congo (RDC)',
    code: 'CD',
    flag: '🇨🇩',
    phoneCode: '+243',
    cities: ['Kinshasa', 'Lubumbashi', 'Goma', 'Kisangani', 'Bukavu', 'Matadi']
  },
  {
    name: 'Congo (Brazzaville)',
    code: 'CG',
    flag: '🇨🇬',
    phoneCode: '+242',
    cities: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi']
  },
  {
    name: 'Guinée',
    code: 'GN',
    flag: '🇬🇳',
    phoneCode: '+224',
    cities: ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labé']
  },
  {
    name: 'Maroc',
    code: 'MA',
    flag: '🇲🇦',
    phoneCode: '+212',
    cities: ['Marrakech', 'Casablanca', 'Rabat', 'Fès', 'Tanger', 'Agadir', 'Essaouira']
  },
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    phoneCode: '+33',
    cities: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Nice', 'Nantes', 'Lille']
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    phoneCode: '+1',
    cities: ['Montréal', 'Toronto', 'Vancouver', 'Québec', 'Ottawa', 'Calgary']
  },
  {
    name: 'États-Unis',
    code: 'US',
    flag: '🇺🇸',
    phoneCode: '+1',
    cities: ['New York', 'Los Angeles', 'Miami', 'Chicago', 'Atlanta', 'Houston', 'Washington D.C.']
  },
  {
    name: 'Belgique',
    code: 'BE',
    flag: '🇧🇪',
    phoneCode: '+32',
    cities: ['Bruxelles', 'Anvers', 'Liège', 'Gand', 'Charleroi', 'Bruges']
  },
  {
    name: 'Suisse',
    code: 'CH',
    flag: '🇨🇭',
    phoneCode: '+41',
    cities: ['Genève', 'Zürich', 'Lausanne', 'Bâle', 'Berne']
  },
  {
    name: 'Royaume-Uni',
    code: 'GB',
    flag: '🇬🇧',
    phoneCode: '+44',
    cities: ['Londres', 'Manchester', 'Birmingham', 'Édimbourg', 'Glasgow', 'Bristol']
  },
  {
    name: 'Allemagne',
    code: 'DE',
    flag: '🇩🇪',
    phoneCode: '+49',
    cities: ['Berlin', 'Munich', 'Francfort', 'Hambourg', 'Cologne']
  },
  {
    name: 'Autre pays...',
    code: 'OTHER',
    flag: '🌐',
    phoneCode: '+',
    cities: []
  }
];

export function getCountryByName(name: string): CountryInfo | undefined {
  return COUNTRIES_LIST.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

export function getCitiesByCountry(countryName: string): string[] {
  const found = getCountryByName(countryName);
  return found ? found.cities : [];
}
