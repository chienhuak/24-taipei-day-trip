from fastapi import Request


from mvc_views.auth import AuthView
from utils.security import encode_jwt, decode_jwt
from mvc_models.auth import AuthModel

class AuthController:

	# 驗證用戶是否為登入狀態
	def get_signin(request: Request):

		auth_header = request.headers.get('Authorization')  # 從 Authorization Header 中提取 token

		if not auth_header:
			return AuthView.unauthorized()

		token = auth_header.split(" ")[1]  # 取得 JWT Token
		payload = decode_jwt(token)  # 取得 user_data

		if not payload:
			return AuthView.unauthorized()

		return AuthView.authenticated(payload)


	# 用戶登入
	def put_signin(data: dict):
		user_data = AuthModel.check_signin_input(data)
		if not user_data :
			return AuthView.unauthorized()
		encoded_data = encode_jwt(user_data)
		if not encoded_data :
			return AuthView.unauthorized()
		return AuthView.token_success_signed(encoded_data)



