window.addEventListener("load", () => {
    //document.getElementById("mainContainer").innerText = ""
})

productCard()
document.getElementById('homeBtn').addEventListener('click', productCard)
/* document.getElementById('clearBtn').addEventListener('click', ()=>{
    localStorage.removeItem("cart")
}) */

document.getElementById('cartBtn').addEventListener('click', async () => {
    cartCard()
})

function clearCart() {
    localStorage.removeItem("cart")
}


function getProducts() {
    const getCartList = localStorage.getItem('cart')

    let cartlist = JSON.parse(getCartList)
    return cartlist
}



function productCard() {

    const item = productsDB
    let products = Object.values(item)

    let cartDiv = document.getElementById('mainContainer')
    cartDiv.innerHTML = ""

    let cardDiv = document.createElement('div')
    cardDiv.id = "cardDiv"

    let produktdiv = document.createElement('div')
    produktdiv.id = "produktdiv"

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        let productCard = document.createElement('div')
        let produktTitle = document.createElement('h3')
        let produktDesc = document.createElement('p')
        let productImg = document.createElement('img')
        let produktPrice = document.createElement('p')
        let br = document.createElement("br")
        let addbtn = document.createElement('button')

       // productCard.style.borderBottom = "1px solid black"

        productImg.src = product.price_data.product_data.metadata.img

        //produktTitle.style.borderBottom = "1px solid black"
        productCard.id = "productCard"
        produktTitle.innerText = product.price_data.product_data.name
        produktDesc.innerText = product.description
        produktPrice.innerText = "price: " + product.price_data.unit_amount / 100 + "kr"
        produktPrice.style.padding = "10px 0px"
        addbtn.innerText = "add to cart"
        addbtn.id = "checkOutBtn"
        addbtn.style.width = "50%"
        addbtn.onclick = function(){
            addProduct(product.price_data.product_data.name)
        }


        productCard.append(produktTitle, produktDesc, productImg,  br, produktPrice, addbtn, br)
        produktdiv.append(productCard)
    }

    cardDiv.append(produktdiv)
    cartDiv.appendChild(cardDiv)


}


function cartCard() {
    let cartDiv = document.getElementById('mainContainer')
    cartDiv.innerHTML = ""

    const product = getProducts()

    if (!product) {
        let text = document.createElement('h3')
        text.innerText = "There is nothing added to the cart"

        let recetDiv = document.createElement("div")
        recetDiv.id = "recetDiv"

        let getRecet = document.createElement("button")
   



        cartDiv.append(text, getRecet, recetDiv)
        //return
    } else {

        let cartItems = Object.values(product)


        let cardDiv = document.createElement('div')
        cardDiv.id = "cardDiv"

        let produktdiv = document.createElement('div')
        produktdiv.id = "produktdiv"

        let checkoutPrice = 0

        let clearcartbtn = document.createElement('button')



        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            let product = document.createElement('div')

            let produktTitle = document.createElement('h3')
            let produktAmount = document.createElement('p')
            let produktPrice = document.createElement('p')
            let produktImg = document.createElement('img')

            let br = document.createElement("br")

            product.style.margin = "10% 0px"

            produktTitle.style.marginTop = "20px"
            //produktTitle.style.borderBottom = "1px solid black"
            produktTitle.innerText = item.price_data.product_data.name
            produktAmount.innerText = "Amount: x" + item.quantity
            produktPrice.style.padding = "10px 0px "
            produktPrice.innerText = "price: " + item.price_data.unit_amount / 100 + " kr"



            checkoutPrice += item.quantity * item.price_data.unit_amount / 100
            product.append(produktTitle, produktAmount, produktPrice, br)
            produktdiv.append(product)

        }

        clearcartbtn.innerText = "Empty Cart"
        clearcartbtn.addEventListener('click', () => {
            localStorage.removeItem('cart')
            cart = {}
            cartCard()
        })


        let priceTotal = document.createElement("div")
        let checkoutBtn = document.createElement("button")


        checkoutBtn.id = "checkoutBtn"

        priceTotal.innerText = "Price Total: " + checkoutPrice
        priceTotal.style.padding = "10px 0px"
        checkoutBtn.innerText = "Checkout"
        checkoutBtn.addEventListener('click', () => checkout())

        let recetDiv = document.createElement("div")
        recetDiv.id = "recetDiv"


        cardDiv.append(produktdiv, priceTotal, clearcartbtn, checkoutBtn)
        cartDiv.append(cardDiv)

    }
}


