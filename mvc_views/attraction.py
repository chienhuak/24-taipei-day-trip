from fastapi.responses import JSONResponse

class AttractionView :

	def all(data, page):
		return {
			"nextPage": page+1 if len(data) == 12 else None,
			"data": data
			}



	def success_response(data):
		return {"data": data}



	def not_found_response(msg):
		print("注意：", msg)
		return JSONResponse(status_code=400, content={
			"error": True,
			"message": msg
			}) 
	


	def server_error_response():
		print("注意：系統錯誤")
		return JSONResponse(status_code=500, content={
			"error": True,
			"message": "系統錯誤"
			})



