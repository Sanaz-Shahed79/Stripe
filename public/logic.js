const publicKey = "pk_test_51Jc4KaFYrsT4JzuLnxfWccQV75y84ogkUy5ptJoxmDaja5LIaydegbHC3I8kszcwiuHrWMa4XOsI6DwEFzsBlcGF00RMkCDsNF"


let cart = {}

let stripe = Stripe(publicKey)

const productsDB = {
    "iPhone X": {
        description: "Latest and gratest smartphone from Apple.",
        price_data: {
            currency: "sek",
            product_data: {
                name: "iPhone X",
                metadata: {
                    img: "./resources/iPhonex.png",
                }
            },
            unit_amount: 1149500,
        }
    },
    "One Plus 5": {
        description: "Sleek and powerful smartphone from One Plus",
        price_data: {
            currency: "sek",
            product_data: {
                name: "One Plus 5",
                metadata: {
                    img: "./resources/OnePlus5.png",
                },
            },
            unit_amount: 499500,
        }
    },
    "Galaxy S8": {
        description: "Latest edge to edge smartphone from Samsung.",
        price_data: {
            currency: "sek",
            product_data: {
                name: "Galaxy S8",
                metadata: {
                    img: "./resources/SamsungS8.png",
                },
            },
            unit_amount: 799000,
        }
    },
    "LG V30": {
        description: "Super nice and beautiful smartphone from LG.",
        price_data: {
            currency: "sek",
            product_data: {
                name: "LG V30",
                metadata: {
                    img: "./resources/LGV30.png",
                },
            },
            unit_amount: 749500,
        }
   },
}

const addProduct = async (productKey) => {
    console.log(productKey)
    const product = productsDB[productKey];

    if (!product) {
        throw new Error('Product does not Exist')
    }

    cart[productKey] = cart[productKey] || product;
    cart[productKey].quantity = cart[productKey].quantity || 0;
    cart[productKey].quantity++;
    let getCart = localStorage.getItem('cart')
    let setCart = localStorage.setItem("cart", JSON.stringify(cart))

}

const checkout = async () => {
    try {
        if (Object.keys(cart).length == 0) {
        }
        const response = await fetch("/api/session/new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                line_items: Object.values(cart)
            })
        })
        const { id } = await response.json()
        localStorage.setItem("session", id)
        stripe.redirectToCheckout({ sessionId: id });
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

async function main() {

    localStorage.removeItem("session")
}
main()

