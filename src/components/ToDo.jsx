import { useState } from "react";
import { Input, Button, Form, Select, Checkbox} from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ToDoModal from "./ToDoModal.jsx";
import ToDoDesc from "./ToDoDesc.jsx";

const { Option } = Select;

const ToDo =()=>{
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [todoDescOpen, setTodoDescOpen] = useState(false);
    const [state, setState] = useState('insert');
    const [modalDesc, setModalDesc] = useState({
        title: '',
        desc: '',
    });
    const [todos, setTodos] = useState({
        todo:[]
    });
    const [temp, setTemp] = useState([]);

    const[color, setColor] = useState({
        primary:'#2D2D2D',
        secondary:'#EAF8F3',
    })
    
    const changeTheme =()=>{
        setColor((prevVal)=>({
            primary:prevVal.secondary,
            secondary:prevVal.primary
        }))
    }
    
    const handleSubmit =()=>{
        form.validateFields().then((values)=>{
            setTodos((prevVal)=>({
                todo:[...prevVal.todo, values],
            }))
            setOpen(false);
            form.setFieldsValue({
                name: '',
                description: '',
                category: '',
                priority:'low',
            });
        });
    }
    const handleEdit =()=>{
        form.validateFields().then((values)=>{
            setTodos((prevVal)=>{
                let obj = {
                    name:values.name,
                    description:values.description,
                    category:values.category,
                    priority:values.priority
                }
                prevVal.todo[values.index] = obj;
                return {todo:[...prevVal.todo]}
            })
            setOpen(false);
            form.setFieldsValue({
                name: '',
                description: '',
                category:'personal',
                priorityHigh:false,
            });
            setState('insert');
        });
    }

    const updateModalDesc =(data)=>{
        setTodoDescOpen(true);
        setModalDesc({
            title: data.name,
            desc: data.description,
        });
    }

    const deleteModal =(data, index)=>{
        const obj = temp.filter((d)=> d===data)[0];
        setTodos((prevVal)=>{
            let newData;
            if (obj){
                setTemp((prev)=> temp.filter((d)=>d!==data));
                newData = prevVal.todo.filter((d)=> d!==obj);
            }else{
                newData = prevVal.todo.filter((_, i)=>i!= index);
            }
            return {todo:newData}
        });
    }
    const updateTodo = (data, index)=>{
        const obj = todos.todo.filter((d)=> d===data)[0];
        let ind = todos.todo.findIndex((d)=>d===obj);
        setState('update');
        setOpen(true);
        form.setFieldsValue({
            name:obj.name,
            description:obj.description,
            index: ind,
            category: obj.category,
        });
    }
    const handleCategory=(category)=>{
        setTemp(()=>{
            if(category==='all') return todos.todo;
            return todos.todo.filter((d)=>d.category===category);
        });
    }
    const searchToDos =(e)=>{
        const value = e.target.value;
        setTemp(()=>{
            let first = todos.todo.filter((d)=>d.name.includes(value));
            if (first.length===0){
                first = todos.todo.filter((d)=>d.description.includes(value));
            }
            return first;
        })
    }
    return(
        <div 
            className="todo"
            style={{backgroundColor:color.primary}} 
        >
            <div className="header clearfix">
                <h1 style={{color:color.secondary}}>Todo</h1>
                <div 
                    className="change-mode"
                    onClick={changeTheme}
                >Change Theme</div>
            </div>

            <Input 
                className="search"
                suffix={<SearchOutlined />}
                allowClear
                onChange={searchToDos}
            />
            <Button 
                className="create-todo-button"
                onClick={()=>(setOpen(true), form.setFieldsValue({
                    name: '',
                    description: '',
                }))}
            >Create Todo</Button>
            
            <ToDoModal 
                visible={open} 
                onClose={()=>(setOpen(false), setState('insert'))}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="form"
                    initialValues={{
                        category: 'personal',
                      }}
                
                >
                    <Form.Item
                        name="name"
                        label="Title"
                        rules={[
                        {
                            required: true,
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                        {
                            required: true,
                        },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[
                            {
                                required: true,
                                message:'Please select a category'
                            },
                            ]}
                    >
                        <Select>
                            <Option value="work">Work</Option>
                            <Option value="personal">Personal</Option>
                            <Option value="shopping">shopping</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="priority"
                        label="Priority"
                    >
                        <Select>
                            <Option value="high">High</Option>
                            <Option value="low">Low</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="index"
                        label=""
                    >
                        {state==='update'? <Input disabled/>: null}
                    </Form.Item>

                    <Button className="form-btn-save" onClick={()=>state==='insert'? handleSubmit():handleEdit()}>Save</Button>
                </Form>    
            </ToDoModal>
            
            <Select 
                style={{width:344, marginTop:15}}
                onChange={handleCategory}
            >
                <Option value="work">Work</Option>
                <Option value="personal">Personal</Option>
                <Option value="shopping">shopping</Option>
                <Option value="all">All</Option>
            </Select>
            
                <div className="list-of-todos">
                    {todos.todo.length>0 && 
                        ( temp ?? todos.todo).map((data, index)=>
                            <div className="slot" key={index} style={{backgroundColor: data.priority==='high'? "rgb(226, 146, 135)": "rgb(228, 235, 129)"}}>
                                <DeleteOutlined 
                                    className="delete"
                                    onClick={()=>deleteModal(data, index)}
                                />
                                <EditOutlined 
                                    className="edit-btn"
                                    onClick={()=>updateTodo(data, index)}
                                />
                                <div  className="clearfix" onClick={()=> updateModalDesc(data)}> 
                                    <img src="src/assets/images/knowledge.jpg" alt="" />
                                    <p className="title">{data.name}</p>
                                    <p className="desc">{data.description.slice(0,15) + "..."}</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            <ToDoDesc 
                visible={todoDescOpen}
                title={modalDesc.title}
                description={modalDesc.desc}
                onClose={()=> setTodoDescOpen(false)}
            />

        </div>
    );
}
export default ToDo;