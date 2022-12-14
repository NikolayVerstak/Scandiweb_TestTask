import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";  

import '../styles/App.css'

import NavBar from "./NavBar";
import Categories from "./Categories";
import Product from './Product';
import Cart from "./Cart";
import PopUp from "./PopUp";
import Loading from "./Loading";
import Error from "./Error";
import OrderDone from "./OrderDone";

import { ALL_CATEGORIES, ALL_CURRENCIES } from "../graphql/queries";
import { endpoint, options } from './FetchData';
var _ = require('lodash');



class App extends React.Component {

state = { 
            categories: [], 
            currencies: [],
            currencyType: 0,
            isLoaded: false, 
            productId: '',
            productsToCart: [],
            numberOfProducts: 0,
            orderInCart: 0,
            popUpProduct: {}
    }
    
    componentDidMount() {
        //fetch categories names to use them in URLs
        options.body = JSON.stringify([{query: ALL_CATEGORIES, variables: {} }, {query: ALL_CURRENCIES, variables: {} }])
        fetch(endpoint, options)
        .then(response => {
            if (response.status >= 500) {
                throw new Error("Error fetching data");
            } else {
                return response.json();
            }
        })
        .then( data => 
            this.setState({categories: data[0].data.categories, currencies: data[1].data.currencies, isLoaded: true}) )
        //when the page is uploaded check if there's any cache data
        if(JSON.parse(localStorage.getItem('productsToCart')) && this.state.productsToCart !== JSON.parse(localStorage.getItem('productsToCart')) ) {
            this.setState({
                productsToCart: JSON.parse(localStorage.getItem('productsToCart')), 
                orderInCart: JSON.parse(localStorage.getItem('orderInCart')) + 1, 
                numberOfProducts: JSON.parse(localStorage.getItem('numberOfProducts'))
            })
        }
        if(JSON.parse(localStorage.getItem('currencyType')) && this.state.currencyType !== JSON.parse(localStorage.getItem('currencyType')) ) {
            this.setState({
                currencyType: JSON.parse(localStorage.getItem('currencyType'))
            })
        } 
    }

    //currencyFromNav comes from NavBar.js
    onChangeCurrency(currencyFromNav) {
        this.setState({currencyType: currencyFromNav})
        localStorage.setItem('currencyType', JSON.stringify(currencyFromNav))
    }
    
    //newProduct comes from GetCategories.js or Product.js
    addToCart(newProduct) {
        const productsList = this.state.productsToCart
        const order = this.state.orderInCart
        const productExist = productsList.find( item => item.id === newProduct.id)
        //the first chech if there is the same product in the cart
        if(productExist) {
            const sameId = productsList.filter(item => item.id === newProduct.id)
            //seach the product by selected attributes
            const sameAttrs = sameId.filter (item => _.isEqual(item.selectedAttrs, newProduct.selectedAttrs) === true)
            //if there is equality with both filters (id and attributes), we increase the qty of product
            if(sameAttrs.length === 1) {
                sameAttrs.forEach( sameProduct => {
                    this.setState({...sameProduct, "qty": ++sameProduct.qty })
                    localStorage.setItem('productsToCart', JSON.stringify(productsList))
                })
            //if there is no equality, we add a new item
            } else {
                //add order property to understand in Cart component whose prodyct's qty we reduce of increase
                const newProductsList = [...productsList, {...newProduct, "qty": 1, "order": order + 1} ]
                this.setState({productsToCart: newProductsList, orderInCart: order + 1})
                localStorage.setItem('productsToCart', JSON.stringify(newProductsList))
                localStorage.setItem('orderInCart', JSON.stringify(this.state.orderInCart))
            }
        } else { //if the same product doesn't exist in the cart
            const newProductsList = [...productsList, {...newProduct, "qty": 1, "order": order + 1} ]
            this.setState({productsToCart: newProductsList, orderInCart: order + 1 })
            localStorage.setItem('productsToCart', JSON.stringify(newProductsList))
            localStorage.setItem('orderInCart', JSON.stringify(this.state.orderInCart))
        }
        this.setState({popUpProduct: newProduct})
        this.showPopUp() //show notification ob the screen
    }

