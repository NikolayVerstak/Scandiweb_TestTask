export const SELECTED_CATEGORY = `
query Category($name: String!) {
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
}`;

export const SELECTED_PRODUCT = `
query Product ($id: String!) {
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
`
export const ALL_CATEGORIES = `
query Categories {
    categories {
        name
    }
}`;
