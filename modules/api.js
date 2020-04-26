
// RESPONSIBLE FOR ALL FETCH REQUEST MADE TO THE BACKENDS API

class ApiAdapter
{

    // FETCH HEADERS CONFIG
    static headersConfig = 
    {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    // BASE URL
    static baseURL = "https://trackmymoney.herokuapp.com/api/v1";


    // UNIVERSAL FETCH POST REQUEST
    static postRequest(url, body)
    {
        return fetch(this.baseURL + url, {
            method: "POST",
            headers: this.headersConfig,
            body: JSON.stringify(body)
        })
        .then(response => response.json())
    };

    // UNIVERSAL FETCH PATCH REQUEST
    static patchRequest(url, body)
    {
        return fetch(this.baseURL + url, {
            method: "PATCH",
            headers: this.headersConfig,
            body: JSON.stringify(body)
        })
        .then(response => response.json())
    };
}

export default ApiAdapter;
