import Report from './Report.jsx';

const Navbar = () =>{
    return(
        <>
        <div className='clearfix'>
            <nav className='clearfix'>
                <li><a href='/products'>MarketPlace</a></li>
                <li><a href='/todo'>ToDo</a></li>
                <li><a href='/report'>Report</a></li>
                <li><a href='/form'>Form</a></li>
                <li><a href='/'>Home</a></li>

            </nav>
        </div>
        
    </>
    );
};
export default Navbar