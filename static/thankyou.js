// 取得URL中的
const url = new URL(location.href)
// console.log(location.href)

const params = new URLSearchParams(url.search)
const number = params.get('number');
// console.log(number)

const orderID = document.getElementById('orderID')
const paymentstatus = document.getElementById('paymentstatus')
// const tappaymsg = document.getElementById('tappaymsg')
const token = localStorage.getItem('token')

fetch(`/api/order/${number}`,{
    headers: {
        'Authorization': `Bearer ${token}`, // 將 JWT 放在 Authorization Header 中
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    if (data.data) {
        orderID.innerText = number
        paymentstatus.innerText = data.data.status
    }
    else {
        orderID.innerText = number
        paymentstatus.innerText = data.data.status
    }


})