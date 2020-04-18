import React, { Component } from "react";

import './errors.css'

class PageNotFound extends Component {

    componentDidMount() {
        // if(this.state.actions.length === 0) {
        //     this.props.history.push('/actions')
        // }
    }

    render() {
        return(
            <div className="header-404">404</div>
        );
    }

}

export default PageNotFound;
