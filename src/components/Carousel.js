import React from "react";

import Arrow from '../images/side-arrow.png'
import '../styles/Carousel.css'



class Carousel extends React.Component {

    state = {
        pictures: this.props.gallery,
        currentIndex: 0 
    }

    length = this.props.gallery.length

    goToPrevious() {
        if(this.state.currentIndex === 0 ) {
            const isLastPic = this.length - 1
            this.setState({currentIndex: isLastPic})
        } else {
            const newIndex = this.state.currentIndex - 1
            this.setState({currentIndex: newIndex})
        }
    }

    goToNext() {
        if(this.state.currentIndex === this.length - 1 ) {
            const isFirstPic = 0
            this.setState({currentIndex: isFirstPic})
        } else {
            const newIndex = this.state.currentIndex + 1
            this.setState({currentIndex: newIndex})
        }
    }
    
    render() {
        const {pictures, currentIndex} = this.state;
        return(
            <div className="carousel">
                {pictures.map( (picture, index) => { 
                return (
                    <div key={index}>
                        <img src={picture} alt={index}  
                        className={ index === currentIndex ? '' : 'hidden-pic'}/> 
                    </div>
                )
            })}
                {this.length > 1 ? 
                <div className="slider-btn">
                    <button className="btn prev-pic" onClick={() => this.goToPrevious()}>
                        <img src={Arrow} alt="prev-pic"/>
                    </button>
                    <button className="btn next-pic" onClick={() => this.goToNext()}>
                        <img src={Arrow} alt="next-pic"/>
                    </button>
                </div>
                : null }
            </div>
        )
    }
}

export default Carousel;

