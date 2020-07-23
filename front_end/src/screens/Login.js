import React from 'react';
import axios from "axios";
import { Button, Form, Input, Icon as AntIcon, notification } from 'antd';
import context from '../context';
import { withRouter } from 'react-router-dom'
import { Card, Elevation } from "@blueprintjs/core";
import { Helmet } from 'react-helmet'

const TITLE = 'Company Management'

class Login extends React.Component{
    static contextType = context;
    state ={ username : "", password : "", loginLoading: false }
    async onLogin(){
        this.props.form.validateFields(['username','password'], (err, values) => {
            if (!err) {
                if(this.state.username && this.state.password){
                    (async () => {
                        var loginData = new FormData()
                        loginData.set('username',this.state.username)
                        loginData.set('password',this.state.password)
                        this.setState({ loginLoading: true })
                        var response = await axios({ method : 'post', url : 'http://localhost:5001/login', data : loginData, });
                        if (response.status === 200 && response.data.success){
                            this.props.history.push('/home');
                        }
                        else if(response.data.message === 'WrongPassword'){
                            notification.warning({message: "Username or Password Mismatch" ,description:"Please Enter Correct Username & Password"}); 
                        }
                        this.setState({ loginLoading: false })
                    })(); 
                } 
            }   
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div style = {{ display:'flex',height:'100%', backgroundColor:'red'}}>
                <Helmet>
                    <title>{ TITLE }</title>
                </Helmet>
                <div style = {{display:'flex',backgroundColor:"#D5D8DC", alignItems:'center',alignContent:'center', justifyContent:'center', height:'100%',width:'100%'}}>
                    <Card style={{ width:'25%', alignContent:'center' }} elevation={Elevation.TWO}>
                        <div style = {{display:'flex',color:'black', justifyContent:'center', fontSize:'130%', fontFamily:'"Lucida Sans Unicode", "Lucida Grande", sans-serif'}}>Company Management</div>
                        <hr></hr>
                        <Form.Item   >
                                {getFieldDecorator('username', {
                                   
                                    rules: [{ required: true, message: 'Please enter Username!', whitespace: true }],
                                    onChange: (event) => { this.setState({ username: event.target.value }) },
                                })(<Input prefix={<AntIcon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Enter Username"  />)}
                        </Form.Item>
                        <Form.Item  >
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please enter Password!', whitespace: true }],
                                    onChange: (event) => { this.setState({ password: event.target.value }) },
                                })(<Input.Password prefix={<AntIcon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Enter Password" />)}
                        </Form.Item>
                        <hr></hr>
                        <div style= {{display:'flex',justifyContent:'center'}}>
                            <Button key="submit" type="primary" loading={this.state.loginLoading} onClick={this.onLogin.bind(this)}>Login</Button>            
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
}
export default  withRouter(Form.create({ name: 'register' })(Login));
