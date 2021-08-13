# inventory_system

# Redis
- 用redis做 order token(idempotency key)，避免同用戶重複下單，成功下單後更新token，不然token皆為同一個
- 用redis做訂單數量確認，避免不同用戶同時下單錯誤，利用redis increasement的atomicity
- 用redis 記住預定數量，每日處理

# Authorization
- jwt驗證 作為登入驗證 登入時一併把 order key帶入
- order token 登入時回傳給User
- 發送除了登入或註冊相關的request要帶入jwt token做驗證
- 發送order和pre-order相關的request還要再帶入 order token做驗證

# Schedule & pre-order
- 跨日更新庫存或處理預定單
- 預定的數量放在redis內，以商品的defaultInventory作為計算，扣除後判斷有多少預定和今日還可以有多少庫存
- 如果預定數量超過defaultInventory則今日無現貨，扣除後defaultInventory，剩餘的預定單延至下一日處理
- 預定系統 每日的庫存不足時可預訂，訂單將於每日依據預購時間先後確認是否訂購成功

```
DB Schema
User {
	id
	account
	password bcrpt做hash
}
Product {
	id itmeID
	currentInventory
	defaultInventory
}
Order {
	id
	user_id
	product_id
	order_date
	arrival_date // 訂購或是預定成功才有值
}
```

```
Api
Post /api/user/signup
Post /api/user/login

Get /api/product
Post  /api/product/:id
Post /api/product/preorder/:id
```