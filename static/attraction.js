const pathname = window.location.pathname;
const parts = pathname.split('/');
const id = parts[parts.length - 1];
let photos = []
let photoIndex
const photoTag = document.querySelector('#slide-photos')


// document.addEventListener('DOMContentLoaded', function() {
//     checkLoginStatus()
//     att(id)
//     slidephotos()

// });


function slidephotos() {
    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    // const container = document.querySelector('#container1');

    arrowLeft.addEventListener('click', function(event) {
        event.preventDefault();
        if (photos.length > 0 && photoIndex > 0) {
            photoTag.src = photos[--photoIndex]
            updateActiveButton(photoIndex)
        }
    });

    arrowRight.addEventListener('click', function(event) {
        event.preventDefault();
        if (photos.length > 0 && photoIndex < photos.length-1 ) {
            photoTag.src = photos[++photoIndex]
            updateActiveButton(photoIndex)
        }
    });
}


function att(id) {
    console.log(id)
    const imgBox = document.querySelector('.att-imgbox')
    const attName = document.querySelector('#att-name')
    const mrtName = document.querySelector('#mrt-name')
    const desc = document.querySelector('.desc')
    const address = document.querySelector('.address')
    const transport = document.querySelector('.transport')

    const slidePhotos = document.getElementById('slide-photos')
    const btnContainer = document.getElementById('btn-container')


    fetch(`/api/attraction/${id}`)
    .then(response => response.json())
    .then(data => {
        // console.log(data)
        attName.innerText = data.data[0].name
        mrtName.innerText = data.data[0].mrt
        photos = data.data[0].images
        if (photos.length > 0) {
            photoIndex = 0 //抓第一張圖
            photoTag.src = photos[photoIndex]
        }

        // 預載圖片
        for (let i=0;i<data.data[0].images.length;i++) {
            //console.log(data.data[0].images[i])
            let lnk = document.createElement('link');
            lnk.href = data.data[0].images[i];
            lnk.rel = 'preload';
            lnk.as = 'image';
            lnk.crossorigin="anonymous";
            document.head.appendChild(lnk);

        // 載入景點敘述
        desc.innerText = data.data[0].description
        address.innerText = data.data[0].address
        transport.innerText = data.data[0].transport

        // 生成按鈕
        btnContainer.innerHTML = '' // 清空按鈕容器
        photos.forEach((photo, index) => {
            const button = document.createElement('button')
            button.classList.add('dot')
            button.onclick = () => {
                slidePhotos.src = photo
                updateActiveButton(index)
                photoIndex = index
            }
            btnContainer.appendChild(button)
        })

        // 預設選擇第一個按鈕
        updateActiveButton(0)

        }
    })
}


function updateActiveButton(activeIndex) {
    const buttons = document.querySelectorAll('#btn-container .dot')
    buttons.forEach((button, index) => {
        if (index === activeIndex) {
            button.classList.add('active')
        } else {
            button.classList.remove('active')
        }
    })
}


function updateFee() {
    // 獲取Radio按鈕和費用元素
    const amRadio = document.getElementById('am');
    const pmRadio = document.getElementById('pm');
    const feeElement = document.getElementById('fee');

    if (pmRadio.checked) {
        feeElement.textContent = '新台幣2500元';
    } else {
        feeElement.textContent = '新台幣2000元';
    }
}