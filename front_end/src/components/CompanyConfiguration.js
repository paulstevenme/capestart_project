import React from 'react';
import { Spinner, Button as BlueprintButton } from "@blueprintjs/core";
import axios from "axios";
import { Icon as AntIcon,Table, Popconfirm, Form, Divider, Input, Modal, Button, notification } from 'antd';
import 'antd/dist/antd.css';
import context from '../context';
import { withRouter } from 'react-router-dom'

class CompanyConfiguration extends React.Component {
    static contextType = context;
    state = {
        deleteModal:false, deleteModalData : [],
        componentLoading: false,
        per_page: 5,
        table_loading: false,
        loading: true,
        dbConfigList: [],
        deleteDB: "",
        updateDB: "",
        total_pages: "", total_data: "",
        companyName: "", companyLocation: "",  current_page: "",
        dbUpdateModalvisible: false,
        dbCreateModalvisible: false,
        dbModalButtonLoading: false

    }
    async onGet(id) {
        var getUpdate = new FormData()
        getUpdate.set('id', id)
        var response = await axios({
            method: 'post',
            url: 'http://localhost:5001/getCompanyName',
            data: getUpdate
        });
      
        this.setState({
            companyLocation: response.data.company_location,
            companyName: response.data.company_name, updateDB: id,
            dbUpdateModalvisible: true
        });
    }
    async getListOfCompany(page) {
        if (page === "") {
            page = 1
        }
        this.setState({ componentLoading: false, table_loading: true })
        var getList = new FormData()
        getList.set('page', page)
        getList.set('custom_page', this.state.per_page)
        var response = await axios({
            method: 'post',
            url: 'http://localhost:5001/listCompanyNames',
            data: getList,
        });
        if (response.data.success === false) {
            this.setState({ dbConfigList: [] })
            if (this.state.current_page > 1) {
                this.setState({ table_loading: true })
                this.getListOfCompany(this.state.current_page - 1)
            }
            else {
                this.setState({ dbConfigList: response.data.data, componentLoading: false, table_loading: false })
            }
        }
        else {
            this.setState({
                dbConfigList: response.data.data,
                current_page: response.data.page_number, per_page: response.data.custom_page,
                total_pages: response.data.total_pages, page_number_list: response.data.page_number_list,
                total_data: response.data.total_data, table_loading: false
            });
        
            this.setState({ dbConfigList: response.data.data, componentLoading: false, table_loading: false })
        }
    }
    async onDelete(id) {
        var getDelete = new FormData()
        getDelete.set('id', id)
        var response = await axios({
            method: 'post',
            url: 'http://localhost:5001/deleteCompanyName',
            data: getDelete
        });
        if (response.data.success===true && response.data.message === "DataDeleted"){
            this.setState({ deleteDB: id, table_loading: true });
            this.getListOfCompany(this.state.current_page)
        } 
        else if (response.data.success===true && response.data.message === "DeleteEmployee"){
            notification.warning({message: "Employees Found!!" ,description:"Please Delete Employees in the Company First"}); 
        } 
 
    }
    onSave() {
        this.props.form.validateFields([ 'companyName','companyLocation'], (err, values) => {
            if (!err) {
                (async () => {
                    this.setState({ dbModalButtonLoading: true });
                   
                    var fd = new FormData();
            
                    fd.set('compname', this.state.companyName);
                    fd.set('comploc', this.state.companyLocation);

                    var response = await axios({
                        method: 'post',
                        url: 'http://localhost:5001/saveCompanyDetails',
                        data: fd,
                    });
                    if(response.data.success){
                        this.setState({ dbModalButtonLoading: false, dbCreateModalvisible: false });
                        this.setState({ dbid: response.data.id, companyName: "", companyLocation: "", table_loading: true })
                        this.getListOfCompany(this.state.current_page)
                    }
                    else if(response.data.success === false && response.data.message === "CompanyNameExists"){
                        this.setState({ dbModalButtonLoading: false, dbCreateModalvisible: true });
                        notification.warning({message: "Company Name Exists!!" ,description:"Please Choose another Company name"});   
                   
                    }
                    else if(response.data.success === false && response.data.message === "SpecialCharactersError"){
                        this.setState({ dbModalButtonLoading: false, dbCreateModalvisible: true });
                        notification.warning({message: "No Special Characters Allowed!!" ,description:"Please Choose another Company name"});   
            
                    }
                    
                })();
            }
        })
    }
    async onUpdate() {
        this.props.form.validateFields(['companyLocation', 'companyName',], (err, values) => {
            if (!err) {
                (async () => {
                    var fd = new FormData();
            
                    fd.set('id', this.state.updateDB)
                    fd.set('compname', this.state.companyName);
                    fd.set('comploc', this.state.companyLocation);
                    
                    var response = await axios({
                        method: 'post',
                        url: 'http://localhost:5001/updateCompanyName',
                        data: fd,
                    });
                   
                    this.setState({ dbModalButtonLoading: true });
                    setTimeout(() => {
                        this.setState({ dbModalButtonLoading: false, dbUpdateModalvisible: false, dbid: response.data.id, companyName: "", companyLocation: "" });
                    }, 1000);
                    this.setState({ table_loading: true })
                    this.getListOfCompany(this.state.current_page)
                    
                })();
            }
        })
    }

