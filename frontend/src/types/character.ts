export interface Trait {
  id: string;
  title: string;
  description: string;
}

export interface BackgroundFeature {
  id: string;
  title: string;
  description: string;
}

export interface ClassFeature {
  id: string;
  title: string;
  description: string;
  level: number;
}

export interface Species {
  id: string;
  name: string;
  traits: Trait[];
}

export interface Background {
  id: string;
  name: string;
  features: BackgroundFeature[];
}

export interface CharacterClass {
  id: string;
  name: string;
  hitDie: string;
  features: ClassFeature[];
}

export interface Skill {
  name: string;
  ability: string;
  proficiency: 'none' | 'proficient' | 'expertise' | 'jack-of-all-trades';
  other: number;
}

export interface Character {
  id: number;
  name: string;
  species: Species;
  background: Background;
  characterClass: CharacterClass;
  level: number;
  temporaryHp: number;
  currentHp: number;
  maxHp: number;
  speed: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  strengthModifier: number;
  dexterityModifier: number;
  constitutionModifier: number;
  intelligenceModifier: number;
  wisdomModifier: number;
  charismaModifier: number;
  coins: string;
  items: string;
  details: string;
  skills: Skill[] | string;
  createdAt: string;
} 