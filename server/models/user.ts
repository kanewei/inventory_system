import Sequelize from 'Sequelize'
import bcrypt from 'bcryptjs'
import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../db/config'

interface UserAttributes  {
    id: number;
    email: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
}

export type UserInput = Optional<UserAttributes, 'id'>

export type UserOutput = Required<UserAttributes>

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: number
    public email!: string
    public password!: string
    
    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
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
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('NOW()')
    },
    updated_at: {
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