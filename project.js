const btnCart = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const btnClose = document.querySelector('#cart-close');

btnCart.addEventListener('click', () => {
    cart.classList.add('cart-active');
});

btnClose.addEventListener('click', () => {
    cart.classList.remove('cart-active');
});

document.addEventListener('DOMContentLoaded', () => {
    loadFood();
    loadCartFromStorage();
});

function loadFood() {
    loadContant();
}

function loadContant() {
    // remove food items from cart
    let btnRemove = document.querySelectorAll('.cart-remove');
    btnRemove.forEach((btn) => {
        btn.addEventListener('click', removeItem);
    });

    // product item change event
    let qtyElements = document.querySelectorAll('.cart-quantity');
    qtyElements.forEach((input) => {
        input.addEventListener('change', changeQty);
    });
  

    // product cart/
    let cartBtns = document.querySelectorAll('.add-cart');
    cartBtns.forEach((btn) => {
        btn.addEventListener('click', addCart);
    });

    updateTotal();
}

function removeItem() {
    if (confirm('Are You Sure to Remove')) {
        let title = this.parentElement.querySelector('.cart-food-title').innerHTML;
        itemList = itemList.filter((el) => el.title !== title);
        updateLocalStorage();
        displayCartItems();
        updateTotal(); // Update total after removing items
    }
}

function changeQty() {
    if (isNaN(this.value) || this.value < 1) {
        this.value = 1;
    }
    updateTotal();
    updateLocalStorage();
}

let itemList = [];

function addCart() {
    let food = this.parentElement;
    let title = food.querySelector('.food-title').innerHTML;
    let price = food.querySelector('.food-price').innerHTML;
    let imgSrc = food.querySelector('.food-img').src;

    let newProduct = { title, price, imgSrc, quantity: 1 };

    if (itemList.find((el) => el.title === newProduct.title)) {
        alert("Product Already added to the cart");
        return;
    } else {
        itemList.push(newProduct);
        updateLocalStorage();
    }

    displayCartItems();
    updateTotal();
}

function createCartProduct(title, price, imgSrc, quantity) {
    return `
        <div class="cart-box">
            <img src="${imgSrc}" class="cart-img" alt="">
            <div class="detail-box">
                <div class="cart-food-title">${title}</div>
                <div class="price-box">
                    <div class="cart-price">${price}</div>
                    <div class="cart-amt">RS. ${parseFloat(price.replace("RS.", ""))}</div>
                </div>
                <input type="number" value="${quantity}" class="cart-quantity">
            </div>
            <ion-icon name="trash-outline" class="cart-remove"></ion-icon>
        </div>
    `;
}

function updateTotal() {
    const cartItems = document.querySelectorAll('.cart-box');
    const totalValue = document.querySelector('.total-price');

    let total = 0;

    cartItems.forEach((product) => {
        let priceElement = product.querySelector('.cart-amt');
        let amt = parseFloat(priceElement.innerHTML.replace("RS.", ""));
        total += amt;
    });


    cartItems.forEach(product=>{
        let priceElement=product.querySelector('.cart-price');
        let price=parseFloat(priceElement.innerHTML.replace("RS.",""));
        let qty=product.querySelector('.cart-quantity').value;
        total+=(price*qty);
        product.querySelector('.cart-amt').innerText="RS."+(price*qty);

    })




    totalValue.innerHTML = `RS. ${total.toFixed(2)}`;

    const cartCount = document.querySelector('.cart-count');
    let count = itemList.reduce((acc, product) => acc + product.quantity, 0);
    cartCount.innerHTML = count;

    if (count === 0) {
        cartCount.style.display = 'none';
    } else {
        cartCount.style.display = 'block';
    }
}

function updateLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(itemList));
}

function loadCartFromStorage() {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
        itemList = JSON.parse(storedCartItems);
        displayCartItems();
        updateTotal(); // Update total when loading items from storage
    }
}

