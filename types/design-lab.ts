export type DesignLabTemplateId =
  | "f450-quadcopter"
  | "rover-bot"
  | "walking-robot"
  | "table-fan";

export interface DesignComponentItem {
  id: string;
  name: string;
  category: string;
  isOptional?: boolean;
}

export interface DesignLabTemplate {
  id: DesignLabTemplateId;
  name: string;
  subtitle: string;
  category: string;
  badge: string;
  imageUrl: string;
  availableColors: { name: string; hex: string }[];
  availableMotors: { id: string; label: string; kv?: number; power?: string }[];
  availableCameras: { id: string; label: string }[];
  toggleOptions: { id: string; label: string; icon: string; defaultVal: boolean }[];
  components: DesignComponentItem[];
  defaultConfig: DesignLabConfiguration;
}

export interface DesignLabConfiguration {
  id?: string;
  name: string;
  templateId: DesignLabTemplateId;
  frameColor: string;
  accentColor?: string;
  motorType: string;
  cameraType: string;
  options: Record<string, boolean>; // e.g. gpsModule: true, cameraMount: true
  hiddenComponents: string[];
  selectedComponentId: string | null;
  dimensions?: {
    widthMm: number;
    heightMm: number;
    weightGrams: number;
  };
  createdAt: string;
  updatedAt: string;
  version: string;
}
