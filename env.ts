export const IS_OFFLINE = process.env.IS_OFFLINE === 'true'

export const getEnvironmentVariableValue = (value, defaultValue) => {
  return IS_OFFLINE ? defaultValue : value
}

export const POSTGRES_USER = getEnvironmentVariableValue(
  process.env.RDS_USERNAME,
  'postgres'
)

export const POSTGRES_PASSWORD = getEnvironmentVariableValue(
  process.env.RDS_PASSWORD,
  'password'
)

export const POSTGRES_HOST = getEnvironmentVariableValue(
  process.env.RDS_HOST,
  'localhost'
)

export const POSTGRES_DATABASE = getEnvironmentVariableValue(
    process.env.RDS_DB_NAME,
    'example'
  )

  export const POSTGRES_PORT = getEnvironmentVariableValue(
    process.env.POSTGRES_PORT && parseInt(process.env.POSTGRES_PORT, 10),
    5432
  )