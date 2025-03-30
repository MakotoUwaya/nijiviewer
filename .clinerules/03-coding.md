# 実装規約

## 基本原則

### 関数型プログラミング

```typescript
// 純粋関数の例
const calculateTotal = (items: readonly Item[]): Money => {
  return items.reduce((total, item) => addMoney(total, item.price), ZERO_MONEY);
};

// 副作用の分離例
const saveOrder = async (order: Order): Promise<Result<Order, Error>> => {
  try {
    await orderRepository.save(order);
    return ok(order);
  } catch (error) {
    return err(toError(error));
  }
};
```

- 純粋関数を優先
- 不変データ構造を使用
- 副作用を分離・明示
- 型安全性を確保

### ドメイン駆動設計

```typescript
// 値オブジェクト
interface Price {
  readonly amount: Money;
  readonly currency: Currency;

  equals(other: Price): boolean;
  add(other: Price): Price;
}

// エンティティ
interface Order {
  readonly id: OrderId;
  readonly items: readonly OrderItem[];
  readonly status: OrderStatus;

  addItem(item: OrderItem): Result<Order, OrderError>;
  cancel(): Result<Order, OrderError>;
}
```

- 値オブジェクトとエンティティを区別
- 集約で整合性を保証
- リポジトリでデータアクセスを抽象化
- 境界付けられたコンテキストを意識

### テスト駆動開発

```typescript
describe("Order", () => {
  it("正常な注文を作成できる", () => {
    const result = createOrder({
      items: [validItem],
      userId: validUserId,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.items).toHaveLength(1);
      expect(result.value.status).toBe("pending");
    }
  });

  it("無効なアイテムで注文を作成できない", () => {
    const result = createOrder({
      items: [invalidItem],
      userId: validUserId,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_item");
    }
  });
});
```

- Red-Green-Refactorサイクル
- テストを仕様として扱う
- 小さな単位で反復
- 継続的なリファクタリング

## 実装パターン

### 型定義

```typescript
// ブランデッド型
type Branded<T, B> = T & { readonly _brand: B };
type OrderId = Branded<string, "OrderId">;
type Money = Branded<number, "Money">;

// 列挙型
const OrderStatus = {
  Pending: "pending",
  Confirmed: "confirmed",
  Shipped: "shipped",
  Cancelled: "cancelled",
} as const;
type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

// エラー型
type OrderError =
  | { type: "invalid_items"; items: string[] }
  | { type: "insufficient_stock"; itemId: string }
  | { type: "already_cancelled" };
```

### 値オブジェクト

```typescript
// バリデーション付き作成関数
const createMoney = (amount: number): Result<Money, Error> => {
  if (!Number.isFinite(amount)) {
    return err(new Error("金額が無効です"));
  }
  if (amount < 0) {
    return err(new Error("金額が負です"));
  }
  return ok(amount as Money);
};

// 不変な値オブジェクト
const createPrice = (amount: Money, currency: Currency): Price => ({
  amount,
  currency,
  equals: (other: Price) =>
    amount === other.amount && currency === other.currency,
  add: (other: Price) => {
    if (currency !== other.currency) {
      throw new Error("通貨単位が異なります");
    }
    return createPrice((amount + other.amount) as Money, currency);
  },
});
```

### Result型とエラーハンドリング

```typescript
type Result<T, E> = Ok<T> | Err<E>;
type Ok<T> = { readonly ok: true; readonly value: T };
type Err<E> = { readonly ok: false; readonly error: E };

// ヘルパー関数
const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
const err = <E>(error: E): Err<E> => ({ ok: false, error });

// エラー変換
const toError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  return new Error(String(error));
};

// 結果の連鎖
const validateAndSaveOrder = (
  input: OrderInput
): Promise<Result<Order, OrderError>> => {
  return pipe(createOrder(input), (result) =>
    result.ok ? saveOrder(result.value) : Promise.resolve(result)
  );
};
```

### リポジトリパターン

```typescript
interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Option<Order>>;
  findByStatus(status: OrderStatus): Promise<Order[]>;
}

// インメモリ実装（テスト用）
class InMemoryOrderRepository implements OrderRepository {
  private orders = new Map<OrderId, Order>();

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }

  async findById(id: OrderId): Promise<Option<Order>> {
    return this.orders.get(id) || none;
  }

  // ...他のメソッド
}
```

### アダプターパターン

```typescript
// インターフェース（ドメイン層で定義）
interface PaymentGateway {
  processPayment(payment: Payment): Promise<Result<PaymentId, PaymentError>>;
  refundPayment(paymentId: PaymentId): Promise<Result<void, PaymentError>>;
}

// 実装（インフラ層）
class StripePaymentGateway implements PaymentGateway {
  constructor(private readonly client: Stripe) {}

  async processPayment(
    payment: Payment
  ): Promise<Result<PaymentId, PaymentError>> {
    try {
      const result = await this.client.charges.create({
        amount: payment.amount,
        currency: payment.currency,
        source: payment.token,
      });
      return ok(result.id as PaymentId);
    } catch (error) {
      return err(this.translateError(error));
    }
  }

  // ...他のメソッド
}
```
