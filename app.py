from fastapi import *
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from typing import Optional
import mysql.connector
import json
import os
app=FastAPI(debug=True)

# 從環境變數中讀取 MySQL 密碼
mysql_password = os.environ.get("MYSQL_PASSWORD")
# 連接到 MySQL 資料庫
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password=mysql_password,
    database="website"
    )

cursor = mydb.cursor()

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

	with mydb.cursor(buffered=True,dictionary=True) as mycursor :

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
		with mydb.cursor(buffered=True,dictionary=True) as mycursor :
			
			query = """
			SELECT id, name, CAT as category, description, address, direction as transport, mrt, latitude as lat, longitude as lng, file as images
			FROM attractions 
			WHERE id = %s
			ORDER BY id
			"""
			mycursor.execute(query, (attractionId,))
			results = mycursor.fetchall()

		if results :
			return {"data": results}
		else :
			return JSONResponse(status_code=400, content={
				"error": True,
				"message": "景點編號不存在"
				}) 
	except Exception as e:
		return JSONResponse(status_code=500, content={
				"error": True,
				"message": "系統錯誤"
				}) 

@app.get("/api/mrts", response_class=JSONResponse)
async def mrts(request: Request):
	try:
		with mydb.cursor(buffered=True,dictionary=True) as mycursor :
			
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