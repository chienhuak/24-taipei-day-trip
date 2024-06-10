import mysql.connector
import json
import os

# 讀取 JSON 檔案
#file_path = r'C:\Users\User\Documents\GitHub\24-taipei-day-trip\data\taipei-attractions.json'
file_path = r'./data/taipei-attractions.json'
with open(file_path, 'r', encoding='utf-8') as f:
    json_data = json.load(f)

# 從環境變數中讀取 MySQL 密碼
mysql_password = os.environ.get("MYSQL_PASSWORD")
# 連接到 MySQL 資料庫
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password=mysql_password,
    database="website",
    ssl_disabled=True  # 禁用 SSL
    )

cursor = conn.cursor()


def create_table() :
    # 創建資料表（如果尚未創建）
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attractions (
        id INT PRIMARY KEY,
        rate INT,
        direction TEXT,
        name VARCHAR(255),
        date DATE,
        longitude VARCHAR(50),
        REF_WP VARCHAR(50),
        avBegin DATE,
        langinfo VARCHAR(50),
        MRT VARCHAR(50),
        SERIAL_NO VARCHAR(50),
        RowNumber VARCHAR(50),
        CAT VARCHAR(50),
        MEMO_TIME TEXT,
        POI CHAR(1),
        file TEXT,
        idpt VARCHAR(50),
        latitude VARCHAR(50),
        description TEXT,
        avEnd DATE,
        address TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS urls (
        id INT,
        url VARCHAR(255)
    )
    """)

    print("Table created successfully!")


def json_insert() :
    # 插入 JSON 數據到資料表中
    for attraction in json_data["result"]["results"]:
        sql = """
        INSERT INTO attractions (id, rate, direction, name, date, longitude, REF_WP, avBegin, langinfo, MRT, SERIAL_NO, RowNumber, CAT, MEMO_TIME, POI, file, idpt, latitude, description, avEnd, address)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (
            attraction["_id"],
            attraction["rate"],
            attraction["direction"],
            attraction["name"],
            attraction["date"],
            attraction["longitude"],
            attraction["REF_WP"],
            attraction["avBegin"],
            attraction["langinfo"],
            attraction["MRT"],
            attraction["SERIAL_NO"],
            attraction["RowNumber"],
            attraction["CAT"],
            attraction["MEMO_TIME"],
            attraction["POI"],
            attraction["file"].replace("https:",",https:")[1:],
            attraction["idpt"],
            attraction["latitude"],
            attraction["description"],
            attraction["avEnd"],
            attraction["address"]
        ))

    # 提交更改
    conn.commit()

    print("JSON data inserted successfully!")


def url_files() : 
    # 插入 JSON 數據到資料表中
    for data in json_data["result"]["results"]:
        xs = data["file"].split("https:")
        for x in xs :
            if x:
                sql = """
                INSERT INTO urls (id, url)
                VALUES (%s, %s)
                """
                cursor.execute(sql, (
                    data["_id"],
                    'https:'+x
                ))
    
    # 提交更改
    conn.commit()

    print("JSON data inserted successfully!")


create_table()
json_insert()
url_files()

# 關閉連接
cursor.close()
conn.close()