export enum DISCOUNT_TYPE {
  PERCENTAGE = "PERCENTAGE",
  FLAT = "FLAT",
}

export interface ICoupon {
  code: string;
  discountType: DISCOUNT_TYPE;
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate?: Date;
  expiryDate: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
