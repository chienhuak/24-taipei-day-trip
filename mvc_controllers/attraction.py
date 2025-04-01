# Controller（控制器）負責處理 特定 API 路由的業務邏輯，決定如何使用 Model（數據）和 View（回應格式）
# 接收 HTTP 請求
# 調用 Model 來獲取數據
# 調用 View 來返回格式化數據
# 處理錯誤與異常

from mvc_views.attraction import AttractionView
from mvc_models.attraction import AttractionModel

class AttractionController :

	def get_attraction(attractionId:int):
		try:
			attraction = AttractionModel.get_attraction_info_by_id(attractionId)

			if not attraction:
				return AttractionView.not_found_response("景點編號不存在")

			images = AttractionModel.get_attraction_images_by_id(attractionId)
			attraction[0]['images'] = images
			# print(attraction[0]) #debug
			return AttractionView.success_response(attraction)
		except Exception as e:
			print("注意：", e)
			return AttractionView.server_error_response()

	
	def get_attractions(page,keyword):

		try:
			if page < 0 :
				return AttractionView.not_found_response("頁數錯誤")

			attractions = AttractionModel.get_attractions(page, keyword)
			return AttractionView.all(attractions, page)

		except Exception as e:
			print("注意：", e)
			return AttractionView.server_error_response()