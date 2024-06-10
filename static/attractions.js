function mrts() {
    const div = document.querySelector('#container1')
    fetch('/api/mrts')
    .then(response => response.json())
    .then(data => {
        for (let i=0;i<data.data.length;i++){
            const mrt = document.createElement('a')
            mrt.innerText = data.data[i]
            div.appendChild(mrt)
        }
    })
}


document.addEventListener('DOMContentLoaded', function() {
    mrts();

    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    const container = document.querySelector('#container1');

    arrowLeft.addEventListener('click', function(event) {
        event.preventDefault();
        container.scrollBy({ left: -600, behavior: 'smooth' });
    });

    arrowRight.addEventListener('click', function(event) {
        event.preventDefault();
        container.scrollBy({ left: 600, behavior: 'smooth' });
    });
});


function photos(page) {
    const apiUrl = `/api/attractions?page=${page}`  //使用模板字面量（template literals）構建URL時，需使用反引號（`）而不是單引號（'）。這樣可以確保變量 ${page} 被正確替換。
    const container2 = document.querySelector('#container2')

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            for (let i=0;i<data.data.length;i++){
                const div = document.createElement('div')
                div.className = "imgbox"
                const p1 = document.createElement('p')
                p1.className = "p1"
                p1.innerText = data.data[i].name  
                const p2 = document.createElement('p')
                p2.className = "p2"
                p2.innerText = data.data[i].mrt  
                const photo = document.createElement('img')
                photo.className = "myphoto"
                photo.src = data.data[i].images[0]     
                photo.innerText          
                div.appendChild(photo)
                div.appendChild(p1)
                div.appendChild(p2)
                container2.appendChild(div)
            }
        })
        .catch(error => console.error('Error:', error));
}


document.addEventListener('DOMContentLoaded', function(){
    mrts()
    photos(0)
})


// 監聽滾動事件
let currentPage = 0; // 初始化頁數
let loading = false; // 請求狀態

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 && !loading) {
        // 滾動到接近底部500px且沒有正在進行的請求時加載更多照片
        loading = true;
        currentPage++;
        photos(currentPage);
        loading = false; // 重置loading狀態
    }
});