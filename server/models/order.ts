import { DataTypes, Model, Optional } from 'Sequelize'
import sequelizeConnection from '../db/config'

interface OrderAttributes  {
    id: number;
    user_id: number;
    product_id: string;
    arrival_date?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date; 
}

export type OrderInput = Optional<OrderAttributes, 'id'>

export type OrderOutput = Required<OrderAttributes>

class Order extends Model<OrderAttributes, OrderInput> implements OrderAttributes {
    public id!: number
    public user_id!: number
    public product_id!: string
    public arrival_date!: Date
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    arrival_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
  tableName: 'orders',
  sequelize: sequelizeConnection,
  paranoid: true
})

export default Order