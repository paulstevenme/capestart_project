import React from 'react';
import { Spinner, Button as BlueprintButton } from "@blueprintjs/core";
import axios from "axios";
import { Table, Popconfirm, Form, Divider, Input, Modal, Button, notification } from 'antd';
import 'antd/dist/antd.css';
import context from '../context';

import { withRouter } from 'react-router-dom'

class EmployeeConfiguration extends React.Component {
    static contextType = context;
    state = {
        comp_name:'',
        filterTable: "",
        comp_id:"",
        deleteModal:false, deleteModalData : [],
        componentLoading: false,
        per_page: 5,
        table_loading: false,
        loading: true,
        dbConfigList: [],
        deleteDB: "",
        updateDB: "",
        total_pages: "", total_data: "",
        employeeName: "", employeeSalary: "",  current_page: "",
        dbUpdateModalvisible: false,
        dbCreateModalvisible: false,
        dbModalButtonLoading: false

    }
    async onGet(id) {
        var getUpdate = new FormData()
        getUpdate.set('id', id)
        var response = await axios({
            method: 'post',
            url: 'http://localhost:5001/getEmployeeName',
            data: getUpdate
        });
      
        this.setState({
            employeeSalary: response.data.employee_salary,
            employeeName: response.data.employee_name, updateDB: id,
            dbUpdateModalvisible: true
        });
    }
    async getListOfEmployees(page) {
        if (page === "") {
            page = 1
        }
        this.setState({ componentLoading: false, table_loading: true })
        var getList = new FormData()
        getList.set('page', page)
        getList.set('custom_page', this.state.per_page)
        getList.set('compid', this.state.comp_id)

        var response = await axios({
            method: 'post',
            url: 'http://localhost:5001/listEmployeeNames',
            data: getList,
        });
        if (response.data.success === false) {
            this.setState({ dbConfigList: [] })
            if (this.state.current_page > 1) {
                this.setState({ table_loading: true })
                this.getListOfEmployees(this.state.current_page - 1)
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
            url: 'http://localhost:5001/deleteEmployeeName',
            data: getDelete
        });
        if (response.data.success===true && response.data.message === "DataDeleted"){
            this.setState({ deleteDB: id, table_loading: true });
            this.getListOfEmployees(this.state.current_page)
        }   
    }
    onSave() {
        this.props.form.validateFields([ 'employeeName','employeeSalary'], (err, values) => {
            if (!err) {
                (async () => {
                    this.setState({ dbModalButtonLoading: true });
                  
                    var fd = new FormData();
            
                    fd.set('empname', this.state.employeeName);
                    fd.set('empsal', this.state.employeeSalary);
                    fd.set('compid', this.state.comp_id);

                    var response = await axios({
                        method: 'post',
                        url: 'http://localhost:5001/saveEmployeeDetails',
                        data: fd,
                    });
                    if(response.data.success){
                        this.setState({ dbModalButtonLoading: false, dbCreateModalvisible: false });
                        this.setState({ dbid: response.data.id, employeeName: "", employeeSalary: "", table_loading: true })
                        this.getListOfEmployees(this.state.current_page)
                    }
                    else if (response.data.success === false && response.data.message ==="EmployeeNameExists"){
                        this.setState({ dbModalButtonLoading: false, dbCreateModalvisible: true });
                        notification.warning({message: "Employee Name Exists!!" ,description:"Please Choose another Employee name"});   
                    }
                    else if(response.data.success === false && response.data.message === "SpecialCharactersError"){
                        this.setState({ dbModalButtonLoading: false, dbCreateModalvisible: true });
                        notification.warning({message: "No Special Characters Allowed!!" ,description:"Please Choose another Employee name"});   
            
                    }
                })();
            }
        })
    }
    async onUpdate() {
        this.props.form.validateFields(['employeeSalary', 'employeeName',], (err, values) => {
            if (!err) {
                (async () => {
                    var fd = new FormData();
            
                    fd.set('id', this.state.updateDB)
                    fd.set('empname', this.state.employeeName);
                    fd.set('empsal', this.state.employeeSalary);
                    
                    var response = await axios({
                        method: 'post',
                        url: 'http://localhost:5001/updateEmployeeName',
                        data: fd,
                    });
                   
                    this.setState({ dbModalButtonLoading: true });
                    setTimeout(() => {
                        this.setState({ dbModalButtonLoading: false, dbUpdateModalvisible: false, dbid: response.data.id, employeeName: "", employeeSalary: "" });
                    }, 1000);
                    this.setState({ table_loading: true })
                    this.getListOfEmployees(this.state.current_page)
                    
                })();
            }
        })
    }

    search(value) {
        const { dbConfigList } = this.state;
        console.log("PASS", { value });

        
            const filterTable = dbConfigList.filter(o =>
                Object.keys(o).some(k =>
                  String(o[k])
                    .toLowerCase()
                    .includes(value.toLowerCase())
                )
              );
          
              this.setState({ filterTable });
        
      
      };



    componentDidMount() {
        console.log("context value", this.context.id)
        if( this.context.id === {}){
            this.props.history.push('/home')
        }
        this.setState({comp_id:this.context.id.id, comp_name:this.context.id.name  }, ()=>{this.getListOfEmployees(1);})
        
    }
 

