import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../db/config'

interface ProductAttributes  {
    id: string;
    currentInventory: number;
    defaultInventory: number;
}

export type ProductInput = Optional<ProductAttributes, 'id'>

export type ProductOutput = Required<ProductAttributes>

class Product extends Model<ProductAttributes, ProductInput> implements ProductAttributes {
    public id!: string
    public currentInventory!: number
    public defaultInventory!: number
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
  sequelize: sequelizeConnection,
  paranoid: true
})

export default Product