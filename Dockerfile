# 基礎鏡像
FROM python:3.9

# 工作目錄
WORKDIR /docker-website

# 複製依賴文件並安裝
COPY requirements.txt .
RUN pip install -r requirements.txt

# 暴露端口
EXPOSE 8000

# 應用程序代碼
COPY . .

# 自動命令
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
