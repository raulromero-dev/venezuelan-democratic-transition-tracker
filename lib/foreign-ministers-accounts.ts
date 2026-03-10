// Foreign Ministers and Heads of State X accounts by region
// These are verified official accounts for diplomatic monitoring

export interface ForeignMinisterAccount {
  handle: string
  name: string
  role: string
  country: string
  countryCode: string
  flag: string
  region: "North America" | "South America" | "Central America" | "Caribbean" | "Europe" | "Asia" | "Oceania" | "Africa"
}

export const FOREIGN_MINISTER_ACCOUNTS: ForeignMinisterAccount[] = [
  // ===================
  // NORTH AMERICA
  // ===================
  // United States
  {
    handle: "SecBlinken",
    name: "Antony Blinken",
    role: "Secretary of State",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    region: "North America",
  },
  {
    handle: "StateDept",
    name: "U.S. State Department",
    role: "Foreign Ministry",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    region: "North America",
  },
  {
    handle: "WHAAsstSecty",
    name: "Western Hemisphere Affairs",
    role: "State Dept Bureau",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    region: "North America",
  },
  {
    handle: "BrianANichols",
    name: "Brian A. Nichols",
    role: "Asst. Secretary",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    region: "North America",
  },
  // Canada
  {
    handle: "MeslanieJoly",
    name: "Mélanie Joly",
    role: "Foreign Minister",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    region: "North America",
  },
  {
    handle: "CanadaFP",
    name: "Global Affairs Canada",
    role: "Foreign Ministry",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    region: "North America",
  },
  {
    handle: "JustinTrudeau",
    name: "Justin Trudeau",
    role: "Prime Minister",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    region: "North America",
  },
  // Mexico
  {
    handle: "SRE_mx",
    name: "Secretaría de Relaciones Exteriores",
    role: "Foreign Ministry",
    country: "Mexico",
    countryCode: "MX",
    flag: "🇲🇽",
    region: "North America",
  },
  {
    handle: "JuanRamonDLF",
    name: "Juan Ramón de la Fuente",
    role: "Foreign Minister",
    country: "Mexico",
    countryCode: "MX",
    flag: "🇲🇽",
    region: "North America",
  },
  {
    handle: "Claudiashein",
    name: "Claudia Sheinbaum",
    role: "President",
    country: "Mexico",
    countryCode: "MX",
    flag: "🇲🇽",
    region: "North America",
  },

  // ===================
  // SOUTH AMERICA
  // ===================
  // Argentina
  {
    handle: "DianaMondino",
    name: "Diana Mondino",
    role: "Foreign Minister",
    country: "Argentina",
    countryCode: "AR",
    flag: "🇦🇷",
    region: "South America",
  },
  {
    handle: "CancilleriaARG",
    name: "Cancillería Argentina",
    role: "Foreign Ministry",
    country: "Argentina",
    countryCode: "AR",
    flag: "🇦🇷",
    region: "South America",
  },
  {
    handle: "JMilei",
    name: "Javier Milei",
    role: "President",
    country: "Argentina",
    countryCode: "AR",
    flag: "🇦🇷",
    region: "South America",
  },
  // Brazil
  {
    handle: "MauroVieira_MRE",
    name: "Mauro Vieira",
    role: "Foreign Minister",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    region: "South America",
  },
  {
    handle: "ItasmaratyGovBr",
    name: "Itamaraty",
    role: "Foreign Ministry",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    region: "South America",
  },
  {
    handle: "LulaOficial",
    name: "Lula da Silva",
    role: "President",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    region: "South America",
  },
  // Chile
  {
    handle: "Albertovanklav",
    name: "Alberto van Klaveren",
    role: "Foreign Minister",
    country: "Chile",
    countryCode: "CL",
    flag: "🇨🇱",
    region: "South America",
  },
  {
    handle: "GabrielBoric",
    name: "Gabriel Boric",
    role: "President",
    country: "Chile",
    countryCode: "CL",
    flag: "🇨🇱",
    region: "South America",
  },
  {
    handle: "MinijstelChile",
    name: "Ministerio RREE Chile",
    role: "Foreign Ministry",
    country: "Chile",
    countryCode: "CL",
    flag: "🇨🇱",
    region: "South America",
  },
  // Colombia
  {
    handle: "CancilleriaCol",
    name: "Cancillería Colombia",
    role: "Foreign Ministry",
    country: "Colombia",
    countryCode: "CO",
    flag: "🇨🇴",
    region: "South America",
  },
  {
    handle: "petrogustavo",
    name: "Gustavo Petro",
    role: "President",
    country: "Colombia",
    countryCode: "CO",
    flag: "🇨🇴",
    region: "South America",
  },
  // Peru
  {
    handle: "CancilleriaPeru",
    name: "Cancillería Peru",
    role: "Foreign Ministry",
    country: "Peru",
    countryCode: "PE",
    flag: "🇵🇪",
    region: "South America",
  },
  // Ecuador
  {
    handle: "CancilleriaEc",
    name: "Cancillería Ecuador",
    role: "Foreign Ministry",
    country: "Ecuador",
    countryCode: "EC",
    flag: "🇪🇨",
    region: "South America",
  },
  {
    handle: "DanielNoboaOk",
    name: "Daniel Noboa",
    role: "President",
    country: "Ecuador",
    countryCode: "EC",
    flag: "🇪🇨",
    region: "South America",
  },
  // Uruguay
  {
    handle: "MRECUruguay",
    name: "MREC Uruguay",
    role: "Foreign Ministry",
    country: "Uruguay",
    countryCode: "UY",
    flag: "🇺🇾",
    region: "South America",
  },
  // Paraguay
  {
    handle: "MREParaguay",
    name: "MRE Paraguay",
    role: "Foreign Ministry",
    country: "Paraguay",
    countryCode: "PY",
    flag: "🇵🇾",
    region: "South America",
  },
  // Bolivia
  {
    handle: "MRE_Bolivia",
    name: "MRE Bolivia",
    role: "Foreign Ministry",
    country: "Bolivia",
    countryCode: "BO",
    flag: "🇧🇴",
    region: "South America",
  },
  // Guyana
  {
    handle: "MoFAGuyana",
    name: "Foreign Affairs Guyana",
    role: "Foreign Ministry",
    country: "Guyana",
    countryCode: "GY",
    flag: "🇬🇾",
    region: "South America",
  },

  // ===================
  // CENTRAL AMERICA (Nicaragua, Belize, Guatemala, El Salvador, Panama, Honduras, Costa Rica - NOT Cuba)
  // ===================
  // El Salvador
  {
    handle: "naborib",
    name: "Nayib Bukele",
    role: "President",
    country: "El Salvador",
    countryCode: "SV",
    flag: "🇸🇻",
    region: "Central America",
  },
  {
    handle: "RREE_SV",
    name: "Foreign Ministry El Salvador",
    role: "Foreign Ministry",
    country: "El Salvador",
    countryCode: "SV",
    flag: "🇸🇻",
    region: "Central America",
  },
  // Panama
  {
    handle: "CancilleriaPma",
    name: "Cancillería Panamá",
    role: "Foreign Ministry",
    country: "Panama",
    countryCode: "PA",
    flag: "🇵🇦",
    region: "Central America",
  },
  {
    handle: "JoseRaulMulino",
    name: "José Raúl Mulino",
    role: "President",
    country: "Panama",
    countryCode: "PA",
    flag: "🇵🇦",
    region: "Central America",
  },
  // Costa Rica
  {
    handle: "RREECostaRica",
    name: "RREE Costa Rica",
    role: "Foreign Ministry",
    country: "Costa Rica",
    countryCode: "CR",
    flag: "🇨🇷",
    region: "Central America",
  },
  {
    handle: "RodrigoChavesR",
    name: "Rodrigo Chaves",
    role: "President",
    country: "Costa Rica",
    countryCode: "CR",
    flag: "🇨🇷",
    region: "Central America",
  },
  // Guatemala
  {
    handle: "MinexGT",
    name: "MINEX Guatemala",
    role: "Foreign Ministry",
    country: "Guatemala",
    countryCode: "GT",
    flag: "🇬🇹",
    region: "Central America",
  },
  {
    handle: "BArevalo",
    name: "Bernardo Arévalo",
    role: "President",
    country: "Guatemala",
    countryCode: "GT",
    flag: "🇬🇹",
    region: "Central America",
  },
  // Honduras
  {
    handle: "SRE_Honduras",
    name: "SRE Honduras",
    role: "Foreign Ministry",
    country: "Honduras",
    countryCode: "HN",
    flag: "🇭🇳",
    region: "Central America",
  },
  {
    handle: "XiomarasCastroZ",
    name: "Xiomara Castro",
    role: "President",
    country: "Honduras",
    countryCode: "HN",
    flag: "🇭🇳",
    region: "Central America",
  },
  // Nicaragua
  {
    handle: "CancilleriaNic",
    name: "Cancillería Nicaragua",
    role: "Foreign Ministry",
    country: "Nicaragua",
    countryCode: "NI",
    flag: "🇳🇮",
    region: "Central America",
  },
  // Belize
  {
    handle: "MFA_Belize",
    name: "MFA Belize",
    role: "Foreign Ministry",
    country: "Belize",
    countryCode: "BZ",
    flag: "🇧🇿",
    region: "Central America",
  },

  // ===================
  // CARIBBEAN
  // ===================
  // Cuba
  {
    handle: "CubaMINREX",
    name: "MINREX Cuba",
    role: "Foreign Ministry",
    country: "Cuba",
    countryCode: "CU",
    flag: "🇨🇺",
    region: "Caribbean",
  },
  {
    handle: "BrunoRguezP",
    name: "Bruno Rodríguez",
    role: "Foreign Minister",
    country: "Cuba",
    countryCode: "CU",
    flag: "🇨🇺",
    region: "Caribbean",
  },
  {
    handle: "DiazCanelB",
    name: "Miguel Díaz-Canel",
    role: "President",
    country: "Cuba",
    countryCode: "CU",
    flag: "🇨🇺",
    region: "Caribbean",
  },
  // Dominican Republic
  {
    handle: "MIREX_RD",
    name: "MIREX Rep. Dominicana",
    role: "Foreign Ministry",
    country: "Dominican Republic",
    countryCode: "DO",
    flag: "🇩🇴",
    region: "Caribbean",
  },
  {
    handle: "LuisAbinader",
    name: "Luis Abinader",
    role: "President",
    country: "Dominican Republic",
    countryCode: "DO",
    flag: "🇩🇴",
    region: "Caribbean",
  },
  // Jamaica
  {
    handle: "JamaicaMFAFT",
    name: "Jamaica MFAFT",
    role: "Foreign Ministry",
    country: "Jamaica",
    countryCode: "JM",
    flag: "🇯🇲",
    region: "Caribbean",
  },
  {
    handle: "AndrewHolnessJM",
    name: "Andrew Holness",
    role: "Prime Minister",
    country: "Jamaica",
    countryCode: "JM",
    flag: "🇯🇲",
    region: "Caribbean",
  },
  // Trinidad and Tobago
  {
    handle: "MTTrinidad",
    name: "MFAT Trinidad",
    role: "Foreign Ministry",
    country: "Trinidad and Tobago",
    countryCode: "TT",
    flag: "🇹🇹",
    region: "Caribbean",
  },
  {
    handle: "DrKeithRowley",
    name: "Keith Rowley",
    role: "Former Prime Minister",
    country: "Trinidad and Tobago",
    countryCode: "TT",
    flag: "🇹🇹",
    region: "Caribbean",
  },
  {
    handle: "PM_Kamla",
    name: "Kamla Persad-Bissessar",
    role: "Prime Minister",
    country: "Trinidad and Tobago",
    countryCode: "TT",
    flag: "🇹🇹",
    region: "Caribbean",
  },
  // Haiti
  {
    handle: "MAE_Haiti",
    name: "MAE Haiti",
    role: "Foreign Ministry",
    country: "Haiti",
    countryCode: "HT",
    flag: "🇭🇹",
    region: "Caribbean",
  },
  // Bahamas
  {
    handle: "MFABahamas",
    name: "MFA Bahamas",
    role: "Foreign Ministry",
    country: "Bahamas",
    countryCode: "BS",
    flag: "🇧🇸",
    region: "Caribbean",
  },
  {
    handle: "PhilipEDavis",
    name: "Philip Davis",
    role: "Prime Minister",
    country: "Bahamas",
    countryCode: "BS",
    flag: "🇧🇸",
    region: "Caribbean",
  },
  // Barbados
  {
    handle: "foreignbarbados",
    name: "MFA Barbados",
    role: "Foreign Ministry",
    country: "Barbados",
    countryCode: "BB",
    flag: "🇧🇧",
    region: "Caribbean",
  },
  {
    handle: "miaboramottley",
    name: "Mia Mottley",
    role: "Prime Minister",
    country: "Barbados",
    countryCode: "BB",
    flag: "🇧🇧",
    region: "Caribbean",
  },
  // Grenada
  {
    handle: "dickonmitchell",
    name: "Dickon Mitchell",
    role: "Prime Minister",
    country: "Grenada",
    countryCode: "GD",
    flag: "🇬🇩",
    region: "Caribbean",
  },
  // Saint Lucia
  {
    handle: "PhilipJPierre",
    name: "Philip J. Pierre",
    role: "Prime Minister",
    country: "Saint Lucia",
    countryCode: "LC",
    flag: "🇱🇨",
    region: "Caribbean",
  },
  // Antigua and Barbuda
  {
    handle: "gastonbrowne",
    name: "Gaston Browne",
    role: "Prime Minister",
    country: "Antigua and Barbuda",
    countryCode: "AG",
    flag: "🇦🇬",
    region: "Caribbean",
  },
  // Saint Vincent
  {
    handle: "ComradeRalph",
    name: "Ralph Gonsalves",
    role: "Prime Minister",
    country: "Saint Vincent",
    countryCode: "VC",
    flag: "🇻🇨",
    region: "Caribbean",
  },
  // Suriname
  {
    handle: "gov_suriname",
    name: "Government Suriname",
    role: "Government",
    country: "Suriname",
    countryCode: "SR",
    flag: "🇸🇷",
    region: "Caribbean",
  },
  // Guadeloupe / Martinique (French territories - use France handles)

  // ===================
  // EUROPE
  // ===================
  // EU
  {
    handle: "JosepBorrellF",
    name: "Josep Borrell",
    role: "High Representative",
    country: "European Union",
    countryCode: "EU",
    flag: "🇪🇺",
    region: "Europe",
  },
  {
    handle: "eu_eeas",
    name: "EU External Action",
    role: "EU Foreign Service",
    country: "European Union",
    countryCode: "EU",
    flag: "🇪🇺",
    region: "Europe",
  },
  // United Kingdom
  {
    handle: "DavidLammy",
    name: "David Lammy",
    role: "Foreign Secretary",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    region: "Europe",
  },
  {
    handle: "FCDOGovUK",
    name: "UK Foreign Office",
    role: "Foreign Ministry",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    region: "Europe",
  },
  {
    handle: "Keir_Starmer",
    name: "Keir Starmer",
    role: "Prime Minister",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    region: "Europe",
  },
  // Spain
  {
    handle: "JoseAlbares",
    name: "José Manuel Albares",
    role: "Foreign Minister",
    country: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    region: "Europe",
  },
  {
    handle: "MAECgob",
    name: "MAEC España",
    role: "Foreign Ministry",
    country: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    region: "Europe",
  },
  {
    handle: "saboronchezcastejon",
    name: "Pedro Sánchez",
    role: "Prime Minister",
    country: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    region: "Europe",
  },
  // France
  {
    handle: "francediplo",
    name: "France Diplomatie",
    role: "Foreign Ministry",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    region: "Europe",
  },
  {
    handle: "EmmanuelMacron",
    name: "Emmanuel Macron",
    role: "President",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    region: "Europe",
  },
  {
    handle: "francediplo_EN",
    name: "France Diplomatie EN",
    role: "Foreign Ministry",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    region: "Europe",
  },
  // Germany
  {
    handle: "AusijwaertigesAmt",
    name: "Auswärtiges Amt",
    role: "Foreign Ministry",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    region: "Europe",
  },
  {
    handle: "ABaerbock",
    name: "Annalena Baerbock",
    role: "Foreign Minister",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    region: "Europe",
  },
  {
    handle: "Bundeskanzler",
    name: "Olaf Scholz",
    role: "Chancellor",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    region: "Europe",
  },
  // Italy
  {
    handle: "ItalyMFA",
    name: "Italy MFA",
    role: "Foreign Ministry",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
    region: "Europe",
  },
  {
    handle: "Antonio_Tajani",
    name: "Antonio Tajani",
    role: "Foreign Minister",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
    region: "Europe",
  },
  {
    handle: "GiorgiaMeloni",
    name: "Giorgia Meloni",
    role: "Prime Minister",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
    region: "Europe",
  },
  // Portugal
  {
    handle: "MNEPTGOV",
    name: "MNE Portugal",
    role: "Foreign Ministry",
    country: "Portugal",
    countryCode: "PT",
    flag: "🇵🇹",
    region: "Europe",
  },
  {
    handle: "LuisMontenegroPT",
    name: "Luís Montenegro",
    role: "Prime Minister",
    country: "Portugal",
    countryCode: "PT",
    flag: "🇵🇹",
    region: "Europe",
  },
  // Netherlands
  {
    handle: "ministerBZ",
    name: "Ministerie BZ",
    role: "Foreign Ministry",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    region: "Europe",
  },
  {
    handle: "MinPres",
    name: "Mark Rutte",
    role: "Prime Minister",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    region: "Europe",
  },
  // Belgium
  {
    handle: "BelgiumMFA",
    name: "Belgium MFA",
    role: "Foreign Ministry",
    country: "Belgium",
    countryCode: "BE",
    flag: "🇧🇪",
    region: "Europe",
  },
  {
    handle: "alexanderdecroo",
    name: "Alexander De Croo",
    role: "Prime Minister",
    country: "Belgium",
    countryCode: "BE",
    flag: "🇧🇪",
    region: "Europe",
  },
  // Poland
  {
    handle: "PolandMFA",
    name: "Poland MFA",
    role: "Foreign Ministry",
    country: "Poland",
    countryCode: "PL",
    flag: "🇵🇱",
    region: "Europe",
  },
  {
    handle: "sikorskiradek",
    name: "Radosław Sikorski",
    role: "Foreign Minister",
    country: "Poland",
    countryCode: "PL",
    flag: "🇵🇱",
    region: "Europe",
  },
  {
    handle: "donaldtusk",
    name: "Donald Tusk",
    role: "Prime Minister",
    country: "Poland",
    countryCode: "PL",
    flag: "🇵🇱",
    region: "Europe",
  },
  // Sweden
  {
    handle: "SweMFA",
    name: "Sweden MFA",
    role: "Foreign Ministry",
    country: "Sweden",
    countryCode: "SE",
    flag: "🇸🇪",
    region: "Europe",
  },
  {
    handle: "SwedishPM",
    name: "Ulf Kristersson",
    role: "Prime Minister",
    country: "Sweden",
    countryCode: "SE",
    flag: "🇸🇪",
    region: "Europe",
  },
  // Norway
  {
    handle: "NorwayMFA",
    name: "Norway MFA",
    role: "Foreign Ministry",
    country: "Norway",
    countryCode: "NO",
    flag: "🇳🇴",
    region: "Europe",
  },
  {
    handle: "jonasgahrstore",
    name: "Jonas Gahr Støre",
    role: "Prime Minister",
    country: "Norway",
    countryCode: "NO",
    flag: "🇳🇴",
    region: "Europe",
  },
  // Denmark
  {
    handle: "DanishMFA",
    name: "Danish MFA",
    role: "Foreign Ministry",
    country: "Denmark",
    countryCode: "DK",
    flag: "🇩🇰",
    region: "Europe",
  },
  {
    handle: "LarsLoekke",
    name: "Lars Løkke Rasmussen",
    role: "Foreign Minister",
    country: "Denmark",
    countryCode: "DK",
    flag: "🇩🇰",
    region: "Europe",
  },
  // Switzerland
  {
    handle: "SwissMFA",
    name: "Swiss FDFA",
    role: "Foreign Ministry",
    country: "Switzerland",
    countryCode: "CH",
    flag: "🇨🇭",
    region: "Europe",
  },
  // Austria
  {
    handle: "MFA_Austria",
    name: "Austria MFA",
    role: "Foreign Ministry",
    country: "Austria",
    countryCode: "AT",
    flag: "🇦🇹",
    region: "Europe",
  },
  // Ireland
  {
    handle: "dfatirl",
    name: "Ireland DFA",
    role: "Foreign Ministry",
    country: "Ireland",
    countryCode: "IE",
    flag: "🇮🇪",
    region: "Europe",
  },
  {
    handle: "MichealMartinTD",
    name: "Micheál Martin",
    role: "Foreign Minister",
    country: "Ireland",
    countryCode: "IE",
    flag: "🇮🇪",
    region: "Europe",
  },
  {
    handle: "SimonHarrisTD",
    name: "Simon Harris",
    role: "Taoiseach",
    country: "Ireland",
    countryCode: "IE",
    flag: "🇮🇪",
    region: "Europe",
  },
  // Greece
  {
    handle: "GreeceMFA",
    name: "Greece MFA",
    role: "Foreign Ministry",
    country: "Greece",
    countryCode: "GR",
    flag: "🇬🇷",
    region: "Europe",
  },
  {
    handle: "PrimijinisterGR",
    name: "Kyriakos Mitsotakis",
    role: "Prime Minister",
    country: "Greece",
    countryCode: "GR",
    flag: "🇬🇷",
    region: "Europe",
  },
  // Czech Republic
  {
    handle: "CzechMFA",
    name: "Czech MFA",
    role: "Foreign Ministry",
    country: "Czech Republic",
    countryCode: "CZ",
    flag: "🇨🇿",
    region: "Europe",
  },
  {
    handle: "P_Fiala",
    name: "Petr Fiala",
    role: "Prime Minister",
    country: "Czech Republic",
    countryCode: "CZ",
    flag: "🇨🇿",
    region: "Europe",
  },
  // Hungary
  {
    handle: "HungaryMFA",
    name: "Hungary MFA",
    role: "Foreign Ministry",
    country: "Hungary",
    countryCode: "HU",
    flag: "🇭🇺",
    region: "Europe",
  },
  {
    handle: "PM_ViktorOrban",
    name: "Viktor Orbán",
    role: "Prime Minister",
    country: "Hungary",
    countryCode: "HU",
    flag: "🇭🇺",
    region: "Europe",
  },
  // Romania
  {
    handle: "MAaborERomania",
    name: "Romania MFA",
    role: "Foreign Ministry",
    country: "Romania",
    countryCode: "RO",
    flag: "🇷🇴",
    region: "Europe",
  },
  // Finland
  {
    handle: "Aborulkoministeri",
    name: "Finland MFA",
    role: "Foreign Ministry",
    country: "Finland",
    countryCode: "FI",
    flag: "🇫🇮",
    region: "Europe",
  },
  {
    handle: "PetteriOrpo",
    name: "Petteri Orpo",
    role: "Prime Minister",
    country: "Finland",
    countryCode: "FI",
    flag: "🇫🇮",
    region: "Europe",
  },

  // ===================
  // ASIA
  // ===================
  // China
  {
    handle: "MFA_China",
    name: "China MFA",
    role: "Foreign Ministry",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    region: "Asia",
  },
  {
    handle: "SpokespersonCHN",
    name: "MFA Spokesperson",
    role: "Spokesperson",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    region: "Asia",
  },
  // Russia
  {
    handle: "mfa_russia",
    name: "Russia MFA",
    role: "Foreign Ministry",
    country: "Russia",
    countryCode: "RU",
    flag: "🇷🇺",
    region: "Asia",
  },
  {
    handle: "MZakharova",
    name: "Maria Zakharova",
    role: "Spokesperson",
    country: "Russia",
    countryCode: "RU",
    flag: "🇷🇺",
    region: "Asia",
  },
  {
    handle: "KremlinRussia_E",
    name: "Kremlin",
    role: "Government",
    country: "Russia",
    countryCode: "RU",
    flag: "🇷🇺",
    region: "Asia",
  },
  // Japan
  {
    handle: "MofaJapan_en",
    name: "Japan MOFA",
    role: "Foreign Ministry",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    region: "Asia",
  },
  // South Korea
  {
    handle: "MOFAkr_eng",
    name: "South Korea MOFA",
    role: "Foreign Ministry",
    country: "South Korea",
    countryCode: "KR",
    flag: "🇰🇷",
    region: "Asia",
  },
  // India
  {
    handle: "MEAIndia",
    name: "India MEA",
    role: "Foreign Ministry",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    region: "Asia",
  },
  {
    handle: "DrSJaishankar",
    name: "S. Jaishankar",
    role: "Foreign Minister",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    region: "Asia",
  },
  {
    handle: "naaborendramodi",
    name: "Narendra Modi",
    role: "Prime Minister",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    region: "Asia",
  },
  // Israel
  {
    handle: "IsraelMFA",
    name: "Israel MFA",
    role: "Foreign Ministry",
    country: "Israel",
    countryCode: "IL",
    flag: "🇮🇱",
    region: "Asia",
  },
  {
    handle: "Israel_katz",
    name: "Israel Katz",
    role: "Foreign Minister",
    country: "Israel",
    countryCode: "IL",
    flag: "🇮🇱",
    region: "Asia",
  },
  {
    handle: "netanyahu",
    name: "Benjamin Netanyahu",
    role: "Prime Minister",
    country: "Israel",
    countryCode: "IL",
    flag: "🇮🇱",
    region: "Asia",
  },
  // Turkey
  {
    handle: "MFATurkey",
    name: "Turkey MFA",
    role: "Foreign Ministry",
    country: "Turkey",
    countryCode: "TR",
    flag: "🇹🇷",
    region: "Asia",
  },
  {
    handle: "RTErdogan",
    name: "Recep Tayyip Erdoğan",
    role: "President",
    country: "Turkey",
    countryCode: "TR",
    flag: "🇹🇷",
    region: "Asia",
  },
  {
    handle: "HakanFidan",
    name: "Hakan Fidan",
    role: "Foreign Minister",
    country: "Turkey",
    countryCode: "TR",
    flag: "🇹🇷",
    region: "Asia",
  },
  // Iran - Supreme Leader Khamenei
  {
    handle: "khamenei_ir",
    name: "Ayatollah Khamenei",
    role: "Supreme Leader",
    country: "Iran",
    countryCode: "IR",
    flag: "🇮🇷",
    region: "Asia",
  },
  {
    handle: "Iran_MFA",
    name: "Iran MFA",
    role: "Foreign Ministry",
    country: "Iran",
    countryCode: "IR",
    flag: "🇮🇷",
    region: "Asia",
  },
  {
    handle: "Aboramirhossein",
    name: "Amir Hossein",
    role: "Spokesperson",
    country: "Iran",
    countryCode: "IR",
    flag: "🇮🇷",
    region: "Asia",
  },
  // Saudi Arabia
  {
    handle: "KSAmofaEN",
    name: "Saudi MFA",
    role: "Foreign Ministry",
    country: "Saudi Arabia",
    countryCode: "SA",
    flag: "🇸🇦",
    region: "Asia",
  },
  // UAE
  {
    handle: "MoFAUAE",
    name: "UAE MOFA",
    role: "Foreign Ministry",
    country: "UAE",
    countryCode: "AE",
    flag: "🇦🇪",
    region: "Asia",
  },
  // Indonesia
  {
    handle: "Kemlu_RI",
    name: "Indonesia MFA",
    role: "Foreign Ministry",
    country: "Indonesia",
    countryCode: "ID",
    flag: "🇮🇩",
    region: "Asia",
  },
  // Philippines
  {
    handle: "ABORDFAPHL",
    name: "Philippines DFA",
    role: "Foreign Ministry",
    country: "Philippines",
    countryCode: "PH",
    flag: "🇵🇭",
    region: "Asia",
  },
  {
    handle: "baborongbongmarcos",
    name: "Bongbong Marcos",
    role: "President",
    country: "Philippines",
    countryCode: "PH",
    flag: "🇵🇭",
    region: "Asia",
  },
  // Thailand
  {
    handle: "MFAThailand",
    name: "Thailand MFA",
    role: "Foreign Ministry",
    country: "Thailand",
    countryCode: "TH",
    flag: "🇹🇭",
    region: "Asia",
  },
  // Malaysia
  {
    handle: "MYForeignMinistry",
    name: "Malaysia MFA",
    role: "Foreign Ministry",
    country: "Malaysia",
    countryCode: "MY",
    flag: "🇲🇾",
    region: "Asia",
  },
  {
    handle: "anaborwaribrahim",
    name: "Anwar Ibrahim",
    role: "Prime Minister",
    country: "Malaysia",
    countryCode: "MY",
    flag: "🇲🇾",
    region: "Asia",
  },
  // Singapore
  {
    handle: "MFAsg",
    name: "Singapore MFA",
    role: "Foreign Ministry",
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    region: "Asia",
  },
  {
    handle: "LawrenceWongST",
    name: "Lawrence Wong",
    role: "Prime Minister",
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    region: "Asia",
  },
  // Pakistan
  {
    handle: "ForeignOfficePk",
    name: "Pakistan MFA",
    role: "Foreign Ministry",
    country: "Pakistan",
    countryCode: "PK",
    flag: "🇵🇰",
    region: "Asia",
  },
  // Qatar
  {
    handle: "MofaQatar_EN",
    name: "Qatar MFA",
    role: "Foreign Ministry",
    country: "Qatar",
    countryCode: "QA",
    flag: "🇶🇦",
    region: "Asia",
  },
  {
    handle: "TamijmBinHamad",
    name: "Sheikh Tamim bin Hamad",
    role: "Emir",
    country: "Qatar",
    countryCode: "QA",
    flag: "🇶🇦",
    region: "Asia",
  },
  {
    handle: "PMOQatar",
    name: "Qatar PMO",
    role: "Government",
    country: "Qatar",
    countryCode: "QA",
    flag: "🇶🇦",
    region: "Asia",
  },

  // ===================
  // OCEANIA
  // ===================
  // Australia
  {
    handle: "SenatorWong",
    name: "Penny Wong",
    role: "Foreign Minister",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    region: "Oceania",
  },
  {
    handle: "dfaborat",
    name: "DFAT Australia",
    role: "Foreign Ministry",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    region: "Oceania",
  },
  {
    handle: "AlboMP",
    name: "Anthony Albanese",
    role: "Prime Minister",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    region: "Oceania",
  },
  // New Zealand
  {
    handle: "ABORZMFAT",
    name: "NZ MFAT",
    role: "Foreign Ministry",
    country: "New Zealand",
    countryCode: "NZ",
    flag: "🇳🇿",
    region: "Oceania",
  },
  {
    handle: "christopherluxon",
    name: "Christopher Luxon",
    role: "Prime Minister",
    country: "New Zealand",
    countryCode: "NZ",
    flag: "🇳🇿",
    region: "Oceania",
  },
  {
    handle: "waborinstoaborpeters",
    name: "Winston Peters",
    role: "Foreign Minister",
    country: "New Zealand",
    countryCode: "NZ",
    flag: "🇳🇿",
    region: "Oceania",
  },
  // Fiji
  {
    handle: "FijiaborPM",
    name: "Fiji PM",
    role: "Prime Minister",
    country: "Fiji",
    countryCode: "FJ",
    flag: "🇫🇯",
    region: "Oceania",
  },
  // Papua New Guinea
  {
    handle: "JamesMarape",
    name: "James Marape",
    role: "Prime Minister",
    country: "Papua New Guinea",
    countryCode: "PG",
    flag: "🇵🇬",
    region: "Oceania",
  },

  // ===================
  // AFRICA
  // ===================
  // South Africa
  {
    handle: "DIRCO_ZA",
    name: "DIRCO South Africa",
    role: "Foreign Ministry",
    country: "South Africa",
    countryCode: "ZA",
    flag: "🇿🇦",
    region: "Africa",
  },
  {
    handle: "CyrilRamaphosa",
    name: "Cyril Ramaphosa",
    role: "President",
    country: "South Africa",
    countryCode: "ZA",
    flag: "🇿🇦",
    region: "Africa",
  },
  // Nigeria
  {
    handle: "aborNGRPresident",
    name: "Nigeria Presidency",
    role: "Government",
    country: "Nigeria",
    countryCode: "NG",
    flag: "🇳🇬",
    region: "Africa",
  },
  // Egypt
  {
    handle: "MfaEgypt",
    name: "Egypt MFA",
    role: "Foreign Ministry",
    country: "Egypt",
    countryCode: "EG",
    flag: "🇪🇬",
    region: "Africa",
  },
  // Kenya
  {
    handle: "ForeignOfficeKE",
    name: "Kenya MFA",
    role: "Foreign Ministry",
    country: "Kenya",
    countryCode: "KE",
    flag: "🇰🇪",
    region: "Africa",
  },
  {
    handle: "WilliamsRuto",
    name: "William Ruto",
    role: "President",
    country: "Kenya",
    countryCode: "KE",
    flag: "🇰🇪",
    region: "Africa",
  },
  // Morocco
  {
    handle: "MarijocMFA",
    name: "Morocco MFA",
    role: "Foreign Ministry",
    country: "Morocco",
    countryCode: "MA",
    flag: "🇲🇦",
    region: "Africa",
  },
  // Algeria
  {
    handle: "Abormbassade_Aborlg",
    name: "Algeria MFA",
    role: "Foreign Ministry",
    country: "Algeria",
    countryCode: "DZ",
    flag: "🇩🇿",
    region: "Africa",
  },
  // Ethiopia
  {
    handle: "MFAEthiopia",
    name: "Ethiopia MFA",
    role: "Foreign Ministry",
    country: "Ethiopia",
    countryCode: "ET",
    flag: "🇪🇹",
    region: "Africa",
  },
  // Ghana
  {
    handle: "MaborFAGhana",
    name: "Ghana MFA",
    role: "Foreign Ministry",
    country: "Ghana",
    countryCode: "GH",
    flag: "🇬🇭",
    region: "Africa",
  },
]

// Helper functions
export function getForeignMinisterAccountInfo(handle: string): ForeignMinisterAccount | undefined {
  return FOREIGN_MINISTER_ACCOUNTS.find((a) => a.handle.toLowerCase() === handle.toLowerCase())
}

export function getForeignMinisterHandlesByRegion(region: string): string[] {
  if (region === "All") {
    return FOREIGN_MINISTER_ACCOUNTS.map((a) => a.handle)
  }
  return FOREIGN_MINISTER_ACCOUNTS.filter((a) => a.region === region).map((a) => a.handle)
}

export function getAllForeignMinisterHandles(): string[] {
  return FOREIGN_MINISTER_ACCOUNTS.map((a) => a.handle)
}

export function getAccountsByRegion(region: string): ForeignMinisterAccount[] {
  if (region === "All") {
    return FOREIGN_MINISTER_ACCOUNTS
  }
  return FOREIGN_MINISTER_ACCOUNTS.filter((a) => a.region === region)
}

export function getAllRegions(): string[] {
  return ["North America", "South America", "Central America", "Caribbean", "Europe", "Asia", "Oceania", "Africa"]
}
