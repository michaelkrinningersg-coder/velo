import { RouteImporter } from './src/simulation/RouteImporter';

console.log('Starting profile...');
const start = Date.now();
const importer = new RouteImporter();

const stagesStart = Date.now();
const stages = importer.listExistingStages();
console.log(`listExistingStages took ${Date.now() - stagesStart}ms`);

const overviewStart = Date.now();
const overview = importer.listOverview();
console.log(`listOverview took ${Date.now() - overviewStart}ms`);

console.log('Finished profiling. Total:', Date.now() - start, 'ms');
