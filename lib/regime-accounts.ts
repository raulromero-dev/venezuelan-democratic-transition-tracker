// Regime X account data and categorization

export interface RegimeAccount {
  category: string
  name: string
  role: string
  handle: string
}

export const REGIME_CATEGORIES = [
  "Executive & High Command",
  "Diplomatic corp",
  "Ministers & Cabinet",
  "Legislative & Political Figures",
  "Regional Governors",
  "Other Officials & Military",
  "Official Accounts",
  "Opinion Makers & Media",
] as const

export type RegimeCategory = (typeof REGIME_CATEGORIES)[number]

export const REGIME_ACCOUNTS: RegimeAccount[] = [
  // Executive & High Command
  { category: "Executive & High Command", name: "Nicolás Maduro", role: "President", handle: "NicolasMaduro" },
  {
    category: "Executive & High Command",
    name: "Nicolás Maduro (EN)",
    role: "English-language presidential feed",
    handle: "maduro_en",
  },
  { category: "Executive & High Command", name: "Cilia Flores", role: "First Lady & Deputy", handle: "ConCiliaFlores" },
  { category: "Executive & High Command", name: "Delcy Rodríguez", role: "Vice President", handle: "delcyrodriguezv" },
  {
    category: "Executive & High Command",
    name: "Diosdado Cabello",
    role: "Minister of Interior / PSUV First VP",
    handle: "dcabellor",
  },
  {
    category: "Executive & High Command",
    name: "Jorge Rodríguez",
    role: "President of National Assembly",
    handle: "jorgerpsuv",
  },
  {
    category: "Executive & High Command",
    name: "Vladimir Padrino López",
    role: "Minister of Defense",
    handle: "vladimirpadrino",
  },
  {
    category: "Executive & High Command",
    name: "Gen. Domingo Hernández Lárez",
    role: "CEOFANB Commander",
    handle: "dhernandezlarez",
  },
  {
    category: "Executive & High Command",
    name: "Nicolás Maduro Guerra",
    role: "Son of President / Deputy",
    handle: "nicmaduroguerra",
  },
  { category: "Executive & High Command", name: "Alex Saab", role: "Minister of Industry", handle: "AlexNSaab" },

  // Diplomatic corp
  {
    category: "Diplomatic corp",
    name: "Remigio Ceballos Ichaso",
    role: "Venezuelan Ambassador to China",
    handle: "CeballosIchaso1",
  },
  { category: "Diplomatic corp", name: "Yván Gil", role: "Foreign Minister", handle: "yvangil" },
  { category: "Diplomatic corp", name: "Jorge Arreaza", role: "Former FM, PSUV cadre", handle: "jaarreaza" },

  // Ministers & Cabinet
  { category: "Ministers & Cabinet", name: "Tarek William Saab", role: "Attorney General", handle: "TarekWiliamSaab" },
  { category: "Ministers & Cabinet", name: "Ramón Velásquez Araguayán", role: "Transportation", handle: "rvaraguayan" },
  { category: "Ministers & Cabinet", name: "Pedro Tellechea", role: "Oil/PDVSA", handle: "TellecheaRuiz" },
  {
    category: "Ministers & Cabinet",
    name: "Aníbal Coronado",
    role: "Office of the Presidency",
    handle: "ACoronadoVzla",
  },
  { category: "Ministers & Cabinet", name: "Magaly Gutiérrez", role: "Health", handle: "MagaGutierrezV" },
  { category: "Ministers & Cabinet", name: "Julio García Zerpa", role: "Penitentiary Service", handle: "JulioGarciaZ" },
  { category: "Ministers & Cabinet", name: "Juan Carlos Loyo", role: "Fisheries", handle: "Jcloyo" },

  // Legislative & Political Figures
  { category: "Legislative & Political Figures", name: "Tania Díaz", role: "Deputy (Propaganda)", handle: "taniapsuv" },
  {
    category: "Legislative & Political Figures",
    name: "Hermann Escarrá",
    role: "Constitutional Lawyer",
    handle: "HermannEscarra",
  },
  {
    category: "Legislative & Political Figures",
    name: "Francisco Torrealba",
    role: "Labor minister",
    handle: "torrealbaf",
  },
  {
    category: "Legislative & Political Figures",
    name: "Bernabé Gutiérrez",
    role: "AD-Judicialized Leader",
    handle: "adbernabe",
  },
  {
    category: "Legislative & Political Figures",
    name: "Timoteo Zambrano",
    role: "Cambiemos Leader/Ally",
    handle: "TimoteoZambrano",
  },
  {
    category: "Legislative & Political Figures",
    name: "Ricardo Sánchez",
    role: "Deputy/Ally",
    handle: "RicardoSanchezX",
  },
  {
    category: "Legislative & Political Figures",
    name: "Winston Vallenilla",
    role: "Deputy/Entertainer",
    handle: "vwinstonv",
  },
  { category: "Legislative & Political Figures", name: "Iris Varela", role: "PSUV hardliner", handle: "irisvarela" },
  {
    category: "Legislative & Political Figures",
    name: "Pedro Infante",
    role: "PSUV youth figure",
    handle: "pinfantea",
  },
  {
    category: "Legislative & Political Figures",
    name: "Francisco Ameliach",
    role: "PSUV leader",
    handle: "AmeliachPSUV",
  },

  // Regional Governors
  { category: "Regional Governors", name: "Rafael Lacava", role: "Carabobo", handle: "rafaellacava10" },
  { category: "Regional Governors", name: "Freddy Bernal", role: "Táchira", handle: "FreddyBernal" },
  { category: "Regional Governors", name: "Luis José Marcano", role: "Anzoátegui", handle: "luismarcanos" },
  { category: "Regional Governors", name: "Víctor Clark", role: "Falcón", handle: "GobVictorClark" },
  { category: "Regional Governors", name: "Adolfo Pereira", role: "Lara", handle: "AdolfoP_Oficial" },
  { category: "Regional Governors", name: "Ernesto Luna", role: "Monagas", handle: "ErnestoLunaPsuv" },
  { category: "Regional Governors", name: "José Alejandro Terán", role: "La Guaira", handle: "Jateranoficial" },
  { category: "Regional Governors", name: "Ángel Marcano", role: "Bolívar", handle: "amarcanopsuv" },
  { category: "Regional Governors", name: "Karina Carpio", role: "Aragua", handle: "Soykarinacarpio" },
  { category: "Regional Governors", name: "Jehyson Guzmán", role: "Mérida", handle: "JEHYSONGUZMAN" },
  { category: "Regional Governors", name: "José Vásquez", role: "Guárico", handle: "josemvasquez" },
  { category: "Regional Governors", name: "Héctor Rodríguez", role: "Governor of Miranda", handle: "HectoRodriguez" },

  // Other Officials & Military
  {
    category: "Other Officials & Military",
    name: "M/G Elio Estrada Paredes",
    role: "GNB Commander",
    handle: "ElioEstrada18",
  },
  { category: "Other Officials & Military", name: "Jose David Cabello", role: "", handle: "jdavidcabello" },
  { category: "Other Officials & Military", name: "Erika Farías", role: "PSUV Leader", handle: "ErikaPSUV" },
  {
    category: "Other Officials & Military",
    name: "Jacqueline Faría",
    role: "Mission Venezuela Bella",
    handle: "JacquelinePSUV",
  },
  {
    category: "Other Officials & Military",
    name: "Alexander Vargas",
    role: "Peace Commissioner",
    handle: "vargas_mimou",
  },
  { category: "Other Officials & Military", name: "Marleny Contreras", role: "Former Minister", handle: "Marlenycdc" },
  {
    category: "Other Officials & Military",
    name: "Manuel Quevedo",
    role: "Ex-PDVSA/Oil minister",
    handle: "MQuevedoF",
  },

  // Official Accounts
  {
    category: "Official Accounts",
    name: "Prensa Presidencial",
    role: "Presidential Press Office",
    handle: "PresidencialVen",
  },
  { category: "Official Accounts", name: "Ernesto Villegas", role: "Culture minister", handle: "VillegasPoljak" },
  { category: "Official Accounts", name: "PSUV", role: "Ruling Party", handle: "PartidoPSUV" },
  { category: "Official Accounts", name: "Con el Mazo Dando", role: "Propaganda TV show", handle: "ConElMazoDando" },
  { category: "Official Accounts", name: "Aviación Militar Bolivariana", role: "Air Force", handle: "AMB_FANB" },
  { category: "Official Accounts", name: "SAIME", role: "Migration/ID Authority", handle: "VenezuelaSaime" },
  { category: "Official Accounts", name: "Prensa FANB", role: "Military Press", handle: "PrensaFANB" },
  {
    category: "Official Accounts",
    name: "Ministerio Interior y Justicia",
    role: "Interior Ministry",
    handle: "MIJP_Vzla",
  },
  { category: "Official Accounts", name: "Asamblea Nacional", role: "Parliament", handle: "Asamblea_Ven" },
  { category: "Official Accounts", name: "Ceofanb", role: "Strategic Command", handle: "CEOFANBVE" },
  { category: "Official Accounts", name: "SENIAT", role: "Tax Authority", handle: "SENIAT_Oficial" },

  // Opinion Makers & Media
  { category: "Opinion Makers & Media", name: "Mario Silva", role: "Host of La Hojilla", handle: "LaHojillaenTV" },
  {
    category: "Opinion Makers & Media",
    name: "Miguel Pérez Pirela",
    role: "Host of Desde Donde Sea",
    handle: "maperezpirela",
  },
  {
    category: "Opinion Makers & Media",
    name: "Pedro Carvajalino",
    role: "Host of Zurda Konducta",
    handle: "PedroKonductaz",
  },
  {
    category: "Opinion Makers & Media",
    name: "William Castillo",
    role: "Anti-Blockade Observatory",
    handle: "planwac",
  },
  { category: "Opinion Makers & Media", name: "Orlenys Ortiz", role: "Digital Influencer", handle: "OrlenysOV" },
  { category: "Opinion Makers & Media", name: "Carola Chávez", role: "Writer/Opinion", handle: "tongorocho" },
  {
    category: "Opinion Makers & Media",
    name: "Madelein García",
    role: "Telesur Correspondent",
    handle: "madeleintlSUR",
  },
  { category: "Opinion Makers & Media", name: "Luigino Bracci Roa", role: "Digital Activist", handle: "lubrio" },
  { category: "Opinion Makers & Media", name: "Michel Caballero", role: "Journalist", handle: "MichelCaballero" },
  { category: "Opinion Makers & Media", name: "Barry Cartaya", role: "VTV Journalist", handle: "cartayabarry" },
  { category: "Opinion Makers & Media", name: "Boris Castellano", role: "VTV Journalist", handle: "BorisCastellano" },
  {
    category: "Opinion Makers & Media",
    name: "Patricia Villegas",
    role: "President of Telesur",
    handle: "pvillegas_tlSUR",
  },
  { category: "Opinion Makers & Media", name: "Karen Méndez", role: "Journalist", handle: "KarenMendezL" },
  { category: "Opinion Makers & Media", name: "Indhriana Parada", role: "Influencer", handle: "indhriana" },
  { category: "Opinion Makers & Media", name: "VTV Canal 8", role: "State TV", handle: "VTVcanal8" },
  { category: "Opinion Makers & Media", name: "teleSUR tv", role: "State-aligned regional media", handle: "teleSURtv" },
  {
    category: "Opinion Makers & Media",
    name: "teleSUR English",
    role: "English-language propaganda arm",
    handle: "telesurenglish",
  },
  { category: "Opinion Makers & Media", name: "La Iguana TV", role: "Hardline propaganda", handle: "la_iguanatv" },
  { category: "Opinion Makers & Media", name: "Alfred Nazareth", role: "President, VTV", handle: "luchaalmada" },
  { category: "Opinion Makers & Media", name: "AVN", role: "State news agency", handle: "avnve" },
]

