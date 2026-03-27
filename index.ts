import { app } from "./src/server.js"; // In bun, extensions usually not needed but using .js for standard ESM
import "dotenv/config";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