    increaseQty(e) {
        const productsList = this.state.productsToCart
        const order = parseInt(e.target.alt) //we save product order number inside image alt 
        const product = productsList.filter( product => product.order === order)
        const updatedProduct = product[0]

        this.setState({...updatedProduct, "qty": ++updatedProduct.qty })
        localStorage.setItem('productsToCart', JSON.stringify(productsList))
        this.numberUp() //increase the nubmer near the basket icon
    }


    reduceQty(e) {
        const productsList = this.state.productsToCart
        const order = parseInt(e.target.alt) //we save product order number inside image alt 
        const product = productsList.filter( product => product.order === order)
        const updatedProduct = product[0] 
        //check if there is just one piece of selected product
        if(updatedProduct.qty === 1) {
            for (let i = 0; i < productsList.length; i++) {
                if(productsList[i].order === updatedProduct.order) {
                    //remove that product from list
                    const newProductsList = productsList.splice(i, 1)
                    this.setState({productsList: newProductsList})
                    localStorage.setItem('productsToCart', JSON.stringify(productsList))
                    //reduce total qty near basket icon by one
                    this.numberDown();
                    break;
                } 
            }
        //if products has more that one piece, we minus one
        } else {
            this.setState({...updatedProduct, "qty": --updatedProduct.qty })
            localStorage.setItem('productsToCart', JSON.stringify(productsList));
            //reduce total qty near basket icon by one
            this.numberDown();
        }
        this.miniBasketDelay(e)
    }
    
    //to prevent the closing of miniBasket at once
    miniBasketDelay(e) {
        // if miniBasket is opened and user remove last element in a list, we don't close it immediate
        if(e.target.id && parseInt(e.target.id) === this.state.productsToCart.length) {
            const miniBasket = document.querySelector('.mini-cart')
            const greyPage = document.querySelector('div.inFront')
            const height = miniBasket.clientHeight
            //if items overflow miniBasket height don't make a delay
            if(height > 800) {
                miniBasket.classList.add("block")
                greyPage.classList.add("inFront")
            }
            //check if cursor is still ouside of miniBasket and items don't overflow miniBasket height
            if(height <= 800 && greyPage && miniBasket) {
                miniBasket.classList.replace("block", "temporaryBlock")
                greyPage.classList.replace("inFront", "temporaryInFront")
                //create a delay for 1,5s
                setTimeout(function() {
                    miniBasket.classList.remove("temporaryBlock")
                    greyPage.classList.remove("temporaryInFront")
                    //if user didn't move mouse to miniBasket, we remove grey background
                    if(greyPage && miniBasket.classList.value !== "mini-cart block") {
                        greyPage.classList.remove("inFront")
                    }
                }, 1500) 
            }
            
        }
    }

    //increase the number near the basket icon
    numberUp() {
        const newNumber = this.state.numberOfProducts + 1
        this.setState({numberOfProducts: newNumber})
        localStorage.setItem('numberOfProducts', JSON.stringify(newNumber))
    }

    //reduce the number near the basket icon
    numberDown() {
        const newNumber = this.state.numberOfProducts - 1
        this.setState({numberOfProducts: newNumber})
        localStorage.setItem('numberOfProducts', JSON.stringify(newNumber))
        //if user remove last product from miniBasket, close miniBasket without delay and remove grey background 
        if(this.state.numberOfProducts === 1 && document.querySelector('.mini-cart.block')) {
            this.removeGreyPage()
        }
    }

    //if user click on the "Chek out" or "Order" buttons
    numberZero() {
        this.setState({numberOfProducts: 0})
        localStorage.setItem('numberOfProducts', JSON.stringify(0))
    }

