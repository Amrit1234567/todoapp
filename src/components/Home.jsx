import { useEffect, useState } from "react";

const Home =()=>{
    const [display, setDisplay] = useState('environment');
    const [trans, setTrans] = useState('fade-in');

    const transit = (image) =>{
        setTrans('fade-out');

        setTimeout(()=>{
            setDisplay(image);
            setTrans('fade-in');
        },500);

    }

    const handleChange=(symbol)=>{
        const images = ['environment', 'knowledge', 'person'];
        let index;
        if (symbol =='>'){
            index = images.indexOf(display)+1;
            if (index === images.length){
                transit(images[0]);
            }else{
                transit(images[index]);
            }
        }else{
            index = images.indexOf(display)-1;
            if (index < 0){   
                transit(images[images.length-1])
            }else{
                transit(images[index]);
            }
        }
    }

    useEffect(()=>{
        const interval = setInterval(()=>{
            handleChange('>');
        }, 3000);

        return ()=> clearInterval(interval);
    },[display]);

    return(
        <div className="slider">
            <img src={`src/assets/images/${display}.jpg`} className={trans} alt="" />
            <button className="right" onClick={()=> handleChange('>')}>{">"}</button>
            <button className="left" onClick={()=> handleChange('<')}>{"<"}</button>
        </div>
    );
}
export default Home;