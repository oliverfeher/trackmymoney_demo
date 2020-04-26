import API from "/modules/api.js"
import Dom from "/modules/dom.js";
import ErrorHandling from "/modules/errors.js"

// RESPONSIBLE FOR USER AUTH/LOGIN INCLUDING FORMS

class Auth 
{


    // SETTING CURRENT USER
    static currentUser = {}
    static setCurrentUser(user) 
    {
        // VALIDATION FOR NON EXISTING E-MAIL ADDRESSES
        if (user.hasOwnProperty("error"))
        {
            Dom.renderLogin();
            ErrorHandling.loginErrors(user);
        }
        else if (user.hasOwnProperty("loginError"))
        {
            Dom.renderSignUp();
            ErrorHandling.signupErrors(user);
        }
        else
        {
            this.currentUser = user;
            Dom.loadMainPage();
        }
    }

    // SIGN UP FORM HTML
    static logInForm() 
    {
        return `
            <div id="login-container">
            <div class="title-container">
                <img src="./assets/logo.svg" alt="logo"/>
                <p id="title-text">trackMyMoney</p>
            </div>
            <form action="POST">
                <label for="">E-mail address:</label>
                <input type="text" name="user_email" placeholder="e-mail">
                <label for="">Password:</label>
                <input type="password" name="user_password" placeholder="password"/>
            </form>
            <div id="button-container">
                <button id="log-in">Log in</button>
                <button id="sign-up">Sign up</button>
            </div>
        </div>
        `
    };


    // SIGN UP FORM HTML
    static signUpForm()
    {
        return `
        <div id="login-container">
            <div class="title-container">
                <img src="./assets/logo.svg" alt="logo"/>
                <p id="title-text">trackMyMoney</p>
            </div>
            <form action="POST">
                <label for="">E-mail address:</label>
                <input type="text" name="user_email" placeholder="e-mail">
                <label for="">Password:</label>
                <input type="password" name="user_password" placeholder="password"/>
                <label for="">First name:</label>
                <input type="text" name="user_first_name" placeholder="first name"/>
                <label for="">Last name:</label>
                <input type="text" name="user_last_name" placeholder="last name"/>
            </form>
            <div id="button-container">
                <button id="sign-up">Sign up</button>
            </div>
        </div>
        `
    }

// LOGIN REQUEST
    static logIn = (event) => 
    {
        event.preventDefault();
        
        // GET USER LOGIN INFO FROM FORM INTO AN OBJECT
        const userInfo = 
        {
            user: {
                email: event.path[2].childNodes[3][0].value,
                password: event.path[2].childNodes[3][1].value
            }
        }
        API.postRequest("/login", userInfo)  
            .then(response => this.setCurrentUser(response));
    };

// SIGNUP REQUEST
    static userSignUp =  (event) =>
    {
        const userInfo = 
        {
            user : 
            {
                email: event.path[2].childNodes[3][0].value,
                password: event.path[2].childNodes[3][1].value,
                first_name: event.path[2].childNodes[3][2].value,
                last_name: event.path[2].childNodes[3][3].value
            }
        };

        API.postRequest("/users", userInfo)
            .then(response => this.setCurrentUser(response));
    };

}

export default Auth;