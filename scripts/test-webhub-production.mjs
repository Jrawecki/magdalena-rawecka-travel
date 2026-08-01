#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { DeploymentManifestSchema } from "@webhub/protocol";

const root = resolve(import.meta.dirname, "..");
const projectId = "travel_agency_fixture";
const deploymentId = "travel_agency_fixture_production";
const revision = "b".repeat(40);
const secret = randomBytes(48).toString("base64url");
const origin = "https://magdalena-rawecka-travel.vercel.app";
const manifestPath = join(
  root,
  ".webhub",
  "deployments",
  `${deploymentId}.manifest.json`,
);
const allowedProperties = new Set(["alt", "href", "title", "aria-label"]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

function textualOutput(directory) {
  return files(directory)
    .flatMap((path) => {
      const content = readFileSync(path);
      return content.includes(0) ? [] : [content.toString("utf8")];
    })
    .join("\n");
}

function cleanBuildEnvironment() {
  return Object.fromEntries(
    Object.entries(process.env).filter(([name]) => {
      const normalizedName = name.toUpperCase();
      return (
        !normalizedName.startsWith("WEBHUB_") &&
        !normalizedName.startsWith("VITE_WEBHUB_") &&
        !normalizedName.startsWith("NEXT_PUBLIC_WEBHUB_")
      );
    }),
  );
}

const fallbackNpmCli =
  process.platform === "win32"
    ? join(
        dirname(process.execPath),
        "node_modules",
        "npm",
        "bin",
        "npm-cli.js",
      )
    : undefined;
const npmCli = process.env.npm_execpath ?? fallbackNpmCli;
const npmExecutable = npmCli ? process.execPath : "npm";
const npmArguments = [...(npmCli ? [npmCli] : []), "run", "build"];

function runBuild(overrides = {}) {
  execFileSync(npmExecutable, npmArguments, {
    cwd: root,
    env: { ...cleanBuildEnvironment(), ...overrides },
    stdio: "inherit",
    windowsHide: true,
  });
}

runBuild();
const ordinaryFiles = files(join(root, "dist"));
const ordinaryOutput = textualOutput(join(root, "dist"));
assert(
  !ordinaryOutput.includes('name="webhub-project"'),
  "Ordinary build exposed WebHub deployment metadata.",
);
assert(
  !ordinaryOutput.includes("data-webhub-targets"),
  "Ordinary build exposed target markers.",
);
assert(
  !ordinaryOutput.includes("data-webhub-source"),
  "Ordinary build exposed source markers.",
);
assert(
  ordinaryFiles.every((path) => !path.endsWith(".map")),
  "Ordinary build contained source maps.",
);

runBuild({
  WEBHUB_PROJECT_ID: projectId,
  WEBHUB_DEPLOYMENT_ID: deploymentId,
  WEBHUB_REPOSITORY_REVISION: revision,
  WEBHUB_PUBLIC_ORIGINS: origin,
  WEBHUB_INSTRUMENTATION_SECRET: secret,
  WEBHUB_DEPLOYMENT_ENVIRONMENT: "production",
  WEBHUB_PRIVATE_MANIFEST: `.webhub/deployments/${deploymentId}.manifest.json`,
  WEBHUB_INCLUDE_INSPECT_TARGETS: "1",
});

const manifest = DeploymentManifestSchema.parse(
  JSON.parse(readFileSync(manifestPath, "utf8")),
);
const targets = Object.values(manifest.targets);
const sources = Object.values(manifest.sources);
assert(
  targets.length === 63,
  `Expected 63 approved targets, received ${targets.length}.`,
);
assert(
  sources.length === 99,
  `Expected 99 opaque source records, received ${sources.length}.`,
);
assert(
  Object.keys(manifest.fileHashes).length === 3,
  "Expected three hash-bound source files.",
);
assert(
  manifest.projectId === projectId,
  "Private manifest Project identity changed.",
);
assert(
  manifest.deploymentId === deploymentId,
  "Private manifest deployment identity changed.",
);
assert(
  manifest.repositoryRevision === revision,
  "Private manifest revision changed.",
);
assert(
  JSON.stringify(manifest.publicOrigins) === JSON.stringify([origin]),
  "Private manifest origin changed.",
);
assert(
  targets.every((record) =>
    /^t_[A-Za-z0-9_-]{24}$/u.test(record.summary.targetId),
  ),
  "A production target ID was not opaque.",
);
assert(
  sources.every((record) => /^s_[A-Za-z0-9_-]{24}$/u.test(record.sourceId)),
  "A production source ID was not opaque.",
);
assert(
  targets.every(
    (record) =>
      record.locator.syntaxKind === "jsx-text" ||
      (record.locator.syntaxKind === "jsx-attribute" &&
        allowedProperties.has(record.locator.propertyName)),
  ),
  "A target used an unsupported source kind or attribute.",
);

const privatePaths = new Set([
  ...targets.map((record) => record.locator.filePath),
  ...sources.map((record) => record.filePath),
  ...Object.keys(manifest.fileHashes),
]);
assert(
  [...privatePaths].every((path) => path.startsWith("src/")),
  "A private locator escaped the Travel Agency source root.",
);
for (const [filePath, digest] of Object.entries(manifest.fileHashes)) {
  const source = readFileSync(join(root, ...filePath.split("/")), "utf8");
  const expected = `sha256:${createHash("sha256").update(source, "utf8").digest("hex")}`;
  assert(digest === expected, `Private file hash did not match ${filePath}.`);
}

const publicFiles = files(join(root, "dist"));
assert(
  publicFiles.every((path) => !path.endsWith(".map")),
  "Instrumented public output contained source maps.",
);
const publicOutput = textualOutput(join(root, "dist"));
for (const forbidden of [
  ...privatePaths,
  root,
  root.replaceAll("\\", "/"),
  revision,
  secret,
  "repositoryRevision",
  "fileHashes",
  "syntaxKind",
  "templateLanguage",
  ".webhub/deployments",
]) {
  assert(
    !publicOutput.includes(forbidden),
    "Instrumented public output leaked private metadata.",
  );
}
for (const expected of [
  `name="webhub-project" content="${projectId}"`,
  `name="webhub-deployment" content="${deploymentId}"`,
  "data-webhub-targets",
  "data-webhub-source",
]) {
  assert(
    publicOutput.includes(expected),
    `Instrumented public output omitted ${expected}.`,
  );
}

const targetPattern = /data-webhub-targets(?:"\s*:\s*"|=")([A-Za-z0-9_-]+)"/gu;
const browserTargetIds = new Set();
let targetMatch;
while ((targetMatch = targetPattern.exec(publicOutput)) !== null) {
  const summaries = JSON.parse(
    Buffer.from(targetMatch[1], "base64url").toString("utf8"),
  );
  assert(
    Array.isArray(summaries) && summaries.length > 0,
    "A public marker was not a target array.",
  );
  for (const summary of summaries) {
    const allowedKeys = ["kind", "label", "propertyName", "targetId", "value"];
    assert(
      Object.keys(summary).every((key) => allowedKeys.includes(key)),
      "A public target summary contained a private field.",
    );
    assert(
      /^t_[A-Za-z0-9_-]{24}$/u.test(summary.targetId),
      "A browser target ID was not opaque.",
    );
    browserTargetIds.add(summary.targetId);
  }
}
assert(
  browserTargetIds.size === targets.length,
  `Public output exposed ${browserTargetIds.size} of ${targets.length} approved targets.`,
);

const sourcePattern =
  /data-webhub-source(?:"\s*:\s*"|=")(s_[A-Za-z0-9_-]{24})"/gu;
const browserSourceIds = new Set(
  [...publicOutput.matchAll(sourcePattern)].map((match) => match[1]),
);
const privateSourceIds = new Set(sources.map((record) => record.sourceId));
assert(
  browserSourceIds.size === privateSourceIds.size &&
    [...browserSourceIds].every((sourceId) => privateSourceIds.has(sourceId)),
  "Public inspect-source IDs did not exactly match the opaque private records.",
);

process.stdout.write(
  `Travel Agency production gate passed with ${targets.length} targets and ${sources.length} opaque source records.\n`,
);
