/**
 * Maps openfootball team names to flag codes for flagcdn.com.
 * flagcdn uses ISO 3166-1 alpha-2 codes and supports UK subdivisions (gb-eng, etc.).
 * @see https://flagcdn.com
 */
export const TEAM_FLAG_CODES: Record<string, string> = {
  Algeria: "dz",
  Angola: "ao",
  Argentina: "ar",
  Australia: "au",
  Austria: "at",
  Belgium: "be",
  Bolivia: "bo",
  "Bosnia & Herzegovina": "ba",
  "Bosnia-Herzegovina": "ba",
  Brazil: "br",
  Bulgaria: "bg",
  Cameroon: "cm",
  Canada: "ca",
  "Cape Verde": "cv",
  Chile: "cl",
  China: "cn",
  Colombia: "co",
  "Costa Rica": "cr",
  Croatia: "hr",
  Cuba: "cu",
  Curaçao: "cw",
  "Czech Republic": "cz",
  Czechoslovakia: "cz",
  "Côte d'Ivoire": "ci",
  "DR Congo": "cd",
  Denmark: "dk",
  "Dutch East Indies": "id",
  "East Germany": "de",
  Ecuador: "ec",
  Egypt: "eg",
  "El Salvador": "sv",
  England: "gb-eng",
  France: "fr",
  Germany: "de",
  Ghana: "gh",
  Greece: "gr",
  Haiti: "ht",
  Honduras: "hn",
  Hungary: "hu",
  Iceland: "is",
  Iran: "ir",
  Iraq: "iq",
  Ireland: "ie",
  Israel: "il",
  Italy: "it",
  "Ivory Coast": "ci",
  Jamaica: "jm",
  Japan: "jp",
  Jordan: "jo",
  Kuwait: "kw",
  Mexico: "mx",
  Morocco: "ma",
  Netherlands: "nl",
  "New Zealand": "nz",
  Nigeria: "ng",
  "North Korea": "kp",
  "Northern Ireland": "gb-nir",
  Norway: "no",
  Panama: "pa",
  Paraguay: "py",
  Peru: "pe",
  Poland: "pl",
  Portugal: "pt",
  Qatar: "qa",
  Romania: "ro",
  Russia: "ru",
  "Saudi Arabia": "sa",
  Scotland: "gb-sct",
  Senegal: "sn",
  Serbia: "rs",
  "Serbia and Montenegro": "rs",
  Slovakia: "sk",
  Slovenia: "si",
  "South Africa": "za",
  "South Korea": "kr",
  "Soviet Union": "ru",
  Spain: "es",
  Sweden: "se",
  Switzerland: "ch",
  Togo: "tg",
  "Trinidad and Tobago": "tt",
  Tunisia: "tn",
  Turkey: "tr",
  USA: "us",
  Ukraine: "ua",
  "United Arab Emirates": "ae",
  "United States": "us",
  Uruguay: "uy",
  Uzbekistan: "uz",
  Wales: "gb-wls",
  "West Germany": "de",
  Yugoslavia: "rs",
  Zaire: "cd",
};

const PLACEHOLDER_PATTERN = /^(?:[12][A-L]|3[A-Z/]+|W\d+|L\d+)$/;

export function isPlaceholderTeam(team: string): boolean {
  return PLACEHOLDER_PATTERN.test(team);
}

export function getTeamFlagCode(team: string): string | null {
  if (isPlaceholderTeam(team)) return null;
  return TEAM_FLAG_CODES[team] ?? null;
}

export function getFlagCdnUrl(code: string, width = 40): string {
  const normalized = code.toLowerCase();
  if (width <= 24) {
    return `https://flagcdn.com/24x18/${normalized}.png`;
  }
  if (width <= 40) {
    return `https://flagcdn.com/w40/${normalized}.png`;
  }
  return `https://flagcdn.com/w80/${normalized}.png`;
}

export function getTeamFlagUrl(team: string, width = 40): string | null {
  const code = getTeamFlagCode(team);
  if (!code) return null;
  return getFlagCdnUrl(code, width);
}
