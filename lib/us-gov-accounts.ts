// US Government accounts configuration
// Source: USgov.txt - Complete list with 49 accounts

export interface USGovAccount {
  handle: string
  displayName: string
  role: string
  affiliation: string
  subgroups: string[]
}

export const US_GOV_ACCOUNTS: USGovAccount[] = [
  // White House
  {
    handle: "@POTUS",
    displayName: "Donald J. Trump",
    role: "President of the United States",
    affiliation: "White House",
    subgroups: ["All", "Official Accounts", "Key Administration"],
  },
  {
    handle: "@realDonaldTrump",
    displayName: "Donald J. Trump",
    role: "Personal account",
    affiliation: "White House",
    subgroups: ["All", "Key Administration"],
  },
  {
    handle: "@WhiteHouse",
    displayName: "The White House",
    role: "Official account",
    affiliation: "White House",
    subgroups: ["All", "Official Accounts"],
  },
  {
    handle: "@VP",
    displayName: "JD Vance",
    role: "Vice President of the United States",
    affiliation: "White House",
    subgroups: ["All", "Official Accounts", "Key Administration"],
  },
  {
    handle: "@PressSec",
    displayName: "Karoline Leavitt",
    role: "White House Press Secretary",
    affiliation: "White House Comms",
    subgroups: ["All", "Official Accounts", "Key Administration"],
  },
  {
    handle: "@K_Leavitt",
    displayName: "Katherine Leavitt",
    role: "Deputy White House Press Secretary",
    affiliation: "White House Comms",
    subgroups: ["All", "Key Administration"],
  },
  {
    handle: "@WHCommsDirector",
    displayName: "White House Comms Director",
    role: "Senior communications lead",
    affiliation: "White House",
    subgroups: ["All", "Official Accounts", "Key Administration"],
  },
  {
    handle: "@StephenM",
    displayName: "Stephen Miller",
    role: "Deputy Chief of Staff & Homeland Security Advisor",
    affiliation: "White House",
    subgroups: ["All", "Key Administration"],
  },

  // National Security Council
  {
    handle: "@WHNSCSpox",
    displayName: "NSC Spokesperson",
    role: "Official spokesperson",
    affiliation: "NSC",
    subgroups: ["All", "National Security"],
  },

  // State Department
  {
    handle: "@SecRubio",
    displayName: "Marco Rubio",
    role: "Secretary of State",
    affiliation: "State Department",
    subgroups: ["All", "Official Accounts", "State Department", "Key Administration"],
  },
  {
    handle: "@marcorubio",
    displayName: "Marco Rubio",
    role: "Personal political account",
    affiliation: "State Department",
    subgroups: ["All", "Key Administration"],
  },
  {
    handle: "@StateDept",
    displayName: "U.S. Department of State",
    role: "Official account",
    affiliation: "State Department",
    subgroups: ["All", "Official Accounts", "State Department"],
  },
  {
    handle: "@StateDeputySec",
    displayName: "Deputy Secretary of State",
    role: "Second-in-command",
    affiliation: "State Department",
    subgroups: ["All", "State Department"],
  },
  {
    handle: "@WHAAsstSecty",
    displayName: "Bureau of Western Hemisphere Affairs",
    role: "Latin America policy lead",
    affiliation: "State Department",
    subgroups: ["All", "State Department"],
  },
  {
    handle: "@USWHADeputy",
    displayName: "Deputy Assistant Secretary WHA",
    role: "Latin America deputy",
    affiliation: "State Department",
    subgroups: ["All", "State Department"],
  },
  {
    handle: "@StateDeptSpox",
    displayName: "State Department Spokesperson",
    role: "Official spokesperson",
    affiliation: "State Department",
    subgroups: ["All", "State Department"],
  },
  {
    handle: "@StateDeputySpox",
    displayName: "Deputy State Department Spokesperson",
    role: "Official deputy spokesperson",
    affiliation: "State Department",
    subgroups: ["All", "State Department"],
  },
  {
    handle: "@StateINL",
    displayName: "US Dept of State INL",
    role: "Intl Narcotics & Law Enforcement Bureau",
    affiliation: "State Department",
    subgroups: ["All", "State Department", "National Security"],
  },
  {
    handle: "@StateDeptCT",
    displayName: "State Dept Counterterrorism Bureau",
    role: "Counterterrorism bureau",
    affiliation: "State Department",
    subgroups: ["All", "State Department", "National Security"],
  },

  // Diplomats
  {
    handle: "@USAmbColombia",
    displayName: "U.S. Ambassador to Colombia",
    role: "Ambassador",
    affiliation: "State Department",
    subgroups: ["All", "Diplomats", "State Department"],
  },
  {
    handle: "@USAmbOAS",
    displayName: "U.S. Permanent Representative to the OAS",
    role: "Ambassador",
    affiliation: "OAS Mission",
    subgroups: ["All", "Diplomats"],
  },
  {
    handle: "@usembassyve",
    displayName: "U.S. Venezuela Affairs Unit (VAU)",
    role: "US mission for Venezuela",
    affiliation: "State Department",
    subgroups: ["All", "State Department", "Diplomats"],
  },
  {
    handle: "@USEmbassyBogota",
    displayName: "US Embassy Bogota",
    role: "U.S. Embassy in Colombia",
    affiliation: "State Department",
    subgroups: ["All", "Diplomats", "State Department"],
  },

  // Southern Command / DoD
  {
    handle: "@Southcom",
    displayName: "U.S. Southern Command",
    role: "SOUTHCOM official",
    affiliation: "DoD",
    subgroups: ["All", "Official Accounts", "Southern Command"],
  },
  {
    handle: "@ARMYSOUTH",
    displayName: "U.S. Army South",
    role: "Army component of SOUTHCOM",
    affiliation: "DoD",
    subgroups: ["All", "Southern Command"],
  },
  {
    handle: "@jiatfs",
    displayName: "Joint Interagency Task Force South",
    role: "Illicit trafficking ops",
    affiliation: "DoD/SOUTHCOM",
    subgroups: ["All", "Southern Command"],
  },
  {
    handle: "@DeptofDefense",
    displayName: "U.S. Department of Defense",
    role: "Official account",
    affiliation: "DoD",
    subgroups: ["All", "Official Accounts", "Key Administration"],
  },
  {
    handle: "@DODResponse",
    displayName: "DoD Rapid Response",
    role: "Official messaging",
    affiliation: "DoD",
    subgroups: ["All", "Official Accounts"],
  },

  // Department of War (reinstated)
  {
    handle: "@SecWar",
    displayName: "Pete Hegseth",
    role: "Secretary of War (2025)",
    affiliation: "Department of War",
    subgroups: ["All", "Official Accounts", "Key Administration"],
  },
  {
    handle: "@PeteHegseth",
    displayName: "Pete Hegseth",
    role: "Personal account",
    affiliation: "Department of War",
    subgroups: ["All", "Key Administration"],
  },
  {
    handle: "@DeptofWar",
    displayName: "Department of War",
    role: "Official reinstated department",
    affiliation: "DoD/War Dept",
    subgroups: ["All", "Official Accounts"],
  },

  // DHS / National Security
  {
    handle: "@DHSgov",
    displayName: "Department of Homeland Security",
    role: "Official account",
    affiliation: "DHS",
    subgroups: ["All", "Official Accounts", "National Security"],
  },
  {
    handle: "@CBP",
    displayName: "Customs and Border Protection",
    role: "Official DHS account",
    affiliation: "DHS",
    subgroups: ["All", "National Security"],
  },
  {
    handle: "@ICEgov",
    displayName: "Immigration and Customs Enforcement",
    role: "Official DHS account",
    affiliation: "DHS",
    subgroups: ["All", "National Security"],
  },

  // Treasury
  {
    handle: "@USTreasury",
    displayName: "Department of the Treasury",
    role: "Official account",
    affiliation: "Treasury",
    subgroups: ["All", "Official Accounts"],
  },
  {
    handle: "@USTreasurySpox",
    displayName: "Treasury Spokesperson",
    role: "Official communications",
    affiliation: "Treasury",
    subgroups: ["All", "Official Accounts"],
  },
  {
    handle: "@OFAC_US",
    displayName: "Treasury OFAC Office",
    role: "Sanctions authority",
    affiliation: "Treasury",
    subgroups: ["All", "Official Accounts", "National Security"],
  },

  // Intelligence Community
  {
    handle: "@ODNIgov",
    displayName: "Office of the Director of National Intelligence",
    role: "IC headquarters & DNI office",
    affiliation: "ODNI",
    subgroups: ["All", "Official Accounts", "National Security"],
  },
  {
    handle: "@DNIGabbard",
    displayName: "Tulsi Gabbard",
    role: "Director of National Intelligence",
    affiliation: "ODNI",
    subgroups: ["All", "Key Administration", "National Security"],
  },
  {
    handle: "@CIA",
    displayName: "Central Intelligence Agency",
    role: "Foreign intelligence service",
    affiliation: "CIA",
    subgroups: ["All", "Official Accounts", "National Security"],
  },
  {
    handle: "@FBI",
    displayName: "Federal Bureau of Investigation",
    role: "Domestic security & law enforcement",
    affiliation: "DOJ",
    subgroups: ["All", "Official Accounts", "National Security"],
  },
  {
    handle: "@FBIDirectorKash",
    displayName: "Kash Patel",
    role: "Director of the FBI",
    affiliation: "DOJ",
    subgroups: ["All", "Key Administration", "National Security"],
  },

  // Military / Coast Guard
  {
    handle: "@USCG",
    displayName: "U.S. Coast Guard",
    role: "Maritime security & SAR",
    affiliation: "DHS",
    subgroups: ["All", "Official Accounts", "National Security"],
  },
  {
    handle: "@USCGSoutheast",
    displayName: "U.S. Coast Guard Southeast",
    role: "Coast Guard district covering Caribbean & FL",
    affiliation: "DHS",
    subgroups: ["All", "National Security"],
  },
  {
    handle: "@USNavy",
    displayName: "U.S. Navy",
    role: "Official Navy account",
    affiliation: "DoD",
    subgroups: ["All", "Official Accounts", "National Security"],
  },
  {
    handle: "@USNorthernCmd",
    displayName: "U.S. Northern Command",
    role: "Homeland defense combatant command",
    affiliation: "DoD",
    subgroups: ["All", "Official Accounts", "National Security"],
  },
  {
    handle: "@CMC_MarineCorps",
    displayName: "Commandant of the Marine Corps",
    role: "Senior Marine Corps leadership",
    affiliation: "USMC/DoD",
    subgroups: ["All", "Official Accounts", "National Security"],
  },
]

export const FEED_CATEGORIES = [
  "All",
  "Official Accounts",
  "Key Administration",
  "State Department",
  "Southern Command",
  "National Security",
  "Diplomats",
] as const

export type FeedCategory = (typeof FEED_CATEGORIES)[number]

export function getAccountsByCategory(category: FeedCategory): USGovAccount[] {
  if (category === "All") return US_GOV_ACCOUNTS
  return US_GOV_ACCOUNTS.filter((account) => account.subgroups.includes(category))
}

export function getAllHandles(): string[] {
  return US_GOV_ACCOUNTS.map((a) => a.handle.replace("@", ""))
}
