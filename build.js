const markdownpdf = require('markdown-pdf'),
      docs = require('./docs.json');

markdownpdf()
  .concat.from(docs.target)
  .to('report.pdf', () => {
    console.log('Published!');
  });
