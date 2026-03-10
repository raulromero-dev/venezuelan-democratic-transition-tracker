// =============================================================================
// GOVERNMENT SOURCES BY COUNTRY AND REGION
// =============================================================================

export interface CountrySource {
  name: string
  code: string // ISO 3166-1 alpha-2
  flag: string
  language: "en" | "es" | "pt" | "fr" | "de" | "zh" | "ru" | "ar" | "ja" | "ko" | "other"
  governmentDomains: string[]
  mediaDomains: string[]
}

export interface RegionData {
  name: string
  countries: CountrySource[]
}

// =============================================================================
// NORTH AMERICA
// =============================================================================

const NORTH_AMERICA: CountrySource[] = [
  {
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    language: "en",
    governmentDomains: [
      "state.gov",
      "whitehouse.gov",
      "treasury.gov",
      "defense.gov",
      "congress.gov",
      "senate.gov",
      "house.gov",
      "usaid.gov",
    ],
    mediaDomains: [
      "nytimes.com",
      "washingtonpost.com",
      "wsj.com",
      "politico.com",
      "thehill.com",
      "foreignpolicy.com",
      "apnews.com",
      "reuters.com",
    ],
  },
  {
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    language: "en",
    governmentDomains: ["canada.ca", "international.gc.ca", "pm.gc.ca", "parl.ca"],
    mediaDomains: ["theglobeandmail.com", "cbc.ca", "nationalpost.com", "thestar.com"],
  },
  {
    name: "Mexico",
    code: "MX",
    flag: "🇲🇽",
    language: "es",
    governmentDomains: ["gob.mx", "sre.gob.mx", "presidencia.gob.mx"],
    mediaDomains: ["reforma.com", "eluniversal.com.mx", "milenio.com", "excelsior.com.mx", "jornada.com.mx"],
  },
]

// =============================================================================
// SOUTH AMERICA
// =============================================================================

const SOUTH_AMERICA: CountrySource[] = [
  {
    name: "Argentina",
    code: "AR",
    flag: "🇦🇷",
    language: "es",
    governmentDomains: ["argentina.gob.ar", "cancilleria.gob.ar", "casarosada.gob.ar"],
    mediaDomains: ["clarin.com", "lanacion.com.ar", "infobae.com", "pagina12.com.ar", "perfil.com"],
  },
  {
    name: "Brazil",
    code: "BR",
    flag: "🇧🇷",
    language: "pt",
    governmentDomains: ["gov.br", "itamaraty.gov.br", "planalto.gov.br"],
    mediaDomains: ["folha.uol.com.br", "oglobo.globo.com", "estadao.com.br", "uol.com.br", "g1.globo.com"],
  },
  {
    name: "Colombia",
    code: "CO",
    flag: "🇨🇴",
    language: "es",
    governmentDomains: ["gov.co", "cancilleria.gov.co", "presidencia.gov.co"],
    mediaDomains: ["eltiempo.com", "semana.com", "elespectador.com", "rcnradio.com", "caracol.com.co"],
  },
  {
    name: "Chile",
    code: "CL",
    flag: "🇨🇱",
    language: "es",
    governmentDomains: ["gob.cl", "minrel.gob.cl", "presidencia.cl"],
    mediaDomains: ["emol.com", "latercera.com", "biobiochile.cl", "cooperativa.cl", "elmostrador.cl"],
  },
  {
    name: "Peru",
    code: "PE",
    flag: "🇵🇪",
    language: "es",
    governmentDomains: ["gob.pe", "rree.gob.pe", "presidencia.gob.pe"],
    mediaDomains: ["elcomercio.pe", "larepublica.pe", "gestion.pe", "rpp.pe"],
  },
  {
    name: "Ecuador",
    code: "EC",
    flag: "🇪🇨",
    language: "es",
    governmentDomains: ["gob.ec", "cancilleria.gob.ec", "presidencia.gob.ec"],
    mediaDomains: ["eluniverso.com", "elcomercio.com", "expreso.ec", "primicias.ec"],
  },
  {
    name: "Uruguay",
    code: "UY",
    flag: "🇺🇾",
    language: "es",
    governmentDomains: ["gub.uy", "mrree.gub.uy", "presidencia.gub.uy"],
    mediaDomains: ["elpais.com.uy", "elobservador.com.uy", "montevideo.com.uy"],
  },
  {
    name: "Paraguay",
    code: "PY",
    flag: "🇵🇾",
    language: "es",
    governmentDomains: ["gov.py", "mre.gov.py", "presidencia.gov.py"],
    mediaDomains: ["abc.com.py", "lanacion.com.py", "ultimahora.com"],
  },
  {
    name: "Bolivia",
    code: "BO",
    flag: "🇧🇴",
    language: "es",
    governmentDomains: ["gob.bo", "cancilleria.gob.bo", "presidencia.gob.bo"],
    mediaDomains: ["eldeber.com.bo", "lostiempos.com", "la-razon.com", "paginasiete.bo"],
  },
  {
    name: "Guyana",
    code: "GY",
    flag: "🇬🇾",
    language: "en",
    governmentDomains: ["gov.gy", "minfor.gov.gy", "op.gov.gy"],
    mediaDomains: ["stabroeknews.com", "kaboronews.com", "guyanachronicle.com"],
  },
  {
    name: "Suriname",
    code: "SR",
    flag: "🇸🇷",
    language: "other",
    governmentDomains: ["gov.sr", "buza.gov.sr"],
    mediaDomains: ["starnieuws.com", "dwtonline.com"],
  },
]

