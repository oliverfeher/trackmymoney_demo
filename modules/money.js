import ApiAdapter from "/modules/api.js";
import Auth from "/modules/auth.js";
import Dom from "/modules/dom.js";

// RESPONSIBLE FOR CALCULATIONS AND DATA PULLS
class Money
{

    // ADD/EDIT USERS INCOME
    static getIncome = (event) =>
    {
        event.preventDefault();

        const userInfo = 
        {
            user: Auth.currentUser,
            income: parseInt(event.target.parentNode.children[0].children[1].value)
        }
        ApiAdapter.patchRequest("/users", userInfo)
            .then(response => this.updateUserIncome(response))
    }

    // UPDATE DOM WITH getIncome() RESULTS
    static updateUserIncome(user)
    {
        Dom.updateBars(user);
        const incomeText = document.querySelector("#total-income");
        incomeText.innerText = `Total income: $${user.income}`
    }

    // GET USERS BILLS TOTAL VALUE/COST
    static getBillsValue(user)
    {
        let costArray = [];
        let paidArray = user.bills.filter(bill=>bill.paid === true)
        for(let i = 0; i < paidArray.length; i++)
        {
            costArray.push(paidArray[i].cost);
        }
        let totalCost = costArray.reduce((total, num) => {return total + num}, 0)
        return totalCost;
    }

    // PAY BILL * MARK PAID *
    static payBill = (event) => 
    {
        const billInfo = 
        {
            user_id: Auth.currentUser.id,
            bill_id: event.target.id
        }
        ApiAdapter.patchRequest(`/users/${Auth.currentUser.id}/bills`, billInfo)
        .then(data => this.updatePaymentStatus(data, event))
    }

    // BILL PAID / UNPAID => CHANGES THE SPENT MONEY VALUE THE BAR AND THE PAID/MARK PAID BUTTON
    static updatePaymentStatus(data, event)
    {

        let bill = data.bills.find(e=> e.id == event.target.id)

        if (bill.paid !== false)
        {
            event.target.style.backgroundColor = "#3EF3D3";
            event.target.style.color = "black";
            event.target.innerText = "Paid";
        } 
        else 
        {
            event.target.style.backgroundColor = "#21264B";
            event.target.style.color = "white";
            event.target.innerText = "Mark Paid";
        }
        this.getBillsValue(data);
        Dom.updateBars.call(this, data);
    }

    // CREATE A NEW BILL
    static addBill(event)
    {

        const userInfo =
        {
            user_id: Auth.currentUser.id,
            bills_title: event.target.parentNode.children[0][0].value,
            bill_cost: event.target.parentNode.children[0][1].value,
            bill_date: event.target.parentNode.children[0][2].value
        }

        ApiAdapter.postRequest(`/users/${Auth.currentUser}/bills`, userInfo)
        .then(user=> Dom.updateBills(user))
       
    }

    // RESET MONTHLY INCOME / PIE CHART AND DELETE ALL BILLS
    static resetMonth()
    {
        fetch(`http://localhost:3000/api/v1/users/${Auth.currentUser.id}/bills`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            
        })
        .then(response=> response.json())
        .then(user=>Dom.refreshAfterReset(user))
    }

}


export default Money;