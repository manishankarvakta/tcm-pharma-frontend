import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from "heroicons-react";
import { Button } from 'react-bootstrap';

const PosHeader = ({logo, handleLogout}) => {
    return (
        <nav>
            {/* <Link to="/">Home</Link> */}
            <Link to="/">
                <img src={logo} width='150' alt="TCM" />
            </Link>
            <span className="float-end">
                <Link className='btn btn-dark pull-end mr-auto px-3 py-2' to="/dashboard">Exit <Icons.LogoutOutline className='ms-2'  size={18}/> </Link>
            </span>
            {
                // user?.uid
                //     ?
                //     <>
                //         {/* <Link to="/welcome">User</Link> */}
                //         <button className='btn btn-dark align-right' onClick={()=> signOut(auth)}>Sign Out</button>
                //     </>
                //     :
                //     <>
                //         <Link to="/login">Login</Link>
                //         {/* <Link to="/register">Register</Link> */}
                //     </>
            }

        </nav>
    );
};

export default PosHeader;