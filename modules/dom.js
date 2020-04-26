// import Auth from "/modules/auth.js";
// import Money from "/modules/money.js"
// import Pie from "/modules/pie.js"

// RESPONSIBLE FOR MANIPULATING THE DOM
class Dom
{
    static container = document.querySelector("#main-container");

    // RENDER LOG IN FORM
    static renderLogin()
    {
        // render login form
        this.container.innerHTML = Auth.logInForm();

        // login eventlistener to login button
        const loginButton = document.querySelector("#log-in");
        loginButton.addEventListener("click", Auth.logIn);

        // sign up eventlistener to signup button
        const signUpButton = document.querySelector("#sign-up");
        signUpButton.addEventListener("click", this.renderSignUp);
    }
    
    // render sign up form
    static renderSignUp = () =>
    {
        this.container.innerHTML = Auth.signUpForm();
        document.querySelector(".title-container").style.marginTop = "5%";
        const signUpButton = document.querySelector("#sign-up");
        signUpButton.addEventListener("click", Auth.userSignUp);
    }

    // RERENDER AFTER SUCCESFUL LOGIN
    static loadMainPage()
    {
        this.container.innerHTML = `${this.renderLoggedInHeader()}  ${this.renderIncomeSection(Auth.currentUser)} ${this.renderPieSection()} ${this.renderBillsSection()} ${this.renderFooter()}`;
        this.getUsersBills(Auth.currentUser);
        this.flipping();
        Pie.generateChart(Auth.currentUser);
        document.querySelector("#reset-month").addEventListener("click", Money.resetMonth);
    };

    // RENDER LOGGED IN HEADER
    static renderLoggedInHeader()
    {
        return `
        <div id="user-container">
            <div class="title-container" id="logged-in-title">
                <img src="./assets/logo.svg" alt="logo" id="logo"/>
                <p id="title-text">trackMyMoney</p>
            </div>
            <div id="welcome-container">
                <p id="welcome-msg">Welcome, ${Auth.currentUser.first_name + " " + Auth.currentUser.last_name}!</p>
                <p id="date-now">${this.getTodaysDate()}</p>
            </div>
        </div>`
    }

    // RENDER INCOME SECTION\
    static renderIncomeSection(user) 
    {
        
        return `
            <div id="income-section" class="flip-box">
                <div class="flip-box-inner">
                    <div class="flip-box-front">
                        <p id="total-income">Total income: $${user.income}</p>
                        <div id="progress-container">
                            <ul>
                                <p id="bar-remaining-text">remaining $${user.income - Money.getBillsValue(user)}</p>
                                <li class="base-bar"></li>
                                <li id="bar-remaining" style="width:${this.calculateRemainingWidth(user)}%;"></li>

                                    <p id="bar-spent-text">spent $${Money.getBillsValue(user)}</p>
                                    <li class="base-bar"></li>
                                <li id="bar-spent" style="width:${this.calculateSpentWidth(user)}%;"></li>
                            </ul>
                            <p id="edit-income-section" >edit</p>
                        </div>
                    </div>

                    <div class="flip-box-back">
                        <form id="income-form">
                            <label>Add/Edit Income:</label>
                            <input type="number">
                        </form>
                        <p id="income-submit">Submit</p>
                        <p id="income-back">Back</p>
                    </div>
                </div>
            </div>
        `
    }
    // RENDER BILLS SECTION
    static renderBillsSection()
    {
        return `
            <div id="bills-section" class="flip-box">
                <div class="flip-box-inner">
                    <div class="flip-box-front">
                    <p id="bills-title">Your bills:</p>
                        <div id="bills">
                        </div>
                    <p id="edit-bills-section" >edit</p>
                    </div>

                    <div class="flip-box-back" id="bills-flip-back">
                        <form id="income-form">
                            <label>Add Bill:</label>
                            <input type="text" placeholder="bill title">

                            <input type="number" placeholder="bill cost">

                            <input type="date" placeholder="due by">
                        </form>
                        <p id="bills-submit">Add</p>
                        <p id="bills-back">Back</p>
                    </div>
                </div>
            </div>`
    }

    // RENDER PIE SECTION
    static renderPieSection()
    {
        return `
        <div id="bills-pie-section">
            <p id="bills-title">Bills Chart</p>
            <p id="reset-month">Reset Month</p>
        </div>
        `
    }

    // RENDER FOOTER SECTION
    static renderFooter()
    {
        return `
        <footer>
            <p>Copyright © trackMyMoney 2020</p>
            <p> by: Oliver Feher</p>
        </footer>`
    }

    // RENDER CURRENTUSERS BILLS
    static getUsersBills()
    {
        Auth.currentUser.bills.forEach(bill=> 
        {

            let billContainer = document.createElement("div");
            billContainer.setAttribute("class", "bill-container");

            let ubill = document.createElement("p")
            ubill.innerText = `${bill.name} - $${bill.cost}`
            ubill.setAttribute("class", "bill-text")

            let dateButton = document.createElement("p");
            dateButton.setAttribute("class", "bill-date-button");
            dateButton.innerText = this.parseDate(bill.date).slice(0,-5).toUpperCase();
            

            let statusButton = document.createElement("p");
            statusButton.setAttribute("class", "bill-status-button");
            statusButton.setAttribute("id", bill.id)
            statusButton.addEventListener("click", Money.payBill)

            this.usersBillInfo(bill, statusButton);

            // APPENDING CREATED ELEMENTS
            billContainer.append(dateButton, ubill, statusButton);
            document.querySelector("#bills").appendChild(billContainer);
        });
    }

