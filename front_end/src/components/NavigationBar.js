import React from 'react';
import { Menu, Popover, Position } from "@blueprintjs/core";
import { withRouter } from 'react-router-dom'
import context from '../context'


class NavigationBar extends React.Component {
    static contextType = context;
    nextPath(path) {
        this.props.history.push(path);
    }
    onLogout(){

        this.props.history.push('/login');
    }
    render() {
        return (
            <nav style={{ display: 'flex' }} className="bp3-navbar bp3-dark">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="bp3-navbar-heading">Company Management</div>
                </div>
                
                <div style={{ flex: 1 }}></div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={() => this.nextPath('/home')} className="bp3-button bp3-minimal bp3-icon-home">Home</button>

                    <span className="bp3-navbar-divider"></span>
                    <Popover content={<Menu>
                        <Menu.Item icon="log-out" text="Logout" onClick= {this.onLogout.bind(this)} />
                    </Menu>} position={Position.BOTTOM}>
                        <button className="bp3-button bp3-minimal bp3-icon-user"></button>
                    </Popover>
                    
                </div>
            </nav>
        )
    }
}
export default withRouter(NavigationBar)