# Security policy

## Dependency checks

Run the CI-equivalent dependency check with:

```sh
bun audit --audit-level=moderate
```

The lockfile currently has no moderate, high, or critical advisories.

## Accepted low-severity advisory

Astro 6.4.8 currently resolves `esbuild` 0.27.x through its supported dependency range. That version is affected by [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr), an arbitrary-file-read issue involving the development server on Windows.

The generated production site is static, and the template does not expose the development server publicly. Do not bind the development server to untrusted networks. The project will remove this exception when Astro's supported dependency range includes `esbuild` 0.28.1 or newer; forcing an unsupported override is intentionally avoided.

## Reporting

Do not publish suspected vulnerabilities in a public issue. Use GitHub private vulnerability reporting when it is available, or contact the repository owner privately.
