const scores = [5, 10, 25, 50, 100, 200, 300, 400, 500, 600];

function roundToTwoDecimals(value) {
  return Math.round(value * 100) / 100;
}

function calculateBuildup(score, catId) {
  if (score < 10) {
    return { short: 0, long: 0 };
  }
  
  const multiplier = 1.0; // R = 65
  let addedShort = (score / 100) * 0.75 * multiplier;
  let addedLong = (score / 1000) * 0.75 * multiplier;
  
  let shortMult = 1.0;
  let longMult = 1.0;
  
  if (catId === 1) {
    shortMult = 1.15;
    longMult = 1.3;
  } else if (catId === 2) {
    shortMult = 1.1;
    longMult = 1.15;
  } else if (catId === 4) {
    shortMult = 1.0;
    longMult = 1.1;
  } else if (catId === 5) {
    shortMult = 0.95;
    longMult = 1.0;
  } else if (catId === 6) {
    shortMult = 0.9;
    longMult = 0.9;
  }
  
  addedShort *= shortMult;
  addedLong *= longMult;
  
  addedShort = Math.min(4.0, addedShort);
  
  return {
    short: roundToTwoDecimals(addedShort),
    long: roundToTwoDecimals(addedLong)
  };
}

console.log("### Tour de France (Cat 1)");
for (const s of scores) {
  const b = calculateBuildup(s, 1);
  console.log(`| Score: ${s} | Short: +${b.short.toFixed(2)} | Long: +${b.long.toFixed(2)} |`);
}

console.log("\n### Grand Tour (Cat 2)");
for (const s of scores) {
  const b = calculateBuildup(s, 2);
  console.log(`| Score: ${s} | Short: +${b.short.toFixed(2)} | Long: +${b.long.toFixed(2)} |`);
}

console.log("\n### Stage Race High (Cat 4)");
for (const s of scores) {
  const b = calculateBuildup(s, 4);
  console.log(`| Score: ${s} | Short: +${b.short.toFixed(2)} | Long: +${b.long.toFixed(2)} |`);
}
