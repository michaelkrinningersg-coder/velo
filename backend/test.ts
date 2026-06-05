import { DatabaseService } from './src/db/DatabaseService';
import { GameStateService } from './src/game/GameStateService';
import { bootstrap } from './src/bootstrapper';

async function run() {
  console.log('Bootstrapping...');
  bootstrap(true);
  const dbService = new DatabaseService();
  const db = dbService.getActiveConnection();
  const gss = new GameStateService(db);
  gss.ensureState();

  let state = gss.loadState();
  console.log(`Initial state: ${state.currentDate}, season: ${state.currentSeason}`);

  console.log('Advancing to next season...');
  while (state.currentDate < '2027-01-02') {
    state = gss.advanceDay();
    if (state.currentDate.endsWith('-12-31') || state.currentDate.endsWith('-01-01')) {
      console.log(`Advanced to: ${state.currentDate}`);
    }
  }

  console.log(`Final state: ${state.currentDate}, season: ${state.currentSeason}`);

  // check if rider_skill_yearly_baseline has rows
  const baselineCount = db.prepare('SELECT COUNT(*) as c FROM rider_skill_yearly_baseline').get() as { c: number };
  console.log(`Baseline rows: ${baselineCount.c}`);

  // check if newgens are there
  const riders = db.prepare('SELECT COUNT(*) as c FROM riders').get() as { c: number };
  console.log(`Total riders: ${riders.c}`);

  // wait, what is the initial count of riders? Let's check.
  const dbMaster = dbService.getMasterConnection();
  const initialRiders = dbMaster.prepare('SELECT COUNT(*) as c FROM riders').get() as { c: number };
  console.log(`Initial master riders: ${initialRiders.c}`);

  if (riders.c > initialRiders.c && baselineCount.c > 0) {
    console.log('SMOKE TEST PASSED');
  } else {
    console.log('SMOKE TEST FAILED');
  }
}

run().catch(console.error);
