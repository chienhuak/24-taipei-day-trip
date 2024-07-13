// 添加新行程到購物車中
async function additem() {

    // 從 localStorage 獲取 JWT
    const token = localStorage.getItem('token')

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
        'Authorization': `Bearer ${token}`, // 將 JWT 放在 Authorization Header 中
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "attractionId":attractionId, "date":date, "time":time, "price":price })
    });
    if (response.ok) {
        alert('已加入購物車')
    } else
    alert('請先登入喔')
}


// document.addEventListener('DOMContentLoaded', function(){
//     checkLoginStatus()
//     cartlist()
// })

window.order_trips = {}
let totalAmount = 0
const updateTotalAmount = () => {
    amount.innerText = totalAmount
}


// 購物車中所有待確認行程 render 到畫面中
function cartlist() {

    // 從 localStorage 獲取 JWT
    const token = localStorage.getItem('token')

    const container = document.getElementById('container') // 取得容器元素
    const amount = document.getElementById('amount')


    // 不用 cookie, 在fetch時要自己加 header
    fetch('/api/booking',{
        headers: {
            'Authorization': `Bearer ${token}`, // 將 JWT 放在 Authorization Header 中
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.data || data.data.length === 0) {
            // 如果 data.data 沒有值，則顯示 "沒有預定行程"

            const checkoutinfo1 = document.getElementById('checkout-info-1')
            const checkoutinfo2 = document.getElementById('checkout-info-2')
            const checkout = document.getElementById('checkout')

            const message = document.createElement('p')
            message.innerText = "沒有預定行程"
            container.appendChild(message)
            checkoutinfo1.style.display = 'none'
            checkoutinfo2.style.display = 'none'
            checkout.style.display = 'none'
        } else {
            for (let i = 0; i < data.data.length; i++) {
                // console.log(data.data[i])
    
                const cards_div = document.createElement('div')
                cards_div.className = 'cards c-h book-h-v'
    
                const pickdiv = document.createElement('div')
                pickdiv.className = 'pickdiv'
                const pick = document.createElement('input')
                pick.className = 'pick'
                pick.type = 'checkbox'
                pick.dataset.price = data.data[i].price; // 將價格儲存在 checkbox dataset 中
                pick.dataset.cartId = data.data[i].id; // 將購物項目儲存在 checkbox dataset 中
                pick.dataset.imgsrc = data.data[i].attraction.image
    
                // 幫 checkbox 增加 eventlistener 計算總金額
                pick.addEventListener('change', (event) => {
                    const cartId = event.target.dataset.cartId
                    if (event.target.checked) {
                        totalAmount += parseInt(event.target.dataset.price)
                        window.order_trips[cartId] = event.target.dataset.imgsrc
                    } else {
                        totalAmount -= parseInt(event.target.dataset.price)
                        window.order_trips[cartId] = null
                    }
                    updateTotalAmount()
                    console.log(window.order_trips)
                })
    
                const trashdiv = document.createElement('div')
                trashdiv.addEventListener('click', deleteitem)
                trashdiv.dataset.price = data.data[i].price
                trashdiv.className = 'trash-div'
    
                const trashicon = document.createElement('img')
                trashicon.className = 'trash-icon'
                trashicon.src = '/static/images/trash_icon.png'
                trashicon.dataset.cartId = data.data[i].id; // 將購物項目儲存在 trashicon dataset 中
                trashdiv.appendChild(trashicon)
    
                const ibox = document.createElement('div')
                ibox.className = 'ibox'
    
                const img = document.createElement('img')
                img.className = 'bookingimg'
                img.src = data.data[i].attraction.image
                ibox.appendChild(img)
    
                const tbox = document.createElement('div')
                tbox.className = 'tbox'
    
                const name_p = document.createElement('p')
                name_p.innerText = "台北一日遊：" + data.data[i].attraction.name
                name_p.className = 'tclass'
    
                const date_p = document.createElement('p')
                date_p.innerText = `日期： ${data.data[i].date}`
    
                const time_p = document.createElement('p')
                time_p.innerText = `時間： ${data.data[i].time}`
    
                const price_p = document.createElement('p');
                price_p.innerText = `費用： 新台幣 ${data.data[i].price} 元`
    
                const address_p = document.createElement('p')
                address_p.innerText = `地點： ${data.data[i].attraction.address}`
    

                cards_div.appendChild(ibox)
                cards_div.appendChild(tbox)
                cards_div.appendChild(pickdiv)
                pickdiv.appendChild(pick)
                pickdiv.appendChild(trashdiv)
                tbox.appendChild(name_p)
                tbox.appendChild(date_p)
                tbox.appendChild(time_p)
                tbox.appendChild(price_p)
                tbox.appendChild(address_p)
    
                container.appendChild(cards_div); // 將生成的元素附加到 container
            }
        }
    
            updateTotalAmount()
    
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
        




// 刪除購物中待確認的預定行程 (已確認 OR 移除)
function deleteitem(event) {

    // 從 localStorage 獲取 JWT
    const token = localStorage.getItem('token')
    const cartId = event.target.dataset.cartId


    fetch('/api/booking',{
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`, // 將 JWT 放在 Authorization Header 中
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "cartId": cartId
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        // cartlist()
        const cardToRemove = event.target.closest('.cards')
        // const pick = event.target.closest('.pick')
        if (cardToRemove) {

            // 總金額扣除刪除項目金額，並計算結果
            const checkbox = cardToRemove.querySelector('.pick');
            if (checkbox && checkbox.checked) {
                totalAmount -= parseInt(checkbox.dataset.price);
                updateTotalAmount();
            }
            window.order_trips[checkbox.dataset.cartId] = null

            // 將卡片移除
            cardToRemove.remove()

        }
    })

}


// decode JWT
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


function renderName() {
    const namespan = document.getElementById('booking_user');
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = parseJwt(token);
            const name = decodedToken.name;
            namespan.innerText = name;
        } catch (error) {
            console.error('Error decoding JWT:', error);
        }
    }
}