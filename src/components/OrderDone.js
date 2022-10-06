import React from "react";

import '../styles/OrderDone.css'

class OrderDone extends React.Component {

    render() {
        return (
            <div className="orderDone hide">
                <h1>Thank you for your order!</h1>
                <h2>Your order is being processed and our manager will contact you shortly.</h2>
            </div>
        )
    }
}

export default OrderDone;