# WebHub pilot packages

These archives are the unpublished WebHub 0.2.0 build dependencies used by the controlled Travel
Agency pilot. They were generated from WebHub commit `f91273f` after `npm run build:packages` and
are committed so clean GitHub and Vercel checkouts do not depend on a sibling working directory.

| Archive                            | SHA-256                                                            |
| ---------------------------------- | ------------------------------------------------------------------ |
| `webhub-instrumentation-0.2.0.tgz` | `a7b73aa00567acfc07b2d5ec56304245681634ccd280ff21debc989ac5eaffac` |
| `webhub-protocol-0.2.0.tgz`        | `c1fe2045456a7a42185271982dba84d713ca3fb2e7a22aa0247fc2fba2beaeb9` |
| `webhub-vite-plugin-0.2.0.tgz`     | `d6cc83e1a14b81ee858a0f2efff28dfb9928107816621ae80ef2adb632ba86c1` |

The archives contain only each package's declared distributable files. Regenerate all three from
the same reviewed WebHub revision, update the hashes above, and repeat a clean `npm ci` plus build
before replacing them. Do not copy a private deployment manifest or instrumentation secret here.
