from pydantic import BaseModel
from typing import List, Optional


class ProductBase(BaseModel):
    name: str
    price: float
    image_url: str

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True


class CartItemCreate(BaseModel):
    product_id: int 
    product_name: str
    price: float
    quantity: int

class CartCreate(BaseModel):
    items: List[CartItemCreate]

class CartResponse(BaseModel):
    id: int
    message: str