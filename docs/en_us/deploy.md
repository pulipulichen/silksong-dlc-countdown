# Deployment and local testing

[English](./deploy.md) · [繁體中文](../zh_tw/deploy.md)

## Automatic deployment with GitHub Actions

Publishing the website does not require Node.js, npm, or a local build. Every push to `main` starts the [Deploy to GitHub Pages workflow](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml) on a GitHub-hosted runner. The workflow:

1. Checks out the repository and sets up Node.js 22.
2. Installs npm dependencies.
3. Runs `npm run build` (TypeScript checking, the Vite production build, and generated social-preview and app-icon assets).
4. Verifies the output and deploys `dist/` to GitHub Pages.

For the first deployment, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The workflow checks this setting and fails with instructions if Pages is configured for branch publishing. You can also start a deployment manually from **Actions → Deploy to GitHub Pages → Run workflow**.

Live site: <https://pulipulichen.github.io/silksong-dlc-countdown/>

## Local production preview with Podman

Local testing is optional. To build and serve the production site in containers without installing Node.js or npm on the host, run from the repository root:

```sh
podman build -t silksong-dlc-countdown -f Containerfile .
podman run --rm -p 8080:80 silksong-dlc-countdown
```

Open <http://localhost:8080/silksong-dlc-countdown/>. Stop the container with **Ctrl+C**.

## Vite hot reload with Podman

For a development server that refreshes as source files change, run this from the repository root:

```sh
./start.sh
```

Podman is required. The script builds the development image and mounts the source directories into the container. Open <http://localhost:8080/silksong-dlc-countdown/> and press **Ctrl+C** to stop the server.

The project does not define a separate `npm test` script; `npm run build` runs the TypeScript check and production build used by deployment.

For source-level date and DLC settings, see [Countdown dates and DLC configuration](./configuration.md). For Android App Bundles, see [Google Play AAB configuration](./google_play.md).
