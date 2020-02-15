declare class ObjectID64 {
  constructor(base?: string);
  public encode(id: string): string;
  public decode(id: string): string;
}

export default function objectid64(base?: string): ObjectID64;