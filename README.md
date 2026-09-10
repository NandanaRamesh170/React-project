# Loop | Activity Points Management

A React front end for managing student co-curricular and extra-curricular activity points. The app uses local JSON files as its data source and keeps newly submitted activities in browser session state.

## Run locally

```bash
npm install
npm run dev
```

## Demo login

- UID: `STU2024001`
- Password: `activity123`

## Build for GitHub Pages

The Vite base path is set to `/React-project/`. Update that value in `vite.config.js` if the repository name changes, then run `npm run build`.

For deployment, push the project to GitHub and enable the included GitHub Actions workflow. It publishes the `dist` folder to GitHub Pages on every push to `main`. The app uses hash navigation so client routes remain accessible on Pages.
