
let stripe = Stripe(
    "pk_test_51LkPKRKM61lhAugfVLMtYlmnE4QtZbXGgBD3v6XnGhiRuU6NGJSPUlPYtWn3A32yICAr5ZkliXjsaCcf7CK9baxV00P1pdIyps"
  );
async function createSession(){
    const user = JSON.parse(localStorage.getItem('user'))
    axios.post('/api/submit-order',{carts : getCartItems() , user})
    .then(response => {
        if(response.data){
            redirect(response.data);
        }
        console.log(response)
    })
}
async function redirect(sessionId){
    return await stripe.redirectToCheckout({ sessionId});

}

function verify(sessionId){
    axios.post(`/api/verify-order/${sessionId}`)
    .then(response => {
        if(response.data){
            setTimeout(() => {
                alert('Your order submited successfully!');
                localStorage.removeItem('cart-items');
                location.href = 'http://localhost:3000';

            }, 1000);   
        }
        console.log(response);

    })
    .catch(err => {
        console.log(err);
        alert('Something is wrong!');
        location.href = 'http://localhost:3000';
    })
}