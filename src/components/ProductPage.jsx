import { useState } from "react";
import Products from "./Products";

const ProductPage =()=>{
    const [display, setDisplay] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const handleCartListing =(data)=>{
        //{title, amount, discount, imgsrc}
        setCartItems((prevVal)=>[...prevVal, data]);
    }
    return(
        <>
            <div className="cart-section clearfix">
                <div className="cart"
                    onMouseOver={()=> setDisplay(true)}
                    onMouseOut={()=> setDisplay(false)}
                >
                    <button>Cart</button>
                    {display && <div className="cart-products clearfix">
                        {cartItems.map((items, index)=><div className="row" key={index}>
                            <img src={items.imgsrc}></img>
                            <p>{items.title}</p>
                            <p>${items.amount*items.discount*0.01}</p>
                        </div>)}
                    </div>}
                </div>
            </div>
            <Products 
                title={"Environment Painting"}
                amount={300}
                discount={50}
                imgsrc={"src/assets/images/environment.jpg"}
                collectAtCart={handleCartListing}
            />
        </>
        
    );
};
export default ProductPage;