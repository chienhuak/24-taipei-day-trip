async function feed() {
	// 從 localStorage 獲取 JWT
	const token = localStorage.getItem('token')
    const div = document.querySelector('#container1')
    const response = await fetch('/api/feed', {
		method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`, // 將 JWT 放在 Authorization Header 中
        'Content-Type': 'application/json'
        }
	})
    .then(response => response.json())
    .then(data => {
		console.log(data)
		const content_div = document.getElementById('board-content')
		content_div.innerHTML = '' // 清空之前的内容
		const messages = data.data.show_msgboard
        messages.forEach(message => {
			// console.log(message.name)
			// console.log(message.content)
			const msg_div = document.createElement('div')
			// msg_div.innerText = data.data.show_msgboard['content']
			msg_div.innerText = `${message.name}: ${message.content} (${message.time})`
			content_div.appendChild(msg_div)
        }
	)
	// .catch(error => {
	// 	console.error('Error fetching data:', error);
	// })
})
}