/**/
function getProducts() {
    const getCartList = localStorage.getItem('cart')
    let cartlist = JSON.parse(getCartList)
    
    return cartlist
}

let cart = getProducts()

async function success() {
    
    if (!cart) {
        alert('Köp redan avslutat')
    } else {
        
        let cartItems = Object.values(cart)
        
        let products = cartItems.map((item) => {
            return item.price_data.product_data.name + ' ' + item.quantity + "st"
        })

        let orderDate = new Date()
        const response = await fetch('/api/recet', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderDate,
                products
            })
            
        })
        localStorage.removeItem("cart")
    }
}
success()
