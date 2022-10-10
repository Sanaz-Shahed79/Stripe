const productsArea = document.querySelector('#products-area');
const productsWrapper = document.querySelector('#products-wrapper');
const cartItemsWrapper = document.querySelector('#cart-items-wrapper');
async function products(){
    const result = await fetch("./assets/data.json");
    const products = await result.json();
    if(products){
        if(productsArea){
            products.forEach(product => {
                productsArea.innerHTML += productTemplate(product);
            })
            loading('off')
        }
    }
    console.log(products);
}
function productTemplate(product){
    console.log(product)
    return `
    <!--Product Template-->
    <div class="col-md-3 mb-4">
        <div class="card rounded shadow-sm">
            <div class="card-body">
                <img src="./assets/img/${product.image}" alt="${product.title}">
                <h6 class="m-0">${product.title}</h6>
                <small class="d-block text-muted">${product.description.substring(0,20)}</small>
                <h5 class="font-weight-bold mt-1">${product.price} kr</h5>
                <abbr title="Add To Cart" 
                onclick="addToCart(${product.id},'${product.title}','${product.description}','${product.price}')">
                    <i class="fa fa-plus add-to-cart"></i>
                </abbr>
            </div>
        </div>
    </div>
    <!--./Product Template-->
    `;
}
function loading(status){
    const loader = document.querySelector('#loading');
    if(status == 'show'){
        loader.classList.remove('d-none');
        return true;
    }
    loader.classList.add('d-none');
}
products()
function showHome(){
    productsWrapper.classList.remove('d-none')
    cartItemsWrapper.classList.add('d-none')
}
function showCarts(){
    productsWrapper.classList.add('d-none')
    cartItemsWrapper.classList.remove('d-none')
    cartHTMLUpdate();
}