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
		return {
			"error": True,
			"message": "請按照情境提供對應的錯誤訊息"
			}

	with mydb.cursor(buffered=True,dictionary=True) as mycursor :

		# 每頁顯示10條留言
		page_size = 12

		query = """
		SELECT id, name, CAT as category, description, address, direction as transport, mrt, latitude as lat, longitude as lng, file as images, SERIAL_NO
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
				WHERE SERIAL_NO = %s AND (url like '%.jpg' OR url like '%.png')
				"""
				mycursor2.execute(query, (result['SERIAL_NO'],))
				results2 = mycursor.fetchall()
				result['image'] = results2

	return {
		"nextPage": page,
		"data": results}
