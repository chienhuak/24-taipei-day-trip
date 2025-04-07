from fastapi.responses import JSONResponse

class AuthView:

	def authenticated(user_data):
		return JSONResponse(status_code=200, content={
			"data": {
				"id": user_data["id"],
				"name": user_data["name"],
				"email": user_data["email"]
			}
		})



	def unauthorized():
		return JSONResponse(status_code=401, content={
			"data": None
		})