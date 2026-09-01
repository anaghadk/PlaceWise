const fs = require('fs');

const raw = fs.readFileSync('src/data/placementRecordsRaw.csv', 'utf8');

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse considering quotes
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const c = line[charIdx];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += c;
      }
    }
    fields.push(current.trim());
    
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = fields[idx] || '';
    });
    rows.push(row);
  }
  return rows;
}

const rows = parseCSV(raw);
console.log('Total rows parsed:', rows.length);

const batchYears = [...new Set(rows.map(r => r.batch_year))].sort();
console.log('Batch years:', batchYears);

const statuses = [...new Set(rows.map(r => r.status))];
console.log('Statuses:', statuses);

const byYear = {};
batchYears.forEach(y => {
  byYear[y] = {
    total: 0,
    onCampus: 0,
    offCampusHigherStudies: 0,
    notPlaced: 0,
    companies: {},
    offersCount: 0,
    multipleOffersStudents: 0
  };
});

const companyOfferMap = {};

rows.forEach(r => {
  const y = r.batch_year;
  byYear[y].total++;
  if (r.status === 'On-Campus') byYear[y].onCampus++;
  else if (r.status.includes('Off-Campus') || r.status.includes('Higher Studies') || r.status.includes('Entrepreneur')) byYear[y].offCampusHigherStudies++;
  else if (r.status === 'Not Placed') byYear[y].notPlaced++;

  if (r.details) {
    const comps = r.details.split(';').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    if (r.status === 'On-Campus') {
      if (comps.length > 1) byYear[y].multipleOffersStudents++;
      byYear[y].offersCount += comps.length;
      comps.forEach(c => {
        const cleanName = c.replace(/\s*\([^)]*\)/g, '').trim(); // e.g. "Akamai (PPO)" -> "Akamai"
        byYear[y].companies[cleanName] = (byYear[y].companies[cleanName] || 0) + 1;
        companyOfferMap[cleanName] = (companyOfferMap[cleanName] || 0) + 1;
      });
    }
  }
});

console.log('Summary by Year:');
Object.entries(byYear).forEach(([y, data]) => {
  const placedTotal = data.onCampus + data.offCampusHigherStudies;
  const placementRate = ((placedTotal / data.total) * 100).toFixed(1);
  console.log(`Year ${y}: Total=${data.total}, OnCampus=${data.onCampus}, OffCampus/HS=${data.offCampusHigherStudies}, NotPlaced=${data.notPlaced}, Rate=${placementRate}%, TotalOffers=${data.offersCount}, MultiOfferStudents=${data.multipleOffersStudents}`);
});

const sortedCompanies = Object.entries(companyOfferMap).sort((a,b) => b[1] - a[1]);
console.log('\nTop 20 Recruiters overall:');
sortedCompanies.slice(0, 20).forEach(([c, count]) => {
  console.log(`  ${c}: ${count} offers`);
});
