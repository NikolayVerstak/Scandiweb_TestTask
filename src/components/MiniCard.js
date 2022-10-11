import React from "react";
import { Link } from "react-router-dom";

import '../styles/MiniCard.css';
import '../styles/fonts.css';

import minus from '../images/minus.png'
import plus from '../images/plus.png'



class MiniCard extends React.Component {

    state = {
        products: [],
        currencyNumber: this.props.currencyType
    }

    componentDidMount() {
        if(this.state.products !== this.props.productsToMiniCard) {
            this.setState({ products: this.props.productsToMiniCard})
        }
    }

    componentDidUpdate() {
        if(this.state.products !== this.props.productsToMiniCard) {
            this.setState({ products: this.props.productsToMiniCard})
        }
        this.currencyChange()
    }

    currencyChange() {
        if (this.state.currencyNumber !== this.props.currencyType) {
            this.setState({currencyNumber: this.props.currencyType})
        }
    }


    render() {
        const {products} = this.state;
        
        if(products.length !== 0) {
            
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
            const totalQty = qtyArr.reduce( (prev, next) => {
                return prev + next
            })

            return(
                <div className="mini-card">
                    <div className="space"></div>
                    <div className="mini-card-content"
                    onMouseEnter={(e) => this.props.greyPage(e)}
                    onMouseLeave={() => this.props.removeGreyPage()}>
                        <div className="total-qty">
                            <h1>My Bag,&nbsp;</h1>
                            <h2> {totalQty === 1 ? "1 item" : `${totalQty} items`}</h2>
                        </div>
                        <div className="mini-items">
                        
                        {products.map(product => {

                            return (
                            <div className="mini-item" key = {Math.random()*1000} >
                                <div className="mini-item-details">
                                        <div className="mini-item-name">
                                            <h2>{product.brand}</h2>
                                            <Link to={`/product/${product.id}`}>
                                                <p className="linkToProduct" id={product.id}>{product.name}</p>
                                            </Link>
                                        </div>
                                    <div className="mini-item-price">
                                        <p>{product.prices[`${currencyNumber}`].currency.symbol} {product.prices[`${currencyNumber}`].amount} </p>
                                    </div>
                                    <div className="mini-item-attributes">

                                    {product.attributes ? product.attributes.map(attribute => {
                            
                                        return (
                                        <div key={attribute.id} className={`mini-attr ${attribute.name.split(' ').join('')}`}>
                                            {(attribute.name === "Color") ?
                                            <>
                                            <h1>{attribute.name}:</h1> 
                                            <div className="color-mini-items">
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
                                                <div className="size-capacity-miniItems">
                                                    {attribute.items.map(item => {
                                                        return <p key={item.id} 
                                                        className={item.selected === "true" ? "marked" : ""}
                                                        style={attribute.items.length < 4 ? {'width' : '46px'} : {'width' : '24px'} }>  
                                                        {item.value}</p>
                                                    })}
                                                </div>
                                            </>
                                            }
                                        </div>)
                                    }) : null }
                                    </div>
                                </div>
                                <div className="mini-qty-buttons" id="mini-qty-buttons">
                                        <button className="mini-qty-increase">
                                            <img src={plus} alt={product.order} 
                                            onClick={(e) => this.props.increaseQty(e)}/>
                                        </button>
                                        <h1>{product.qty}</h1>
                                        <button className="mini-qty-reduce">
                                            <img src={minus} alt={product.order} id={products.indexOf(product)}
                                            onClick={(e) => this.props.reduceQty(e)}/>
                                        </button>
                                    </div>

                                    <div className="mini-item-pictures" 
                                    style={product.attributes.length === 1 || !product.attributes.length  ? {'height':'138px'} : {'height':'190px'}}>
                                        <img src={product.gallery[0]} alt={product.order} />
                                    </div>
                            </div>)
                            })}
                        </div>
                        <div className="total-amount">
                            <h1>Total</h1>
                            <p>{products[0].prices[`${currencyNumber}`].currency.symbol}{amount.toFixed(2)}</p>
                        </div>
                        <div className="mini-buttons">
                            <Link to='/card'>
                                <button className="view visible">
                                    VIEW BAG 
                                </button>
                            </Link>
                            <button className="order" onClick={() => this.props.orderClick()}>
                                CHECK OUT
                            </button>
                        </div>
                    </div>
                    
                    
                </div>
            ) 
        }
        
    }
}

export default MiniCard;