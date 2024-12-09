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
        <div class="search-sub-bar">
            <button id="product-search" class="search-icon"><img src="/src/svg/search.svg" class="icon-in-button"></button>
            <input type="text" placeholder="Find..." id="find" class="search-text">
        </div>
        <div class="search-icon-div">
            <button id="snf" class="filter-button"><img src="/src/svg/sort-filter.svg" class="icon-in-button">
                <div class="sort-and-filter" id="snf-div"></div></button>
        </div>
    </div>
    <div class="product-card-display" id="pcd">
    </div>
`

const sortAndFilter = document.querySelector("#snf");
const sortAndFilterDiv = document.querySelector("#snf-div");

sortAndFilterDiv.innerHTML=/*html */`
        <div class="snf-title"><p class="snf-text big">Sort</p>
        </div>
        <div class="snf-content" id="sort-price">
            <p class="snf-text">Price</p>
            <button class="order" id="sort-price">
                <img class="icon-in-button is-hidden" src="/src/svg/arrow-down.svg" id="price-down">
                <img class="icon-in-button is-hidden" src="/src/svg/arrow-up.svg" id="price-up">
            </button>
        </div>
        <div class="snf-content" id="sort-name">
            <p class="snf-text">Name</p>
            <button class="order" id="name-order">
                <img class="icon-in-button is-hidden" src="/src/svg/arrow-down.svg" id="name-down">
                <img class="icon-in-button is-hidden" src="/src/svg/arrow-up.svg" id="name-up">
            </button>
        </div>
        <div class="snf-title"><p class="snf-text big">Filter</p>
        </div>
`

const price = document.querySelector("#sort-price");
const name = document.querySelector("#sort-name");

var priceToggle = 0;
var nameToggle = 0;
var sort=["SRN",0];

price.addEventListener("click",() =>{
    nameToggle = 0;
    priceToggle = (priceToggle + 1) % 3;
    console.log(nameToggle,priceToggle);

    document.querySelector("#name-up").classList.add("is-hidden");    
    document.querySelector("#name-down").classList.add("is-hidden");    

    if(priceToggle === 0){
        document.querySelector("#price-up").classList.add("is-hidden");
        document.querySelector("#price-down").classList.add("is-hidden");
        sort=["SRN",0];
    }
    else if(priceToggle === 1){
        document.querySelector("#price-up").classList.remove("is-hidden");
        document.querySelector("#price-down").classList.add("is-hidden");
        sort=["sales-price",1]
    }
    else if(priceToggle === 2){
        document.querySelector("#price-down").classList.remove("is-hidden");
        document.querySelector("#price-up").classList.add("is-hidden");
        sort=["sales-price",2]
    }
    else {
        console.log("sort_error");
    }
    populateProductCards(sort)
});
name.addEventListener("click",() =>{
    priceToggle = 0;
    nameToggle = (nameToggle + 1) % 3;
    console.log(nameToggle,priceToggle);

    document.querySelector("#price-up").classList.add("is-hidden");    
    document.querySelector("#price-down").classList.add("is-hidden");    

    if(nameToggle === 0){
        document.querySelector("#name-up").classList.add("is-hidden");
        document.querySelector("#name-down").classList.add("is-hidden");
        sort=["SRN",0];
    }
    else if(nameToggle === 1){
        document.querySelector("#name-up").classList.remove("is-hidden");
        document.querySelector("#name-down").classList.add("is-hidden");
        sort=["product-name",1]
    }
    else if(nameToggle === 2){
        document.querySelector("#name-down").classList.remove("is-hidden");
        document.querySelector("#name-up").classList.add("is-hidden");
        sort=["product-name",2]
    }
    else {
        console.log("sort_error");
    }
    populateProductCards(sort)
});

const searchButton = document.querySelector("#product-search");
const productCardsViewer = document.querySelector("#pcd");
const searchText = document.querySelector("#find");
populateProductCards(sort)


// Search functionality
searchText.addEventListener("input", ()=> {
    populateProductCards(sort);
});
searchButton.addEventListener("click", () => {
    searchText.focus();
});
searchText.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        populateProductCards(sort);
    }
});

// Toggle sorting div
sortAndFilter.addEventListener("click", (e) => {
    if (!sortAndFilterDiv.contains(e.target)){      //since the div is part of the button
        sortAndFilterDiv.classList.toggle("is-hidden");
    e.stopPropagation(); // Prevent this click from triggering the document click handler
    }
});
// Add click handler to close sorting div when clicking outside
document.addEventListener("click", (e) => {
    // Check if the div is currently visible and the click wasn't inside the div
    if (sortAndFilterDiv.classList.contains("is-hidden") && 
        !sortAndFilterDiv.contains(e.target) &&
        sortAndFilterDiv !== e.target
    ) {
        console.log(e.target);
        sortAndFilterDiv.classList.toggle("is-hidden");
    }
});


async function populateProductCards(sorting) {
    const inputValue = await document.getElementById("find").value;
    console.log("Search Text:",inputValue, ", sorting type:", sorting[0], sorting[1]);
    var product = await searchProduct(inputValue);
    
    console.log(product);
    console.log(product.length);

    product = product.sort(function(a,b){
        var sorter=0;
        if(sorting[0]==="SRN"){
            sorter = (a[sorting[0]]-b[sorting[0]]);
        }
        else if(sorting[0]==="product-name"){
            sorter = a[sorting[0]].localeCompare(b[sorting[0]]);
            if(sorting[1] == 2){
                sorter = - sorter;
            }
        }
        else if(sorting[0]==="sales-price"){
            sorter = (a[sorting[0]]-b[sorting[0]]);
            if(sorting[1] == 2){
                sorter = - sorter;
            }
        }
        return sorter;
    })

    console.log(product);

    const blankdiv = document.createElement('div');
    blankdiv.className='blank-flex-grow';

    var i=0;

    if(product.length === 0){
        productCardsViewer.innerHTML = `<div class="no-product-found">No-Product-was-found</div>`;
    }
    else{
        productCardsViewer.innerHTML = ``;
    
        product.forEach(element => {
            const newblank =blankdiv.cloneNode();
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
                    if(element["inventory"]===0){
                        const priceX = document.createElement('div');
                        priceX.className = 'price-show crossed';
                        priceX.textContent = `Product out of stock`;
                        prodPrice.appendChild(priceX);
                    }
                    else {
                        const priceX = document.createElement('div');
                        priceX.className = 'price-show crossed';
                        priceX.textContent = `\$${element["sales-price"]}`;
                        const price = document.createElement('div');
                        price.className = 'price-show';
                        price.textContent = `\$${element["sales-price"]*(1-element["discount"])}`;
                        const addToCart = document.createElement('button');
                        addToCart.className = 'add-to-cart';
                        addToCart.id = `atc-${element.SRN}`;
                            const logoPlus = document.createElement('img');
                            logoPlus.className = 'icon-in-button';
                            logoPlus.src = '/src/svg/plus.svg';
                        addToCart.appendChild(logoPlus);
                        prodPrice.appendChild(priceX);
                        prodPrice.appendChild(price);
                        prodPrice.appendChild(addToCart);
                    }
            cardInfo.appendChild(prodName);
            cardInfo.appendChild(prodPrice);

            newCard.appendChild(cardImage);
            newCard.appendChild(cardInfo);

            newCard.appendChild(cardDesc);

            productCardsViewer.appendChild(newCard);
            productCardsViewer.appendChild(newblank);
        });
    }
}

