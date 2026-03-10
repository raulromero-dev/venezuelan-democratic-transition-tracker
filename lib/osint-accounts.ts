// OSINT accounts configuration for X API feed
// Edit this file to add/remove accounts for monitoring

export interface OsintAccount {
  handle: string
  displayName: string
  description: string
  category: "Individual Analysts" | "Groups & Organizations"
}

export const OSINT_ACCOUNTS: OsintAccount[] = [
  // Individual Analysts
  {
    handle: "Flightwatcher1",
    displayName: "FlightWatcher",
    description: "Flight analysis",
    category: "Individual Analysts",
  },
  { handle: "ConflictsW", displayName: "CNW", description: "Conflict monitoring", category: "Individual Analysts" },
  {
    handle: "SerbinPont",
    displayName: "Andrei Serbin Pont",
    description: "Regional expert",
    category: "Individual Analysts",
  },
  {
    handle: "raptor_intel",
    displayName: "RaptorIntel",
    description: "Military intel",
    category: "Individual Analysts",
  },
  {
    handle: "hernandomattosd",
    displayName: "Hernando Mattos",
    description: "Regional analyst",
    category: "Individual Analysts",
  },
  {
    handle: "Ian_larenas",
    displayName: "Carlos Larenas",
    description: "Defense expert",
    category: "Individual Analysts",
  },
  { handle: "CSolar", displayName: "Carlos Solar", description: "Security studies", category: "Individual Analysts" },
  { handle: "jorgesahd", displayName: "Jorge Sahd", description: "Policy analyst", category: "Individual Analysts" },
  {
    handle: "milkorockmar",
    displayName: "Milko Schvartzman",
    description: "Maritime expert",
    category: "Individual Analysts",
  },
  { handle: "diapez", displayName: "Diapez", description: "OSINT contributor", category: "Individual Analysts" },
  {
    handle: "RICHARDJOHNKOU1",
    displayName: "Richard Kouyoumdjian",
    description: "Defense analyst",
    category: "Individual Analysts",
  },
  {
    handle: "RyanBergPhD",
    displayName: "Ryan Berg, PhD",
    description: "CSIS Americas",
    category: "Individual Analysts",
  },
  { handle: "Arr3ch0", displayName: "Arr3ch0", description: "Venezuela OSINT", category: "Individual Analysts" },
  {
    handle: "DelonArmand",
    displayName: "DelonArmand",
    description: "Venezuela OSINT (Oil Tankers)",
    category: "Individual Analysts",
  },
  {
    handle: "MT_Anderson",
    displayName: "MT Anderson",
    description: "Venezuela OSINT",
    category: "Individual Analysts",
  },
  { handle: "LatinMilAv", displayName: "LatinMilAv", description: "Venezuela OSINT", category: "Individual Analysts" },
  { handle: "SA_Defensa", displayName: "SA Defensa", description: "Venezuela OSINT", category: "Individual Analysts" },
  { handle: "Warshipcam", displayName: "Warshipcam", description: "Venezuela OSINT", category: "Individual Analysts" },
  {
    handle: "Johnmorgan726",
    displayName: "John Morgan",
    description: "Venezuela OSINT",
    category: "Individual Analysts",
  },
  {
    handle: "Sentdefender",
    displayName: "Sentdefender",
    description: "International OSINT",
    category: "Individual Analysts",
  },
  {
    handle: "LatAmMilMVMTs",
    displayName: "Latin American Military Movements",
    description: "International OSINT",
    category: "Individual Analysts",
  },

  // Groups & Organizations
  {
    handle: "monitoresequibo",
    displayName: "Monitor Esequibo",
    description: "Guyana-Venezuela monitoring",
    category: "Groups & Organizations",
  },
  {
    handle: "LatamObscuro",
    displayName: "Obscuro",
    description: "Latin America OSINT",
    category: "Groups & Organizations",
  },
  {
    handle: "Obscuro_ES",
    displayName: "Obscuro ES",
    description: "Spanish language OSINT",
    category: "Groups & Organizations",
  },
  {
    handle: "CSISAmericas",
    displayName: "CSIS Americas",
    description: "US think tank",
    category: "Groups & Organizations",
  },
  {
    handle: "Osint613",
    displayName: "Osint613",
    description: "Real-time global conflict monitoring",
    category: "Groups & Organizations",
  },
]

// Get all handles for X API query
export function getAllOsintHandles(): string[] {
  return OSINT_ACCOUNTS.map((account) => account.handle)
}

// Get handles by category
export function getOsintHandlesByCategory(category: OsintAccount["category"]): string[] {
  return OSINT_ACCOUNTS.filter((account) => account.category === category).map((account) => account.handle)
}

// Get account info by handle
export function getOsintAccountInfo(handle: string): OsintAccount | undefined {
  return OSINT_ACCOUNTS.find((account) => account.handle.toLowerCase() === handle.toLowerCase())
}