    //remove all products from the cart
    orderClick() {
        const emptyBasket = this.state.productsToCart;
        emptyBasket.splice(0, emptyBasket.length)
        const orderZero = 0
        this.setState({productsToCart: emptyBasket, orderInCart: orderZero})
        localStorage.setItem('productsToCart', JSON.stringify(this.state.productsToCart));
        localStorage.setItem('orderInCart', JSON.stringify(orderZero));
        this.numberZero()
        this.removeGreyPage()
        this.showOrderDone()
    }

    //show button "VIEW BAG" in mini-cart if user is not on the Cart Page
    showViewButton() {
        const viewButton = document.querySelector('button.view.hidden')
        if(viewButton && window.location.pathname !== "/cart") {
            viewButton.classList.replace("hidden", "visible")
        }
    }

    //grey background when user open miniBasket
    greyPage(e) {
        //if any products are added to the cart
        if(this.state.productsToCart.length !== 0 && !e.target.alt) {
            document.querySelector('.mini-cart').classList.add('block')
            const background = document.querySelector('div.background')
            background.classList.add('inFront')
        }
    }

    removeGreyPage() {
        const background = document.querySelector(".background")
        if(background.classList.value.includes("inFront") ) {
            background.classList.remove('inFront')
        }
    }

    //notification about added product
    showPopUp() {
        const popUp = document.querySelector('div.popUp-product.show')
        if(!popUp) {
            const popUp = document.querySelector('div.popUp-product.hide')
            popUp.classList.replace('hide', 'show')
            setTimeout(function() { 
                const popUp = document.querySelector('div.popUp-product.show')
                popUp.classList.replace('show','hide')
            }, 1500);
        }
    }

    //notification about successful order
    showOrderDone() {
        const orderDone = document.querySelector('div.orderDone.hide')
        orderDone.classList.replace('hide', 'show')
        setTimeout(function() { 
            const orderDone = document.querySelector('div.orderDone')
            orderDone.classList.add('hide')
        }, 3000);
    }


    render() {
        const { categories, currencies, isLoaded, currencyType, productsToCart, numberOfProducts, popUpProduct } = this.state;
        if (!isLoaded) {
            return (
            <Loading />)
        } else {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <NavBar 
                            changeCurrency={(currencyFromNav) => this.onChangeCurrency(currencyFromNav)}
                            categories={categories}
                            currencies={currencies}
                            numberOfProducts={numberOfProducts}
                            productsToCart={productsToCart} 
                            currencyType={currencyType}
                            increaseQty={(e) => this.increaseQty(e)}
                            reduceQty={(e) => this.reduceQty(e)}
                            orderClick={() => this.orderClick()}
                            showViewButton={() => this.showViewButton()}
                            greyPage={(e) => this.greyPage(e)}
                            removeGreyPage={() => this.removeGreyPage()}
                        />
                        <PopUp product={popUpProduct} />
                        <OrderDone />
                    </div>
                    <Routes>
                        
                        {categories.map(category => {
                            return (
                                <Route key={category.name} 
                                path={category.name === "all" ? "/" : `/category/${category.name}`} element={
                                    <Categories 
                                        categoryName={category.name}
                                        currencyType={currencyType}   
                                        productsToCart={(product) => this.addToCart(product)}
                                        numberUp={() => this.numberUp()}
                                    />}
                                />
                            )
                        })}

                        <Route path='/product/:id' element={
                            <Product currencyType={currencyType} 
                                productsToCart={(product) => this.addToCart(product)}
                                showViewButton={() => this.showViewButton()}
                                numberUp={() => this.numberUp()}
                            />
                        }/>
                        <Route path='/cart' element={
                            <Cart 
                                productsToCart={productsToCart} 
                                currencyType={currencyType} 
                                increaseQty={(e) => this.increaseQty(e)}
                                reduceQty={(e) => this.reduceQty(e)}
                                orderClick={() => this.orderClick()}
                            />
                        }/>
                        <Route path="*" element={ <Error /> } />
                    </Routes>
                    <div className="background"></div>
                </BrowserRouter>
            </div>
        );
        }
    };
};

export default App;

