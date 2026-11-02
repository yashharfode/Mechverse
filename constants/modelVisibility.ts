/**
 * Model Visibility Configuration for Localhost & Presentation
 * Toggle these flags to true/false to instantly hide or unhide models
 * across the Navbar, Catalog, 3D Explorer, and AR view.
 */

// Set to true to hide on localhost; switch to false when unhiding
export const HIDE_ROPEWAY_ROBOT = true;
export const HIDE_RACING_BOT = true;

export function isModelVisible(machineId: string): boolean {
  if (HIDE_ROPEWAY_ROBOT && machineId === "ropeway-robot") {
    return false;
  }
  if (HIDE_RACING_BOT && (machineId === "robo-racer" || machineId === "racing")) {
    return false;
  }
  return true;
}
