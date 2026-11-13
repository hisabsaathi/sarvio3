const fs = require('fs');
const path = require('path');

// 1. डेटा फाइल लोड करें
const toolsData = require('./data/tools.json');

const BASE_URL = 'https://sarvio3.sarvio3.workers.dev';
const TODAY = new Date().toISOString().split('T')[0];
const URLS_PER_FILE = 10000; // हर फाइल में 10,000 टूल्स

// 2. सारे URLs की एक लिस्ट बनाएं
let allUrls = [];
// पहले होमपेज जोड़ें
allUrls.push(`${BASE_URL}/`);

// फिर सारे टूल्स के लिंक जोड़ें
toolsData.forEach(tool => {
  if(tool.slug) {
    allUrls.push(`${BASE_URL}/tool/${tool.slug}`);
  }
});

// 3. URL्स को 10,000 के चंक्स (Chunks) में बांटें
const chunks = [];
for (let i = 0; i < allUrls.length; i += URLS_PER_FILE) {
  chunks.push(allUrls.slice(i, i + URLS_PER_FILE));
}

// 4. हर चंक के लिए अलग साइटमैप फाइल बनाएं
let sitemapFiles = [];
chunks.forEach((chunk, index) => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  chunk.forEach(url => {
    xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });
  
  xml += `</urlset>`;
  
  const fileName = `sitemap-tools-${index + 1}.xml`;
  sitemapFiles.push(fileName);
  
  // फाइल को मुख्य फोल्डर में सेव करें
  fs.writeFileSync(path.join(__dirname, fileName), xml);
});

// 5. मास्टर इंडेक्स (sitemap.xml) बनाएं जो सारी फाइलों को जोड़ेगा
let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

sitemapFiles.forEach(file => {
  indexXml += `  <sitemap>\n    <loc>${BASE_URL}/${file}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>\n`;
});

indexXml += `</sitemapindex>`;

// मास्टर फाइल सेव करें
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), indexXml);
console.log('✅ Sitemap Index और सभी चाइल्ड साइटमैप सफलतापूर्वक बन गए!');
