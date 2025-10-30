export interface GW2Account {
  id: string;
  name: string;
  age: number;
  world: number;
  guilds: string[];
  guild_leader: string[];
  created: string;
  access: string[];
  commander: boolean;
  fractal_level: number;
  daily_ap: number;
  monthly_ap: number;
  wvw_rank: number;
}

export interface GW2Character {
  name: string;
  race: string;
  gender: string;
  profession: string;
  level: number;
  guild?: string;
  age: number;
  created: string;
  deaths: number;
  title?: number;
}

export interface GW2TokenInfo {
  id: string;
  name: string;
  permissions: string[];
}

export interface GW2ApiError {
  text: string;
}
