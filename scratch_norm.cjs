const fs = require('fs');
const raw = fs.readFileSync('src/data/placementRecordsRaw.csv', 'utf8');

function cleanCompanyName(name) {
  let c = name.trim();
  // Remove parenthetical details like (PPO), (T1), (T2), (CTY), (ST), (BTA), (ASE), (SE), (DEV), (QA), (NINJA), etc.
  c = c.replace(/\s*\([^)]*\)/g, '').trim();
  
  const upper = c.toUpperCase();
  if (upper.includes('ACCENTURE')) return 'Accenture';
  if (upper.includes('BOSCH') || upper.includes('RBEI')) return 'Robert Bosch';
  if (upper.includes('HPE') || upper.includes('HEWLETT')) return 'HPE';
  if (upper.includes('LTI') || upper.includes('L & TECHNOLOGY') || upper.includes('LTTS') || upper.includes('L&T TECHNOLOGY')) return 'L&T / LTI';
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

  return c;
}

const lines = raw.trim().split('\n');
const counts = {};
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(',');
  const status = parts[3];
  const details = parts.slice(4).join(',');
  if (status === 'On-Campus' && details) {
    const rawOffers = details.split(';').map(x => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    rawOffers.forEach(o => {
      const norm = cleanCompanyName(o);
      counts[norm] = (counts[norm] || 0) + 1;
    });
  }
}

const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
console.log('Top Normalized Companies:');
sorted.slice(0, 30).forEach(([c, n]) => console.log(`${c}: ${n}`));
