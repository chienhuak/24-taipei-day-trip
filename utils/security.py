import jwt
from fastapi.responses import JSONResponse

jwtkey = "iweorhfnen834"

def decode_jwt(token):
	try:
		return jwt.decode(token,jwtkey,algorithms="HS256")

	except:
		return None


