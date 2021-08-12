import Sequelize from 'Sequelize'
import bcrypt from 'bcryptjs'
import { DataTypes, Model, Optional } from 'Sequelize'
import sequelizeConnection from '../db/config'

interface UserAttributes  {
    id: number;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date; 
}

export type UserInput = Optional<UserAttributes, 'id'>

export type UserOutput = Required<UserAttributes>

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: number
    public email!: string
    public password!: string
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('NOW()')
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('NOW()')
    }
}, {
  tableName: 'users',
  sequelize: sequelizeConnection,
  paranoid: true
})

User.beforeSave((user) => {
  if (user.changed('password')) {
    const salt = bcrypt.genSaltSync(10)
    user.password = bcrypt.hashSync(user.password, salt)
  }
})

export default User