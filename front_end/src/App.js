import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './screens/Login'
import NavigationBar from './components/NavigationBar'
import context from './context'
import { withRouter } from 'react-router-dom'
import EmployeeConfiguration from './components/EmployeeConfiguration';
import CompanyConfiguration from './components/CompanyConfiguration';


class Navigation extends React.Component {
    static contextType = context;
   
    
    render() {
        return (
            <Router>
                <Switch >
                   
                  
                    <Route exact path="/home"><div><NavigationBar/><CompanyConfiguration /></div></Route>
                    <Route exact path="/employeeList"><div><NavigationBar/><EmployeeConfiguration /></div></Route>
                   
                    <Route exact path="/login"><Login /></Route>
                   
                </Switch>
            </Router >
        );
    }
}

export default withRouter(Navigation);