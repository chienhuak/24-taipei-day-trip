async def attraction(attractionId):
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
				return results

			else :
				return None

	except Exception as e:
		return {
			"error": True,
			"message": "系統錯誤"
			}