// =============================================================================
// EUROPE
// =============================================================================

const EUROPE: CountrySource[] = [
  {
    name: "European Union",
    code: "EU",
    flag: "🇪🇺",
    language: "en",
    governmentDomains: ["europa.eu", "ec.europa.eu", "consilium.europa.eu", "europarl.europa.eu", "eeas.europa.eu"],
    mediaDomains: ["euronews.com", "politico.eu", "euobserver.com", "euractiv.com"],
  },
  {
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    language: "en",
    governmentDomains: ["gov.uk", "parliament.uk", "fco.gov.uk"],
    mediaDomains: [
      "bbc.com",
      "theguardian.com",
      "telegraph.co.uk",
      "thetimes.com",
      "ft.com",
      "independent.co.uk",
      "dailymail.co.uk",
    ],
  },
  {
    name: "Spain",
    code: "ES",
    flag: "🇪🇸",
    language: "es",
    governmentDomains: ["lamoncloa.gob.es", "exteriores.gob.es", "congreso.es", "senado.es"],
    mediaDomains: ["elpais.com", "elmundo.es", "abc.es", "lavanguardia.com", "elconfidencial.com", "20minutos.es"],
  },
  {
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    language: "fr",
    governmentDomains: ["gouvernement.fr", "diplomatie.gouv.fr", "elysee.fr", "assemblee-nationale.fr", "senat.fr"],
    mediaDomains: ["lemonde.fr", "lefigaro.fr", "liberation.fr", "france24.com", "rfi.fr"],
  },
  {
    name: "Germany",
    code: "DE",
    flag: "🇩🇪",
    language: "de",
    governmentDomains: ["bundesregierung.de", "auswaertiges-amt.de", "bundestag.de", "bundesrat.de"],
    mediaDomains: ["spiegel.de", "faz.net", "sueddeutsche.de", "zeit.de", "dw.com", "tagesschau.de"],
  },
  {
    name: "Italy",
    code: "IT",
    flag: "🇮🇹",
    language: "other",
    governmentDomains: ["governo.it", "esteri.it", "quirinale.it", "camera.it", "senato.it"],
    mediaDomains: ["corriere.it", "repubblica.it", "lastampa.it", "ansa.it"],
  },
  {
    name: "Portugal",
    code: "PT",
    flag: "🇵🇹",
    language: "pt",
    governmentDomains: ["portugal.gov.pt", "mne.gov.pt", "parlamento.pt"],
    mediaDomains: ["publico.pt", "dn.pt", "jn.pt", "expresso.pt"],
  },
  {
    name: "Netherlands",
    code: "NL",
    flag: "🇳🇱",
    language: "other",
    governmentDomains: ["government.nl", "rijksoverheid.nl", "tweedekamer.nl"],
    mediaDomains: ["nos.nl", "rtv.nl", "volkskrant.nl", "nrc.nl"],
  },
  {
    name: "Belgium",
    code: "BE",
    flag: "🇧🇪",
    language: "other",
    governmentDomains: ["belgium.be", "diplomatie.belgium.be"],
    mediaDomains: ["lesoir.be", "lalibre.be", "standaard.be", "nieuwsblad.be"],
  },
  {
    name: "Poland",
    code: "PL",
    flag: "🇵🇱",
    language: "other",
    governmentDomains: ["gov.pl", "msz.gov.pl", "prezydent.pl", "sejm.gov.pl"],
    mediaDomains: ["gazeta.pl", "wp.pl", "onet.pl", "tvn24.pl"],
  },
  {
    name: "Sweden",
    code: "SE",
    flag: "🇸🇪",
    language: "other",
    governmentDomains: ["government.se", "ud.se", "riksdagen.se"],
    mediaDomains: ["svd.se", "dn.se", "aftonbladet.se", "expressen.se"],
  },
  {
    name: "Norway",
    code: "NO",
    flag: "🇳🇴",
    language: "other",
    governmentDomains: ["regjeringen.no", "stortinget.no"],
    mediaDomains: ["nrk.no", "vg.no", "aftenposten.no", "dagbladet.no"],
  },
  {
    name: "Denmark",
    code: "DK",
    flag: "🇩🇰",
    language: "other",
    governmentDomains: ["stm.dk", "um.dk", "ft.dk"],
    mediaDomains: ["dr.dk", "politiken.dk", "berlingske.dk", "jyllands-posten.dk"],
  },
  {
    name: "Switzerland",
    code: "CH",
    flag: "🇨🇭",
    language: "other",
    governmentDomains: ["admin.ch", "eda.admin.ch"],
    mediaDomains: ["swissinfo.ch", "nzz.ch", "tagesanzeiger.ch"],
  },
  {
    name: "Austria",
    code: "AT",
    flag: "🇦🇹",
    language: "de",
    governmentDomains: ["bundeskanzleramt.gv.at", "bmeia.gv.at", "parlament.gv.at"],
    mediaDomains: ["derstandard.at", "diepresse.com", "kurier.at", "orf.at"],
  },
  {
    name: "Ireland",
    code: "IE",
    flag: "🇮🇪",
    language: "en",
    governmentDomains: ["gov.ie", "dfa.ie", "oireachtas.ie"],
    mediaDomains: ["irishtimes.com", "independent.ie", "rte.ie"],
  },
  {
    name: "Greece",
    code: "GR",
    flag: "🇬🇷",
    language: "other",
    governmentDomains: ["primeminister.gr", "mfa.gr", "hellenicparliament.gr"],
    mediaDomains: ["kathimerini.gr", "tanea.gr", "in.gr"],
  },
  {
    name: "Czech Republic",
    code: "CZ",
    flag: "🇨🇿",
    language: "other",
    governmentDomains: ["vlada.cz", "mzv.cz", "psp.cz"],
    mediaDomains: ["idnes.cz", "novinky.cz", "aktualne.cz"],
  },
  {
    name: "Hungary",
    code: "HU",
    flag: "🇭🇺",
    language: "other",
    governmentDomains: ["kormany.hu", "mfa.gov.hu", "parlament.hu"],
    mediaDomains: ["index.hu", "hvg.hu", "origo.hu"],
  },
  {
    name: "Romania",
    code: "RO",
    flag: "🇷🇴",
    language: "other",
    governmentDomains: ["gov.ro", "mae.ro", "cdep.ro"],
    mediaDomains: ["hotnews.ro", "digi24.ro", "adevarul.ro"],
  },
]