    render() {
      
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                sorter: (a, b) => a.name.localeCompare(b.name),
                title: 'Employee Name',
                dataIndex: 'name',
                key: 'name',
                
               
                
                
            },
            {
                sorter: (a, b) => a.data- b.data,
                title: 'Employee Salary',
                dataIndex: 'data',
                key: 'data',
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
                          
                                <BlueprintButton style={{ marginBottom: '20px' ,marginLeft:"80%", marginTop:"10px" }} icon="add" text="Add New Employee" intent="primary" onClick={() => { this.setState({ dbCreateModalvisible: true }) }} />
                                <Input.Search
                                    style={{  margin: "0 0 10px 0" }}
                                    placeholder="Search Employee Name..."
                                    enterButton
                                    onSearch={this.search.bind(this)}
                                    />
                                <Table
                                    title={() => <div style={{fontFamily:'  "Cantarell", "Open Sans"',fontSize: '1.5em', marginLeft:"38%"}}>{this.state.comp_name} Employee List </div>}
                                    loading={this.state.table_loading}
                                    bordered={true}
                                    size={"default"}
                                    tableLayout={"fixed"}
                                    pagination={{
                                        position: 'bottom', pageSize: 5, defaultPageSize: 5, current: this.state.current_page,
                                        total: this.state.total_data, onChange: (page) => this.getListOfEmployees(page)
                                    }}
                                    columns={columns}
                                    dataSource={this.state.filterTable === ""? this.state.dbConfigList : this.state.filterTable}
                                    // dataSource={this.state.dbConfigList}
                                    rowKey='id'>
                                </Table>

                            {/* DB Data Table End */}
                            {/* Modal for DB Create Start */}
                            <Modal
                                destroyOnClose={true}
                                width={420}
                                style={{ top: 20 }}
                                title="Add New Employee"
                                visible={this.state.dbCreateModalvisible}
                                // For close Button on Top of Modal and any side button click
                                onCancel={(e) => { this.setState({ dbCreateModalvisible: false, employeeName: "", employeeSalary: "", dbPassword: "", dbhost: "", dbtype: "" }) }}
                                footer={[
                                    <Button key="back" onClick={(e) => { this.setState({ dbCreateModalvisible: false, employeeName: "", employeeSalary: "", dbPassword: "", dbhost: "", dbtype: "" }) }}>
                                        Cancel
                                </Button>,
                                    <Button key="submit" type="primary" loading={this.state.dbModalButtonLoading} onClick={this.onSave.bind(this)}>
                                        Save
                                </Button>,
                                ]}
                            >
                            
                                <Form.Item
                                    label="Employee Name" hasFeedback>
                                    {getFieldDecorator('employeeName', {
                                        rules: [{ required: true, message: 'Please enter your Employee Name!', whitespace: true }],
                                        onChange: (event) => { this.setState({ employeeName: event.target.value }) },
                                    })(<Input />)}
                                </Form.Item>
                                <Form.Item
                                    label="Employee Salary"
                                >
                                    {getFieldDecorator('employeeSalary', {
                                        rules: [{ required: true, message: 'Please enter your Employee Salary!', whitespace: true }],
                                        onChange: (event) => { this.setState({ employeeSalary: event.target.value }) },
                                    })(<Input />)}
                                </Form.Item>
                            </Modal>
                            {/* Modal for DB Create End */}
                            {/* Modal for DB Update Start */}
                            <Modal
                                destroyOnClose={true}
                                width={420}
                                style={{ top: 20 }}
                                title="Update Employee Details"
                                visible={this.state.dbUpdateModalvisible}
                                // For close Button on Top of Modal and any side button click
                                onCancel={(e) => { this.setState({ dbUpdateModalvisible: false, employeeName: "", employeeSalary: "", dbPassword: "", dbhost: "", dbtype: "" }) }}
                                footer={[
                                    <Button key="back" onClick={(e) => { this.setState({ dbUpdateModalvisible: false, employeeName: "", employeeSalary: "", dbPassword: "", dbhost: "", dbtype: "" }) }}>
                                        Cancel
                                </Button>,
                                    <Button key="submit" type="primary" loading={this.state.dbModalButtonLoading} onClick={this.onUpdate.bind(this)}>
                                        Update
                                </Button>,
                                ]}
                            >
                                <Form.Item
                                    label="Employee Name" hasFeedback
                                >
                                    {getFieldDecorator('employeeName', {
                                        rules: [{ required: true, message: 'Please enter your Employee Name!', whitespace: true }],
                                        onChange: (event) => { this.setState({ employeeName: event.target.value }) },
                                        initialValue: this.state.employeeName
                                    })(<Input />)}
                                </Form.Item>
                                <Form.Item
                                    label="Employee Salary"
                                >
                                    {getFieldDecorator('employeeSalary', {
                                        rules: [{ required: true, message: 'Please enter your Salary!', whitespace: true }],
                                        onChange: (event) => { this.setState({ employeeSalary: event.target.value }) },
                                        initialValue: this.state.employeeSalary
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
export default withRouter(Form.create({ name: 'register' })(EmployeeConfiguration));