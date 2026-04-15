# drb99-web

Frontend for generating npm packaging scaffolds for Go CLIs.

## Getting Started

Install dependencies and start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To point the UI at the backend, set `NEXT_PUBLIC_API_BASE_URL` before starting the app.

Example:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 pnpm dev
```

## Scripts

- `pnpm dev`: start the Next.js app in development mode
- `pnpm build`: build the production app
- `pnpm start`: run the production build
- `pnpm lint`: run ESLint

## Project Structure

- `app/`: routes and page-level UI
- `components/`: reusable form and UI primitives
- `lib/`: API, platform mapping, and shared utilities

## Notes

- The app uses the Next.js App Router.
- Framework-specific changes should follow the local docs in `node_modules/next/dist/docs/`.
