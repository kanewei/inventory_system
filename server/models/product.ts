import { DataTypes, Model, Optional } from 'Sequelize'
import sequelizeConnection from '../db/config'

interface ProductAttributes  {
    id: string;
    currentInventory: number;
    defaultInventory: number;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date; 
}

export type ProductInput = Optional<ProductAttributes, 'id'>

export type ProductOutput = Required<ProductAttributes>

class Product extends Model<ProductAttributes, ProductInput> implements ProductAttributes {
    public id!: string
    public currentInventory!: number
    public defaultInventory!: number

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Product.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    currentInventory: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    defaultInventory: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
  tableName: 'products',
  sequelize: sequelizeConnection,
  paranoid: true
})

export default Product