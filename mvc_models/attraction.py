import mysql.connector

class AttractionModel :

	def get_attraction_info_by_id(attractionId:int):
		try:
			with mysql.connector.connect(pool_name="hello") as mydb, mydb.cursor(buffered=True,dictionary=True) as mycursor :
				query = """
				SELECT id, name, CAT as category, description, address, direction as transport, mrt, latitude as lat, longitude as lng, file as images
				FROM attractions 
				WHERE id = %s 
				"""
				mycursor.execute(query, (attractionId,))
				results = mycursor.fetchall() # fetchall() 回傳 list [{}] ; fetchone() 回傳 dict
				return results if results else None # {'key1':'val1','key2':'val2',...}
		except Exception as e:
			print("注意：", e)
			return None



	def get_attraction_images_by_id(attractionId:int):
		try:
			with mysql.connector.connect(pool_name="hello") as mydb, mydb.cursor(buffered=True,dictionary=True) as mycursor :
				query = """
				SELECT url
				FROM urls 
				WHERE id = %s AND (url like '%.jpg' OR url like '%.png')
				"""
				mycursor.execute(query, (attractionId,))
				results = mycursor.fetchall()
				return [item['url'] for item in results] if results else None # ['url1', 'url2', ...]
		except Exception as e:
			print("注意：", e)
			return None



	def get_attractions(page:int ,keyword:str):
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
		return results if results else None