import { DataTypes, Model, Optional } from 'Sequelize'
import sequelizeConnection from '../db/config'

interface OrderAttributes  {
    id: number;
    user_id: number;
    product_id: string;
    arrival_date?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export type OrderInput = Optional<OrderAttributes, 'id'>

export type OrderOutput = Required<OrderAttributes>

class Order extends Model<OrderAttributes, OrderInput> implements OrderAttributes {
    public id!: number
    public user_id!: number
    public product_id!: string
    public arrival_date!: Date
    
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
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
  sequelize: sequelizeConnection,
  paranoid: true
})

export default Order