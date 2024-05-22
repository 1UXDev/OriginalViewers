const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 8080;

const app = express();

const staticPath = path.join('/home/ubuntu/viewer/platform/app/ohif');

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

app.use(
  '/ohif',
  express.static(staticPath, {
    setHeaders: (res, path, stat) => {
      res.set('Cross-Origin-Resource-Policy', 'same-site');
    },
  })
);

app.get('/ohif/*', (req, res) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
