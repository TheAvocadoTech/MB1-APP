export type RFIDReader = {
  sequence: number;
  id: number;
  ip?: string;
  sr?: string;
  ser?: string;
  location: string;
  port?: number;
  isWaypoint?: boolean;
  coords: {
    x: number;
    y: number;
  };
};