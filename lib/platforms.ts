export const mapPlatform = (platformId: string): string => {
  switch (platformId) {
    case "linux":
      return "linux-amd64";
    case "darwin":
      return "darwin-arm64";
    case "windows":
      return "windows-amd64";
    default:
      return platformId;
  }
};

export const mapPlatformsList = (platformIds: string[]): string[] => {
  return platformIds.map(mapPlatform);
};
