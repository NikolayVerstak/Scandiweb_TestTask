import React from "react";
import { Link } from "react-router-dom";

import '../styles/fonts.css'
import '../styles/NavBar.css'

import CurrencySelector from "./CurrencySelector";
import MiniCard from "./MiniCard";
import basket from '../images/basket_icon.png'


class NavBar extends React.Component {

    onChangeCategory(event) {
        this.props.changeCategory(event.target.innerText.toLowerCase())
    }

    onChangeCurrency(currencyFromSelector) {
        this.props.changeCurrency(currencyFromSelector)
    }

    removeGreyPage() {
        if(this.props.productsToCard.length !== 0) {
            this.props.removeGreyPage()
            document.querySelector('.mini-card').classList.remove('block')
        }
    }

    render() {

        return(
            <div className="navbar" onClick={() => this.props.showViewButton()}>
                <div className="navbar-buttons">
                    <Link to="/"> 
                        <button>all</button>
                    </Link>
                    <Link to="/category/clothes">
                        <button>clothes</button>
                    </Link>
                    <Link to="/category/tech">
                        <button>tech</button>
                    </Link>
                </div>
                <div className="navbar-right-icons">
                    <div className="navbar-currency">
                        <CurrencySelector 
                            currencyChange={(currencyFromSelector) => this.onChangeCurrency(currencyFromSelector)}  
                            currencyType={this.props.currencyType}
                        />
                    </div>
                    <div className="navbar-basket" 
                        onMouseEnter={(e) => this.props.greyPage(e)}
                        onMouseLeave={() => this.removeGreyPage()}>
                        <div className="basket-image">
                            <Link to="/card">
                                <img src={basket} alt="basket" />
                            </Link>
                            <div className={this.props.numberOfProducts > 0 ? 'basket-numbers visible' : 'basket-numbers hidden'}>
                                <p>{this.props.numberOfProducts}</p>
                            </div> 
                            <MiniCard 
                                productsToMiniCard={this.props.productsToCard} 
                                currencyType={this.props.currencyType}
                                increaseQty={(e) => this.props.increaseQty(e)}
                                reduceQty={(e) => this.props.reduceQty(e)}
                                orderClick={() => this.props.orderClick()}
                            />
                        </div>
                    </div>
                </div>
            </div>  
        )
    }
}


export default NavBar;