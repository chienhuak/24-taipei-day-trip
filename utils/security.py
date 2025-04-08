import jwt
from fastapi.responses import JSONResponse
from datetime import datetime,timedelta,timezone

jwtkey = "iweorhfnen834"

def decode_jwt(token):
	try:
		return jwt.decode(token,jwtkey,algorithms="HS256")

	except:
		return None


def encode_jwt(user_data):
	try:
		exp = datetime.now(tz=timezone.utc) + timedelta(days=7)
		user_data[0].update({"exp": exp})
		access_token = jwt.encode(user_data[0], jwtkey, algorithm="HS256")
		return access_token

	except Exception as e:
		print("encode_jwt 錯誤：", e)
		return None

