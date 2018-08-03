const markdownpdf = require('markdown-pdf'),
      pdfmerge = require('pdfmerge'),
      docs = require('./docs.json');

markdownpdf()
  .concat.from(docs.target)
  .to('contents.pdf', () => {
    markdownpdf().from('docs/cover.md').to('cover.pdf', () => {
      pdfmerge(['cover.pdf', 'contents.pdf'], 'report.pdf')
        .then(done => console.log(done))
        .catch(err => console.log(err));
    });
    console.log('Published!');
  });
