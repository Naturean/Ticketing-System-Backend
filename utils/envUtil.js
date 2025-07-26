const environment = process.env.NODE_ENV;
const apiRoute = process.env.API_ROUTE;
const database = process.env.LOCAL_DATABASE;
const username = process.env.LOCAL_DB_USERNAME;
const password = process.env.LOCAL_DB_PASSWORD;
const host = process.env.LOCAL_DB_HOST;
const port = process.env.SERVER_PORT;
const localImgUrl = process.env.LOCAL_IMG_URL;
const localAvatarUrl = process.env.LOCAL_AVATAR_URL;

export {
  environment,
  apiRoute,
  database,
  username,
  password,
  host,
  port,
  localImgUrl,
  localAvatarUrl,
};
