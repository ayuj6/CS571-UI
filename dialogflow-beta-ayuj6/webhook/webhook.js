const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const app = express()
const fetch = require('node-fetch')
const base64 = require('base-64')

let username = "";
let password = "";
let token = "";

USE_LOCAL_ENDPOINT = false;
// set this flag to true if you want to use a local endpoint
// set this flag to false if you want to use the online endpoint
ENDPOINT_URL = "";
if(USE_LOCAL_ENDPOINT) {
  ENDPOINT_URL = "http://127.0.0.1:5000";
} else {
  ENDPOINT_URL = "http://cs571.cs.wisc.edu:5000";
}

async function getToken() {
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + base64.encode(username + ":" + password),
    },
  };
  const serverReturn = await fetch(ENDPOINT_URL + "/login", request);
  const serverResponse = await serverReturn.json();
  token = serverResponse.token;
  console.log(token);
  return token;
}

async function getMessage(isUser, text) {
  let request = {
    method: 'POST',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token},
    body: JSON.stringify({ 
      "date": (new Date()).toISOString(),
      "isUser": isUser,
      "text": text,
    }),
    redirect: 'follow'
  }

  const serverReturn = await fetch(ENDPOINT_URL + '/application/messages',request)
  const serverResponse = await serverReturn.json()
  
  message = serverResponse.message
  
  return message;
}

async function clearMessage() {
  let request = {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json',
              'x-access-token': token},
    redirect: 'follow'
  }

  const serverReturn = await fetch(ENDPOINT_URL + '/application/messages',request)
  const serverResponse = await serverReturn.json()
}


