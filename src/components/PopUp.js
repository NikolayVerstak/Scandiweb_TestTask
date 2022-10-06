import React from "react";

import '../styles/PopUp.css'



class PopUp extends React.Component {

    state = { product: this.props.product }

    componentDidUpdate() {
        if(this.state.product !== this.props.product) {
            this.setState({product: this.props.product})
        }
    }

    render() {
        const {product} = this.state
        return (
            <div className="popUp-product hide">
                <h1>{product.brand} {product.name}</h1>
                <h2>has just been added to the card</h2>
            </div>
        )
    }
}

export default PopUp;