// =============================================================================
// ASIA
// =============================================================================

const ASIA: CountrySource[] = [
  {
    name: "China",
    code: "CN",
    flag: "🇨🇳",
    language: "zh",
    governmentDomains: ["gov.cn", "fmprc.gov.cn", "mfa.gov.cn", "xinhuanet.com"],
    mediaDomains: ["globaltimes.cn", "chinadaily.com.cn", "cgtn.com", "scmp.com"],
  },
  {
    name: "Russia",
    code: "RU",
    flag: "🇷🇺",
    language: "ru",
    governmentDomains: ["government.ru", "mid.ru", "kremlin.ru", "duma.gov.ru"],
    mediaDomains: ["rt.com", "tass.com", "ria.ru", "interfax.ru", "sputniknews.com"],
  },
  {
    name: "Japan",
    code: "JP",
    flag: "🇯🇵",
    language: "ja",
    governmentDomains: ["kantei.go.jp", "mofa.go.jp", "shugiin.go.jp", "sangiin.go.jp"],
    mediaDomains: ["japantimes.co.jp", "nhk.or.jp", "asahi.com", "mainichi.jp", "yomiuri.co.jp"],
  },
  {
    name: "South Korea",
    code: "KR",
    flag: "🇰🇷",
    language: "ko",
    governmentDomains: ["president.go.kr", "mofa.go.kr", "assembly.go.kr"],
    mediaDomains: ["koreaherald.com", "koreatimes.co.kr", "en.yna.co.kr", "arirang.com"],
  },
  {
    name: "India",
    code: "IN",
    flag: "🇮🇳",
    language: "en",
    governmentDomains: ["india.gov.in", "mea.gov.in", "pmindia.gov.in", "parliamentofindia.nic.in"],
    mediaDomains: [
      "thehindu.com",
      "hindustantimes.com",
      "timesofindia.indiatimes.com",
      "ndtv.com",
      "indianexpress.com",
    ],
  },
  {
    name: "Israel",
    code: "IL",
    flag: "🇮🇱",
    language: "en",
    governmentDomains: ["gov.il", "mfa.gov.il", "knesset.gov.il", "pmo.gov.il"],
    mediaDomains: ["timesofisrael.com", "jpost.com", "haaretz.com", "ynetnews.com", "israelhayom.com"],
  },
  {
    name: "Turkey",
    code: "TR",
    flag: "🇹🇷",
    language: "other",
    governmentDomains: ["tccb.gov.tr", "mfa.gov.tr", "tbmm.gov.tr"],
    mediaDomains: ["dailysabah.com", "hurriyetdailynews.com", "trtworld.com", "aa.com.tr"],
  },
  {
    name: "Iran",
    code: "IR",
    flag: "🇮🇷",
    language: "other",
    governmentDomains: ["president.ir", "mfa.ir", "en.mfa.ir"],
    mediaDomains: ["presstv.ir", "tehrantimes.com", "irna.ir", "tasnimnews.com"],
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
    language: "ar",
    governmentDomains: ["spa.gov.sa", "mofa.gov.sa"],
    mediaDomains: ["arabnews.com", "saudigazette.com.sa", "alarabiya.net"],
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    flag: "🇦🇪",
    language: "ar",
    governmentDomains: ["government.ae", "mofaic.gov.ae"],
    mediaDomains: ["thenationalnews.com", "khaleejtimes.com", "gulfnews.com"],
  },
  {
    name: "Indonesia",
    code: "ID",
    flag: "🇮🇩",
    language: "other",
    governmentDomains: ["kemlu.go.id", "presidenri.go.id", "dpr.go.id"],
    mediaDomains: ["thejakartapost.com", "kompas.com", "tempo.co", "detik.com"],
  },
  {
    name: "Philippines",
    code: "PH",
    flag: "🇵🇭",
    language: "en",
    governmentDomains: ["dfa.gov.ph", "president.gov.ph", "congress.gov.ph"],
    mediaDomains: ["inquirer.net", "philstar.com", "rappler.com", "abs-cbn.com"],
  },
  {
    name: "Vietnam",
    code: "VN",
    flag: "🇻🇳",
    language: "other",
    governmentDomains: ["mofa.gov.vn", "chinhphu.vn"],
    mediaDomains: ["vietnamnews.vn", "vnexpress.net", "tuoitrenews.vn"],
  },
  {
    name: "Thailand",
    code: "TH",
    flag: "🇹🇭",
    language: "other",
    governmentDomains: ["mfa.go.th", "thaigov.go.th"],
    mediaDomains: ["bangkokpost.com", "nationthailand.com", "thaipbsworld.com"],
  },
  {
    name: "Malaysia",
    code: "MY",
    flag: "🇲🇾",
    language: "en",
    governmentDomains: ["kln.gov.my", "pmo.gov.my", "parlimen.gov.my"],
    mediaDomains: ["thestar.com.my", "nst.com.my", "malaymail.com"],
  },
  {
    name: "Singapore",
    code: "SG",
    flag: "🇸🇬",
    language: "en",
    governmentDomains: ["mfa.gov.sg", "pmo.gov.sg", "parliament.gov.sg"],
    mediaDomains: ["straitstimes.com", "channelnewsasia.com", "todayonline.com"],
  },
  {
    name: "Pakistan",
    code: "PK",
    flag: "🇵🇰",
    language: "en",
    governmentDomains: ["mofa.gov.pk", "pmo.gov.pk", "na.gov.pk"],
    mediaDomains: ["dawn.com", "geo.tv", "tribune.com.pk", "thenews.com.pk"],
  },
  {
    name: "Bangladesh",
    code: "BD",
    flag: "🇧🇩",
    language: "en",
    governmentDomains: ["mofa.gov.bd", "pmo.gov.bd"],
    mediaDomains: ["thedailystar.net", "dhakatribune.com", "bdnews24.com"],
  },
  {
    name: "Qatar",
    code: "QA",
    flag: "🇶🇦",
    language: "ar",
    governmentDomains: ["mofa.gov.qa", "gco.gov.qa"],
    mediaDomains: ["aljazeera.com", "thepeninsulaqatar.com", "gulf-times.com"],
  },
  {
    name: "Kuwait",
    code: "KW",
    flag: "🇰🇼",
    language: "ar",
    governmentDomains: ["mofa.gov.kw", "da.gov.kw"],
    mediaDomains: ["kuwaittimes.com", "arabtimesonline.com"],
  },
]

