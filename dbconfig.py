import mysql.connector
import os

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
