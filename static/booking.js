// 添加新行程到購物車中
async function additem() {

    // 解析 querystring
    const path = window.location.pathname
    const pathSegments = path.split('/')
    const attractionId = pathSegments[pathSegments.length - 1]
    // const attractionId = document.getElementById('attractionId').value;

    const date = document.getElementById('date').value;
    const time = document.querySelector('input[name="ampm"]:checked').value;
    const price = time === 'afternoon' ? 2500 : 2000;

    const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "attractionId":attractionId, "date":date, "time":time, "price":price })
    });
}


// 購物車中所有待確認行程


// 刪除購物中待確認的預定行程 (已確認 OR 移除)