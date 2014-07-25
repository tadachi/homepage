'use strict';

// Parse query string to extract some parameters (it can fail for some input)
var query = document.location.href.replace(/^[^?]*(\?([^#]*))?(#.*)?/, '$2');
var queryParams = query ? JSON.parse('{' + query.split('&').map(function (a) {
  return a.split('=').map(decodeURIComponent).map(JSON.stringify).join(': ');
}).join(',') + '}') : {};

var url = queryParams.file || '../pdf/demo.pdf';
var scale = +queryParams.scale || 1.5;

//
// Fetch the PDF document from the URL using promises
//
PDFJS.getDocument(url).then(function(pdf) {
  var numPages = pdf.numPages;
  // Using promise to fetch the page

  // For testing only.
  var MAX_NUM_PAGES = 50;
  var ii = Math.min(MAX_NUM_PAGES, numPages);

  var promise = Promise.resolve();
  for (var i = 1; i <= ii; i++) {
    var anchor = document.createElement('a');
    anchor.setAttribute('name', 'page=' + i);
    anchor.setAttribute('title', 'Page ' + i);
    document.body.appendChild(anchor);

    // Using promise to fetch and render the next page
    promise = promise.then(function (pageNum, anchor) {
      return pdf.getPage(pageNum).then(function (page) {
        var viewport = page.getViewport(scale);

        var container = document.createElement('div');
        container.id = 'pageContainer' + pageNum;
        container.className = 'pageContainer';
        container.style.width = viewport.width + 'px';
        container.style.height = viewport.height + 'px';
        anchor.appendChild(container);

        var renderContext = {
          viewport: viewport,
          pageNum: pageNum,
          container: container
        };
        // the next page fetch will start only after this page rendering is done
        return page.getOperatorList().then(function (opList) {
          var svgGfx = new SVGGraphics(page.commonObjs, page.objs);
          return svgGfx.loadDependencies(opList).then(function (values) {
            return svgGfx.beginDrawing(renderContext.viewport,
              renderContext.pageNum, renderContext.container, opList);
          });
        });
      });
    }.bind(null, i, anchor));
  }
});