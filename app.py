from fastapi import *
from datetime import datetime,timedelta,timezone
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from typing import Optional, Union
import mysql.connector
import json
import os
from fastapi.staticfiles import StaticFiles
import jwt
import re

app=FastAPI(debug=True)
jwtkey = "iweorhfnen834"

# 從環境變數中讀取 MySQL 密碼
mysql_password = os.environ.get("MYSQL_PASSWORD")
# 連接到 MySQL 資料庫
with mysql.connector.connect(
    host="localhost",
    user="root",
    password=mysql_password,
    database="website",
	pool_name="hello"
    ):pass

# 設定靜態檔案路徑
app.mount("/static", StaticFiles(directory="static"), name="static")

# Static Pages (Never Modify Code in this Block)
@app.get("/", include_in_schema=False)
async def index(request: Request):
	return FileResponse("./static/index.html", media_type="text/html")
@app.get("/attraction/{id}", include_in_schema=False)
async def attraction(request: Request, id: int):
	return FileResponse("./static/attraction.html", media_type="text/html")
@app.get("/booking", include_in_schema=False)
async def booking(request: Request):
	return FileResponse("./static/booking.html", media_type="text/html")
@app.get("/thankyou", include_in_schema=False)
async def thankyou(request: Request):
	return FileResponse("./static/thankyou.html", media_type="text/html")

@app.get("/api/attractions", response_class=JSONResponse)
async def attractions(request: Request, page:Optional[int]=0,keyword:Optional[str]=""):
	if page < 0:
		return JSONResponse(status_code=500, content={
			"error": True,
			"message": "頁數錯誤"
			}) 

	with mysql.connector.connect(pool_name="hello") as mydb, mydb.cursor(buffered=True,dictionary=True) as mycursor :

		# 每頁顯示12條留言
		page_size = 12

		query = """
		SELECT id, name, CAT as category, description, address, direction as transport, mrt, latitude as lat, longitude as lng, file as images
		FROM attractions 
		WHERE (mrt = %s OR name like %s) 
		ORDER BY id
		LIMIT %s OFFSET %s
		"""
		mycursor.execute(query, (keyword, '%'+keyword+'%', page_size, page_size*page))
		results = mycursor.fetchall()
		with mydb.cursor(buffered=True) as mycursor2 :
			for result in results:
				query = """
				SELECT url
				FROM urls 
				WHERE id = %s AND (url like '%.jpg' OR url like '%.png')
				"""
				mycursor2.execute(query, (result['id'],))
				results2 = mycursor2.fetchall()
				url_list = [x[0] for x in results2]
				result['images'] = url_list

	return {
		"nextPage": page+1 if len(results) == 12 else None,
		"data": results}

@app.get("/api/attraction/{attractionId}", response_class=JSONResponse)
async def attractions(request: Request, attractionId:int):
	try:
		with mysql.connector.connect(pool_name="hello") as mydb, mydb.cursor(buffered=True,dictionary=True) as mycursor :
			
			query = """
			SELECT id, name, CAT as category, description, address, direction as transport, mrt, latitude as lat, longitude as lng, file as images
			FROM attractions 
			WHERE id = %s 
			ORDER BY id
			"""
			mycursor.execute(query, (attractionId,))
			results = mycursor.fetchall()

			if results :
				with mydb.cursor(buffered=True) as mycursor2 :
					query = """
					SELECT url
					FROM urls 
					WHERE id = %s AND (url like '%.jpg' OR url like '%.png')
					"""
					mycursor2.execute(query, (attractionId,))
					results2 = mycursor2.fetchall()
					url_list = [x[0] for x in results2]
					results[0]['images'] = url_list
				return {"data": results}
			else :
				return JSONResponse(status_code=400, content={
					"error": True,
					"message": "景點編號不存在"
					}) 
	except Exception as e:
		print(e)
		return JSONResponse(status_code=500, content={
				"error": True,
				"message": "系統錯誤"
				}) 

@app.get("/api/mrts", response_class=JSONResponse)
async def mrts(request: Request):
	try:
		with mysql.connector.connect(pool_name="hello") as mydb, mydb.cursor(buffered=True,dictionary=True) as mycursor :
			
			query = """
			SELECT mrt
			FROM attractions 
			GROUP BY mrt
			ORDER BY count(mrt) desc
			"""
			mycursor.execute(query)
			results = mycursor.fetchall()

			# 將結果轉換為只包含 mrt value 的 list
			mrt_list = [item['mrt'] for item in results]

		if results :
			return {"data": mrt_list}

	except Exception as e:
		return JSONResponse(status_code=500, content={
				"error": True,
				"message": "系統錯誤"
				}) 

# 登入會員資訊
@app.get("/api/user/auth", response_class=JSONResponse)
async def signin(request: Request):

	# 從 Authorization Header 中提取 token
	auth_header = request.headers.get('Authorization')
	if auth_header:
		myjwt = auth_header.split(" ")[1] 
		try:
			myjwtx = jwt.decode(myjwt,jwtkey,algorithms="HS256")
			# print(myjwtx)
			return {
				"data" : {
					"id": myjwtx["id"],
					"name" : myjwtx["name"] ,
					"email" : myjwtx["email"]
				}
			}

		except jwt.ExpiredSignatureError:
			print("expired")
			return JSONResponse(status_code=401, content={
				"data": None
				}) 

		except Exception as e:
			print("other exception")
			return JSONResponse(status_code=401, content={
				"data": None
				}) 



