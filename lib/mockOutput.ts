export const mockResult = {
  workflow: "npm-wrapper",
  summary: {
    repo_url: "https://github.com/user/repo",
    binary_name: "mytool",
    version: "v1.0.0",
    platforms: [
      "linux-amd64",
      "darwin-arm64",
      "windows-amd64"
    ],
    asset_urls: {
      "linux-amd64": "https://example.com/linux",
      "darwin-arm64": "https://example.com/macos",
      "windows-amd64": "https://example.com/windows"
    }
  },
  files: {
    "README.md": "# mytool\n\nGenerated automatically.",
    "package.json": "{\n  \"name\": \"mytool-npm\",\n  \"version\": \"1.0.0\"\n}",
    "index.js": "console.log('run');",
    "install.js": "console.log('install');"
  }
} as const;
