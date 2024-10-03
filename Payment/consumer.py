from main import redis, Order
import time
key = 'refund-order'
group = 'payment-group'



# create a group
try : 
    redis.xgroup_create(key,group)
except: 
    print("Group already exists !")
    

while True : 
    try : 
        results = redis.xreadgroup(group, key, {key: ">"}, None)
        if results != [] : 
            print(results)
            for res in results : 
                obj = res[1][0][1]
                order = Order.get(obj['pk'])
                order.status =  'refunded'
                
                order.save() 
                
    except Exception as e : 
        print("Error Man !!! ")
    
    time.sleep(1)
