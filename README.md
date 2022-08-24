# LibJs Loader

Provides a method for lazy loading of js libraries in the browser.

## Using

```ts
import { loadLibrary } from 'libjs-loader';

loadLibrary(
    'https://mozilla.github.io/pdf.js/build/pdf.js',
    'pdfjs-dist/build/pdf',
    (pdfLib: any) => {
        const pdfWorker = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
        pdfLib.GlobalWorkerOptions.workerSrc = pdfWorker;
        pdfLib.loadScript(pdfWorker);
    })
    .then(pdf => {
        const loadingTask = pdf.getDocument('pdf url');
        ...
    });
```
