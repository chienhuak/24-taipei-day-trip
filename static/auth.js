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
    const signinBtn = document.getElementById('signin-card');
    const signoutBtn = document.getElementById('signout-btn');

    const response = await fetch('/api/user/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email":email, "password":password })
      });

      if (response.ok) {
        const result = await response.json();
        // console.log(result.token);
        if(result.token) {
            signinBtn.style.display = "none";
            signoutBtn.style.display = "inline-block";
            alert('登入成功');
        }
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



function signout() {

    const signoutBtn = document.getElementById('signout-btn')
    const signinBtn = document.getElementById('signin-card')

    // 清除 cookie 中的 token
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    signoutBtn.style.display = "none"
    signinBtn.style.display = "inline-block"

    // 重定向到首頁
    window.location.href = '/'
}