// Re-export from the compiled JS file (source was deleted during refactoring).
// The dist version is used because its internal requires resolve within the dist tree.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GameRepository } = require('../../dist/backend/src/db/GameRepository.js') as { GameRepository: any };
export { GameRepository };
