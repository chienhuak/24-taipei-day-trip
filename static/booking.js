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



// 購物車中所有待確認行程 render 到畫面中
document.addEventListener('DOMContentLoaded', function(){
    cartlist()
})


function cartlist() {

    const container = document.getElementById('container'); // 取得容器元素

    fetch('/api/booking')
    .then(response => response.json())
    .then(data => {
        for (let i = 0; i < data.data.length; i++) {
            console.log(data.data[i])

            const cards_div = document.createElement('div')
            cards_div.className = 'cards c-h'

            const pick = document.createElement('input')
            pick.type = 'checkbox'

            const ibox = document.createElement('div')
            ibox.className = 'ibox'

            const img = document.createElement('img')
            img.className = 'bookingimg'
            img.src = data.data[i].attraction.image
            ibox.appendChild(img)

            const tbox = document.createElement('div')
            tbox.className = 'tbox'

            const name_p = document.createElement('p')
            name_p.innerText = data.data[i].attraction.name

            const date_p = document.createElement('p')
            date_p.innerText = `Date: ${data.data[i].date}`

            const time_p = document.createElement('p')
            time_p.innerText = `Time: ${data.data[i].time}`

            const price_p = document.createElement('p');
            price_p.innerText = `Price: ${data.data[i].price}`

            const address_p = document.createElement('p')
            address_p.innerText = data.data[i].attraction.address

            cards_div.appendChild(pick)
            cards_div.appendChild(ibox)
            cards_div.appendChild(tbox)
            tbox.appendChild(name_p)
            tbox.appendChild(date_p)
            tbox.appendChild(time_p)
            tbox.appendChild(price_p)
            tbox.appendChild(address_p)

            container.appendChild(cards_div); // 將生成的元素附加到 container
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}



// 刪除購物中待確認的預定行程 (已確認 OR 移除)