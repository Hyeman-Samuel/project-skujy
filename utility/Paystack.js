const request =require("request");
const config= require("config");
const paystack = (req) => {
    const MySecretKey = ""//config.get("PayStackSecretKey");
    const initializePayment = (form, mycallback) => {
        const option = {
            url : 'https://api.paystack.co/transaction/initialize',
            headers : {
                Authorization:"Bearer "+MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
           },
           form
        }
        const callback = (error, response, body)=>{
            return mycallback(error, body);
        }
        request.post(option,callback);
    }

    const verifyPayment = (ref,mycallback) => {
        const option = {
            url : 'https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref),
            headers : {
                Authorization:"Bearer "+ MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
           }
        }
        const callback = (error, response, body)=>{
            return mycallback(error, body);
        }
        request(option,callback);
    }
    return {initializePayment, verifyPayment};
}
module.exports = paystack