import mysql.connector

class AuthModel:

	# 驗證用戶輸入帳密與資料庫會員資訊是否一致
	def check_signin_input(data:dict):
		with mysql.connector.connect(pool_name="hello") as mydb, mydb.cursor(buffered=True,dictionary=True) as mycursor :
			query = """
				SELECT id, name, username as email
				FROM member 
				WHERE username = %s AND password = %s
				"""
			mycursor.execute(query, (data["email"], data["password"],))
			results = mycursor.fetchall()
		return results if results else None 

