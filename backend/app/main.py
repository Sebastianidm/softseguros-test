from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SoftSeguros Ecommerce API")

# CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/products", response_model=List[schemas.Product])
def get_products(db: Session = Depends(database.get_db)):
    products = db.query(models.Product).all()
    # seeder automatico si esta vacio.
    if not products:
        seed_data = [
            models.Product(
                name="Tablet Pro 12", 
                price=850000, 
                image_url="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop"
            ),
            models.Product(
                name="Teclado Mecánico", 
                price=120000, 
                image_url="https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800"
            ),
            models.Product(
                name="Monitor 4K", 
                price=450000, 
                image_url="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800"
            ),
            models.Product(
                name="Mouse Gamer", 
                price=55000, 
                image_url="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800"
            ),
        ]
        db.add_all(seed_data)
        db.commit()
        products = db.query(models.Product).all()
    return products


@app.post("/cart", status_code=201)
def save_cart(cart: schemas.CartCreate, db: Session = Depends(database.get_db)):
    db_cart = models.Cart()
    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)

    for item in cart.items:
        db_item = models.CartItem(
            cart_id=db_cart.id,
            product_name=item.product_name,
            price=item.price,
            quantity=item.quantity
        )
        db.add(db_item)
    
    db.commit()
    return {"id": db_cart.id, "message": "Carrito guardado correctamente en base de datos."}


@app.get("/health")
def health_check():
    return {"status": "ok"}