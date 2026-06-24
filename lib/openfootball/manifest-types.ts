export interface WorldCupEditionMeta {
  year: number;
  hosts: string;
  name: string;
}

export interface WorldCupYearsManifest {
  generatedAt: string;
  years: WorldCupEditionMeta[];
}
