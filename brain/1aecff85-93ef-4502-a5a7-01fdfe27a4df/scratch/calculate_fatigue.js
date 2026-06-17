const scores = [15, 34, 29, 55, 14, 156, 220, 55, 23, 10, 15, 167, 109, 88, 72, 15, 220, 398, 13, 498, 45];

function roundToTwoDecimals(value) {
  return Math.round(value * 100) / 100;
}

function roundToThreeDecimals(value) {
  return Math.round(value * 1000) / 1000;
}

function simulate(catId) {
  let short = 3.0;
  let long = 2.5;
  
  const R = 65; // Neutral recuperation skill
  const multiplier = 1.0; 
  const decayMultiplier = 1.0; 
  
  let consecutiveNonRaceDays = 0;
  
  let history = [];
  
  // Start state
  history.push({
    event: 'Start',
    stage: 0,
    score: '-',
    short: roundToTwoDecimals(short),
    long: roundToTwoDecimals(long)
  });

  for (let i = 0; i < scores.length; i++) {
    const stageNum = i + 1;
    const score = scores[i];
    
    // 1. Day Advance (Decay)
    let recoveryShort = 0.2 * decayMultiplier;
    let recoveryLong = 0.01 * decayMultiplier;
    
    let shortTermMult = 1.0;
    let longTermMult = 1.0;
    
    if (i === 0) {
      consecutiveNonRaceDays = 1;
      shortTermMult = 1.25;
      longTermMult = 1.15;
    } else {
      consecutiveNonRaceDays = 0;
      const prevScore = scores[i - 1];
      if (prevScore < 10) {
        shortTermMult = 1.20;
        longTermMult = 1.10;
      } else if (prevScore < 25) {
        shortTermMult = 1.15;
        longTermMult = 1.05;
      } else if (prevScore < 50) {
        shortTermMult = 1.05;
        longTermMult = 1.00;
      } else {
        shortTermMult = 1.00;
        longTermMult = 1.00;
      }
    }
    
    recoveryShort *= shortTermMult;
    recoveryLong *= longTermMult;
    
    short = Math.max(0.0, short - recoveryShort);
    long = Math.max(0.0, long - recoveryLong);
    
    short = roundToThreeDecimals(short);
    long = roundToThreeDecimals(long);
    
    history.push({
      event: `Etappe ${stageNum} Morgen (Decay)`,
      stage: stageNum,
      score: '-',
      short: roundToTwoDecimals(short),
      long: roundToTwoDecimals(long)
    });
    
    // 2. Stage Fatigue buildup
    if (stageNum === 1) {
      short = roundToTwoDecimals(short + 0.5);
      long = roundToTwoDecimals(long + 0.05);
      
      history.push({
        event: `Etappe 1 Transfer`,
        stage: 1,
        score: '-',
        short: roundToTwoDecimals(short),
        long: roundToTwoDecimals(long)
      });
    }
    
    let addedShort = score >= 10 ? (score / 100) * 0.75 * multiplier : 0;
    let addedLong = score >= 10 ? (score / 1000) * 0.75 * multiplier : 0;
    
    let shortMult = 1.0;
    let longMult = 1.0;
    
    if (catId === 6 || catId === 9) {
      shortMult = 0.9;
      longMult = 0.9;
    } else if (catId === 5 || catId === 8) {
      shortMult = 0.95;
      longMult = 1.0;
    } else if (catId === 4 || catId === 7) {
      shortMult = 1.0;
      longMult = 1.1;
    } else if (catId === 3) {
      shortMult = 1.15;
      longMult = 1.25;
    } else if (catId === 2) {
      shortMult = 1.1;
      longMult = 1.15;
    } else if (catId === 1) {
      shortMult = 1.15;
      longMult = 1.3;
    }
    
    addedShort *= shortMult;
    addedLong *= longMult;
    
    // Limits
    let shortLimit = 2.5;
    let longLimit = 0.3;
    if (catId === 1 || catId === 3) {
      shortLimit = 3.0;
      longLimit = 0.4;
    } else if (catId === 2) {
      shortLimit = 2.8;
      longLimit = 0.35;
    } else if (catId === 4 || catId === 7) {
      shortLimit = 2.7;
      longLimit = 0.33;
    }
    
    addedShort = Math.min(shortLimit, addedShort);
    addedLong = Math.min(longLimit, addedLong);
    
    addedShort = roundToTwoDecimals(addedShort);
    addedLong = roundToTwoDecimals(addedLong);
    
    short = roundToTwoDecimals(short + addedShort);
    long = roundToTwoDecimals(long + addedLong);
    
    history.push({
      event: `Etappe ${stageNum} Abend (Build)`,
      stage: stageNum,
      score: score,
      short: roundToTwoDecimals(short),
      long: roundToTwoDecimals(long)
    });
  }
  
  // 3. Final Decay (Morning after Stage 21)
  let recoveryShort = 0.2 * decayMultiplier;
  let recoveryLong = 0.01 * decayMultiplier;
  
  let shortTermMult = 1.0;
  let longTermMult = 1.0;
  
  const lastScore = scores[scores.length - 1];
  if (lastScore < 10) {
    shortTermMult = 1.20;
    longTermMult = 1.10;
  } else if (lastScore < 25) {
    shortTermMult = 1.15;
    longTermMult = 1.05;
  } else if (lastScore < 50) {
    shortTermMult = 1.05;
    longTermMult = 1.00;
  } else {
    shortTermMult = 1.00;
    longTermMult = 1.00;
  }
  
  recoveryShort *= shortTermMult;
  recoveryLong *= longTermMult;
  
  short = Math.max(0.0, short - recoveryShort);
  long = Math.max(0.0, long - recoveryLong);
  
  short = roundToThreeDecimals(short);
  long = roundToThreeDecimals(long);
  
  history.push({
    event: `Rundfahrt-Ende Morgen (Decay)`,
    stage: 22,
    score: '-',
    short: roundToTwoDecimals(short),
    long: roundToTwoDecimals(long)
  });
  
  return history;
}

function printMarkdown(history) {
  console.log('| Ereignis / Event | Etappe | Stage Score | Kurzzeit (Short) | Langzeit (Long) | Gesamt (Combined) |');
  console.log('| --- | --- | --- | --- | --- | --- |');
  for (const h of history) {
    const combined = roundToTwoDecimals(h.short + h.long);
    console.log(`| ${h.event} | ${h.stage} | ${h.score} | ${h.short.toFixed(2)} | ${h.long.toFixed(2)} | ${combined.toFixed(2)} |`);
  }
}

console.log("### Category 1: World Tour - Tour de France (shortLimit=3.0, longLimit=0.4)\n");
printMarkdown(simulate(1));

console.log("\n### Category 2: World Tour - Grand Tour (shortLimit=2.8, longLimit=0.35)\n");
printMarkdown(simulate(2));

console.log("\n### Category 4: World Tour - Stage Race High (shortLimit=2.7, longLimit=0.33)\n");
printMarkdown(simulate(4));

console.log("\n### Category 5: Rest / Other Categories (shortLimit=2.5, longLimit=0.3)\n");
printMarkdown(simulate(5));