// Get all handles
export function getAllRegimeHandles(): string[] {
  return REGIME_ACCOUNTS.map((a) => a.handle.replace("@", ""))
}

// Get handles by category
export function getRegimeHandlesByCategory(category: RegimeCategory): string[] {
  return REGIME_ACCOUNTS.filter((a) => a.category === category).map((a) => a.handle.replace("@", ""))
}

// Get account info by handle
export function getRegimeAccountInfo(handle: string): RegimeAccount | undefined {
  const cleanHandle = handle.replace("@", "").toLowerCase()
  return REGIME_ACCOUNTS.find((a) => a.handle.replace("@", "").toLowerCase() === cleanHandle)
}

// Get category color
export function getRegimeCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "Executive & High Command": "#ef4444", // red
    "Diplomatic corp": "#f97316", // orange
    "Ministers & Cabinet": "#eab308", // yellow
    "Legislative & Political Figures": "#22c55e", // green
    "Regional Governors": "#06b6d4", // cyan
    "Other Officials & Military": "#8b5cf6", // violet
    "Official Accounts": "#ec4899", // pink
    "Opinion Makers & Media": "#6366f1", // indigo
  }
  return colors[category] || "#71717a"
}

// Get short category code
export function getRegimeCategoryCode(category: string): string {
  const codes: Record<string, string> = {
    "Executive & High Command": "EXE",
    "Diplomatic corp": "DIP",
    "Ministers & Cabinet": "CAB",
    "Legislative & Political Figures": "LEG",
    "Regional Governors": "GOV",
    "Other Officials & Military": "MIL",
    "Official Accounts": "OFF",
    "Opinion Makers & Media": "MED",
  }
  return codes[category] || "UNK"
}
