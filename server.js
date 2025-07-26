import app from "./app.js";
import { getEnvironmentVariable } from "./utils/envUtil.js";

const { port } = getEnvironmentVariable();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
