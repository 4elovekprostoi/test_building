import './style.css';
let list = document.querySelector('.comments');
let pagination = document.querySelector('.pagination');
const btn = document.querySelector('.btn');
let nextPage;
let toSendPage;

const getResponses = response => response.json();

const showComments = json => {
    list.innerHTML = '';
    for (key in json.data) {
        list.innerHTML += `
        <div class="comment">
            <h3>${json.data[key].name}</h3>
            <p>${json.data[key].text}</p>
        </div>
        `
    };
    nextPage = json.next_page_url;
    return json
};

const showPagination = json => {

    if(json.data.length === json.per_page){
        toSendPage = json.current_page + 1;
    } else{ 
        toSendPage = json.current_page;
    }

    if(json.last_page == json.current_page){
        btn.classList.add("hide");
    } else {
        btn.classList.remove("hide");
    }
    if (!json.prev_page_url) {
        json.links.shift();
    }
    if (!json.next_page_url) {
        json.links.pop();
    }

    pagination.innerHTML = '';
    for (key in json.links) {
        pagination.innerHTML += `
        <div class="items">
            <span data-url="${json.links[key].url}">${json.links[key].label}</span>
        </div>
        `
    }
    let pagButtons = document.querySelectorAll('span'), button;
    for (let i = 0; i < pagButtons.length; i++) {
        button = pagButtons[i];
        if(json.links[i].active){
            button.classList.add("active");
        }
        if (button.dataset.url !== 'null') {
            button.addEventListener('click', clickPagination);
            button.classList.add("paginatin-btn");
        } 
    }

}

function clickPagination() {
    url = this.dataset.url;
    getResponse(url);
}

const addComments = json => {
    for (key in json.data) {
        list.innerHTML += `
        <div class="comment">
            <h3>${json.data[key].name}</h3>
            <p>${json.data[key].text}</p>
        </div>
        `
    }
    nextPage = json.next_page_url;
    return json
}

btn.addEventListener('click',()=>{
    fetch(nextPage)
    .then(getResponses)
    .then(addComments)
    .then(showPagination);
});

function getResponse(url = 'https://jordan.ashton.fashion/api/goods/30/comments'){
    fetch(url)
        .then(getResponses)
        .then(showComments)
        .then(showPagination);
}

getResponse();

var inputValue = document.querySelectorAll(".comment-form > input");
var errorMessage = document.querySelector(".comment-form-heder");
var commentSendButton = document.querySelector(".comment-form > .btn");


commentSendButton.addEventListener('click', valueСheck);

function valueСheck(e){
    let a = 0;
    let text ='';
    for(let i = 0 ; i < inputValue.length; i++){
        if(!inputValue[i].value){
            inputValue[i].classList.add("error");
            errorMessage.classList.add("error-message");
            a--;
        } else{
            inputValue[i].classList.remove("error");
            errorMessage.classList.remove("error-message");         
            a++;
        }
        if(a === 2){
            sendComment(inputValue[0].value,inputValue[1].value);
            inputValue[0].value = '';
            inputValue[1].value = '';
        }
    }   
}

async function sendComment(name,text){
    const data = {
        name: name,
        product_id: 30,
        text: text,
        visible: 0
    };
    await fetch('https://jordan.ashton.fashion/api/goods/30/comments', {
        method: 'POST', 
        body: JSON.stringify(data), 
        headers: {'Content-Type': 'application/json;charset=utf-8' }
    })
    const response = await fetch('https://jordan.ashton.fashion/api/goods/30/comments?page=' + toSendPage)
    const jsonResponse = await response.json()
    showComments(jsonResponse);
    showPagination(jsonResponse);
    
}