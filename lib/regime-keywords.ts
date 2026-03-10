// Keywords for Estados Unidos and Maria Corina filters in Regime X monitoring

// Estados Unidos (US) related keywords
export const ESTADOS_UNIDOS_KEYWORDS = [
  // English
  "Trump",
  "trump",
  "TRUMP",
  "Rubio",
  "rubio",
  "RUBIO",
  "Marco Rubio",
  "Hegseth",
  "hegseth",
  "HEGSETH",
  "Pete Hegseth",
  "USA",
  "U.S.A",
  "United States",
  "Washington",
  "washington",
  "WASHINGTON",
  "Republicans",
  "republicans",
  "REPUBLICANS",
  "Republican",
  "GOP",
  "White House",
  "Casa Blanca",
  "Pentagon",
  "Pentágono",
  "State Department",
  "Departamento de Estado",
  "SOUTHCOM",
  "southcom",
  "Southern Command",
  "Comando Sur",

  // Spanish
  "Imperio",
  "imperio",
  "IMPERIO",
  "imperialismo",
  "Imperialismo",
  "imperialista",
  "Imperialista",
  "yanqui",
  "Yanqui",
  "yanquis",
  "Yanquis",
  "gringo",
  "Gringo",
  "gringos",
  "Gringos",
  "estadounidense",
  "Estadounidense",
  "estadounidenses",
  "Estadounidenses",
  "Estados Unidos",
  "estados unidos",
  "EEUU",
  "EE.UU",
  "EE UU",
  "norteamericano",
  "Norteamericano",
  "norteamericanos",
  "americanos",
  "republicanos",
  "Republicanos",
]

// Reference text for semantic/embedding matching
export const ESTADOS_UNIDOS_REFERENCE_TEXT = `
Trump Donald Trump President Trump administration Rubio Marco Rubio Senator Rubio 
Hegseth Pete Hegseth Secretary Hegseth USA United States of America Washington DC 
Republicans Republican Party GOP conservative White House Casa Blanca Pentagon 
Pentágono State Department Departamento de Estado SOUTHCOM Southern Command Comando Sur
Imperio imperialismo imperialista yanqui yanquis gringo gringos estadounidense 
Estados Unidos EEUU norteamericano americanos republicanos American government
US military intervention US sanctions bloqueo blockade sanctions regime change
`

// Maria Corina related keywords
export const MARIA_CORINA_KEYWORDS = [
  // Names and variations
  "Maria Corina",
  "María Corina",
  "maria corina",
  "maría corina",
  "MARIA CORINA",
  "MARÍA CORINA",
  "Maria Corina Machado",
  "María Corina Machado",
  "Corina Machado",
  "MCM",
  "mcm",
  "Machado",
  "machado",
  "MACHADO",
  "Corina",
  "corina",
  "CORINA",

  // Nicknames
  "Sayona",
  "sayona",
  "SAYONA",
  "La Sayona",
  "la sayona",
  "LA SAYONA",
  "MariCori",
  "Maricori",
  "maricori",
  "MARICORI",
  "Mari cori",
  "mari cori",
  "Mari Cori",

  // Nobel Prize
  "Nobel",
  "nobel",
  "NOBEL",
  "Premio Nobel",
  "premio nobel",
  "Nobel Peace",
  "Nobel de la Paz",

  // Political references
  "Vente Venezuela",
  "vente venezuela",
  "VENTE",
  "oposición",
  "Oposición",
  "líder opositora",
  "opposition leader",
]

// Reference text for semantic/embedding matching
export const MARIA_CORINA_REFERENCE_TEXT = `
Maria Corina Machado María Corina MCM Corina Machado líder opositora opposition leader
Sayona La Sayona MariCori Mari Cori apodo nickname Venezuelan opposition
Nobel Prize Premio Nobel Peace Prize Premio Nobel de la Paz laureate laureada
Vente Venezuela political party partido político opposition democratic movement
Venezuelan democracy democracia venezolana presidential candidate candidata presidencial
primary elections primarias elecciones free elections elecciones libres
`

// Check if text contains Estados Unidos keywords
export function containsEstadosUnidosKeyword(text: string): boolean {
  const lowerText = text.toLowerCase()
  return ESTADOS_UNIDOS_KEYWORDS.some((keyword) => lowerText.includes(keyword.toLowerCase()))
}

// Check if text contains Maria Corina keywords
export function containsMariaCorinakeyword(text: string): boolean {
  const lowerText = text.toLowerCase()
  return MARIA_CORINA_KEYWORDS.some((keyword) => lowerText.includes(keyword.toLowerCase()))
}
