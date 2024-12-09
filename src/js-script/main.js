import '../css-style/main-page.css';
import {searchProduct} from "./func-list.js"


var body = document.querySelector(".body");

body.innerHTML = /* html */`
    <div class="sides"> </div>
    <div class="display" id="d1"></div>
    <div class="sides"></div>
`;

body = document.querySelector("#d1");

body.innerHTML = /* html */`
    <h1 class="page-title"> Welcome to your shopping experience </h1>
    <div class="search-bar">
        <input type="text" placeholder="Find..." id="find" class="search-text">
        <div class="search-icon-div">
            <button id="product-search" class="search-button"><img src="/src/svg/search.svg" class="icon-in-button"></button>
        </div>
    </div>
    <div class="product-card-display" id =pcd>

    </div>
`

const searchButton = document.querySelector("#product-search");
const productCardsViewer = document.querySelector("#pcd");
const searchText = document.querySelector("#find");
populateProductCards()

var product_list;

searchButton.addEventListener("click", () => {
    populateProductCards();
})
searchText.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents the default form submission if within a form
        populateProductCards();
    }
});


async function populateProductCards() {
    const inputValue = document.getElementById("find").value;
    var id = await searchProduct(inputValue);
    product_list = id;
    console.log(id);
    console.log(id.length);
    if(id.length === 0){
        productCardsViewer.innerHTML = `<div class="no-product-found">No-Product-was-found</div>`;
    }
    else{
        productCardsViewer.innerHTML = ``;
    
        id.forEach(element => {
            const newCard = document.createElement('div');
            newCard.className = 'product-card';
            newCard.id = `card-` + element.SRN;
            
            const cardImage = document.createElement('img');
            cardImage.className = 'card-image';
            cardImage.src = element["primary image link"];
            cardImage.alt = element["short description"];

            const cardDesc= document.createElement('div');
            cardDesc.className = 'card-desc';
                const para = document.createElement('p');
                para.className = 'text-desc-card';
                para.textContent = element["short description"];
            cardDesc.appendChild(para);

            const cardInfo= document.createElement('div');
            cardInfo.className = 'card-info';
                const prodName = document.createElement('div');
                prodName.textContent = element["product-name"];
                prodName.className = 'card-prod-name';

                const prodPrice = document.createElement('div');
                prodPrice.className = 'card-prod-price';
                prodPrice.innerHTML = /*html */ `                    
                    <div class="price-show crossed">\$${element["sales-price"]}</div>
                    <div class="price-show">\$${element["sales-price"]*(1-element["discount"])}</div>
                    <button class="add-to-cart"><img src="/src/svg/plus.svg" class="icon-in-button"></button>
                    `
            cardInfo.appendChild(prodName);
            cardInfo.appendChild(prodPrice);

            newCard.appendChild(cardImage);
            newCard.appendChild(cardInfo);

            newCard.appendChild(cardDesc);


            productCardsViewer.appendChild(newCard);

        });
    }
}

