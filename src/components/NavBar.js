import React from "react";
import { Link } from "react-router-dom";

import '../styles/fonts.css'
import '../styles/NavBar.css'

import CurrencySelector from "./CurrencySelector";
import MiniCart from "./MiniCart";
import basket from '../images/basket_icon.svg'


class NavBar extends React.Component {

    onChangeCategory(event) {
        this.props.changeCategory(event.target.innerText.toLowerCase())
    }

    onChangeCurrency(currencyFromSelector) {
        this.props.changeCurrency(currencyFromSelector)
    }

    removeGreyPage() {
        if(this.props.productsToCart.length !== 0) {
            this.props.removeGreyPage()
            document.querySelector('.mini-cart').classList.remove('block')
        }
    }

    showHideMiniCart() {
        if(this.props.productsToCart.length !== 0) {
            const miniBasket = document.querySelector('.mini-cart')
            const greyPage = document.querySelector('.background')
            miniBasket.classList.toggle("block")
            greyPage.classList.toggle("inFront")
        }
    }

    render() {

        return(
            <div className="navbar" onClick={() => this.props.showViewButton()}>
                <div className="navbar-buttons">
                    {this.props.categories.map(category => {
                        return (
                            <Link key={category.name} 
                            to={category.name === "all" ? "/" : `/category/${category.name}`}> 
                                <button>{category.name}</button>
                            </Link>
                        )
                    })}
                </div>
                <div className="navbar-right-icons">
                    <div className="navbar-currency">
                        <CurrencySelector 
                            currencies={this.props.currencies}
                            currencyChange={(currencyFromSelector) => this.onChangeCurrency(currencyFromSelector)}  
                            currencyType={this.props.currencyType}
                        />
                    </div>
                    <div className="navbar-basket" onMouseLeave={() => this.removeGreyPage()}>
                        <div className="basket-image">
                                <img src={basket} alt="basket" onClick={() => this.showHideMiniCart()}/>
                            <div className={this.props.numberOfProducts > 0 ? 'basket-numbers visible' : 'basket-numbers hidden'}>
                                <p>{this.props.numberOfProducts}</p>
                            </div> 
                            <MiniCart 
                                productsToMiniCart={this.props.productsToCart} 
                                currencyType={this.props.currencyType}
                                increaseQty={(e) => this.props.increaseQty(e)}
                                reduceQty={(e) => this.props.reduceQty(e)}
                                orderClick={() => this.props.orderClick()}
                                greyPage={(e) => this.props.greyPage(e)}
                                removeGreyPage={() => this.removeGreyPage()}
                            />
                        </div>
                    </div>
                </div>
            </div>  
        )
    }
}


export default NavBar;