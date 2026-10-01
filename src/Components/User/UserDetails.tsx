import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Common/Header/Header';
import { useUserQuery } from '../../services/userApi';
import SideBar from '../Common/SideBar/SideBar';

const UserDetails = () => {
    const { id } = useParams();
    console.log(id)
    const { data, error, isLoading, isFetching, isSuccess } = useUserQuery(`${id}`);

    console.log(data)

    return (
        <div>
            <div className='container-fluid'>
                <div className="row">
                    <div className="col-md-2">
                        <SideBar></SideBar>
                    </div>
                    <div className="col-md-10">
                        <Header title="User Details"></Header>
                        {isLoading && <h2>...Loading</h2>}
                        {isFetching && <h2>...isFetching</h2>}
                        {error && <h2>Something went wrong</h2>}
                        {isSuccess && (
                            <>
                                <h1 className='text-center'>Name: {data?.name}</h1>
                                <pre>{JSON.stringify(data, undefined, 2)}</pre>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;