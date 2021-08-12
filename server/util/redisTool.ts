import redis from "redis";
import { v4 as uuidv4 } from 'uuid';

const redisClient = redis.createClient();

// Avoiding duplicate order token (idempotency key)
const generateOrderToken = (userId: number): string => {
    const key = "order:token:" + userId;
    const token = uuidv4();
    
    redisClient.get(key, (err,getToken) => {
        if (getToken !== null) {
            return getToken
          } else {
            //Store to Redis
            redisClient.set(key, token);
          }
    })
    return token;
}

const checkOrderToken = (userId: number, token?: string): boolean => {
  if(!token) {
    return false
  }

  const key = "order:token:" + userId;

  redisClient.get(key, (err,getToken) => {
    if(getToken !== null && getToken === token) {
      return true
    }
  })
  return false
}

// Update default inventory every for change default inventory
const setProductDefaultInventory = (productId: string, defaultinventory: number):void => {
  const defaultinventorykey = "defaultinventory:product:" + productId
  //Store to Redis
  redisClient.set(defaultinventorykey, String(defaultinventory));
}

const checkProductInventory = (productId: string): boolean => {
  const defaultinventorykey = "defaultinventory:product:" + productId
  let defaultinventory = 0
  redisClient.get(defaultinventorykey, (err, getDefaultinventory) => {
    if(err !=null) {
      return false
    }
    if(defaultinventory !== null){
      defaultinventory = Number(getDefaultinventory)
    }
  })

  const productKey = 'product:' + productId
  // Product inevntory is sufficient
  redisClient.get(productKey, (err, productcurrentInventory) => {
    if(err !=null) {
      return false
    }
    if(productcurrentInventory !== null && Number(productcurrentInventory) < defaultinventory){
      return false
    }
  })

  redisClient.incrby(productKey, 1, (err, productcurrentInventory) => {
    if(err != null) {
      redisClient.incrby(productKey, -1)
      return false
    }
    if(productcurrentInventory != null && productcurrentInventory < defaultinventory) {
      return true
    }
  })
  return false
}

const setProductPreOderInventory = (productId: string): boolean => {
  const defaultinventorykey = "defaultinventory:product:" + productId
  let defaultinventory = 0
  redisClient.get(defaultinventorykey, (err, getDefaultinventory) => {
    if(err != null) {
      return false
    }
    if(defaultinventory !== null){
      defaultinventory = Number(getDefaultinventory)
    }
  })

  let productcurrentInventory = 0
  const productKey = 'product:' + productId
  redisClient.get(productKey, (err, getProductcurrentInventory) => {
    if(err != null) {
      return false
    }
    if(getProductcurrentInventory == null){
      return false
    }
    productcurrentInventory = Number(getProductcurrentInventory)
  })

  // The inventory of product is sufficient, no nedd to pre-order
  if(productcurrentInventory < defaultinventory) {
    return false
  }
  // Add for pre-order
  return redisClient.incrby(productKey, 1)
}

const handleProductPreOder = (productId: string): number => {
  const defaultinventorykey = "defaultinventory:product:" + productId
  let defaultinventory = 0
  redisClient.get(defaultinventorykey, (err, getDefaultinventory) => {
    if(err != null) {
      return 0
    }
    if(defaultinventory !== null){
      defaultinventory = Number(getDefaultinventory)
    }
  })

  let productcurrentInventory = 0
  const productKey = 'product:' + productId
  redisClient.get(productKey, (err, getProductcurrentInventory) => {
    if(err != null) {
      return 0
    }
    if(getProductcurrentInventory == null){
      return 0
    }
    productcurrentInventory = Number(getProductcurrentInventory)
  })

  // Yesterday order minus defaultinventory to check if pre-order exist
  productcurrentInventory = productcurrentInventory - defaultinventory
  let preOrderCount = 0
  // Pre-order exist
  if(productcurrentInventory > 0) {
    preOrderCount = productcurrentInventory
    redisClient.set(productKey,String(productcurrentInventory))
  } else {
    redisClient.set(productKey,String(0))
  }
  
  return preOrderCount  
}

export {
    generateOrderToken,
    checkOrderToken,
    setProductDefaultInventory,
    checkProductInventory,
    setProductPreOderInventory,
    handleProductPreOder
}