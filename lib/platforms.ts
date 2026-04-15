export const PLATFORM_OPTIONS = [
  { id: "linux", label: "Linux" },
  { id: "darwin", label: "macOS" },
  { id: "windows", label: "Windows" },
] as const;

export type PlatformId = (typeof PLATFORM_OPTIONS)[number]["id"];

const PLATFORM_NAME_MAP: Record<PlatformId, string> = {
  linux: "linux-amd64",
  darwin: "darwin-arm64",
  windows: "windows-amd64",
};

export function mapPlatform(platformId: string): string {
  return PLATFORM_NAME_MAP[platformId as PlatformId] ?? platformId;
}

export function mapPlatformsList(platformIds: string[]): string[] {
  return platformIds.map(mapPlatform);
}
