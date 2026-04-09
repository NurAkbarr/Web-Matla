const app = require("./src/index");

// PENTING UNTUK CPANEL
// cPanel/Passenger akan mengisi process.env.PORT secara otomatis.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
