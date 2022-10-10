
const loginBtn = document.querySelector('#login-btn');
const logoutBtn = document.querySelector('#logout-btn');
const registerBtn = document.querySelector('#register-btn');

async function login(event){
    event.preventDefault();
    const form = event.target;
    const user = {
        email : form.elements.email.value,
        password : form.elements.password.value
    }
    axios.post('/api/login',user)
    .then(response => {
        console.log(response)
        if(response.data.status){
            localStorage.setItem('user', JSON.stringify(response.data.user));
            $('#loginModal').modal('toggle');
            form.reset();
            checkLogin();
            
        }
        alert(response.data.msg);
    })
    
}
async function register(event){
    event.preventDefault();
    const form = event.target;
    const user = {
        email : form.elements.email.value,
        name : form.elements.name.value,
        phone : form.elements.phone.value,
        password : form.elements.password.value,
    }
    axios.post('/api/register',user)
    .then(response => {
        console.log(response)
        if(response.data.status){
            localStorage.setItem('user', JSON.stringify(response.data.user));
            $('#registerModal').modal('toggle');
            form.reset();
            checkLogin();
            
        }
        alert(response.data.msg);
    });  
}
function logout(){
    localStorage.removeItem('user');
    loginBtn.classList.remove('d-none');
    registerBtn.classList.remove('d-none');
    logoutBtn.classList.add('d-none');
    localStorage.removeItem('cart-items');
    cartUpdate();
    cartHTMLUpdate();
}
function checkLogin(){

    const user = localStorage.getItem('user');
    if(user){
        loginBtn.classList.add('d-none')
        registerBtn.classList.add('d-none')
        logoutBtn.classList.remove('d-none')
        return true;
    }
    loginBtn.classList.remove('d-none')
    registerBtn.classList.remove('d-none')
    logoutBtn.classList.add('d-none')
    return false;
}
checkLogin();