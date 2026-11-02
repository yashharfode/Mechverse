import { DesignLabConfiguration } from "@/types/design-lab";

const STORAGE_KEY = "mechverse_design_lab_saved_configs_v1";

export function getSavedDesigns(): DesignLabConfiguration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load saved designs from localStorage:", err);
    return [];
  }
}

export function saveDesign(config: DesignLabConfiguration): DesignLabConfiguration {
  if (typeof window === "undefined") return config;
  try {
    const saved = getSavedDesigns();
    const now = new Date().toISOString();
    const configId = config.id || `design_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const updatedConfig: DesignLabConfiguration = {
      ...config,
      id: configId,
      updatedAt: now,
      createdAt: config.createdAt || now,
    };

    const existingIndex = saved.findIndex((s) => s.id === configId);
    let newSaved: DesignLabConfiguration[];
    if (existingIndex >= 0) {
      newSaved = [...saved];
      newSaved[existingIndex] = updatedConfig;
    } else {
      newSaved = [updatedConfig, ...saved];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
    return updatedConfig;
  } catch (err) {
    console.error("Failed to save design to localStorage:", err);
    return config;
  }
}

export function deleteDesign(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const saved = getSavedDesigns();
    const filtered = saved.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to delete design from localStorage:", err);
  }
}

export function exportDesignJSON(config: DesignLabConfiguration): void {
  if (typeof window === "undefined") return;
  try {
    const exportData = {
      mechverseDesignLab: true,
      exportedAt: new Date().toISOString(),
      schemaVersion: "1.0.0",
      configuration: {
        ...config,
        metadata: {
          platform: "Mechverse Design Lab",
          author: "Makerspace Engineer",
          units: "Metric (mm / grams)",
        },
      },
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `${config.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_config.json`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to export design JSON:", err);
  }
}