    async employeeTableSwitch(value) {
        console.log("company name",value.id)
        var employee_detail = { name: value.name, id: value.id}
        this.context.sendCompanyName(employee_detail, this.props.history.push('/employeeList')) 
    }


    componentDidMount() {
        this.getListOfCompany(1);
    }
 

    render() {
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: 'Company Name',
                dataIndex: 'name',
                key: 'name',
                render: text => <div><AntIcon type="shop" />&nbsp;<a data-id={text} >{text}</a></div>,
            },
            {
                title: 'Company Location',
                dataIndex: 'data',
                key: 'data',
                render: text => <div><AntIcon type="environment" />&nbsp;{text}</div>
                
            },
            {
                title: 'Total Employees',
                dataIndex: 'employee_count',
                key: 'employee_count',
                render: text => <div><AntIcon type="user" />&nbsp;{text}</div>
                
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    this.state.dbConfigList.length >= 1 ? (
                        <div>
                            <span>
                                <div style = {{color:"blue"}} className="bp3-button bp3-minimal bp3-icon-edit" onClick={() => { this.onGet(record.id); }} >Edit</div>
                                <Divider type="vertical" />
                                <Popconfirm title="Sure to delete?" onConfirm={this.onDelete.bind(this, record.id)}>
                                <div style = {{color:"red"}} className="bp3-button bp3-minimal bp3-icon-trash" >Delete</div>
                                </Popconfirm>
                            </span>
                        </div >
                    ) : null
                ),
            },
        ];
        const deleteModalColumns = [
            {
                title: 'Visualize List',
                // dataIndex: 'name',
                // key: 'name',
            },
        ]
        return (
            <div style={{  height: 'calc(100vh - 50px)', display: 'flex', justifyContent: 'center' }}>
                {(this.state.componentLoading) ?
                    <div style={{ height: '65px', alignSelf: 'center' }}>
                        <Spinner size={Spinner.SIZE_STANDARD} />
                    </div>
                    :
                    <div style={{ backgroundColor: "#ffffff" }}>
                        <div style={{ height: '100%' }}>
                           
                                <BlueprintButton style={{ marginBottom: '20px' ,marginLeft:"80%", marginTop:"10px" }} icon="add" text="Add New Company" intent="primary" onClick={() => { this.setState({ dbCreateModalvisible: true }) }} />
                                <Table
                                    onRow={(record, rowIndex) => {
                                        return {
                                        onDoubleClick: event => { this.employeeTableSwitch(record)}, // click row
                                        };
                                    }}

                                    title={() => <div style={{fontFamily:'  "Cantarell", "Open Sans"',fontSize: '1.5em', marginLeft:"38%"}}>Company List </div>}
                                    loading={this.state.table_loading}
                                    bordered={true}
                                    size={"default"}
                                    tableLayout={"fixed"}
                                    pagination={{
                                        position: 'bottom', pageSize: 5, defaultPageSize: 5, current: this.state.current_page,
                                        total: this.state.total_data, onChange: (page) => this.getListOfCompany(page)
                                    }}
                                    columns={columns}
                                    dataSource={this.state.dbConfigList}
                                    rowKey='id'>
                                </Table>
                        
                            {/* DB Data Table End */}
                            {/* Modal for DB Create Start */}
                            <Modal
                                destroyOnClose={true}
                                width={420}
                                style={{ top: 20 }}
                                title="Add Company"
                                visible={this.state.dbCreateModalvisible}
                                // For close Button on Top of Modal and any side button click
                                onCancel={(e) => { this.setState({ dbCreateModalvisible: false, companyName: "", companyLocation: "", dbPassword: "", dbhost: "", dbtype: "" }) }}
                                footer={[
                                    <Button key="back" onClick={(e) => { this.setState({ dbCreateModalvisible: false, companyName: "", companyLocation: "", dbPassword: "", dbhost: "", dbtype: "" }) }}>
                                        Cancel
                                </Button>,
                                    <Button key="submit" type="primary" loading={this.state.dbModalButtonLoading} onClick={this.onSave.bind(this)}>
                                        Save
                                </Button>,
                                ]}
                            >
                            
                                <Form.Item
                                    label="Company Name" hasFeedback>
                                    {getFieldDecorator('companyName', {
                                        rules: [{ required: true, message: 'Please enter your Company name!', whitespace: true }],
                                        onChange: (event) => { this.setState({ companyName: event.target.value }) },
                                    })(<Input />)}
                                </Form.Item>
                                <Form.Item
                                    label="Company Location"
                                >
                                    {getFieldDecorator('companyLocation', {
                                        rules: [{ required: true, message: 'Please enter your Company Location!', whitespace: true }],
                                        onChange: (event) => { this.setState({ companyLocation: event.target.value }) },
                                    })(<Input />)}
                                </Form.Item>
                            </Modal>
                            {/* Modal for DB Create End */}
                            {/* Modal for DB Update Start */}
                            <Modal
                                destroyOnClose={true}
                                width={420}
                                style={{ top: 20 }}
                                title="Update Company Details"
                                visible={this.state.dbUpdateModalvisible}
                                // For close Button on Top of Modal and any side button click
                                onCancel={(e) => { this.setState({ dbUpdateModalvisible: false, companyName: "", companyLocation: "", dbPassword: "", dbhost: "", dbtype: "" }) }}
                                footer={[
                                    <Button key="back" onClick={(e) => { this.setState({ dbUpdateModalvisible: false, companyName: "", companyLocation: "", dbPassword: "", dbhost: "", dbtype: "" }) }}>
                                        Cancel
                                </Button>,
                                    <Button key="submit" type="primary" loading={this.state.dbModalButtonLoading} onClick={this.onUpdate.bind(this)}>
                                        Update
                                </Button>,
                                ]}
                            >
                                <Form.Item
                                    label="Company Name" hasFeedback
                                >
                                    {getFieldDecorator('companyName', {
                                        rules: [{ required: true, message: 'Please enter your Company name!', whitespace: true }],
                                        onChange: (event) => { this.setState({ companyName: event.target.value }) },
                                        initialValue: this.state.companyName
                                    })(<Input />)}
                                </Form.Item>
                                <Form.Item
                                    label="Company Location"
                                >
                                    {getFieldDecorator('companyLocation', {
                                        rules: [{ required: true, message: 'Please enter your Location name!', whitespace: true }],
                                        onChange: (event) => { this.setState({ companyLocation: event.target.value }) },
                                        initialValue: this.state.companyLocation
                                    })(<Input />)}
                                </Form.Item>
                               
                            </Modal>
                            {/* Modal for DB Update End */}

                        </div>
                    </div>
                }
                <div>
                    <Modal destroyOnClose={true} width={420} 
                        centered={true} 
                        style={{ marginLeft: '64px' }} 
                        title="Unable to Delete" 
                        visible={this.state.deleteModal} 
                        onCancel={(e) => { this.setState({ deleteModal:false }) }} 
                        footer=''>
                            <div style={{color:"red", display:'flex', alignContent:'center', justifyContent: 'center', textAlign:'center'}}>DB has been used for Visualize Configuration!! Please delete Visualize Configuration first and come back here </div>
                            <br/>
                            <div style={{color:"blue", display:'flex', alignContent:'center', justifyContent: 'center', textAlign:'center'}}> List of Visualize Configuration Using this DB </div>
                            <br/>
                            <Table bordered={true} size={"default"} tableLayout={"fixed"} pagination = {false}
                            columns = {deleteModalColumns}
                            dataSource={this.state.deleteModalData}
                            pagination={{
                                position: 'bottom', defaultPageSize: 5,
                                total: this.state.deleteModalData.length
                            }}
                            ></Table>
                    </Modal>
                </div>
            </div>
        )
    }
}
export default withRouter(Form.create({ name: 'register' })(CompanyConfiguration));