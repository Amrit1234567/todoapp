import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyForm from './components/MyForm.jsx'
import Report from './components/Report.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx';
import ToDo from './components/ToDo.jsx';
import './App.css'
import Products from './components/Products.jsx';
import ProductPage from './components/ProductPage.jsx';

function App() {
  const [error, setError] = useState({
    errors :[],
  });

  const [bools, setBools] = useState({
    form: true,
    report: false,
  });

  const [data, setData] = useState({
    route: '',
    error: '',
    findDate: '',
    solvedDate: '',
    solvedBy: '',
  });

  const handleChange = (e) =>{
    const {name, value} = e.target;
    setData((prevData)=>({
      ...prevData,
      [name] : value,
    }));
  }

  const validateData =()=>{
    if (data.route === null || data.route==='')return false;
    if (data.error === null || data.error==='')return false;
    if (data.findDate === null || data.findDate==='')return false;
    if (data.solvedBy === null || data.solvedBy==='')return false;

    return true;
  }

  const handleClick =()=>{
    if(validateData()){
      setError((prevData)=>({
        errors:[...prevData.errors, data]
      }));
      setData({
        route: '',
        error: '',
        findDate: '',
        solvedDate: '',
        solvedBy:'',
      });
    }else{
      alert("Please Enter Values");
    };
  }

  const handleUpdate = (event, index) =>{
    setError((prevData)=>{
      let newData = [];
      let count = 0;
      for(const x of prevData.errors){
        let obj =x;
        if(count==index){
          obj["solvedDate"] = event.target.value;   
        }
        newData.push(obj);
        count += 1;
      }
      return {errors: newData}
    })
  }

  const showReports = () =>{
    setBools((prevVal)=>({
      form: !prevVal.form,
      report: !prevVal.report,
    }));
  }

  let myForm = <MyForm 
    handleChange={handleChange} 
    handleClick={handleClick}
    data={data}
  />
  let report = <Report 
    error={error} 
    handleChange={handleUpdate}
  />

  useEffect(() => {
    if (error.errors.length>0){
      localStorage.setItem('errorState', JSON.stringify(error));
    }
  }, [error]);

  useEffect(()=>{
    const a = JSON.parse(localStorage.getItem('errorState'));
    if(a){
      setError(a);
      report = <Report 
        error={a} 
        handleChange={handleUpdate}
      />
    }
  }, []);

  
  return (
    <>
    {/* {bools.form && myForm}
    {bools.report && 
      <ul>
        {report}
      </ul>
    }
    
    {error.errors.length > 0 && <button onClick={showReports}>Show {bools.report ? 'Form': 'Report'}</button>}
     */}
     <Navbar />
     <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/form' element={myForm} />
                <Route path='/report' element={report} />
                <Route path='/todo' element={<ToDo/>} />
                <Route path='/products' element={<ProductPage/>} />
            </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