// =============================================================================
// OCEANIA
// =============================================================================

const OCEANIA: CountrySource[] = [
  {
    name: "Australia",
    code: "AU",
    flag: "🇦🇺",
    language: "en",
    governmentDomains: ["dfat.gov.au", "pm.gov.au", "aph.gov.au", "foreignminister.gov.au"],
    mediaDomains: [
      "abc.net.au",
      "smh.com.au",
      "theaustralian.com.au",
      "theguardian.com/australia-news",
      "sbs.com.au",
      "9news.com.au",
    ],
  },
  {
    name: "New Zealand",
    code: "NZ",
    flag: "🇳🇿",
    language: "en",
    governmentDomains: ["mfat.govt.nz", "beehive.govt.nz", "parliament.nz"],
    mediaDomains: ["nzherald.co.nz", "stuff.co.nz", "rnz.co.nz", "newshub.co.nz"],
  },
  {
    name: "Fiji",
    code: "FJ",
    flag: "🇫🇯",
    language: "en",
    governmentDomains: ["foreignaffairs.gov.fj", "fiji.gov.fj"],
    mediaDomains: ["fijitimes.com", "fijivillage.com"],
  },
  {
    name: "Papua New Guinea",
    code: "PG",
    flag: "🇵🇬",
    language: "en",
    governmentDomains: ["pm.gov.pg", "foreignaffairs.gov.pg"],
    mediaDomains: ["postcourier.com.pg", "thenational.com.pg"],
  },
]

