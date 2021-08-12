import 'dotenv/config'

import { User, Product, Order } from '../models'

const isDev = process.env.NODE_ENV === 'development'

const dbInit = () => {
    // User.sync({ alter: false })
    // Product.sync({ alter: false  })
    // Order.sync({ alter: false  })
}

export default dbInit 