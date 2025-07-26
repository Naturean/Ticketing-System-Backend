import app from "./app.js";
import { port } from "./utils/envUtil.js";

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
