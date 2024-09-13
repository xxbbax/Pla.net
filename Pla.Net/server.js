const express = require('express');
const app = express();
const port = 3000;

// Указываем, что статические файлы будут в папке publicno
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});