    // USER BILLS STATUS
    static usersBillInfo(bill, button)
    {
        if (bill.paid === true)
        {
            button.style.backgroundColor = "#3EF3D3";
            button.style.color = "black";
            button.innerText = "Paid";
        } 
        else 
        {
            button.style.backgroundColor = "#21264B";
            button.style.color = "white";
            button.innerText = "Mark Paid";
        }
    }

    // RENDER CURRENT DATE
    static getTodaysDate()
    {
        let date = new Date();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let currentDate = ` ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        return currentDate;
    }

    // PARSE BILL DATE INTO ONLY DAYS AND MONTHS FORMAT
    static parseDate(str)
    {
        let date = new Date(str);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let currentDate = ` ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        return currentDate;
    }

    // FLIP FLOP SECTION FLIPPING
    static flipping()
    {
        const progressSection = document.querySelector("#edit-income-section");
        progressSection.addEventListener("click", flipFlop);

        const progressSectionBack = document.querySelector("#income-submit");
        progressSectionBack.addEventListener("click", flipFlopBack);
        progressSectionBack.addEventListener("click", Money.getIncome);

        const backButton = document.querySelector("#income-back");
        backButton.addEventListener("click", flipFlopBack);

        const billsSubmit = document.querySelector("#bills-submit");
        billsSubmit.addEventListener("click", Money.addBill);
        billsSubmit.addEventListener("click", flipFlopBillsBack);

        const billsSection = document.querySelector("#edit-bills-section");
        billsSection.addEventListener("click", flipFlopBills);

        const billsBackButton = document.querySelector("#bills-back");
        billsBackButton.addEventListener("click", flipFlopBillsBack);



        // RENDER INCOME EDIT FORM
        function flipFlop() 
        {
            document.querySelector(".flip-box").classList.add("flip-section");
        }

        // RENDER INCOME DISPLAY FORM
        function flipFlopBack() 
        {
            document.querySelector(".flip-box").classList.remove("flip-section");
        }

        // RENDER BILLS EDIT FORM

        function flipFlopBills() 
        {
            document.querySelector("#bills-section").classList.add("flip-section");
        }

        // RENDER BILLS DISPLAY FORM
        function flipFlopBillsBack() 
        {
            document.querySelector("#bills-section").classList.remove("flip-section");
        }
    }

    // UPDATE MONEY BARS
    static updateBars = (user) =>
    {
        // BAR VARIABLES
        let remainingText = document.querySelector("#bar-remaining-text");
        let remainingBar = document.querySelector("#bar-remaining");
        let spentBar = document.querySelector("#bar-spent");
        let spentText = document.querySelector("#bar-spent-text");

        // UPDATE BAR WIDTHS AND REMAINING/SPENT VALUES
        remainingText.innerText = `remaining $${user.income - Money.getBillsValue(user)}`
        remainingBar.style.width =`${this.calculateRemainingWidth(user)}%`
        if (remainingBar.style.width !== "100%") {
            remainingBar.style.borderTopRightRadius = "0px";
            remainingBar.style.borderBottomRightRadius = "0px";
        }
        else 
        {
            remainingBar.style.borderTopRightRadius = "1000px";
            remainingBar.style.borderBottomRightRadius = "1000px";
        }

        spentText.innerText = `spent $${Money.getBillsValue(user)}`
        spentBar.style.width = `${this.calculateSpentWidth(user)}%`;
    }

    // CALCULATE SPENT PERCENTAGE OF USER INCOME
    static calculateSpentWidth(user)
    {
        let spent = (Money.getBillsValue(user) / user.income) * 100;
        return spent;  
    }

    // CALCULATE REMAINING PERCENTAGE OF USER INCOME
    static calculateRemainingWidth(user)
    {
        let remaining = 100 - this.calculateSpentWidth(user);
        return remaining;
    }

    // RENDER NEWLY CREATED BILL TO THE BILLS SECTION
    static updateBills = (user) =>
    {
        
        let newBill = user.new_bill;
        let billContainer = document.createElement("div");
            billContainer.setAttribute("class", "bill-container");

            let ubill = document.createElement("p")
            ubill.innerText = `${newBill.name} - $${newBill.cost}`
            ubill.setAttribute("class", "bill-text")

            let dateButton = document.createElement("p");
            dateButton.setAttribute("class", "bill-date-button");
            dateButton.innerText = this.parseDate(newBill.date).slice(0,-5).toUpperCase();
            

            let statusButton = document.createElement("p");
            statusButton.setAttribute("class", "bill-status-button");
            statusButton.setAttribute("id", newBill.id)
            statusButton.addEventListener("click", Money.payBill)

            this.usersBillInfo(newBill, statusButton);

            // APPENDING CREATED ELEMENTS
            billContainer.append(dateButton, ubill, statusButton);
            document.querySelector("#bills").appendChild(billContainer);
            
            Pie.generateChart(user.user)
    }

    // REFRESH ALL SECTIONS TO ZERO/EMPTY
    static refreshAfterReset(user)
    {
        let arr = document.querySelectorAll("svg")
        for(let i= 0; i< arr.length; i++)
        {
            arr[i].remove()
        }
        let bills = Array.from(document.querySelectorAll(".bill-container"))
        for(let i = 0; i < bills.length; i++)
        {
            bills[i].remove();
        }
        Money.updateUserIncome(user);
        this.updateBars(user);
        document.querySelector("#bar-remaining").style.width = "0%";

    }
}

// export default Dom;
