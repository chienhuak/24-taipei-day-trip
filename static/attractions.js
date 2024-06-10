// 查詢功能，監聽查詢輸入框
const searchForm = document.querySelector('.searchbar');
searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // 防止表單提交
    const searchInput = document.querySelector('#search-input');
    currentKeyword = searchInput.value.trim();
    currentPage = 0; // 重置頁數
    photos(currentPage, currentKeyword); // 根據新的關鍵字加載照片
});


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


function photos(page, keyword = "") {
    //使用模板字面量（template literals）構建URL時，需使用反引號（`）而不是單引號（'）。這樣可以確保變量 ${page} 被正確替換。
    let apiUrl;
    if (keyword) {
        apiUrl = `/api/attractions?keyword=${keyword}&page=${page}`;
    } else {
        apiUrl = `/api/attractions?page=${page}`;
    }
    
    const container2 = document.querySelector('#container2')

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // 如果是新的關鍵字搜索（頁數為0），則清空容器
            if (keyword) {
                container2.innerHTML = "";
            }

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
            loading = false; // 重置loading狀態
        })
        .catch(error => {
            console.error('Error:', error)
            loading = false; // 請求失敗，重置loading狀態
        });
}


document.addEventListener('DOMContentLoaded', function(){
    mrts()
    photos(0)
})


// 監聽滾動事件
let currentPage = 0; // 初始化頁數
let loading = false; // 請求狀態
let debounceTimer; // 防彈跳計時器，防止事件過度觸發
let currentKeyword = ""; // 當前關鍵字

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
        // 滾動到接近底部500px且沒有正在進行的請求時加載更多照片
        loading = true;
        currentPage++;
        clearTimeout(debounceTimer); // 清除之前的計時器
        debounceTimer = setTimeout(() => {
            photos(currentPage,keyword);
        }, 500); // 在500毫秒後執行加載操作
    }
});