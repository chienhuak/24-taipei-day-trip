from fastapi import Request


from mvc_views.auth import AuthView
from utils.security import decode_jwt

class AuthController:

	def signin(request: Request):

		auth_header = request.headers.get('Authorization')  # 從 Authorization Header 中提取 token

		if not auth_header:
			return AuthView.unauthorized()

		token = auth_header.split(" ")[1]  # 取得 JWT Token
		payload = decode_jwt(token)  # 取得 user_data

		if not payload:
			return AuthView.unauthorized()

		return AuthView.authenticated(payload)

