// Influencer accounts for X API - organized by political group
export interface InfluencerAccount {
  name: string
  handle: string
  group: "MAGA" | "Democratic" | "Venezuelan"
}

export const INFLUENCER_ACCOUNTS: InfluencerAccount[] = [
  // MAGA Influencers
  { name: "Alex Jones", handle: "RealAlexJones", group: "MAGA" },
  { name: "Nick Fuentes", handle: "NickJFuentes", group: "MAGA" },
  { name: "Jack Posobiec", handle: "JackPosobiec", group: "MAGA" },
  { name: "Charlie Kirk", handle: "charliekirk11", group: "MAGA" },
  { name: "Candace Owens", handle: "RealCandaceO", group: "MAGA" },
  { name: "Ben Shapiro", handle: "benshapiro", group: "MAGA" },
  { name: "Tucker Carlson", handle: "TuckerCarlson", group: "MAGA" },
  { name: "Laura Loomer", handle: "LauraLoomer", group: "MAGA" },
  { name: "Steve Bannon (War Room)", handle: "WarRoom", group: "MAGA" },
  { name: "Mike Cernovich", handle: "Cernovich", group: "MAGA" },
  { name: "Dinesh D'Souza", handle: "DineshDSouza", group: "MAGA" },
  { name: "Sebastian Gorka", handle: "SebGorka", group: "MAGA" },
  { name: "Tom Fitton", handle: "TomFitton", group: "MAGA" },
  { name: "Dan Bongino", handle: "dbongino", group: "MAGA" },
  { name: "Marjorie Taylor Greene", handle: "RepMTG", group: "MAGA" },
  { name: "Matt Walsh", handle: "MattWalshBlog", group: "MAGA" },
  { name: "Libs of TikTok", handle: "libsoftiktok", group: "MAGA" },
  { name: "Benny Johnson", handle: "bennyjohnson", group: "MAGA" },
  { name: "Rogan O'Handley", handle: "DC_Draino", group: "MAGA" },
  { name: "The Gateway Pundit", handle: "gatewaypundit", group: "MAGA" },
  { name: "Paul Joseph Watson", handle: "PrisonPlanet", group: "MAGA" },
  { name: "Ian Miles Cheong", handle: "stillgray", group: "MAGA" },
  { name: "Andy Ngo", handle: "MrAndyNgo", group: "MAGA" },
  { name: "Tomi Lahren", handle: "TomiLahren", group: "MAGA" },
  { name: "Jesse Kelly", handle: "JesseKellyDC", group: "MAGA" },
  { name: "Monica Crowley", handle: "MonicaCrowley", group: "MAGA" },
  { name: "Raheem Kassam", handle: "RaheemKassam", group: "MAGA" },
  { name: "Julie Kelly", handle: "julie_kelly2", group: "MAGA" },
  { name: "Catturd", handle: "catturd2", group: "MAGA" },
  { name: "TheQuartering", handle: "TheQuartering", group: "MAGA" },
  { name: "End Wokeness", handle: "EndWokeness", group: "MAGA" },

  // Democratic Influencers
  { name: "Rachel Maddow", handle: "maddow", group: "Democratic" },
  { name: "Joy-Ann Reid", handle: "JoyAnnReid", group: "Democratic" },
  { name: "Lawrence O'Donnell", handle: "Lawrence", group: "Democratic" },
  { name: "Chris Hayes", handle: "chrislhayes", group: "Democratic" },
  { name: "Mehdi Hasan", handle: "mehdirhasan", group: "Democratic" },
  { name: "Alexandria Ocasio-Cortez", handle: "AOC", group: "Democratic" },
  { name: "Ilhan Omar", handle: "IlhanMN", group: "Democratic" },
  { name: "Ayanna Pressley", handle: "AyannaPressley", group: "Democratic" },
  { name: "Ro Khanna", handle: "RoKhanna", group: "Democratic" },
  { name: "Jon Favreau", handle: "jonfavs", group: "Democratic" },
  { name: "Jon Lovett", handle: "jonlovett", group: "Democratic" },
  { name: "Tommy Vietor", handle: "TVietor08", group: "Democratic" },
  { name: "Dan Pfeiffer", handle: "danpfeiffer", group: "Democratic" },
  { name: "Brian Tyler Cohen", handle: "briantylercohen", group: "Democratic" },
  { name: "Harry Sisson", handle: "harryjsisson", group: "Democratic" },
  { name: "BrooklynDad_Defiant", handle: "mmpadellan", group: "Democratic" },
  { name: "Acyn Torabi", handle: "Acyn", group: "Democratic" },
  { name: "Ron Filipkowski", handle: "RonFilipkowski", group: "Democratic" },
  { name: "Mueller, She Wrote", handle: "MuellerSheWrote", group: "Democratic" },
  { name: "Aaron Rupar", handle: "atrupar", group: "Democratic" },
  { name: "Sawyer Hackett", handle: "SawyerHackett", group: "Democratic" },
  { name: "Lindy Li", handle: "lindyli", group: "Democratic" },
  { name: "Tristan Snell", handle: "TristanSnell", group: "Democratic" },
  { name: "Dash Dobrofsky", handle: "DashDobrofsky", group: "Democratic" },
  { name: "Duty To Warn", handle: "duty2warn", group: "Democratic" },
  { name: "The Lincoln Project", handle: "ProjectLincoln", group: "Democratic" },
  { name: "MeidasTouch", handle: "MeidasTouch", group: "Democratic" },
  { name: "Occupy Democrats", handle: "OccupyDemocrats", group: "Democratic" },
  { name: "The Recount", handle: "therecount", group: "Democratic" },
  { name: "No Lie with Brian Tyler Cohen", handle: "NoLieWithBTC", group: "Democratic" },
  { name: "Kaivan Shroff", handle: "KaivanShroff", group: "Democratic" },

  // Venezuelan Influencers
  { name: "Luis Carlos Díaz", handle: "LuisCarlos", group: "Venezuelan" },
  { name: "Naky Soto", handle: "Naky", group: "Venezuelan" },
  { name: "Luz Mely Reyes", handle: "LuzMelyReyes", group: "Venezuelan" },
  { name: "Eugenio Martínez", handle: "puzkas", group: "Venezuelan" },
  { name: "Pedro Pablo Peñaloza", handle: "pppenaloza", group: "Venezuelan" },
  { name: "Gabriel Bastidas", handle: "Gbastidas", group: "Venezuelan" },
  { name: "Ibéyise Pacheco", handle: "ibepacheco", group: "Venezuelan" },
  { name: "Alejandro Marcano Santelli", handle: "AleMarcanoS", group: "Venezuelan" },
  { name: "Rafael León", handle: "RLeon_9", group: "Venezuelan" },
  { name: "Miguel Ángel Rodríguez", handle: "MiguelContigo", group: "Venezuelan" },
  { name: "Sergio Novelli", handle: "SergioNovelli", group: "Venezuelan" },
  { name: "Nelson Bocaranda", handle: "NelsonBocaranda", group: "Venezuelan" },
  { name: "Vladimir Villegas", handle: "Vladi_VillegasP", group: "Venezuelan" },
  { name: "Carla Angola", handle: "carlaangola", group: "Venezuelan" },
  { name: "Maibort Petit", handle: "maibortpetit", group: "Venezuelan" },
  { name: "Roberto Deniz", handle: "robertodeniz", group: "Venezuelan" },
  { name: "César Batiz", handle: "CBatiz", group: "Venezuelan" },
  { name: "Ewald Scharfenberg", handle: "Ewaldsccs", group: "Venezuelan" },
  { name: "Orlando Avendaño", handle: "OrlvndoA", group: "Venezuelan" },
  { name: "Patricia Poleo", handle: "PattyPoleo", group: "Venezuelan" },
  { name: "Daniel Lara Farías", handle: "DLaraF", group: "Venezuelan" },
  { name: "VESinFiltro", handle: "vesinfiltro", group: "Venezuelan" },
  { name: "Cazadores de Fake News", handle: "cazamosfakenews", group: "Venezuelan" },
]

export type InfluencerGroup = "All" | "MAGA" | "Democratic" | "Venezuelan"

export function getAccountsByGroup(group: InfluencerGroup): InfluencerAccount[] {
  if (group === "All") return INFLUENCER_ACCOUNTS
  return INFLUENCER_ACCOUNTS.filter((a) => a.group === group)
}

export function getAllHandles(): string[] {
  return INFLUENCER_ACCOUNTS.map((a) => a.handle)
}
