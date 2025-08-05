const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const xml2js = require('xml2js');

async function run() {
  const feedUrl = 'https://www.cfa.vic.gov.au/cfa/rssfeed/tfbfdrforecast_rss.xml';
  const response = await fetch(feedUrl);
  const xml = await response.text();
  const result = await xml2js.parseStringPromise(xml);

  const description = result.rss.channel[0].item[0].description[0];
  console.log('🔥 CFA RSS description:', description); // helpful for troubleshooting

  const fireDangerMatch = description.match(/Central: ([A-Z\s]+)<br>/);
  const fireDangerRating = fireDangerMatch ? fireDangerMatch[1].trim() : 'NO RATING';

  const today = new Date().toISOString().split('T')[0];

  const json = {
    today: {
      rating: fireDangerRating
    },
    updated: today
  };

  fs.writeFileSync('fire-rating.json', JSON.stringify(json, null, 2));
  console.log(`✅ Updated fire-rating.json to: ${fireDangerRating}`);
}

run();
