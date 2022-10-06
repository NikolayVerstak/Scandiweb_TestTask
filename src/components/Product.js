import React from "react";
import DOMPurify from 'dompurify';

import '../styles/Product.css'
import '../styles/fonts.css'

import Loading from "./Loading";
import { endpoint, options } from './FetchData';
import { SELECTED_PRODUCT} from "../graphql/queries";
import arrow from '../images/arrowDescription.png'

class Product extends React.Component {

    state = {
        product: [], 
        isLoaded: false, 
        //path is '/product/air-pods' so minus 9 letters will be 'air-pods' - product.id
        id: window.location.pathname.slice(9), 
        bigPictureNumber: 0,
        currencyNumber: this.props.currencyType,
        productCategory: ''
    }

    componentDidMount() {
        options.body = JSON.stringify({query: SELECTED_PRODUCT, variables: { id: this.state.id } })
        fetch(endpoint, options)
        .then(response => {
            if (response.status >= 400) {
                throw new Error("Error fetching data");
            } else {
                return response.json();
            }
        })
        .then(data => this.setState({product: data.data.product, isLoaded: true, 
            productCategory: data.data.product.category
        }))
        //show button "VIEW BAG" in mini-card 
        this.props.showViewButton()
        
    }

    componentDidUpdate() {
        //if user click on product name from miniCard
        const miniCardLinks = document.querySelectorAll('p.linkToProduct')
        if(miniCardLinks) {
            miniCardLinks.forEach( link => {
                link.addEventListener('click', (e) => {
                    if(this.state.id !== e.target.id) {
                        options.body = JSON.stringify({query: SELECTED_PRODUCT, variables: { id: e.target.id} })
                        fetch(endpoint, options)
                        .then(response => {
                            if (response.status >= 400) {
                                throw new Error("Error fetching data");
                            } else {
                                return response.json();
                            }
                        })
                        .then(data => this.setState({product: data.data.product, isLoaded: true, 
                            productCategory: data.data.product.category
                        }))
                        this.setState({id: e.target.id})
                    }
                })
            })
        }
        this.currencyChange()
        this.markedNavButton() 
    }

    currencyChange() {
        if (this.state.currencyNumber !== this.props.currencyType) {
            this.setState( { currencyNumber: this.props.currencyType})
        }
    }

    onSelectedPicture(event) {
        if(event.target.alt) {
            this.setState({ bigPictureNumber: Number(event.target.alt)})
        }
    }

    onMarkAttribute(event) {
        //mark attributes only if a product exists in stock 
        if(this.state.product.inStock) {
        //and user clicks on attributes related to color
        if((event.target.localName === "span") && (event.target.classList[0] === "darkColor" || "whiteColor")) {
            const selectedColor = event.target
            const allColors = document.querySelectorAll(".color-items > div")
            allColors.forEach(color => {
                //highlight that attribute by adding the class
                if(color.children[0].innerText === selectedColor.innerText) {
                    color.classList.add('selectedAttribute')
                    //user chose some attributes so we delete warning message from DOM
                    color.parentElement.lastChild.style.display="none"
                } else {
                    color.classList.remove('selectedAttribute')
                }
            })
        } 
        //if user click on attributes not related to color
        if ((event.target.localName === "p") && event.target.parentElement.classList[0] === "size-capacity-items") {
            const selectedAttr = event.target
            event.target.parentNode.childNodes.forEach(attr => {
                if(attr.innerText === selectedAttr.innerText) {
                    attr.classList.add('selectedAttribute')
                    attr.parentElement.lastChild.style.display="none"
                } else {
                    attr.classList.remove('selectedAttribute')
                }
            })
        }
        //remove default class of button that highlights it if some attributes aren't chosen
        const addButton = document.querySelector('.sendToBasket-button>button')
        addButton.classList.remove('warning')
        }
    }

    onShowDescription(event) {
        event.preventDefault()
        const showMore = document.getElementById('more')
        showMore.parentNode.classList.toggle('smallDescription')
        const imgArrow = document.querySelector('.Arrow')
        imgArrow.classList.toggle('rotate')
    }

    markedNavButton() {
        const buttons = Array.from(document.querySelectorAll('.navbar-buttons>a>button'))
        buttons.forEach(button => {
            if (button.innerHTML === this.state.productCategory) {
                button.classList.add('active')
            } else { button.classList.remove('active') }
        })
    }

