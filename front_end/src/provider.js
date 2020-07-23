import React from 'react'
import Context from './context'
//import Visualize from './UI/Visualize';
class AppProvider extends React.Component {
    state = {
        componentToShow: "login",
        changeComponentToShow: (component) => {
            this.setState({ componentToShow: component })
        },
    
        id : {},
        sendCompanyName : (idReceived) =>{
            this.setState({id:idReceived})
        }
       
    }

    render() {
        return (
            <Context.Provider value={this.state}>{this.props.children}</Context.Provider>
        );
    }
}
export default AppProvider;
