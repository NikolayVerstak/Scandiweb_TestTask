import React from "react";

import '../styles/fonts.css'
import '../styles/CurrencySelector.css';
import arrow from '../images/arrow.png'



class CurrencySelector extends React.Component {

    currencies =[
        {
            label: "USD",
            symbol: "$"
        },
        {
            label: "GBP",
            symbol: "£ "
        },
        {
            label: "AUD",
            symbol: "A$ "
        },
        {
            label: "JPY",
            symbol: "¥ "
        },
        {
            label: "RUB",
            symbol: "₽ "
        }
]

    state ={ currentCurrency: this.currencies[this.props.currencyType].symbol }

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
        if(selectedSymbol !== this.state.currentCurrency) {
            this.setState({currentCurrency: selectedSymbol})
        }
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
        const {currentCurrency} = this.state;

        return(
        <div className="currency-selector-field">
            <div className="selector" 
            //if a user move from currency selector to miniCard, close dropdown
            onMouseLeave={(e) => this.closeDropdown(e)}>
                <div id="selector-field" onClick={(e) => this.onHideDropdown(e)}>
                    <p id="selector-field-symbol">{currentCurrency}</p>
                    <img src={arrow} alt="" id="currency-arrow-icon" />
                </div>
                <ul id="options-field" className="hidden" 
                    onClick={event => this.onOptionClick(event)}>
                    <li className="currency-option">
                        <p id="0" className="symbol-label">$ &nbsp;USD</p>
                    </li>
                    <li className="currency-option">
                        <p id="1" className="symbol-label">£ &nbsp;GBP</p>
                    </li>
                    <li className="currency-option">
                        <p id="2" className="symbol-label">A$ &nbsp;AUD</p>
                    </li>
                    <li className="currency-option">
                        <p id="3" className="symbol-label">¥ &nbsp;JPY</p>
                    </li>
                    <li className="currency-option">
                        <p id="4" className="symbol-label">₽ &nbsp;RUB</p>
                    </li>
                </ul>
            </div> 
        </div>
        )
    }
}

export default CurrencySelector;