function displayCartItems() {
    let cartBasket = document.querySelector('.cart-content');
    cartBasket.innerHTML = ''; // Clear existing items to avoid duplication

    itemList.forEach((item) => {
        let newProductElement = createCartProduct(item.title, item.price, item.imgSrc, item.quantity);
        let element = document.createElement('div');
        element.innerHTML = newProductElement;
        cartBasket.append(element);

        // Attach event listeners to the newly created elements
        let removeBtn = element.querySelector('.cart-remove');
        removeBtn.addEventListener('click', removeItem);

        let qtyInput = element.querySelector('.cart-quantity');
        qtyInput.addEventListener('change', changeQty);
    });

    updateTotal();
}

// Load items from local storage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadFood();
    loadCartFromStorage();
});




// Selecting elements for the wishlist
const wishlistIcon = document.querySelector('#wishlist-icon');
const wishlist = document.querySelector('.wishlist');
const wishlistClose = document.querySelector('#wishlist-close');
const wishlistBtns = document.querySelectorAll('.wish-cart');
const wishlistCount = document.querySelector('.wishlist-count');

// Initialize wishlist items array
let wishlistItems = [];

// Update the count of wishlist items displayed on the wishlist icon
function updateWishlistCount() {
    const count = wishlistItems.length;
    wishlistCount.textContent = count;
    // Show or hide the count based on whether there are items in the wishlist
    wishlistCount.style.display = count > 0 ? 'block' : 'none';
}

// Add event listeners for wishlist icon and close button
wishlistIcon.addEventListener('click', () => {
    wishlist.classList.add('wishlist-active');
});

wishlistClose.addEventListener('click', () => {
    wishlist.classList.remove('wishlist-active');
});

// Add event listeners to "Add to Wishlist" buttons
wishlistBtns.forEach(btn => {
    btn.addEventListener('click', addToWishlist);
});

// Add item to the wishlist
function addToWishlist() {
    const food = this.parentElement;
    const title = food.querySelector('.food-title').innerHTML;
    const price = food.querySelector('.food-price').innerHTML;
    const imgSrc = food.querySelector('.food-img').src;

    const newItem = { title, price, imgSrc };

    // Check if the item already exists in the wishlist
    if (wishlistItems.find(item => item.title === newItem.title)) {
        alert("Product already added to the wishlist");
        return;
    }

    wishlistItems.push(newItem);
    updateWishlistLocalStorage();
    displayWishlistItems();
    updateWishlistCount(); // Update wishlist count
}

// Remove an item from the wishlist
function removeFromWishlist() {
    if (confirm('Are you sure you want to remove this item from the wishlist?')) {
        const title = this.parentElement.querySelector('.wishlist-food-title').innerHTML;
        wishlistItems = wishlistItems.filter((el) => el.title !== title);
        this.parentElement.remove();
        updateWishlistLocalStorage();
        updateWishlistCount(); // Update wishlist count
    }
}

// Update wishlist items in local storage
function updateWishlistLocalStorage() {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
}

// Load wishlist items from local storage
function loadWishlistFromStorage() {
    const storedWishlistItems = localStorage.getItem('wishlistItems');
    if (storedWishlistItems) {
        wishlistItems = JSON.parse(storedWishlistItems);
        displayWishlistItems();
        updateWishlistCount(); // Update wishlist count when loading items from storage
    }
}

// Display wishlist items on the page
function displayWishlistItems() {
    const wishlistBasket = document.querySelector('.wishlist-content');
    wishlistBasket.innerHTML = ''; // Clear existing items to avoid duplication

    wishlistItems.forEach((item) => {
        const newProductElement = createWishlistProduct(item.title, item.price, item.imgSrc);
        const element = document.createElement('div');
        element.innerHTML = newProductElement;
        wishlistBasket.appendChild(element);

        // Attach event listeners to the newly created elements
        const removeBtn = element.querySelector('.wishlist-remove');
        removeBtn.addEventListener('click', removeFromWishlist);
    });
}

// Function to create HTML element for a product in the wishlist
function createWishlistProduct(title, price, imgSrc) {
    return `
        <div class="wishlist-box">
            <img src="${imgSrc}" class="wishlist-img" alt="">
            <div class="detail-box">
                <div class="wishlist-food-title">${title}</div>
                <div class="price-box">
                    <div class="wishlist-price">${price}</div>
                </div>
            </div>
            <ion-icon name="trash-outline" class="wishlist-remove"></ion-icon>
        </div>
    `;
}

// Load wishlist items from local storage when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadWishlistFromStorage();
});

