import React from 'react'

function ButtonCom(props) {
    return (
        <>
            <button type='button' className="btncss fw-bold mt-2" onClick={props.onClick}>{props.btn}</button>
        </>
    )
}

export default ButtonCom