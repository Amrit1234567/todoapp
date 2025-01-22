const Products =({title, amount, discount, imgsrc, collectAtCart})=>{

return(
    <div className="product-box">
        <img width={'200px'} height={'200px'} src={imgsrc}></img>
        <p>{title}</p>
        <p><strong>${discount*0.01*amount}</strong></p>
        <p><s>${amount}</s> -{discount}%<button onClick={()=> collectAtCart({title, amount, discount, imgsrc})}>Add to Cart</button></p>
    </div>
);
}
export default Products;