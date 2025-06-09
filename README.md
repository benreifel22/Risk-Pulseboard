# Risk Pulseboard

This project tracks notable sanctions and tariff events from public feeds. Items are scored for severity and client exposure, aggregated by ISO week and displayed on a simple dashboard.

**Live site:** https://<USER>.github.io/<REPO>/ (enable GitHub Pages on `main` / root).

## Development

```bash
npm install
npm start
```

Open `http://localhost:3000` to preview.

## Customisation
- Edit `fetchFeeds.mjs` to add RSS feeds.
- Tweak scoring keywords in `impact.js`.
- Update `clientExposure.json` to match HS codes or countries relevant to you.
