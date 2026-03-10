// Media outlets organized by category
export const MEDIA_OUTLETS = {
  english: [
    "The New York Times",
    "The Washington Post",
    "The Wall Street Journal",
    "Los Angeles Times",
    "AP News",
    "Reuters",
    "The Economist",
    "Time Magazine",
    "NPR",
    "PBS",
    "CNN",
    "ABC News",
    "NBC News",
    "CBS News",
    "Miami Herald",
    "BBC",
    "Financial Times",
    "The Guardian",
    "The Times",
    "The Telegraph",
    "The Independent",
  ],
  spanish: [
    "El País",
    "El Mundo",
    "ABC España",
    "La Vanguardia",
    "Reforma",
    "El Universal Mexico",
    "Clarín",
    "La Nación Argentina",
    "El Tiempo Colombia",
    "Semana",
    "El Mercurio",
    "Univisión",
    "Telemundo",
    "CNN en Español",
    "BBC Mundo",
    "DW Español",
    "VOA Noticias",
    "Euronews en Español",
    "Agencia EFE",
  ],
  venezuelan: ["El Nacional", "La Patilla", "El Pitazo", "Efecto Cocuyo", "Tal Cual", "Runrunes"],
  world: [
    "Le Monde",
    "France24",
    "Deutsche Welle",
    "Der Spiegel",
    "Frankfurter Allgemeine Zeitung",
    "The Spectator",
    "Haaretz",
    "The Jerusalem Post",
    "The Times of Israel",
    "Ynet News",
    "Israel Hayom",
    "Globes",
    "Al Jazeera",
    "Arab News",
    "The National UAE",
    "South China Morning Post",
    "The Hindu",
    "The Japan Times",
    "NHK",
    "The Straits Times",
    "Daily Maverick",
    "Mail & Guardian",
    "Folha de São Paulo",
    "O Globo",
    "The Globe and Mail",
    "The Sydney Morning Herald",
  ],
  regime: [
    "Venezuela Analysis",
    "VTV",
    "Telesur",
    "Últimas Noticias",
    "Globovisión",
    "Correo del Orinoco",
    "Agencia Venezolana de Noticias",
    "TVes",
    "La Iguana TV",
    "Russia Today",
    "HispanTV",
  ],
}

// Topic tags for article classification
export const ARTICLE_TOPICS = [
  "US military operations",
  "Narco-trafficking",
  "Humanitarian Crisis",
  "Human Rights",
  "Negotiations",
  "Economy",
  "Venezuelan opposition",
] as const

export type ArticleTopic = (typeof ARTICLE_TOPICS)[number]

export type MediaCategory = "All" | "English" | "Spanish" | "Venezuelan" | "World" | "Regime"

export function getOutletsByCategory(category: MediaCategory): string[] {
  if (category === "All") {
    // All media EXCEPT regime media
    return [...MEDIA_OUTLETS.english, ...MEDIA_OUTLETS.spanish, ...MEDIA_OUTLETS.venezuelan, ...MEDIA_OUTLETS.world]
  }
  if (category === "English") return MEDIA_OUTLETS.english
  if (category === "Spanish") return MEDIA_OUTLETS.spanish
  if (category === "Venezuelan") return MEDIA_OUTLETS.venezuelan
  if (category === "World") return MEDIA_OUTLETS.world
  if (category === "Regime") return MEDIA_OUTLETS.regime
  return []
}

// Legacy export for backward compatibility
export type MediaRegion = MediaCategory
export function getOutletsByRegion(region: MediaRegion): string[] {
  return getOutletsByCategory(region as MediaCategory)
}
