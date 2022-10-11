import React from "react";
import { Link } from "react-router-dom";

import '../styles/fonts.css'
import '../styles/Categories.css';

import Loading from "./Loading";
import { SELECTED_CATEGORY} from "../graphql/queries";
import { endpoint, options } from './FetchData';
import basket from '../images/basket_icon_white.svg'



class Categories extends React.Component {   
    
    state = {
        data: [], 
        isLoaded: false, 
        name: this.props.categoryName,
        currencyNumber: 0,
    }

    componentDidMount() {
        options.body = JSON.stringify({query: SELECTED_CATEGORY, variables: {name: this.state.name} })
        fetch(endpoint, options)
        .then(response => {
            if (response.status >= 500) {
                throw new Error("Error fetching data");
            } else {
                return response.json();
            }
        })
        .then(data => this.setState({data: data.data, isLoaded: true}))
    }

    componentDidUpdate() {
        if (this.props.categoryName !== this.state.name) {
        options.body = JSON.stringify({query: SELECTED_CATEGORY, variables: { name: this.props.categoryName} })
        fetch(endpoint, options)
            .then(response => {
                if (response.status >= 500) {
                    throw new Error("Error fetching data");
                } else {
                    return response.json();
                }
            })
            .then(data => this.setState({data: data.data, isLoaded: true, name: this.props.categoryName}))
        }
        this.currencyChange()
    }
    
    //highlight the button in NavBar еhat matches with category name
    selectedCategoryButton() {
        const buttons = document.querySelectorAll("div.navbar-buttons>a>button")
        for (const MarkedButton of buttons) {
            if (this.state.name === MarkedButton.innerText.toLowerCase()) {
                MarkedButton.classList.add('active')
            } else {
                MarkedButton.classList.remove('active')
            }
        }
    }

    currencyChange() {
        if (this.state.currencyNumber !== this.props.currencyType) {
            this.setState( { currencyNumber: this.props.currencyType})
        }
    }

    addToCard(e) {
        const id = e.target.alt;
        const { data } = this.state;
        const allProducts = data.category.products;
        //find product from all products with the same id as clicked product
        const product = allProducts.find(product => product.id === id);
        //to add a new key-value property to productObj, with first attribures
        const selectedAttrs = {}
        if (product.attributes) {
            product.attributes.forEach( attr => {
                const attrName = attr.id
                const attrValue = attr.items[0].value.toUpperCase()
                selectedAttrs[attrName] = attrValue 
                //highlight selected attribute value as true
                for ( let i = 0; i < attr.items.length; i++) {
                    i === 0 ?
                    attr.items[i].selected = "true" :
                    attr.items[i].selected = "false"
                }
            })
        }
        const newProduct = {...product, selectedAttrs}
        this.props.productsToCard(newProduct)
        //make active number sign near basket icon
        this.props.numberUp()   
    }

    render() {
        const { data, isLoaded, currencyNumber } = this.state;

        if (!isLoaded) {
            return (<Loading />)
        } else {

            this.selectedCategoryButton()
            
            return (
                <div className="category" key={data.category.name}>
                    <h1>CATEGORY - {data.category.name.toUpperCase()}</h1>
                    <div className="category-items">

                        {data.category.products.map(product => {

                        return (
                            <div className="category-item" id={product.id} key={product.id}>
                                <Link to={`/product/${product.id}`}>
                                    {product.inStock ? null : <div id="outOfStock-product">OUT OF STOCK</div> }
                                    <div className="item-card" key={product.name} >
                                        <img src={product.gallery[0]} alt={data.category.products.indexOf(product)}/>
                                        <div className="item-content">
                                            <div className="item-title">
                                                <p>{product.name}</p>
                                            </div>
                                            <div className="item-price">
                                                <p>{product.prices[`${currencyNumber}`].currency.symbol} {product.prices[`${currencyNumber}`].amount} </p>
                                            </div>
                                        </div>
                                    </div> 
                                </Link>  
                                <div className={product.inStock ? 'item-basket visible' : 'item-basket hidden'}
                                onClick={(e) => this.addToCard(e)}>
                                    <img src={basket} alt={product.id}/>
                                </div>
                            </div> 
                        )
                        })}
                    </div>
                </div>
            )
        }
    }
    
};

export default Categories;

