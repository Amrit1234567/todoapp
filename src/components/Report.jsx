import { useState } from "react";
import ReportDetail from "./ReportDetail.jsx";

const Report =({error, handleChange})=>{
    return (
        <>
        {error.errors.map((e,index)=>(
            <li key={index} className='clearfix'>
                <ReportDetail 
                  e={e}
                  index={index}
                  handleChange={handleChange}
                />
            </li>
          ))}
        </>
    );
}
export default Report;