app.get('/', (req, res) => res.send('online'))
app.post('/', express.json(), (req, res) => {
const agent = new WebhookClient({ request: req, response: res })

  function welcome() {
    agent.add('Webhook works!')
    console.log(ENDPOINT_URL)
  }


  async function login() {
    username = agent.parameters.username
    password = agent.parameters.password
    console.log(username)
    await getToken()
    await clearMessage()
    await getMessage(true, agent.query)
    

    if(token == "" || typeof token == 'undefined'){
      agent.add("Login unsuccessful. Please check your credentials and try again.") 
    }
    else{
      await navigation("/" + username)
      await getMessage(false, "Login Successful! Welcome back " + username)
      agent.add("Login Successful! Welcome back " + username) 
    }

  }
 

  async function category() {
      let request = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        redirect: 'follow'
      }
    
      const serverReturn = await fetch('http://cs571.cs.wisc.edu:5000/categories',request)
      const serverResponse = await serverReturn.json()
      
      return serverResponse;
    
  }

  async function getCategory(){
    await getMessage(true, agent.query)
    let serverResponse = await category();
    let categories = serverResponse.categories.join(',')
    
    await getMessage(false, "WiscShop has the following categories of products: " + categories + ".")
    agent.add("WiscShop has the following categories of products: " + categories + ".")
  }

  async function getTags() {
    let category = agent.parameters.category;
    await getMessage(true, agent.query)
    let request = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      redirect: 'follow'
    }
  
    const serverResponse = await fetch('http://cs571.cs.wisc.edu:5000/categories',request)
    const allCategory = await serverResponse.json()
    if(!allCategory.categories.includes(category)){
      agent.add("Category " + category + " does not exist.")
      await getMessage(false, "Category " + category + " does not exist.")
    }
    let request1 = {
      method: 'GET',
      redirect: 'follow'
    }
    const serverReturn1 = await fetch('http://cs571.cs.wisc.edu:5000/categories/' + category + '/tags',request1)
    const serverResponse1 = await serverReturn1.json()
    
    console.log(category)
    
    let tags = serverResponse1.tags.join(', ')

    
    await getMessage(false, "The tags for category " + category + " are: " + tags + ".")
    agent.add("The tags for category " + category + " are: " + tags + ".")
  }

  async function getCart() {
    await getMessage(true, agent.query)
    if(token == "" || typeof token == 'undefined'){
      agent.add("You are not logged in.") 
      return
    }

    let request = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('http://cs571.cs.wisc.edu:5000/application/products', request)
    const serverResponse = await serverReturn.json()
    
    let totalPrice = 0.0
    let count = 0
    let cartItems = ""
    let cartMessage = ""

    if(serverResponse.products == null || typeof serverResponse.products == 'undefined'){
      cartMessage = "Your cart seems to be empty. Let's do some shopping!"
    }
    else{
      for(const item of serverResponse.products.values()){
        count += item.count;
        totalPrice += item.price*item.count;
        cartItems += " " + item.count + " " + item.name + ","
      }
      cartMessage = "You currently have " + count + " items in your cart, they are:" + cartItems + 
       ". The total price of your cart comes to $" + totalPrice
    }
      
    await getMessage(false, cartMessage)
    agent.add(cartMessage)
  }


  async function getProduct() {
    let productName = agent.parameters.product;
    let productItems = ""
    let found = false

    await getMessage(true, agent.query)
    let request = {
      method: 'GET',
      redirect: 'follow'
    }
    const serverReturn = await fetch('http://cs571.cs.wisc.edu:5000/products', request)
    const serverResponse = await serverReturn.json()
    
    if(serverResponse.products == null || typeof serverResponse.products == 'undefined'){
      productItems = "There is no such product currently in our shop."
    }
    else{
      for(const item of serverResponse.products.values()){   
        if(item.name == productName ){
          productItems = item.name + ": " + item.description + " You can find it in our " + item.category +
          " ! The price of this item is $" + item.price + "."
          found = true

          let request1 = {
            method: 'GET',
            redirect: 'follow'
          }
        
          const serverReturn1 = await fetch('http://cs571.cs.wisc.edu:5000/products/' + item.id + '/reviews', request1)
          const serverResponse1 = await serverReturn1.json()
          if(serverResponse1.reviews == null || typeof serverResponse1.reviews == 'undefined'){
            productItems += " No reviews for " + item.name
          }
          else{
            let reviewNum = 0
            let totalRating = 0.0
            for(const review of serverResponse1.reviews.values()){
              reviewNum += 1
              totalRating += review.stars
            }
            productItems += " The average rating this item recieved is " + totalRating/reviewNum + "."
          }
          break
        }
      }
      if(!found){
        productItems = "Sorry, we could not find the product you asked for."
      }
    }
      
    await getMessage(false, productItems)
    agent.add(productItems)
  }

  async function addTag() {
    let tagName = agent.parameters.tag
    let tagMess = ""
    await getMessage(true, agent.query)

    let request = {
      method: 'GET',
      redirect: 'follow'
    }
    const serverReturn = await fetch('http://cs571.cs.wisc.edu:5000/tags',request)
    const serverResponse = await serverReturn.json()
    
    if(token == "" || typeof token == 'undefined'){
      agent.add("You are not logged in.") 
      return
    }

    let request1 = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
    const serverReturn1 = await fetch('http://cs571.cs.wisc.edu:5000/application/tags',request1)
    const serverResponse1 = await serverReturn1.json()

    if(serverResponse.tags == null || typeof serverResponse.tags == 'undefined'){
      tagMess = "Please supply us with some tags to narrow down your preferences."
    }
    else{
      let found = false
      for(const tag of serverResponse.tags.values()){
        
        if(tag == tagName){
          found = true
          
          if(typeof serverResponse1.tags == 'undefined' || !serverResponse1.tags.includes(tagName)){
            let request2 = {
              method: 'POST',
              headers: {'Content-Type': 'application/json',
                        'x-access-token': token},
              redirect: 'follow'
            }
          
            await fetch('http://cs571.cs.wisc.edu:5000/application/tags/' + tag, request2)
            tagMess = "Check it out now. We added the tag " + tagName + " for your products."
          }
          break
        } 
      }
      if(!found){
        tagMess = "Sorry we cannot filter your products with that. Try a different tag!"
      }
    }
    
    await getMessage(false, tagMess)
    agent.add(tagMess)
  }


  async function removeTag() {
    let tagName = agent.parameters.tag
    let tagMess = ""
    await getMessage(true, agent.query)

    if(token == "" || typeof token == 'undefined'){
      agent.add("You are not logged in.") 
      return
    }
    let request = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
    const serverReturn1 = await fetch('http://cs571.cs.wisc.edu:5000/application/tags',request)
    const serverResponse1 = await serverReturn1.json()

    if(serverResponse1.tags == null || typeof serverResponse1.tags == 'undefined'){
      tagMess = "Please supply us with the tag you want to remove."
    }
    else{
      let found = false
      for(const tag of serverResponse1.tags.values()){
        if(tag == tagName){
          
          found = true
            let request2 = {
              method: 'DELETE',
              headers: {'Content-Type': 'application/json',
                        'x-access-token': token},
              redirect: 'follow'
            }
          
            await fetch('http://cs571.cs.wisc.edu:5000/application/tags/' + tag, request2)
            tagMess = "Tag " + tagName + " has been removed for you."
          break
        }
        
      }
      if(!found){
        tagMess = tagName + " not found."
      }
    }
    
    await getMessage(false, tagMess)
    agent.add(tagMess)
  }


  async function clearAllTags() {
    let tagMess = "All selected tags have been removed for you."
    await getMessage(true, agent.query)
    if(token == "" || typeof token == 'undefined'){
      agent.add("You are not logged in.") 
      return
    }
    let request = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    await fetch('http://cs571.cs.wisc.edu:5000/application/tags', request)
    await getMessage(false, tagMess)
    agent.add(tagMess)

  }

  async function postCart(productID) {
    let request = {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('http://cs571.cs.wisc.edu:5000/application/products/' + productID, request)
    const serverResponse = await serverReturn.json()
  }


  async function addToCart() {
    let productName = agent.parameters.product
    let count = agent.parameters.number
    await getMessage(true, agent.query)
    
    let request = {
      method: 'GET',
      redirect: 'follow'
    }
    const serverReturn = await fetch('http://cs571.cs.wisc.edu:5000/products', request)
    const serverResponse = await serverReturn.json()

    if(token == "" || typeof token == 'undefined'){
      agent.add("You are not logged in.") 
      return
    }

    let request1 = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
    await fetch('http://cs571.cs.wisc.edu:5000/application/products', request1)
    
    let productItems = ""
    let found = false
    if(serverResponse.products == null || typeof serverResponse.products == 'undefined'){
      productItems = "No products."
    }
    else{
      for(const item of serverResponse.products.values()){
        
        if(item.name == productName ){
          found = true
          for(let i = 0; i<count; i++){
            await postCart(item.id)
            
          }
          productItems = count + " " + productName + " has/have been added into cart."
          break
        }
                
      }
      if(!found){
        productItems = "We could not find " + productName + " in the shop."
      }
      
    }
    
    await getMessage(false, productItems)
    agent.add(productItems)
  }

  async function removeCart(productID) {
    let request = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('http://cs571.cs.wisc.edu:5000/application/products/' + productID, request)
    const serverResponse = await serverReturn.json()
  }

  async function removeFromCart() {
    let productName = agent.parameters.product;
    let count = agent.parameters.number;
    await getMessage(true, agent.query)
    await navigation("/" + username + "/cart")
    if(token == "" || typeof token == 'undefined'){
      agent.add("You are not logged in.") 
      return
    }

    let request1 = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
    const serverReturn1 = await fetch('http://cs571.cs.wisc.edu:5000/application/products', request1)
    const serverResponse1 = await serverReturn1.json()  
    
    let productItems = ""
    let found = false
    if(serverResponse1.products == null || typeof serverResponse1.products == 'undefined'){
      productItems = "You currently have no items in your cart. Let's shop and add some!"
    }
    else{
      for(const item of serverResponse1.products.values()){
        if(item.name == productName ){
          found = true
          if(count <= item.count){
            for(let i = 0; i<count; i++){
              await removeCart(item.id)
            }
            productItems = count + " " + productName + " has/have been removed."
          }
          else{
            productItems = "You only have " + count + " " + productName + " in your cart."
          }
          break
        }
      }
      if(!found){
        productItems = "We could not find " + productName + " in the shop."
      }
    }
    
    await getMessage(false, productItems)
    agent.add(productItems)
  }


  async function clearCart() {
    let productItems = "All product in you cart have been cleared."
    await getMessage(true, agent.query)
    await navigation("/" + username + "/cart")
    if(token == "" || typeof token == 'undefined'){
      agent.add("You are not logged in.") 
      return
    }
    let request = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn = await fetch('http://cs571.cs.wisc.edu:5000/application/products', request)
    const serverResponse = await serverReturn.json()

    
    await getMessage(false, productItems)
    agent.add(productItems)
  }


  async function navigation(page) {
    let request = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      body: JSON.stringify({
        "back": false,
        "dialogflowUpdated": true,
        "page": page
      }),
      redirect: 'follow'
    }
    await fetch('http://cs571.cs.wisc.edu:5000/application', request)
  }

  async function reviewCart() {
    let productMess = ""
    await getMessage(true, agent.query)
    if(token == "" || typeof token == 'undefined'){
      agent.add("You are not logged in.") 
      return
    }
    let request = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'x-access-token': token},
      redirect: 'follow'
    }
  
    const serverReturn1 = await fetch('http://cs571.cs.wisc.edu:5000/application/products', request)
    const serverResponse1 = await serverReturn1.json()
    
    if(serverResponse1.products == null || typeof serverResponse1.products == 'undefined' || serverResponse1.products.length == 0){
      productMess = "There are no items in your cart."
    }
    else{
      await navigation("/" + username + "/cart-review")
      productMess = "Please review your cart."
    }
    
    await getMessage(false, productMess)
    agent.add(productMess)
  }

  async function confirmCart() {
    await getMessage(true, agent.query)
    let productMess = "Your order has been placed! Thank you for shopping with WiscShop!"
    if(token == "" || typeof token == 'undefined'){
      agent.add("You are not logged in.") 
      return
    }

    await navigation("/" + username + "/cart-confirmed")
    await getMessage(false, productMess)
    agent.add(productMess)
  }

  async function pageNavigate() {
    let category = agent.parameters.category
    let product = agent.parameters.product
    let pageIntent = agent.parameters.pageIntent
    let pageMess = ""
    await getMessage(true, agent.query)
    if(token == "" || typeof token == 'undefined'){
      agent.add("You are not logged in, please log in to be taken to a new page.") 
      return
    }

    if(pageIntent == "welcome"){
      await navigation("/")
      pageMess = "Welcome to the WiscShop."
    }
    else if(pageIntent == "sign in" || pageIntent == "log in"){
      await navigation("/signIn")
      pageMess = "Taking you to the sign-in page."
    }
    else if(pageIntent == "sign up"){
      await navigation("/signUp")
      pageMess = "Taking you to the sign-up page."
    }
    
    if(username != ""){
      if(category == "" &&  product == ""){
        if(pageIntent == "home"){
          await navigation("/" + username)
          pageMess = "You are now in the homepage."
        }
        else if(pageIntent == "cart"){
          await navigation("/" + username + "/cart")
          pageMess = "Here is your cart."
        }
        else if(pageIntent == "review cart"){
          await navigation("/" + username + "/cart-review")
          pageMess = "Review the products in your cart."
        }
        else if(pageIntent == "confirm cart"){
          await navigation("/" + username + "/cart-confirmed")
          pageMess = "Here is your confirmed order!"
        }
      }
      else if(category != "" && product == ""){
        await navigation("/" + username + "/" + category)
        pageMess = "Now showing you the products in the " + category + " category."
      }
      else if((category == "" && product != "") || (category != "" && product != "")){
        let request = {
          method: 'GET',
          redirect: 'follow'
        }
        
        const serverReturn = await fetch('http://cs571.cs.wisc.edu:5000/products', request)
        const serverResponse = await serverReturn.json()
        let found = false
        for(const item of serverResponse.products.values()){
          if(item.name == product){
            found = true
            await navigation("/" + username + "/" + item.category + "/products/" + item.id)
            pageMess = "Here is the page for " + product + "."
            break
          }
        }
        if(!found){
          pageMess = "We can't find the product you wanted to look at."
        }
      
      }
    }
    
    await getMessage(false, pageMess)
    agent.add(pageMess)
  }



  let intentMap = new Map()
  intentMap.set('Default Welcome Intent', welcome)
  intentMap.set('Login', login) 
  intentMap.set('getCategory', getCategory)
  intentMap.set('getTags', getTags)
  intentMap.set('getCart', getCart)
  intentMap.set('getProduct', getProduct)

  //
  intentMap.set('addTag', addTag)
  intentMap.set('removeTag', removeTag)
  intentMap.set('clearAllTags', clearAllTags)
  //

  intentMap.set('addToCart', addToCart)
  intentMap.set('removeFromCart', removeFromCart)
  intentMap.set('clearCart', clearCart)

  intentMap.set('reviewCart', reviewCart)
  intentMap.set('confirmCart', confirmCart)
  intentMap.set('pageNavigate', pageNavigate)
  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT || 8080)
