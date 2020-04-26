// RESPONSIBLE FOR FRONTEND ERROR DISPLAYING

class Errors 
{

    // LOGIN ERROR DISPLAYING FOR USER
    static loginErrors(user) 
    {
        document.querySelectorAll("input").forEach(e=> e.classList.add("inputError"));
            
        const errorMsg = document.createElement("p");
        errorMsg.innerText = user.error;
        errorMsg.style.textAlign = "center";
        errorMsg.style.color = "indianred";
        errorMsg.style.fontWeight = "bold";

        const inputs = document.querySelectorAll("input")
        inputs[inputs.length-1].after(errorMsg);

        setTimeout(()=>
        {
            document.querySelectorAll("input").forEach(e=> e.classList.remove("inputError"));
            errorMsg.remove();
        }, 2500);
    }

    // SINGUP ERROR DISPLAYING FOR USER
    static signupErrors(user) 
    {
        document.querySelectorAll("input").forEach(e=> e.classList.add("inputError"));
            
            const inputs = document.querySelectorAll("input")
            
                user.loginError.forEach(e=>
                    {
                    let errorMsg = document.createElement("p");
                    errorMsg.innerText = e;
                    errorMsg.style.textAlign = "center";
                    errorMsg.style.color = "indianred";
                    errorMsg.style.fontWeight = "bold";
                    inputs[inputs.length-1].after(errorMsg);
                    })

            setTimeout(()=>
            {
                document.querySelectorAll("input").forEach(e=> e.classList.remove("inputError"));
                document.querySelectorAll("form > p").forEach(e=> e.remove());
            }, 2500);
    }
}

export default Errors;