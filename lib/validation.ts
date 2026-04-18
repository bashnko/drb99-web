import type { GoReleaseFormData } from "@/components/forms/go-release-form";
import type { NpmWrapperFormData } from "@/components/forms/npm-wrapper-form";

const GITHUB_REPO_PATTERN =
  /^(https?:\/\/github\.com\/|github\.com\/|git@github\.com:)[^/\s]+\/[^/\s]+(?:\.git)?\/?$/i;

const CLI_NAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;
const VERSION_PATTERN = /^v?\d+\.\d+\.\d+(?:[-+][a-zA-Z0-9.-]+)?$/;
const NPM_PACKAGE_NAME_PATTERN = /^(?:@[^/\s]+\/)?[a-z0-9][a-z0-9._-]*$/;

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateGithubRepoUrl(value: string) {
  const repoUrl = value.trim();

  if (!repoUrl) {
    return "Repository URL is required.";
  }

  if (!GITHUB_REPO_PATTERN.test(repoUrl)) {
    return "Invalid GitHub URL — double-check what you entered. It should look like `https://github.com/owner/repo`.";
  }

  return null;
}

function validateBinaryName(value: string, label: string) {
  const binaryName = value.trim();

  if (!binaryName) {
    return `${label} is required.`;
  }

  if (!CLI_NAME_PATTERN.test(binaryName)) {
    return `${label} can only use letters, numbers, dots, underscores, and hyphens.`;
  }

  return null;
}

function validatePlatforms(platforms: string[]) {
  if (platforms.length === 0) {
    return "Select at least one target platform.";
  }

  return null;
}

export function validateGoReleaseForm(data: GoReleaseFormData) {
  return (
    validateGithubRepoUrl(data.repoUrl) ??
    validateBinaryName(data.binaryName, "Binary name") ??
    validatePlatforms(data.platforms)
  );
}

export function validateNpmWrapperForm(data: NpmWrapperFormData) {
  const baseError =
    validateGithubRepoUrl(data.repoUrl) ??
    validateBinaryName(data.cliCommandName, "Binary name") ??
    validatePlatforms(data.platforms);

  if (baseError) {
    return baseError;
  }

  const version = data.version.trim();
  if (!version) {
    return "Version is required for the npm wrapper workflow.";
  }

  if (!VERSION_PATTERN.test(version)) {
    return "Enter a version like `1.0.0` or `v1.0.0`.";
  }

  const packageName = data.packageName.trim();
  if (!packageName) {
    return "Package name is required for the npm wrapper workflow.";
  }

  if (!NPM_PACKAGE_NAME_PATTERN.test(packageName)) {
    return "Enter a valid npm package name (lowercase, optionally scoped like `@scope/name`).";
  }

  for (const platform of data.platforms) {
    const assetUrl = data.assetUrls[platform]?.trim();

    if (!assetUrl) {
      return `Add an asset URL for ${platform}.`;
    }

    if (!isValidUrl(assetUrl)) {
      return `Enter a valid http or https asset URL for ${platform}.`;
    }
  }

  return null;
}
