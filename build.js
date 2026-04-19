const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
}

const pages = [
  { view: 'about.ejs', out: 'about.html', data: { activePage: 'about' } },
  { view: 'blog.ejs', out: 'blog.html', data: { activePage: 'blog' } },
  { view: 'contact.ejs', out: 'contact.html', data: { activePage: 'contact', submitted: false } },
  { view: 'index.ejs', out: 'index.html', data: { activePage: 'episodes' } }
];

pages.forEach(p => {
  ejs.renderFile(path.join(__dirname, 'views', p.view), p.data, (err, str) => {
    if (err) throw err;
    
    // Replace absolute routing to root with relative paths
    let modifiedHtml = str.replace(/href="\//g, 'href="./');
    modifiedHtml = modifiedHtml.replace(/src="\//g, 'src="./');
    
    // Re-route links to specific HTML files
    modifiedHtml = modifiedHtml.replace(/href="\.\/about"/g, 'href="./about.html"');
    modifiedHtml = modifiedHtml.replace(/href="\.\/blog"/g, 'href="./blog.html"');
    modifiedHtml = modifiedHtml.replace(/href="\.\/contact"/g, 'href="./contact.html"');
    // Ensure routing to root resolves to index.html (except when it's just "./" matching the exact string href="./")
    modifiedHtml = modifiedHtml.replace(/href="\.\/"/g, 'href="./index.html"');

    fs.writeFileSync(path.join(docsDir, p.out), modifiedHtml);
    console.log(`Generated docs/${p.out}`);
  });
});
