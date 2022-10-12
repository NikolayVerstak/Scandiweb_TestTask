import React from "react";
import { Link } from "react-router-dom";

import '../styles/Cart.css';
import '../styles/fonts.css';

import Carousel from "./Carousel";
import plus from '../images/plus.svg';
import minus from '../images/minus.svg';



class Cart extends React.Component {

    state = {
        products: [],
        currencyNumber: this.props.currencyType,
        totalArr:[]
    }

    componentDidMount() {
        this.setState({ products: this.props.productsToCart})
        //make all navigation buttons not highlighted
        this.notActiveButtons()
    }

    componentDidUpdate() {
        if(this.state.products !== this.props.productsToCart) {
            this.setState({ products: this.props.productsToCart})
        }
        this.currencyChange()
    }

    currencyChange() {
        if (this.state.currencyNumber !== this.props.currencyType) {
            this.setState( { currencyNumber: this.props.currencyType})
        }
    }

    notActiveButtons() {
        const buttons = Array.from(document.querySelectorAll('.navbar-buttons>a>button'))
        buttons.forEach(button => {
            if (button.className === 'active') {
                button.classList.remove('active')
            } else { return }
        })
    } 

    //hide "View Bag" button in miniBasket
    hideMiniBasketButton() {
        const viewButton = document.querySelector('.view')
        if(viewButton) {
            viewButton.classList.replace('visible', 'hidden')
        }
    }


    render() {
        const {products} = this.state;

        if(products.length !== 0) { 
            this.hideMiniBasketButton()
            
            //calculate total qty and total amount
            const newPricesArr=[]
                const qtyArr = []
                const { products, currencyNumber} = this.state;
                for (let i = 0; i < products.length; i++) {
                    const priceOfEach = products[i].prices[`${currencyNumber}`].amount*products[i].qty
                    newPricesArr.push(priceOfEach)
                    const qty = products[i].qty
                    qtyArr.push(qty) 
                }
                const amount = newPricesArr.reduce( (prev, next) => {
                    return prev + next
                })
                const tax = amount*0.21
                const totalQty = qtyArr.reduce( (prev, next) => {
                    return prev + next
                })

        return (
            <div className="cart-page">
                <div className="cart-content">
                    <div className="page-name">
                        <h1>CART</h1>
                    </div>
                    <div className="cart-items">
                    {products.map(product => {

                        return (
                        <div className="cart-item" key = {Math.random()*1000} >
                            <div className="item-details">
                                    <div className="item-name">
                                        <h2>{product.brand}</h2>
                                        <Link to={`/product/${product.id}`}>
                                            <p>{product.name}</p>
                                        </Link>
                                    </div>
                                <div className="item-price">
                                    <p>{product.prices[`${currencyNumber}`].currency.symbol} {product.prices[`${currencyNumber}`].amount} </p>
                                </div>
                                <div className="item-attributes" id="item-attributes">

                                {product.attributes ? product.attributes.map(attribute => {

                                    return (
                                    <div key={attribute.id} className={`attr ${attribute.name.split(' ').join('')}`}>
                                        {(attribute.name === "Color") ?
                                        <>
                                        <h1>{attribute.name}:</h1> 
                                        <div className="color-items" id={attribute.name + product.order}>
                                            {attribute.items.map(item => {
                                                return (
                                                <div key={item.id} className={item.selected === "true" ? "marked" : ""}>
                                                    <span className={item.id === "White" ? "whiteColor" : ""}
                                                    style={{'backgroundColor': item.value, 'color': item.value}}>
                                                        {item.value}
                                                    </span> 
                                                </div>)
                                            })}
                                        </div>
                                        </>
                                        : 
                                        <>
                                            <h1>{attribute.name}:</h1> 
                                            <div className="size-capacity-items" id={attribute.name + product.order}>
                                                {attribute.items.map(item => {
                                                    return <p key={item.id} className={item.selected === "true" ? "marked" : ""}>{item.value}</p>
                                                })}
                                            </div>
                                        </>
                                        }
                                    </div>)
                                }) : null }
                                </div>
                            </div>
                            
                            <div className="item-buttons">
                                <button className="qty-increase">
                                    <img src={plus} alt={product.order}
                                    onClick={(e) => this.props.increaseQty(e)}/>
                                </button>
                                <h1>{product.qty}</h1>
                                <button className="qty-reduce">
                                    <img src={minus} alt={product.order} 
                                    onClick={(e) => this.props.reduceQty(e)}/>
                                </button>
                            </div>
                            <div className="item-pictures">
                                <Carousel gallery={product.gallery}/>
                            </div>
                        </div>    
                    )
                    })}
                    </div>
                    <div className="cart-total">
                        <div className="total-description">
                            <span className="text">
                                <p className="tax-text">Tax 21%:</p>
                                <p className="qty-text">Quantity:</p>
                                <p className="amount-text">Total:</p>
                            </span>
                            <span className="numbers">
                                <p className="tax-number">
                                    {products[0].prices[`${currencyNumber}`].currency.symbol}
                                    {tax.toFixed(2)}
                                </p>
                                <p className="qty-number">{totalQty}</p>
                                <p className="amount-number">
                                    {products[0].prices[`${currencyNumber}`].currency.symbol}
                                    {amount.toFixed(2)}
                                </p>
                            </span>
                        </div>
                        <div className="order-button">
                            <button onClick={() => this.props.orderClick()}>
                                ORDER
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
        } else { 
            return (
            <div className="empty-basket">
                <h1>Your basket is empty</h1>
                <p>Please use navigation bar to find what your looking for and add to your basket.</p>
            </div>
        )} 
    }
}

export default Cart;