// =============================================================================
// AFRICA (added for completeness)
// =============================================================================

const AFRICA: CountrySource[] = [
  {
    name: "South Africa",
    code: "ZA",
    flag: "🇿🇦",
    language: "en",
    governmentDomains: ["dirco.gov.za", "thepresidency.gov.za", "parliament.gov.za"],
    mediaDomains: ["dailymaverick.co.za", "mg.co.za", "news24.com", "iol.co.za"],
  },
  {
    name: "Nigeria",
    code: "NG",
    flag: "🇳🇬",
    language: "en",
    governmentDomains: ["foreignaffairs.gov.ng", "statehouse.gov.ng"],
    mediaDomains: ["punchng.com", "guardian.ng", "vanguardngr.com", "premiumtimesng.com"],
  },
  {
    name: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    language: "en",
    governmentDomains: ["mfa.go.ke", "president.go.ke"],
    mediaDomains: ["nation.africa", "standardmedia.co.ke", "the-star.co.ke"],
  },
  {
    name: "Egypt",
    code: "EG",
    flag: "🇪🇬",
    language: "ar",
    governmentDomains: ["mfa.gov.eg", "presidency.eg"],
    mediaDomains: ["egypttoday.com", "dailynewsegypt.com", "ahram.org.eg"],
  },
  {
    name: "Morocco",
    code: "MA",
    flag: "🇲🇦",
    language: "ar",
    governmentDomains: ["diplomatie.ma", "maroc.ma"],
    mediaDomains: ["moroccoworldnews.com", "hespress.com"],
  },
  {
    name: "Algeria",
    code: "DZ",
    flag: "🇩🇿",
    language: "ar",
    governmentDomains: ["mae.gov.dz", "el-mouradia.dz"],
    mediaDomains: ["aps.dz", "echoroukonline.com"],
  },
  {
    name: "Ethiopia",
    code: "ET",
    flag: "🇪🇹",
    language: "en",
    governmentDomains: ["mfa.gov.et", "pmo.gov.et"],
    mediaDomains: ["thereporterethiopia.com", "addisstandard.com"],
  },
  {
    name: "Ghana",
    code: "GH",
    flag: "🇬🇭",
    language: "en",
    governmentDomains: ["mfa.gov.gh", "presidency.gov.gh"],
    mediaDomains: ["graphic.com.gh", "myjoyonline.com", "ghanaweb.com"],
  },
]

// =============================================================================
// CENTRAL AMERICA & CARIBBEAN
// =============================================================================

