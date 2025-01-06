import { useState } from "react";
import { Input, Button, Form, Select } from 'antd';
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

    const onSearch = (value) => {
        console.log("Search Value:", value);
    };
    
    const handleSubmit =()=>{
        form.validateFields().then((values)=>{
            console.log(values);
            setTodos((prevVal)=>({
                todo:[...prevVal.todo, values],
            }))
            setOpen(false);
            form.setFieldsValue({
                name: '',
                description: '',
                category: '',
            });
        });
    }
    const handleEdit =()=>{
        form.validateFields().then((values)=>{
            console.log(values);
            setTodos((prevVal)=>{
                let obj = {
                    name:values.name,
                    description:values.description,
                    category:values.category,
                }
                prevVal.todo[values.index] = obj;
                return {todo:[...prevVal.todo]}
            })
            setOpen(false);
            form.setFieldsValue({
                name: '',
                description: '',
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
        console.log(obj);
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
        setState('update');
        setOpen(true);
        form.setFieldsValue({
            name:data.name,
            description:data.description,
            index: index,
            category: data.category,
        });
    }
    const handleCategory=(category)=>{
        if(category==='all'){
            setTemp([]);
            return null;
        }
        setTemp(()=>{
            if(category==='all') return [];
            return todos.todo.filter((d)=>d.category===category);
        });
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
                    vinitialValues={{
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
            <div className="clearfix">
                <div className="category">
                    <div className="work" onClick={()=>handleCategory('work')}>
                        <img src="src/assets/images/society.jpg" alt="" />
                        <div>
                            <h3>Work</h3>
                            <p>Your professional life here</p>
                        </div>
                    </div>
                    <div className="personal" onClick={()=>handleCategory('personal')}>
                        <img src="src/assets/images/person.jpg" alt="" />
                        <div>
                            <h3>Personal</h3>
                            <p>Your personal life here</p>
                        </div>
                    </div>
                    <div className="shopping" onClick={()=>handleCategory('shopping')}>
                        <img src="src/assets/images/environment.jpg" alt="" />
                        <div>
                            <h3>Shopping</h3>
                            <p>Your shopping list here</p>
                        </div>
                    </div>
                </div>
                <div className="list-of-todos">
                    {todos.todo.length>0 && 
                        (temp.length>0? temp : todos.todo).map((data, index)=>
                            <div className="slot">
                                <DeleteOutlined 
                                    className="delete"
                                    onClick={()=>deleteModal(data, index)}
                                />
                                <EditOutlined 
                                    className="edit-btn"
                                    onClick={()=>updateTodo(data, index)}
                                />
                                <div key={index} className="clearfix" onClick={()=> updateModalDesc(data)}> 
                                    <img src="src/assets/images/knowledge.jpg" alt="" />
                                    <p className="title">{data.name}</p>
                                    <p className="desc">{data.description.slice(0,15) + "..."}</p>
                                </div>
                            </div>
                        )
                    }
                </div>
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