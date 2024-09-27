export const CONFIG = {
  // DB
  postgresURL: process.env.DATABASE_URL as string,
  // AWS
  awsUrl: process.env.AWS_URL as string,
  awsUser: process.env.MINIO_ROOT_USER as string,
  awsPassword: process.env.MINIO_ROOT_PASSWORD as string,
  awsBucket: process.env.AWS_BUCKET as string,
  // Redis
  redisHost: process.env.REDIS_HOST as string,
  redisPort: process.env.REDIS_PORT as string,

  // JWT
  jwtSecret: process.env.JWT_SECRET as string,
};