const CENTRAL_AMERICA_CARIBBEAN: CountrySource[] = [
  {
    name: "Cuba",
    code: "CU",
    flag: "🇨🇺",
    language: "es",
    governmentDomains: ["cubaminrex.cu", "presidencia.gob.cu", "granma.cu"],
    mediaDomains: ["granma.cu", "cubadebate.cu", "prensa-latina.cu"],
  },
  {
    name: "Dominican Republic",
    code: "DO",
    flag: "🇩🇴",
    language: "es",
    governmentDomains: ["mirex.gob.do", "presidencia.gob.do"],
    mediaDomains: ["listindiario.com", "diariolibre.com", "elnuevodiario.com.do"],
  },
  {
    name: "Panama",
    code: "PA",
    flag: "🇵🇦",
    language: "es",
    governmentDomains: ["mire.gob.pa", "presidencia.gob.pa"],
    mediaDomains: ["prensa.com", "laestrella.com.pa", "critica.com.pa"],
  },
  {
    name: "Costa Rica",
    code: "CR",
    flag: "🇨🇷",
    language: "es",
    governmentDomains: ["rree.go.cr", "presidencia.go.cr"],
    mediaDomains: ["nacion.com", "crhoy.com", "teletica.com"],
  },
  {
    name: "Guatemala",
    code: "GT",
    flag: "🇬🇹",
    language: "es",
    governmentDomains: ["minex.gob.gt", "guatemala.gob.gt"],
    mediaDomains: ["prensalibre.com", "elperiodico.com.gt", "soy502.com"],
  },
  {
    name: "Honduras",
    code: "HN",
    flag: "🇭🇳",
    language: "es",
    governmentDomains: ["sre.gob.hn", "presidencia.gob.hn"],
    mediaDomains: ["laprensa.hn", "elheraldo.hn", "tiempo.hn"],
  },
  {
    name: "El Salvador",
    code: "SV",
    flag: "🇸🇻",
    language: "es",
    governmentDomains: ["rree.gob.sv", "presidencia.gob.sv"],
    mediaDomains: ["laprensagrafica.com", "elsalvador.com", "diarioelmundo.com.sv"],
  },
  {
    name: "Nicaragua",
    code: "NI",
    flag: "🇳🇮",
    language: "es",
    governmentDomains: ["cancilleria.gob.ni", "el19digital.com"],
    mediaDomains: ["laprensa.com.ni", "confidencial.digital", "100noticias.com.ni"],
  },
  {
    name: "Jamaica",
    code: "JM",
    flag: "🇯🇲",
    language: "en",
    governmentDomains: ["mfaft.gov.jm", "opm.gov.jm"],
    mediaDomains: ["jamaicaobserver.com", "jamaica-gleaner.com"],
  },
  {
    name: "Trinidad and Tobago",
    code: "TT",
    flag: "🇹🇹",
    language: "en",
    governmentDomains: ["foreign.gov.tt", "opm.gov.tt"],
    mediaDomains: ["trinidadexpress.com", "guardian.co.tt", "newsday.co.tt"],
  },
]

// =============================================================================
// EXPORT ALL REGIONS
// =============================================================================

export const REGIONS: Record<string, RegionData> = {
  "North America": {
    name: "North America",
    countries: NORTH_AMERICA,
  },
  "South America": {
    name: "South America",
    countries: SOUTH_AMERICA,
  },
  "Central America & Caribbean": {
    name: "Central America & Caribbean",
    countries: CENTRAL_AMERICA_CARIBBEAN,
  },
  Europe: {
    name: "Europe",
    countries: EUROPE,
  },
  Asia: {
    name: "Asia",
    countries: ASIA,
  },
  Oceania: {
    name: "Oceania",
    countries: OCEANIA,
  },
  Africa: {
    name: "Africa",
    countries: AFRICA,
  },
}

export const ALL_COUNTRIES: CountrySource[] = [
  ...NORTH_AMERICA,
  ...SOUTH_AMERICA,
  ...CENTRAL_AMERICA_CARIBBEAN,
  ...EUROPE,
  ...ASIA,
  ...OCEANIA,
  ...AFRICA,
]

export function getCountryByCode(code: string): CountrySource | undefined {
  return ALL_COUNTRIES.find((c) => c.code === code)
}

export function getCountriesByRegion(region: string): CountrySource[] {
  return REGIONS[region]?.countries || []
}

export function getAllRegionNames(): string[] {
  return Object.keys(REGIONS)
}