# 登入會員
@app.put("/api/user/auth", response_class=JSONResponse)
async def signin(request: Request, data:dict):
	#print (data)
	with mysql.connector.connect(pool_name="hello") as mydb, mydb.cursor(buffered=True,dictionary=True) as mycursor :
		query = """
			SELECT id, name, username as email
			FROM member 
			WHERE username = %s AND password = %s
			"""
		mycursor.execute(query, (data["email"], data["password"],))
		results = mycursor.fetchall()
		

		if results :
			exp = datetime.now(tz=timezone.utc) + timedelta(days=7)
			results[0].update({"exp": exp})
			access_token = jwt.encode(results[0], jwtkey, algorithm="HS256")
			resp = JSONResponse(status_code=200, content={
				"token": access_token
				})
			# resp.set_cookie(key='myjwt',value=access_token, expires=exp)
			return resp
		
		else :
			#return {"data":None}

			resp = JSONResponse(status_code=401, content={
				"data": None,
				#"error": True,
				#"message": "系統錯誤"
				})
			# resp.delete_cookie("myjwt")
			return resp 

		

# 註冊
@app.post("/api/user", response_class=JSONResponse)
async def register(request: Request, data:dict):
	try:
		with mysql.connector.connect(pool_name="hello") as mydb, mydb.cursor(buffered=True,dictionary=True) as mycursor :
			query = """
				SELECT id, name, username as email
				FROM member 
				WHERE username = %s
				"""
			mycursor.execute(query, (data["email"],))
			results = mycursor.fetchall()
			

			if results :
				return JSONResponse(status_code=400, content={
					"error": True,
					"message": "信箱重複註冊"})

			else :
				query = """
				INSERT INTO member (name, username, password)
				VALUES (%s, %s, %s)
				"""
				mycursor.execute(query, (data["name"],data["email"],data["password"],))
				mydb.commit()
				return {
					"ok": True
					}

	except Exception as e:
		return JSONResponse(status_code=500, content={
				"error": True,
				"message": e
				}) 


# 添加新行程到購物車中
@app.post("/api/booking", response_class=JSONResponse)
async def additem(request: Request, data:dict):

	# 從 Authorization Header 中提取 token
	auth_header = request.headers.get('Authorization')
	if auth_header:
		myjwt = auth_header.split(" ")[1] 

		# 解碼 JWT
		myjwtx = jwt.decode(myjwt,jwtkey,algorithms="HS256")

		# 解析請求的 JSON 資料
		data = await request.json()

		# 將資料存到 購物車 DB
		with mysql.connector.connect(pool_name="hello") as mydb, mydb.cursor(buffered=True,dictionary=True) as mycursor :
			query = """
				INSERT INTO cart (username, attractionId, date, time, price)
				VALUES (%s, %s, %s, %s, %s)
				"""
			mycursor.execute(query, (myjwtx["email"], int(data["attractionId"]), data["date"], data["time"], data["price"],))
			mydb.commit()
			
			return JSONResponse(status_code=200, content={
					"date": data["date"], 
					"time": data["time"], 
					"price": data["price"]})


# 購物車中的預訂行程
@app.get("/api/booking", response_class=JSONResponse)
async def cart_api(request: Request):

	# 從 Authorization Header 中提取 token
	auth_header = request.headers.get('Authorization')
	if auth_header:
		myjwt = auth_header.split(" ")[1] 

		# 解碼 JWT
		myjwtx = jwt.decode(myjwt,jwtkey,algorithms="HS256")

		# 購物車 DB
		with mysql.connector.connect(pool_name="hello") as mydb, mydb.cursor(buffered=True,dictionary=True) as mycursor :
			query = """
				SELECT cart.id, username, attractionId, cart.date, time, price, attractions.name, attractions.address, attractions.file
				FROM cart
				JOIN attractions
				ON attractions.id = cart.attractionId
				WHERE username = %s
				"""
			mycursor.execute(query, (myjwtx["email"],))
			results = mycursor.fetchall()
			# print(results)		

			if results:
				data = []
				for result in results:

					# Split the URLs by comma
					urls = result["file"].split(',')

					# Use regex to find the first PNG or JPG URL
					first_image_url = None
					for url in urls:
						match = re.search(r'https?://\S+\.(?:png|jpe?g)', url, re.IGNORECASE)
						if match:
							first_image_url = match.group(0)
							break

					data.append({
						"id":result["id"],
						"attraction": {
							"id":int(result["attractionId"]),
							"name":result["name"],
							"address":result["address"],
							"image":first_image_url} ,
						"date": result["date"],
						"time": result["time"],
						"price": result["price"]
					})
				return {"data": data}
			else:
				return {"data": None}


# 產生訂單
@app.post("/api/order", response_class=JSONResponse)
async def create_order(request: Request, data:dict):

	data = await request.json()
	tappay_url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
	headers={
		"Content-Type": "application/json",
		"x-api-key": "app_O0KJWIEiKdyLhesRLbj8AD5qdUy01uwMtk7aNpCoK4yb24qOHaeNcwWzCFJ1"
	}
	response = requests.post(tappay_url, headers=headers, json=payload)
	result = response.json()

	if result['status'] == 0:
		print(data)

        # return {
		# 	"prime": data['prime'],
		# 	"order": {
		# 		"price": data['price'],
		# 		"trip": {
		# 		"attraction": {
		# 			"id": 10,
		# 			"name": "平安鐘",
		# 			"address": "臺北市大安區忠孝東路 4 段",
		# 			"image": "https://yourdomain.com/images/attraction/10.jpg"
		# 		},
		# 		"date": data['date'],
		# 		"time": data['time']
		# 		},
		# 		"contact": {
		# 		"name": "彭彭彭",
		# 		"email": "ply@ply.com",
		# 		"phone": "0912345678"
		# 		}
		# 	}
		# 	}
		return {"success": True, "message": "付款成功"}
    # else:
	# 	return {"success": False, "message": "付款失敗"}


