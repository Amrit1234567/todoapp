const MyForm =({handleChange, handleClick, data})=>{

    return (
    <div className='box'>
        <h1>Error Storing App</h1><br/>
        <span>Route</span>
        <input type='text' name='route' onChange={handleChange} value={data.route} required></input><br/>
        
        <span>Error</span>
        <input type='text' name='error' onChange={handleChange} value={data.error} required></input><br/>
        
        <span>FindDate</span>
        <input type='date' name='findDate' onChange={handleChange} value={data.findDate} required></input><br/>
        
        <span>SolvedDate</span>
        <input type='date' name='solvedDate' onChange={handleChange} value={data.solvedDate}></input><br/>

        <span>SolvedBy</span>
        <input type='text' name='solvedBy' onChange={handleChange} value={data.solvedBy} required></input>
        <button onClick={handleClick}>Add</button>
    </div>
    );
}
export default MyForm;