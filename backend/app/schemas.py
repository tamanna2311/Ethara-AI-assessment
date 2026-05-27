from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

# Product Schemas
class ProductBase(BaseModel):
    name: str
    sku: str
    price: float = Field(gt=0)
    stock_quantity: int = Field(ge=0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True

# Customer Schemas
class CustomerBase(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    class Config:
        from_attributes = True

# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)

class OrderItem(BaseModel):
    id: int
    product_id: int
    quantity: int
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]

class Order(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    created_at: datetime
    items: List[OrderItem]
    class Config:
        from_attributes = True
