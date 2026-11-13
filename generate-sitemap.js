const fs = require('fs');
const path = require('path');

// ⚠️ यहाँ अपनी डेटा फाइल का पाथ डालें जहाँ सारे 18,000 टूल्स का डेटा (JSON) है
// अगर आप API यूज़ कर रहे हैं, तो आपको fetch का इस्तेमाल करना होगा
const toolsData = require('./data/tools.json'); 

const BASE_URL = 'https://sarvio3.sarvio3.workers.dev';
const TODAY = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// 1. होम पेज (सबसे ज़्यादा प्राथमिकता)
xml += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

// 2. सभी कैटेगरी पेज (अगर आपके पास कैटेगरी हैं)
const categories = ['ai-tools', 'open-models', 'free-ai']; // अपनी कैटेगरी के नाम डालें
categories.forEach(cat => {
  xml += `  <url>\n    <loc>${BASE_URL}/?category=${cat}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
});

// 3. सभी 18,000+ टूल्स के लिए लिंक (यह लूप अपने आप सब जोड़ देगा)
toolsData.forEach(tool => {
  // मान लिया हमारे पास हर टूल का 'slug' या 'id' है (जैसे chatgpt)
  if(tool.slug) {
    xml += `  <url>\n    <loc>${BASE_URL}/tool/${tool.slug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  }
});

xml += `</urlset>`;

// फाइल को public फोल्डर में सेव करें ताकि वो वेबसाइट पर दिखे
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
console.log('✅ 18,000+ टूल्स का साइटमैप सफलतापूर्वक बन गया!');