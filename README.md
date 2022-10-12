# Overview

Implementation of an eCommerce website.

## Dependencies
Data is fetched from the GraphQL endpoint. You can find the endpoint [here](https://github.com/scandiweb/junior-react-endpoint).

## Components

* [App](/src/components/App.js) - the main (parent) component that includes router
* [Loading](/src/components/Loading.js) - a spinner for the process of loading data
* [NavBar](/src/components/NavBar.js) - represents the navigation header
* [CurrencySelector](/src/components/CurrencySelector.js) - a dropdown for changing of currency type
* [MiniCart](/src/components/MiniCart.js) - represents the cart overlay
* [Categories](/src/components/Categories.js) - all categories with a list of products
* [Product](/src/components/Product.js) - a product details component
* [Cart](/src/components/Cart.js) - a list of products added to the cart
* [Error](/src/components/Error.js) - the component for 404 error
* [PopUp](/src/components/PopUp.js) - the notification of a product added to the cart
* [Carousel](/src/components/Carousel.js) - represents a slideshow for cycling through a series of pictures for each product inside the cart
* [OrderDone](/src/components/OrderDone.js) - the notification of successful order

Below is React components diagram and their connection between each other:

![React Component](/src/results%20pictures/Schema.PNG)

### Category page
![React Component](/src/results%20pictures/PLP.png)
Uses GraphQL query to get products for a category:
```query Category($name: String!) {
    category (input: {
        title: $name}) {
        name
        products {
            id
            category
            name
            inStock
            gallery
            description
            attributes {
                id
                name
                type
                items {
                    displayValue
                    value
                    id
                }
            }
            prices {
                currency {
                    label
                    symbol
                }
                amount
            }
            brand
        }
    }
  }
```

### Product details page
![React Component](/src/results%20pictures/PDP.png)
Uses GraphQL query to get data about a particular product:
```query Product ($id: String!) {
    product (id: $id) {
        id
        category
        name
        inStock
        gallery
        description
        attributes {
            id
            name
            type
            items {
                displayValue
                value
                id
            }
        }
        prices {
            currency {
                label
                symbol
            }
            amount
        }
        brand
    }
  }
```

### Cart page
![React Component](/src/results%20pictures/Cart.png)
### Mini-cart 
![React Component](/src/results%20pictures/MiniCart.png)
## How-to launch locally

In the project directory, you can run:
* Install dependencies

`yarn install`

* Build the project

 `yarn build`

* Start the project

`yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
