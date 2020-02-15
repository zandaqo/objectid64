interface LookUpTable {
  [propName: string]: string;
}

declare class ObjectID64 {
  private hexToBase: LookUpTable;
  private baseToHex: LookUpTable;
  private static hexToBase: LookUpTable;
  private static baseToHex: LookUpTable;
  private static base: string;

  constructor(base?: string);
  encode(id: string): string;
  decode(id: string): string;
  static fillDictionaries(characters?: string): [LookUpTable, LookUpTable];
}

export default function objectid64(base?: string): ObjectID64;