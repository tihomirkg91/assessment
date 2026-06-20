## React Compiler

This project uses the **React Compiler** (`babel-plugin-react-compiler`), which automatically
memoizes components, hooks, and values at build time.

This project uses **Biome** for formatting and linting.

## Scripts

npm i
npm start # dev server at http://localhost:3000
npm run build # production build
npm run preview # preview the production build
npm test # run unit tests (vitest run)
npm run test:watch # run tests in watch mode
npm run check # type-check + lint + format check
npm run lint # run Biome linter
npm run lint:fix # run Biome linter and auto-fix
npm run format # format all files with Biome
npm run format:check # check formatting with Biome
npm run reset # clean node_modules, lock file, cache, and reinstall
