import { useState } from "react";

const ReportDetail = ({e, index, handleChange}) =>{
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);
    return (<div>
        {!show ? <p className="report-title" onClick={()=>setShow((prev)=> !prev)}>{e.route}</p>: 
        <div className={`transition ${show ? 'show' : ''}`}>
            <p className='one'><a href={`https://${e.route}`}><b>Route: {e.route}</b></a></p>
              <span className='two'>{`Find Date: ${e.findDate}`}</span>
              <p className='three'>{e.error}</p>
              {edit ? <input className="four" type='date' onChange={(e)=> (setEdit(false),handleChange(e,index))}></input> : 
              <span className='four' style={{color:e.solvedDate?'#3c2b8b':'red'}}><b>{e.solvedDate? `Solved: ${e.solvedDate}`:'Not Solved'} </b></span>}
              <span className="five"><b>Worked By: {e.solvedBy}</b></span><br/>
              {!e.solvedDate && <><br /><button onClick={()=> setEdit((prev)=>{return !prev})} className="edit">{edit?'Save':'Edit'}</button></>}
              {show && <><button className="hide" onClick={()=>setShow((prev)=> !prev)}>Hide</button></>}
        
        </div>}
        
    </div>);
}
export default ReportDetail;