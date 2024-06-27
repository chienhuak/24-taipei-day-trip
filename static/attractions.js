let debounceTimer; // 防彈跳計時器，防止事件過度觸發
let currentKeyword = ""; // 當前關鍵字
let nextPage

// 查詢功能，監聽查詢輸入框
const searchForm = document.querySelector('.searchbar');
searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // 防止表單提交
    const searchInput = document.querySelector('#search-input');
    currentKeyword = searchInput.value.trim();
    container2.innerHTML = ""
    photos(0, currentKeyword); // 重置頁數 // 根據新的關鍵字加載照片
});


function mrts() {
    const div = document.querySelector('#container1')
    fetch('/api/mrts')
    .then(response => response.json())
    .then(data => {
        for (let i=0;i<data.data.length;i++){
            const mrt = document.createElement('button')
            mrt.className = "mrt"
            mrt.innerText = data.data[i]
            mrt.addEventListener('click', (event) => {
                currentKeyword = mrt.innerText
                container2.innerHTML = ""
                photos(0, currentKeyword) 
            })
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
    console.log(page,keyword);
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
            for (let i=0;i<data.data.length;i++){
                const div = document.createElement('div')
                div.className = "imgbox"

                // 加連結到分頁
                div.addEventListener('click', function() {
                    window.location.href = `/attraction/${data.data[i].id}`
                });

                const textdiv = document.createElement('div')
                textdiv.className = "textbox"
                const p1 = document.createElement('p')
                p1.className = "p1"
                p1.innerText = data.data[i].name  
                // p1.href = `/attraction/${data.data[i].id}`  // 加連結到分頁，但是 p tag 換成 a tag 會跑版
                const s2 = document.createElement('span')
                s2.className = "s2"
                s2.innerText = data.data[i].mrt  
                const s3 = document.createElement('span')
                s3.className = "s3"
                s3.innerText = "公共藝術"  
                const photo = document.createElement('img')
                photo.className = "myphoto"
                photo.src = data.data[i].images[0]     
                photo.innerText          
                div.appendChild(photo)
                div.appendChild(p1)                
                container2.appendChild(div)
                div.appendChild(textdiv)
                textdiv.appendChild(s2)
                textdiv.appendChild(s3)
            }
            nextPage = data.nextPage; 
        })
        .catch(error => {
            console.error('Error:', error)
        });
}


document.addEventListener('DOMContentLoaded', function(){
    mrts()
    photos(0)
})


// 監聽滾動事件
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        // 滾動到接近底部500px且沒有正在進行的請求時加載更多照片
        if(!nextPage) return;  //最後一頁 nextPage null則跳出程式
        clearTimeout(debounceTimer); // 清除之前的計時器
        debounceTimer = setTimeout(() => {
            photos(nextPage,currentKeyword);
        }, 500); // 在500毫秒後執行加載操作
    }
});


function card() {
    const card = document.querySelector('.card');
    const overlay = document.getElementById('overlay');
    if (card.style.display == "block"){
        card.style.display = "none";
        overlay.style.display = 'none';
        document.removeEventListener('click', handleClickOutside);
    }
    else {
        card.style.display = "block";
        overlay.style.display = 'block';
        document.addEventListener('click', handleClickOutside);
    }
}


function handleClickOutside(event) {
    const cards = document.querySelectorAll('.card');
    const overlay = document.getElementById('overlay');
    let clickInsideCard = false;

    // 檢查是否點擊在任何一個 .card 內
    cards.forEach(card => {
        if (card.contains(event.target)) {
            clickInsideCard = true;
        }
    });

    // 如果點擊不在任何一個 .card 內，且不是在 #signin-card 上，則隱藏所有 .card 和 #overlay
    if (!clickInsideCard && !event.target.matches('#signin-card')) {
        cards.forEach(card => {
            card.style.display = 'none';
        });
        overlay.style.display = 'none';
        document.removeEventListener('click', handleClickOutside);
    }
    }
    



function card_close() {
    console.log('Hi')
    const cards = document.querySelectorAll('.card');
    const overlay = document.getElementById('overlay');
    for (let i=0;i<cards.length;i++){
        cards[i].style.display = 'none';
        overlay.style.display = 'none';
            document.removeEventListener('click', handleClickOutside);

    }
    
}



async function signin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/user/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email":email, "password":password })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.token);
        if(result.token)
            alert('登入成功');
        else 
            alert('登入失敗:');
        // 可以在此處重定向到其他頁面
        // window.location.href = '/home';
      } else {
        const error = await response.json();
        alert('Something error ' + error);
      }

}



function showRegister() {
    const cardx = document.getElementById('cardx');
    const overlay = document.getElementById('overlay');
    if (cardx.style.display == "block"){
        cardx.style.display = "none";
        overlay.style.display = 'none';
        document.removeEventListener('click', handleClickOutside);
    }
    else {
        cardx.style.display = "block";
        overlay.style.display = 'block';
        document.addEventListener('click', handleClickOutside);
    }
}


async function register() {
    const name = document.getElementById('namex').value;
    const email = document.getElementById('emailx').value;
    const password = document.getElementById('passwordx').value;
    const note = document.getElementById('note');

    const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "name":name, "email":email, "password":password })
      });

      if (response.ok) {
        const result = await response.json();
        if(result.ok)
            note.innerText = "註冊成功";
        else 
            alert('註冊失敗:');

      } else {
        const result = await response.json();
        note.innerText = result.message
      }

}