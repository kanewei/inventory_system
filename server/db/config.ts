import 'dotenv/config'
import { Dialect, Sequelize } from 'Sequelize'

const dbName = process.env.NODE_ENV === "test" ? process.env.DB_DATABASE_TEST as string : process.env.DB_DATABASE as string
const dbUser = process.env.DB_USERNAME as string
const dbHost = process.env.DB_HOST as string
const dbConnect = process.env.DB_CONNECTION as Dialect
const dbPassword = process.env.DB_PASSWORD as string

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: 5432,
  dialect: dbConnect,
  dialectOptions: {
    options: {
      requestTimeout: 3000
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

export default sequelizeConnection