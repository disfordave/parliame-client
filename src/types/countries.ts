import { Party } from "./party";

export interface Country {
  name: string;
  emoji?: string;
  parties: Party[];
}
