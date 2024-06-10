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


function photos() {
    const apiUrl = '/api/attractions'
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
    photos()
})