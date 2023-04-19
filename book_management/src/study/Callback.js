import React, { useState } from 'react';

const Callback = () => {

    const [ cnt, setCnt ] = useState(0);
    let count1 = 0;

    const a = (fx, fx2) => {
        console.log("A함수 실행");
        setCnt(() => fx(fx2));
    }

    const b = (fx2) => {
        console.log("B함수 실행");
        count1 = cnt + 100;
        fx2();
        return count1;
    }

    const c = () => {
        console.log("C함수 호출");
        console.log(count1);
    }


    const clickHandler = () => {
        a(b, c);
    }
    return (
        <div>
            <button onClick={clickHandler}>버튼</button>
        </div>
    );
};

export default Callback;