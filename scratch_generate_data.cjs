const fs = require('fs');

const raw = fs.readFileSync('src/data/placementRecordsRaw.csv', 'utf8');

function cleanCompanyName(name) {
  let c = name.trim();
  c = c.replace(/\s*\([^)]*\)/g, '').trim();
  const upper = c.toUpperCase();
  if (upper.includes('ACCENTURE')) return 'Accenture';
  if (upper.includes('BOSCH') || upper.includes('RBEI')) return 'Robert Bosch';
  if (upper.includes('HPE') || upper.includes('HEWLETT')) return 'HPE';
  if (upper.includes('LTI') || upper.includes('L & TECHNOLOGY') || upper.includes('LTTS') || upper.includes('L&T TECHNOLOGY')) return 'LTI / L&T';
  if (upper.includes('AKAMAI')) return 'Akamai Technologies';
  if (upper.includes('DELOITTE')) return 'Deloitte';
  if (upper.includes('ORACLE')) return 'Oracle';
  if (upper.includes('CISCO')) return 'Cisco';
  if (upper.includes('WALMART')) return 'Walmart';
  if (upper.includes('SIEMENS')) return 'Siemens';
  if (upper.includes('HONEYWELL')) return 'Honeywell';
  if (upper.includes('KPMG')) return 'KPMG';
  if (upper.includes('MINDTREE')) return 'Mindtree';
  if (upper.includes('SHELL')) return 'Shell';
  if (upper.includes('SOCIETE')) return 'Société Générale';
  if (upper.includes('MERCEDES') || upper.includes('DAIMLER')) return 'Mercedes-Benz';
  if (upper.includes('WELLS FARGO')) return 'Wells Fargo';
  if (upper.includes('GOLDMAN')) return 'Goldman Sachs';
  if (upper.includes('MCKINSEY')) return 'McKinsey & Co.';
  if (upper.includes('CAPGEMINI')) return 'Capgemini';
  if (upper.includes('ACCOLITE')) return 'Accolite Digital';
  if (upper.includes('SABRE')) return 'Sabre';
  if (upper.includes('TCS') || upper.includes('TATA CONSULTANCY')) return 'TCS';
  if (upper.includes('QUALCOMM')) return 'Qualcomm';
  if (upper.includes('MICROCHIP')) return 'Microchip';
  if (upper.includes('TELSTRA')) return 'Telstra';
  if (upper.includes('SLING MEDIA')) return 'Sling Media';
  if (upper.includes('ENDURANCE')) return 'Endurance';
  if (upper.includes('WHATFIX')) return 'Whatfix';
  if (upper.includes('NUTANIX')) return 'Nutanix';
  if (upper.includes('COHESITY')) return 'Cohesity';
  if (upper.includes('SONY')) return 'Sony India';
  if (upper.includes('QUANTIPHI')) return 'Quantiphi';
  if (upper.includes('EY ') || upper === 'EY INDIA' || upper === 'EY GDS' || upper === 'EY BANGALORE') return 'EY';
  if (upper.includes('ZEBRA')) return 'Zebra Technologies';
  if (upper.includes('JUNIPER')) return 'Juniper Networks';
  if (upper.includes('LEANOVATE')) return 'Leanovate Solutions';
  if (upper.includes('PHILIPS')) return 'Philips';
  if (upper.includes('MATHWORKS')) return 'MathWorks';
  if (upper.includes('DAILY HUNT') || upper.includes('DAILYHUNT')) return 'Dailyhunt';
  if (upper.includes('PERFIOS')) return 'Perfios';
  if (upper.includes('LENDING')) return 'Lendingkart';
  if (upper.includes('RUBRIK')) return 'Rubrik';
  if (upper.includes('SPRINKLR') || upper.includes('SPRINKLER')) return 'Sprinklr';
  if (upper.includes('VISA')) return 'Visa';
  if (upper.includes('AMADEUS')) return 'Amadeus';
  if (upper.includes('UNISYS')) return 'Unisys';
  if (upper.includes('IBM')) return 'IBM';
  if (upper.includes('INFOSYS')) return 'Infosys';
  if (upper.includes('FIDELITY')) return 'Fidelity Investments';
  if (upper.includes('FINASTRA')) return 'Finastra';
  if (upper.includes('SANDVINE')) return 'Sandvine';
  if (upper.includes('ELLUCIAN')) return 'Ellucian';
  if (upper.includes('BMC')) return 'BMC Software';
  if (upper.includes('BLUEYONDER') || upper.includes('BLUE YONDER')) return 'Blue Yonder';
  if (upper.includes('TARGET')) return 'Target Corporation';
  if (upper.includes('PUBLICIS')) return 'Publicis Sapient';
  if (upper.includes('NETRADYNE')) return 'Netradyne';
  if (upper.includes('BOEING')) return 'Boeing';
  if (upper.includes('AIRASIA')) return 'AirAsia';
  if (upper.includes('KICKDRUM')) return 'Kickdrum';
  if (upper.includes('MAGNITUDE')) return 'Magnitude';
  if (upper.includes('GENISYS')) return 'Genisys Group';
  if (upper.includes('CLUMIO')) return 'Clumio';
  if (upper.includes('TALENT SERVE')) return 'Talent Serve';
  if (upper.includes('SIXTR&D') || upper.includes('SIXT')) return 'Sixt R&D';
  if (upper.includes('FLOCK')) return 'Flock';
  if (upper.includes('KEYSIGHT')) return 'Keysight Technologies';

  return c;
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
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

const rawRows = parseCSV(raw);

const students = rawRows.map((r, index) => {
  const batch = parseInt(r.batch_year, 10);
  const details = r.details.trim();
  const rawOffers = details ? details.split(';').map(x => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean) : [];
  const normalizedOffers = rawOffers.map(cleanCompanyName);
  
  let category = 'Not Placed';
  if (r.status === 'On-Campus') {
    category = 'On-Campus';
  } else if (r.status.includes('Off-Campus') || r.status.includes('Higher Studies') || r.status.includes('Entrepreneur')) {
    category = 'Off-Campus / Higher Studies / Startup';
  }

  const isHigherStudies = /university|school|institute|msc|pgdm|graduate/i.test(details);
  const isEntrepreneur = /entrepreneur|tinker|foodpal|pyse|justvend|leher|blockmanity|freelancer/i.test(details);

  return {
    id: `STU-${batch}-${index + 1}`,
    batchYear: batch,
    usn: r.usn,
    name: r.name,
    status: r.status,
    category,
    details: r.details,
    offers: rawOffers,
    normalizedCompanies: normalizedOffers,
    offerCount: r.status === 'On-Campus' ? rawOffers.length : 0,
    isHigherStudies,
    isEntrepreneur
  };
});

const outJs = `// Placement dataset generated from source records (756 entries across 2018–2022)
export const PLACEMENT_STUDENTS = ${JSON.stringify(students, null, 2)};

export const BATCH_YEARS = [2018, 2019, 2020, 2021, 2022];
`;

fs.writeFileSync('src/data/placementData.js', outJs);
console.log('Successfully generated src/data/placementData.js with', students.length, 'students.');
