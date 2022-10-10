async function addToCart(id,title,description,price){
    console.log(id,title,description)
    const items = getCartItems();
    const find = findItem(id);
    if(find.status == false || items.length == 0){
        console.log('New Item' , items.length , find.status )
        items.push(productConstructor(id,title,description,price,1))
    }else{
        console.log('dup');
        console.log(find);
        items[find.index].quantity += 1;
    }

    setCartItems(items)
    cartUpdate()
}   

function getCartItems(){
    return JSON.parse(localStorage.getItem('cart-items')) ?? [];
}
function setCartItems(items){
    console.log(JSON.stringify(items))
    localStorage.setItem('cart-items',JSON.stringify(items))
}
function findItem(id){
    let result = {
        status : false,
        index : 0
    }
    getCartItems().forEach((item,index) => {
        if(item.id == id){
           // console.log('Founded!');
            result.status = true;
            result.index = index;
        }
    })
    return result;
}
function cartUpdate(){
    let count = 0;
    getCartItems().forEach(item => count += item.quantity);
    document.querySelector('.cart-count').innerText = count;
    console.log(getCartItems());
    let paymentBtn = document.querySelector('#paymentBtn');
    if(count > 0){
        paymentBtn.classList.remove('d-none');
    }else{
        paymentBtn.classList.add('d-none');

    }
}
function productConstructor(id,name,description,price,quantity){
    return {
      id,
      name,
      description,
      price,
      quantity
      };
}
function cartHTMLUpdate(){
    let tbody = cartItemsWrapper.querySelector('tbody');
    tbody.innerHTML = '';
    getCartItems().forEach(item => {
        tbody.innerHTML += 
        `
        <tr>
            <th scope="row">${item.id}</th>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${parseFloat(item.price) * parseFloat(item.quantity)}</td>
            <td>
                <button class="btn btn-sm btn-danger"
                onclick="deleteCartItem(${item.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    })
    
}
cartUpdate();
function deleteCartItem(id){
    let cartItems = getCartItems();
    cartItems.forEach((item, index) => {
        if(item.id == id){
            cartItems.splice(index, 1);
        }
    })
    setCartItems(cartItems);
    cartUpdate();
    cartHTMLUpdate();
}