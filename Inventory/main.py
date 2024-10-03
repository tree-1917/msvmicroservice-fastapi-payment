from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Optional

from redis_om import get_redis_connection, HashModel

# Create App
app = FastAPI()

# Optional CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create connection (decode response manually if needed)
redis = get_redis_connection(
    host="redis-11318.c281.us-east-1-2.ec2.redns.redis-cloud.com",
    port=11318,
    password="Woiw1LlKtlk97OKDeriuFPnIp8jJHviG"
)

# Create product model
class Product(HashModel):
    name: str
    price: float
    quantity: int

    class Meta:
        database = redis

# helper method 
def format(pk : str) : 
    product = Product.get(pk)
    return {
        'id' : product.pk,
        'name' : product.name,
        'price' : product.price,
        'quantity' : product.quantity
    }

@app.get("/")
def root():
    return {"Welcome" : "Product API V0.0"}

# Get one Product 
@app.get("/products/{pk}")
async def get_one(pk:str) : 
    return Product.get(pk)


# Get all Products 
@app.get("/products")
async def all():
    return [format(pk) for pk in Product.all_pks()]


# Create one Product
@app.post('/products')
async def create(product: Product) : 
    return product.save()

# Delete one Product 
@app.delete('/products/{pk}')
def delete(pk: str) : 
    return Product.delete(pk=pk)
