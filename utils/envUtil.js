export function getEnvironmentVariable() {
  const environment = process.env.NODE_ENV;
  const apiRoute = process.env.API_ROUTE;

  const local_database = process.env.LOCAL_DATABASE;
  const local_username = process.env.LOCAL_DB_USERNAME;
  const local_password = process.env.LOCAL_DB_PASSWORD;
  const local_host = process.env.LOCAL_DB_HOST;

  const remote_database = process.env.REMOTE_DATABASE;
  const remote_username = process.env.REMOTE_DB_USERNAME;
  const remote_password = process.env.REMOTE_DB_PASSWORD;
  const remote_host = process.env.REMOTE_DB_HOST;

  const port = process.env.SERVER_PORT;

  const localImgUrl = process.env.LOCAL_IMG_URL;
  const localAvatarUrl = process.env.LOCAL_AVATAR_URL;

  const remoteImgUrl = process.env.REMOTE_IMG_URL;
  const remoteAvatarUrl = process.env.REMOTE_AVATAR_URL;

  return {
    environment,
    apiRoute,
    database: local_database,
    username: local_username,
    password: local_password,
    host: local_host,
    port,
    publicImgUrl: localImgUrl,
    publicAvatarUrl: localAvatarUrl,
  };
}
