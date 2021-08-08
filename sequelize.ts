
import { Sequelize } from 'sequelize-typescript'
import {
    
    POSTGRES_DATABASE,
          POSTGRES_USER,
          POSTGRES_PASSWORD,
          POSTGRES_HOST,
          POSTGRES_PORT
} from './env'

let sequelize = null

const initSequelize = (() => {
    return () => {
      if (!sequelize) {
        sequelize = new Sequelize(
          POSTGRES_DATABASE,
          POSTGRES_USER,
          POSTGRES_PASSWORD,
          {
            dialect: 'postgres',
            port: POSTGRES_PORT,
            host: POSTGRES_HOST,
            models: [__dirname + '/models/example/*.model.*'],
            modelMatch: (filename, member) => {
              return (
                filename
                  .substring(0, filename.indexOf('.model'))
                  .replace('-', '') === member.toLowerCase()
              )
            },
            pool: {
              min: 0,
              max: 2,
              idle: 0,
              acquire: 3000,
              evict: 600
            },
            logging: true,
            sync: {
              force: false,
              logging: false,
              alter: false
            }
          }
        )
        // Sequelize.useCLS(AWSXRay.getNamespace())
        // AWSXRay.capturePostgres(sequelize.connectionManager.lib)
  console.log('sequelize: ', sequelize)
        return sequelize
      } else {
        // restart connection pool to ensure connections are not re-used across invocations
        sequelize.connectionManager.initPools()
        // restore `getConnection()` if it has been overwritten by `close()`
        if (
          // eslint-disable-next-line no-prototype-builtins
          sequelize.connectionManager.hasOwnProperty('getConnection')
        ) {
          delete sequelize.connectionManager.getConnection
        }
      }
    }
  })()

  export {
      sequelize,
      initSequelize
  }