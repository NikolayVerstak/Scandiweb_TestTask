import React from "react";

import '../styles/fonts.css'
import '../styles/CurrencySelector.css';
import arrow from '../images/arrow.svg'



class CurrencySelector extends React.Component {

    state ={ 
        currencies: this.props.currencies,
        currencyType: this.props.currencyType
    }

    onChangeCurrency(event) {
        this.props.currencyChange(event.target.id)
    }
    
    onOptionClick(event) {
        event.stopPropagation()
        const shownField = document.getElementById("selector-field-symbol")
        const optionsField = document.getElementById("options-field")
        const arrowIcon = document.getElementById("currency-arrow-icon")
        //take just symbol from a sign, f.e. "$ USD" and set as selected symbol
        const selectedSymbol = event.target.innerText.split(' ', 1).toString()
        shownField.textContent = selectedSymbol;
        arrowIcon.classList.toggle("rotate")
        optionsField.classList.toggle("hidden")
        this.onChangeCurrency(event)
    }

    //if user click on currency symbol or outside of dropdown, dropdown closes
    onHideDropdown(e) {
        e.stopPropagation()
        const optionsField = document.getElementById("options-field")
        const arrowIcon = document.getElementById("currency-arrow-icon")
        arrowIcon.classList.toggle("rotate")
        optionsField.classList.toggle("hidden")
    }
    
    //close dropdown if it's open when user move mouse to miniBasket
    closeDropdown() {
        const optionsField = document.getElementById("options-field")
        const arrowIcon = document.getElementById("currency-arrow-icon")
        if(optionsField.classList.value !== "hidden") {
            optionsField.classList.add("hidden")
        }
        if(arrowIcon.classList.value === "rotate") {
            arrowIcon.classList.remove("rotate")
        }
    }

    render() {
        const {currencies, currencyType} = this.state;

        return(
        <div className="currency-selector-field">
            <div className="selector" 
            //if a user move from currency selector to miniCard, close dropdown
            onMouseLeave={(e) => this.closeDropdown(e)}>
                <div id="selector-field" onClick={(e) => this.onHideDropdown(e)}>
                    <p id="selector-field-symbol">{currencies[currencyType].symbol}</p>
                    <img src={arrow} alt="" id="currency-arrow-icon" />
                </div>
                <ul id="options-field" className="hidden" 
                    onClick={event => this.onOptionClick(event)}>
                    {currencies.map( (currency, index) => {
                        return (
                            <li className="currency-option" key={currency.symbol}>
                                <p id={index} className="symbol-label">{currency.symbol} &nbsp;{currency.label}</p>
                            </li>
                        )
                    })}
                </ul>
            </div> 
        </div>
        )
    }
}

export default CurrencySelector;