    addToCard() {
        const markedAttrs = document.querySelectorAll('.selectedAttribute')
        const {product} = this.state;
        //make clone of state Product to edit some properties and add a new one
        const newProduct = structuredClone(product)
        //check if a user chose all of attributes
        if(markedAttrs.length === newProduct.attributes.length) {
            //create a new object to save selected by user attributes below the Product clone object
            const selectedAttrs = {}
            //find all attributes sections on the page
            const namesOfAttr = document.querySelectorAll('.attribute-name')
            namesOfAttr.forEach( name => {
                markedAttrs.forEach(attr => {
                    //compare if selected attributes name(id) equals to just found attr name in DOM
                    if(attr.id === name.innerHTML.split(':', 1)[0]) {
                        const attrName = attr.id
                        const attrValue = attr.innerText.toUpperCase()
                        //add a new key-value property to productClone Object that represents selected attributes
                        selectedAttrs[attrName] = attrValue }
                })
            })
            //add a new key-value property to each attributes item "selected: true", if user clicked on it
            const selectedAttrNames = Object.keys(selectedAttrs)
            const selectedAttrValues = Object.values(selectedAttrs)
            //go through all attributes
            for(let i=0; i < newProduct.attributes.length; i++) {
                //and check if its name equals to name of selected attribute
                if(newProduct.attributes[i].id === selectedAttrNames[i]) {
                    newProduct.attributes[i].items.forEach(item => {
                        //if yes, add a key-value "selected: true", no "selected: false"
                        item.value.toUpperCase() === selectedAttrValues[i] ?
                        item.selected = "true" :
                        item.selected = "false"
                    })
                }
            }
            //send this product to App.js
            this.props.productsToCard({...newProduct, selectedAttrs})
            //make active number sign near basket icon
            this.props.numberUp() 
        } else { //if user didn't chose all attributes, show warning
            const notSelectedAttrs = document.querySelectorAll('.display-none')
            notSelectedAttrs.forEach(h3 => {
                h3.classList.replace('display-none', 'display-visible')
            })
        }
    }

    render() {

        const { product, isLoaded, bigPictureNumber, currencyNumber} = this.state;

        if (!isLoaded) {
            return (<Loading />)
        } else {
            return(
                <div className="product-page">
                    <div className="product-content">
                        <div className="small-pictures" id="small-pictures"
                        onClick={(event) => this.onSelectedPicture(event)}>
                            {product.gallery.length > 1 ? product.gallery.map(image => {
                                return <img src={image} key={product.gallery.indexOf(image)} 
                                    alt={product.gallery.indexOf(image)} />
                            }) : null }
                        </div>
                        <div className="big-picture">
                            <img src={product.gallery[bigPictureNumber]} alt={product.gallery[bigPictureNumber]}/>
                        </div>
                        <div className={product.description.length < 150 ? 'info smallDescription' : 'info' } >
                            <div className="product-ditails">
                                <div className="product-name">
                                    <h2>{product.brand}</h2>
                                    <p>{product.name}</p>
                                </div>
                                <div className="product-attributes" id="product-attributes"
                                    onClick={(event) => this.onMarkAttribute(event)}> 

                                    {product.attributes ? product.attributes.map(attribute => {
                                        return (
                                        <div key={attribute.id} className={attribute.name.split(' ').join('')}>
                                            {(attribute.name === "Color") ?
                                                <>
                                                <h1 className="attribute-name">{attribute.name}:</h1> 
                                                <div className="color-items">
                                                    {attribute.items.map(item => {
                                                        return (
                                                        <div key={item.id} id={attribute.name}>
                                                            <span className={item.id === "White" ? "whiteColor" : "darkColor"}
                                                            style={{'backgroundColor': item.value, 'color': item.value}}>
                                                                {item.value}
                                                            </span> 
                                                        </div>)
                                                    })}
                                                    <h3 className="display-none">Please, select an attribute!</h3>
                                                </div>
                                                </>
                                            : 
                                                <>
                                                    <h1 className="attribute-name">{attribute.name}:</h1> 
                                                    <div className="size-capacity-items">
                                                        {attribute.items.map(item => {
                                                            return <p key={item.id} id={attribute.name}>{item.value}</p>
                                                        })}
                                                        <h3 className="display-none">Please, select an attribute!</h3>
                                                    </div>
                                                </>
                                            }
                                        </div>)
                                    }) : null }
                                </div>
                                <div className="product-price">
                                    <h1>Price:</h1>
                                    <p>{product.prices[`${currencyNumber}`].currency.symbol} {product.prices[`${currencyNumber}`].amount} </p>
                                </div>
                                
                                <div className="sendToBasket-button">
                                {product.inStock === true ? 
                                    <button onClick={() => this.addToCard()}>Add To Card</button> 
                                    : <button className="disabled">Add To Card</button> }
                                </div> 
                            </div>

                            <div className="product-description" id="product-description"
                                    dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product.description) }}>
                            </div>
                            {product.description.length > 150 ? 
                            <a href={window.location.pathname} className="more" id="more" onClick={(event) => this.onShowDescription(event)}>
                                <img src={arrow} className="Arrow" alt="arrow"/>
                            </a>
                            : null}
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Product;

