# === fastapi libs
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Optional
from fastapi.background import BackgroundTasks
from redis_om import get_redis_connection, HashModel

# === general libs
import requests
import time

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

# this should be a different database
redis = get_redis_connection(
    host="redis-11318.c281.us-east-1-2.ec2.redns.redis-cloud.com",
    port=11318,
    password="Woiw1LlKtlk97OKDeriuFPnIp8jJHviG"
)


class Order(HashModel):
    product_id: str
    price: float
    fee: float
    total: float
    quantity: int
    status: str = "pending"  # pending, completed, refunded

    class Meta:
        database = redis


@app.get("/")
async def root():
    return {"Welcome": "Order API V0.0"}


# Show order
@app.get("/orders/{pk}")
async def get_one(pk: str):
    try:
        order = Order.get(pk)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        redis.xadd('refund_order', order.dict() , '*')  # Add event to Redis Stream
        return order
    except Exception as e :
        print(e)
        # Order not found, handle the error here
        return {"detail": "Order not found"}, 404



# Create an Order
@app.post("/orders")
async def create(request: Request, background_tasks: BackgroundTasks):
    body = await request.json()

    req = requests.get(f"http://localhost:8000/products/{body['id']}")
    product = req.json()

    # Create order
    order = Order(
        product_id=body['id'],
        price=product['price'],
        fee=0.2 * product['price'],
        total=1.2 * product['price'],
        quantity=body['quantity'],
        status="pending",
    )
    order.save()

    background_tasks.add_task(order_completed, order)

    return order


def order_completed(order: Order):
    time.sleep(5)
    order.status = "Completed"
    order.save()
    # Send event to Redis
    redis.xadd('order_completed', order.dict(), '*')  # Fixed syntax error


