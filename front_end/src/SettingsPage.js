import React from 'react';
import { Icon, Label } from "@blueprintjs/core";
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom'
import context from './context'
import { Card, Elevation } from "@blueprintjs/core";
import { Switch } from 'antd';
import { Table, Popconfirm, Form, Input, Modal, Button } from 'antd';
import axios from "axios";
import { getToken } from './utils/helper';
import Cookies from 'universal-cookie';
import { Helmet } from 'react-helmet'

const TITLE = 'Settings'

const cookies = new Cookies();
class SettingsPage extends React.Component {
    
    static contextType = context;
    state = {
        componentLoading:true,
        settingsChoice:'general',
        oldPassword:'',
        newPassword:'',
        confirmPassword:'',
        ButtonLoading:false,
        passwordCheck: false,    
        registerUserModalvisible:false,
        otpModal:false,
        userUsername:'',
        userPassword:'',
        userConfirmPassword:'',
        userEmail:'',
        startupService:false,
        userList:[],
        table_loading:false,
        otpGotFromUser:'',
        current_page: 1, pageItems: 5, total_usersList_db_datas:"",adminCheck:false
    }
    nextPath(path) { this.props.history.push(path); }
    countDown() {
        let secondsToGo = 5;
        const modal = Modal.success({
          title: 'Logout',
          content: `You will be logged out within ${secondsToGo} second.`,
          onCancel:()=>{cookies.remove('loginToken', { path: '/' })
          this.props.history.push('/');},
          onOk:()=>{cookies.remove('loginToken', { path: '/' })
          this.props.history.push('/');},
          
        });
        const timer = setInterval(() => {
          secondsToGo -= 1;
          modal.update({
            content: `You will be logged out within ${secondsToGo} second.`,
          });
        }, 1000);
        setTimeout(() => {
          clearInterval(timer);
          modal.destroy();
          cookies.remove('loginToken', { path: '/' })
          this.props.history.push('/');
        }, secondsToGo * 1000);
      }
    onNavigationSelect(eventKey) {
        if (eventKey === 'general') {this.setState({settingsChoice:'general'}, ()=>{this.startupServiceGet()})}
        else if (eventKey === 'userManagement') {this.setState({settingsChoice:'userManagement'}, ()=>{this.userListGetter(1)})}
        else if (eventKey === 'resetPassword') {this.setState({settingsChoice:'resetPassword'})}
    }
    handleConfirmBlur(e) {
        const { value } = e.target;
        this.setState({ passwordCheck: this.state.passwordCheck || !!value });
      };
    compareToFirstPassword(rule, value, callback,vField) {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('userPassword')) {callback('Passwords does not match!');} else {callback();}
    };
    validateToNextPassword(rule, value, callback,vField){
        const { form } = this.props;
        if (value && this.state.passwordCheck) {form.validateFields(['userConfirmPassword'], { force: true });}callback();
    };

    async startupServiceChange(checked) {
        var changeStartup = new FormData()
        changeStartup.set('token', getToken(this.props.history))
        changeStartup.set('startup', checked)
        var response = await axios({
            method: 'post',
            url: 'http://localhost:5001/servicestartup',
            data: changeStartup
        });
        if (response.status=== 200){
            console.log(response.data)
            this.setState({startupService:checked})
        }
        if(response.status=== 401){
            console.log("go home")
            this.nextPath('/login')
        }
    }
    async startupServiceGet() {
        var getStartup = new FormData()
        getStartup.set('token', getToken(this.props.history))
        var response = await axios({
            method: 'post',
            url: 'http://localhost:5001/getservicestartup',
            data: getStartup
        });
        if (response.status=== 200){
            console.log(response.data)
            this.setState({startupService:JSON.parse(response.data.startup)})
        }
        if(response.status=== 401){
            console.log("go home")
            this.nextPath('/login')
        }
    }
    async userListGetter(page) {
        if (page === "") {
            page = 1
        }
        this.setState({  table_loading: true, current_page:page })
        var userLister = new FormData()
        userLister.set('token', getToken(this.props.history))
        userLister.set('page', page)
        userLister.set('pageItems', this.state.pageItems)
        var response = await axios({
            method: 'post',
            url: 'http://localhost:5001/userlist',
            data: userLister
        });
        if (response.status=== 200){
            console.log(response.data)
            this.setState({userList:response.data.data, table_loading: false, current_page: response.data.page_number, pageItems:response.data.pageItems, total_usersList_db_datas: response.data.total_db_datas })
        }
        else if (response.data.message === 'AccessRestricted'){
            this.setState({ ButtonLoading:false},()=>{alert('You are not Admin!!')});
        }
        else if (response.success === false & response.message === 'Token Expired!!!') {
            this.nextPath('/login')
        }
        else if (response.data.success === false) {
            this.setState({ userList: [] })
            if (this.state.current_page > 1) {
                this.setState({ table_loading: true })
                this.getListOfDBConfig(this.state.current_page - 1)
            }
            else {
                this.setState({ userList: response.data.data, table_loading: false })
                
            }

        }
    }
    async userRemove(id) {
        var userRemover = new FormData()
        userRemover.set('token', getToken(this.props.history))
        userRemover.set('us_id', id)
        var response = await axios({
            method: 'post',
            url: 'http://localhost:5001/userremove',
            data: userRemover
        });
        if (response.status=== 200){
            this.setState({ table_loading: true },()=>{this.userListGetter(this.state.current_page)});
        }
        else if (response.status=== 401) {
            this.nextPath('/login')
        }
    }
    async adminCheck() {
        var adminChecker = new FormData()
        adminChecker.set('token', getToken(this.props.history))
        var response = await axios({
            method: 'post',
            url: 'http://localhost:5001/adminCheck',
            data: adminChecker
        });
        if (response.data.message === 'Admin'){
            this.setState({adminCheck:true})
        }
        if (response.data.message === 'User'){
            this.setState({adminCheck:false})
        }
        else if (response.status=== 401) {
            this.nextPath('/login')
        }
    }
    userRegister() {
        this.props.form.validateFields(['userUsername', 'userPassword', 'userConfirmPassword','userEmail'], (err, values) => {
            if (!err) {
                (async () => {
                    var userReg = new FormData()
                    userReg.set('token', getToken(this.props.history))
                    userReg.set('username', this.state.userUsername)
                    userReg.set('password', this.state.userPassword)
                    userReg.set('email', this.state.userEmail)
                    var response = await axios({
                        method: 'post',
                        url: 'http://localhost:5001/register',
                        data: userReg
                    });
                    if (response.data.success){
                        this.setState({ table_loading: true, 'registerUserModalvisible':false, userUsername:"",userPassword:"",userEmail:"",userConfirmPassword:"" },()=>{this.userListGetter(this.state.current_page)});
                    }
                    else if (response.data.message === 'UsernameExists'){
                        this.setState({ table_loading: false, 'registerUserModalvisible':true },()=>{alert('Username already exists!!')});
                    }    
                    else if (response.data.message === 'SpecialCharactersError'){
                        this.setState({ table_loading: false, 'registerUserModalvisible':true },()=>{alert('Special Characters not allowed for Username!!')});
                    }
                    else if (response.data.message === 'AccessRestricted'){
                        this.setState({ ButtonLoading:false},()=>{alert('You are not Admin!!')});
                    }
                    else if (response.status=== 401) {
                        this.nextPath('/login')
                    }
                })();
            }
        })
    }
    
    adminPasswordReset() {
        this.props.form.validateFields([ 'userPassword', 'userConfirmPassword'], (err, values) => {
            if (!err) {
                (async () => {
                    this.setState({ButtonLoading:true})
                    var userReg = new FormData()
                    userReg.set('token', getToken(this.props.history))
                    userReg.set('password', this.state.userPassword)
                    userReg.set('confirm_password', this.state.userConfirmPassword)
                    userReg.set('otpGotFromUser', this.state.otpGotFromUser)
                    var response = await axios({
                        method: 'post',
                        url: 'http://localhost:5001/adminPassReset',
                        data: userReg
                    });
                    console.log(response.data)
                    if (response.data.success && response.data.message === 'OTPSent')
                    {
                        this.setState({otpModal:true,ButtonLoading:false})
                    }
                    if (response.data.success && response.data.message === 'passwordChanged' ){
                        this.setState({ otpModal:false, ButtonLoading:false},()=>{alert('Password Changed Successfully')},this.countDown());
                    }
                    else if (response.data.message === 'InternetFailure'){
                        this.setState({ ButtonLoading:false},()=>{alert('Please Check Your Internet Connection')});
                    }
                    else if (response.data.message === 'WrongOTP'){
                        this.setState({ ButtonLoading:false},()=>{alert('Wrong OTP')});
                    }
                    else if (response.data.message === 'AccessRestricted'){
                        this.setState({ ButtonLoading:false},()=>{alert('You are not Admin!!')});
                    }
                    else if (response.status=== 401) {
                        this.nextPath('/login')
                    }
                })();
            }
        })
    }

    componentDidMount() {
        this.adminCheck()
        this.startupServiceGet()
        if (this.props.settingsChoice) {
            this.setState({ settingsChoice: this.props.settingsChoice })
        }
    }
    render() { 
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: 'User',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: 'E-mail',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    this.state.userList.length >= 1 ? (
                        <div>
                            {
                                record.id === 1?
                                 <div  className="bp3-button bp3-minimal bp3-icon-crown" >Admin</div>
                                :
                                <span>
                                <Popconfirm title="Sure to Remove?" onConfirm={this.userRemove.bind(this, record.id)}>
                                <div style = {{color:"red"}} className="bp3-button bp3-minimal bp3-icon-trash" >Remove User</div>
                                </Popconfirm>
                            </span>
                            }
                        </div >
                    ) : null
                ),
            },
        ];
        console.log("Admin Check",this.state.adminCheck)
        return (
            
            <div style={{  height: '100%' }}>
                <Helmet>
                    <title>{ TITLE }</title>
                </Helmet>
                {
                (this.state.settingsChoice === 'general') ?
                    <div style={{display:'flex', margin:'7px', justifyContent: 'center'}}>
                    <Card style={{  padding: '0px', height:'100%', width:'50%' }} elevation={Elevation.TWO}  >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style = {{fontFamily:'  "Cantarell", "Open Sans"', marginTop: '5px', fontSize: '1.8em', textAlign:'center', fontWeight:'bold'}}>General</div>
                            <hr style={{ height: '1px', width: '100%' }}></hr><br/>
                            <div style = {{ display: 'flex', justifyContent: 'space-around'}}>
                               <Label>Run on System Startup</Label>
                                <Switch 
                                checked={this.state.startupService}
                                onChange={this.startupServiceChange.bind(this)}
                                checkedChildren="ON" unCheckedChildren="OFF" />
                            </div>
                        </div>
                    </Card>
                </div>
                    :
                    (this.state.settingsChoice === 'userManagement') ?
                        <div style={{display:'flex', margin:'7px', justifyContent: 'center'}}>
                            <Card style={{  padding: '0px', height:'100%', width:'70%' }} elevation={Elevation.TWO}  >
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems:'center' }}>
                                    <div style = {{fontFamily:'  "Cantarell", "Open Sans"', marginTop: '5px', fontSize: '1.8em', textAlign:'center', fontWeight:'bold'}}>User Management</div>
                                    <hr style={{ height: '1px', width: '100%' }}></hr>
                                    <div>
                                        
                                        <Button key="submit" disabled={this.state.adminCheck?false:true} type="primary" loading={this.state.ButtonLoading} onClick={()=>{this.setState({'registerUserModalvisible':true})}} >
                                            Add Users
                                        </Button>
                                        <Modal
                                            destroyOnClose={true}
                                            width={420}
                                            style={{ top: 20 }}
                                            title="Add Users"
                                            visible={this.state.registerUserModalvisible}
                                            // For close Button on Top of Modal and any side button click
                                            onCancel={(e) => { this.setState({ registerUserModalvisible: false, userUsername: "", userPassword: "", userConfirmPassword: "", userEmail:"" }) }}
                                            footer={[
                                                <Button key="Save" type="primary" loading={this.state.ButtonLoading} onClick={()=>{this.userRegister()}} >
                                                    Save
                                                </Button>,
                                                ]}
                                                >
                                            <Form.Item
                                                label="Username" >
                                                {getFieldDecorator('userUsername', {
                                                    rules: [{ required: true, message: 'Please enter your Configuration name!', whitespace: true }],
                                                    onChange: (event) => { this.setState({ userUsername: event.target.value }) },
                                                })(<Input />)}
                                            </Form.Item>
                                            <Form.Item label="Password" >
                                                {getFieldDecorator('userPassword', {rules: [{required: true,message: 'Please input your password!',},
                                                    {validator: (rule, value, callback) => {this.validateToNextPassword(rule,value,callback,'userPassword')}},],
                                                    onChange: (event) => { this.setState({ userPassword: event.target.value }) },
                                                })(<Input.Password />)}
                                            </Form.Item>
                                            <Form.Item label="Confirm Password" >
                                                {getFieldDecorator('userConfirmPassword', {rules: [{required: true,message: 'Please confirm your password!',},
                                                    {validator: (rule, value, callback) => {this.compareToFirstPassword(rule,value,callback,'userConfirmPassword')}},],
                                                    onChange: (event) => { this.setState({ userConfirmPassword: event.target.value }) },
                                                })(<Input.Password onBlur={this.handleConfirmBlur.bind(this)} />)}
                                            </Form.Item>
                                            <Form.Item label="E-mail">
                                                {getFieldDecorator('userEmail', {rules: [{type: 'email',message: 'The input is not valid E-mail!',},
                                                    {required: true,message: 'Please input your E-mail!',},
                                                    ],
                                                    onChange: (event) => { this.setState({ userEmail: event.target.value }) },
                                                })(<Input />)}
                                            </Form.Item>
                                        </Modal>
                                    </div>
                                    <hr style={{ height: '1px', width: '100%' }}></hr>
                                    <div style = {{padding:'1%'}}>
                                        <Table
                                                title={() => <div style={{fontFamily:'  "Cantarell", "Open Sans"',fontSize: '1.5em', textAlign:'center'}}>User List </div>}
                                                loading={this.state.table_loading}
                                                bordered={true}
                                                size={"small"}
                                                tableLayout={"fixed"}
                                                pagination={{
                                                    position: 'bottom', defaultPageSize: this.state.pageItems, current: this.state.current_page,
                                                    total: this.state.total_usersList_db_datas, onChange: (page) => this.userListGetter(page)
                                                }}
                                                columns={columns}
                                                dataSource={this.state.userList}
                                                rowKey='id'>
                                        </Table>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        : (this.state.settingsChoice === 'resetPassword') ?
                            <div style={{display:'flex', margin:'7px', justifyContent: 'center'}}>
                                <Card style={{  padding: '0px', height:'100%', width:'50%' }} elevation={Elevation.TWO}  >
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style = {{fontFamily:'  "Cantarell", "Open Sans"', marginTop: '5px', fontSize: '1.8em', textAlign:'center', fontWeight:'bold'}}>Reset Password</div>
                                        <hr style={{ height: '1px', width: '100%' }}></hr>
                                            {(this.state.adminCheck===true)?
                                                <div style = {{ display: 'flex', flexDirection:'column',  justifyContent: 'center', margin:'5%', width:'50%'}}>

                                                    <Form.Item label="New Password" >
                                                    {getFieldDecorator('userPassword', {rules: [{required: true,message: 'Please input your password!',},
                                                        {validator: (rule, value, callback) => {this.validateToNextPassword(rule,value,callback,'userPassword')}},],
                                                        onChange: (event) => { this.setState({ userPassword: event.target.value }) },
                                                    })(<Input.Password />)}
                                                    </Form.Item>
                                                    <Form.Item label="Confirm Password" >
                                                        {getFieldDecorator('userConfirmPassword', {rules: [{required: true,message: 'Please confirm your password!',},
                                                            {validator: (rule, value, callback) => {this.compareToFirstPassword(rule,value,callback,'userConfirmPassword')}},],
                                                            onChange: (event) => { this.setState({ userConfirmPassword: event.target.value }) },
                                                        })(<Input.Password onBlur={this.handleConfirmBlur.bind(this)} />)}
                                                    </Form.Item>
                                                    <Button key="submit" type="primary" loading={this.state.ButtonLoading} onClick={()=>{this.adminPasswordReset()}}>
                                                        Reset Password
                                                    </Button>
                                                </div>
                                                :
                                                <div style = {{fontFamily:'  "Cantarell", "Open Sans"', marginTop: '5px', fontSize: '1.8em', textAlign:'center', fontWeight:'bold'}}>You are not the Admin</div>
                                            }
                                            <Modal
                                            destroyOnClose={true}
                                            width={420}
                                            style={{ top: 20 }}
                                            title="OTP Verification"
                                            visible={this.state.otpModal}
                                            // For close Button on Top of Modal and any side button click
                                            onCancel={(e) => { this.setState({ otpModal: false, otpGotFromUser: "" }) }}
                                            footer={[
                                                <Button key="Save" type="primary" loading={this.state.ButtonLoading} onClick={()=>{this.adminPasswordReset()}} >
                                                    Verify
                                                </Button>,
                                                ]}
                                                >
                                            <h4>OTP has been sent to your mail</h4>
                                            <Form.Item
                                                label="Enter OTP" >
                                                {getFieldDecorator('otpInput', {
                                                    rules: [{ required: true, message: 'Please enter OTP', whitespace: true }],
                                                    onChange: (event) => { this.setState({ otpGotFromUser: event.target.value }) },
                                                })(<Input />)}
                                            </Form.Item>
                                            </Modal>
                                        
                                    </div>
                                </Card>
                            </div>
                            : undefined
                }
            <div>
                <SideNav style={{ marginTop: '50px', backgroundColor: '#566573' }} onToggle={this.onToggle}>
                    <SideNav.Toggle />
                    <SideNav.Nav >
                        <NavItem onSelect={this.onNavigationSelect.bind(this)}  eventKey="general" active={(this.state.settingsChoice === "general") ? true : false}>
                            <NavIcon>
                                <Icon icon="search-around" iconSize={18} />
                            </NavIcon>
                            <NavText>
                                General
                            </NavText>
                        </NavItem>
                        <NavItem onSelect={this.onNavigationSelect.bind(this)} eventKey="userManagement" active={(this.state.settingsChoice === "userManagement") ? true : false} >
                            <NavIcon>
                                <Icon icon="user" iconSize={18} />
                            </NavIcon>
                            <NavText>
                                User Management
                            </NavText>
                        </NavItem>
                        <NavItem onSelect={this.onNavigationSelect.bind(this)} eventKey="resetPassword" active={(this.state.settingsChoice === "resetPassword") ? true : false} >
                            <NavIcon>
                                <Icon icon="key" iconSize={18} />
                            </NavIcon>
                            <NavText>
                                Reset Password
                            </NavText>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>
            </div>
        </div >
        )
    }
}


export default withRouter(Form.create({ name: 'register' })(SettingsPage));