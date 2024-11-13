const express = require("express");
const app = express();
const PORT = 8001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
