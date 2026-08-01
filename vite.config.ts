import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { webHub, type WebHubProductionOptions } from "@webhub/vite-plugin";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

function productionOptions(): WebHubProductionOptions | undefined {
  const values = {
    projectId: process.env.WEBHUB_PROJECT_ID,
    deploymentId: process.env.WEBHUB_DEPLOYMENT_ID,
    repositoryRevision: process.env.WEBHUB_REPOSITORY_REVISION,
    publicOrigins: process.env.WEBHUB_PUBLIC_ORIGINS,
    idSecret: process.env.WEBHUB_INSTRUMENTATION_SECRET,
  };
  if (Object.values(values).every((value) => value === undefined))
    return undefined;

  const missing = Object.entries(values)
    .filter(([, value]) => value === undefined || value.length === 0)
    .map(([name]) => name);
  if (missing.length > 0) {
    throw new Error(
      `Incomplete WebHub production configuration: ${missing.join(", ")}`,
    );
  }

  const environment = process.env.WEBHUB_DEPLOYMENT_ENVIRONMENT ?? "production";
  if (
    !(<const>["preview", "staging", "production"]).includes(
      environment as never,
    )
  ) {
    throw new Error(
      "WEBHUB_DEPLOYMENT_ENVIRONMENT must be preview, staging, or production",
    );
  }

  return {
    projectId: values.projectId!,
    deploymentId: values.deploymentId!,
    repositoryRevision: values.repositoryRevision!,
    publicOrigins: values
      .publicOrigins!.split(",")
      .map((origin) => origin.trim()),
    idSecret: values.idSecret!,
    repositoryRoot: projectRoot,
    environment: environment as NonNullable<
      WebHubProductionOptions["environment"]
    >,
    ...(process.env.WEBHUB_PRIVATE_MANIFEST
      ? { manifestPath: process.env.WEBHUB_PRIVATE_MANIFEST }
      : {}),
    includeInspectTargets: process.env.WEBHUB_INCLUDE_INSPECT_TARGETS === "1",
  };
}

const production = productionOptions();

export default defineConfig({
  plugins: [
    react(),
    webHub({
      projectRoot,
      manifestPath: ".webhub/targets.json",
      developer: true,
      collaborator: true,
      instrumentBuild: process.env.WEBHUB_INSTRUMENT_BUILD === "1",
      editableFiles: /^src\//,
      ...(production ? { production } : {}),
    }),
  ],
  server: {
    host: "127.0.0.1",
    port: 4175,
  },
  preview: {
    host: "127.0.0.1",
    port: 4175,
  },
});
