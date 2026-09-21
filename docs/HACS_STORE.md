# HACS distribution for the Moran fork

Status: custom-repository distribution only. This fork is intentionally not submitted as a second
copy of the upstream card in the default HACS store.

The active pilot is a dated local HA resource, not a claim that a current HACS release is
published or installation-tested. The procedure below applies only to an explicitly scoped
release. Ordinary milestone pushes do not authorize tags, releases or store submission.

## Install from the custom repository

1. Open HACS.
2. Open the three-dot menu and select **Custom repositories**.
3. Add `https://github.com/emilianomoran/moran-family-board-card` with category **Dashboard**.
4. Install **Moran Family Board Card**.

HACS installs `moran-family-board-card.js`. The card type is:

```yaml
type: custom:moran-family-board-card
```

The distinct repository, bundle, and custom-element names allow the upstream Family Board Card and
this fork to coexist during evaluation.

## Release checklist

1. Run `npm ci`.
2. Run `npm run format:check`, `npm run lint`, `npm test`, and `npm run build`.
3. Confirm `dist/moran-family-board-card.js` is the only release bundle.
4. Tag a tested Moran version such as `v0.25.1-moran.1`.
5. Publish a GitHub release. `.github/workflows/release.yml` attaches the bundle automatically.
6. Install the release through HACS in a non-primary test dashboard before changing a production
   wall display.

Do not commit household configuration, entity IDs, credentials, or Calendar Bridge connection
details to this public repository.
