import React, { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import Header from "../Common/Header/Header";
import "./Supplier.css";
import * as Icons from "heroicons-react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import SideBar from "../Common/SideBar/SideBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notify } from "../Utility/Notify";
import SearchProduct from "../Common/CustomSelect/SearchProduct";
import {
    useSuppliersQuery,
    useSupplierQuery,
    useAddSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation,
} from "../../services/supplierApi";


const UpdateSupplier = () => {
    let i = 1;
    const { id } = useParams();
    let navigate = useNavigate();
    const [pData, setPData] = useState([]);
    const { register, handleSubmit, reset } = useForm({});
    const supplierProductsRef = useRef(null);
    const { data, error, isLoading, isFetching, isSuccess } = useSupplierQuery(
        `${id}`
    );
   
    

    useEffect(() => {
        if (data) {
            reset({
                company: data.company,
                name: data.name,
                email: data.email, 
                code: data.code,
                status: data.status,
                products:[],
                phone: data.phone,
                address: data.address,
            });
        localStorage.setItem("supplier_cart", JSON.stringify(data.products));
        }
    }, [data]);

    console.log(data);


    useEffect(() => {
        const getCartData = JSON.parse(localStorage.getItem("supplier_cart"));
        setPData(getCartData);
        console.log(pData)
        // dispatch(supplierProducts(pData))
        console.log(supplierProductsRef.current);
    }, []);

    // handel user update
    const [updateSupplier] = useUpdateSupplierMutation();

    
    const addToList = async (data) => {
        if (data) {
            console.log("add to list:", data);
            await supplierProductsRef.current.blur();
            const getData = JSON.parse(localStorage.getItem("supplier_cart"));
            let listData = getData ? getData : [];
            console.log("old:", listData);

            let newProduct = {};
            // unique check
            const idExist = listData.find((pro) => pro.id === data._id);
            if (idExist) {
                notify("Product Already in List", "error");
                // console.log()
            } else {
                newProduct = {
                    id: data._id,
                    name: data.name,
                    article_code: data.article_code,
                    ean: data.ean,
                    unit: data.unit,
                    order: listData.length + 1,
                };
                listData = [...listData, newProduct];
            }

            console.log("upcoming:", newProduct);
            console.log("Updated:", listData);
            setPData(listData);
            reset({
                products:listData,
              });
           
            
            // console.log(newProduct)
            localStorage.setItem("supplier_cart", JSON.stringify(listData));
            supplierProductsRef.current.focus();
        } else {
            return false;
        }
    };

    const removeFromCart = (id) => {
        const getData = JSON.parse(localStorage.getItem("supplier_cart"));
        const restData = getData.filter((pro) => pro.id !== id);
        localStorage.setItem("supplier_cart", JSON.stringify(restData));
        setPData(restData);
        console.log(restData);
    };

    const updateHandler = async (data) => {
        const response = await updateSupplier(data);
        console.log(data)
        if (response) {
            console.log(response);
            notify("User Update Successful!");
            navigate("/supplier");
            localStorage.removeItem("supplier_cart");
        }
    };

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <SideBar></SideBar>
                    </div>
                    <div className="col-md-10">
                        <Header
                            title={data?._id ? "Update Supplier" : "Add Supplier"}
                        ></Header>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="">
                                    <div className=" mt-4">
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit(updateHandler)}>
                                                <div className="row mb-3">
                                                    <div className="form-group col-4  mb-3">
                                                        {/* <label htmlFor="inputSupplierCompany">Supplier Company</label> */}
                                                        <input
                                                            {...register("company", { required: true })}
                                                            type="text"
                                                            className="form-control"
                                                            id="inputSupplierCompany"
                                                            aria-describedby="emailHelp"
                                                            placeholder="Supplier Company"
                                                        />
                                                        <small
                                                            id="emailHelp"
                                                            className="form-text text-muted"
                                                        >
                                                            We'll never share your email with anyone else.
                                                        </small>
                                                    </div>
                                                    <div className="form-group col-4  mb-3">
                                                        {/* <label htmlFor="inputSupplier">Supplier Name</label> */}
                                                        <input
                                                            {...register("name", { required: true })}
                                                            type="text"
                                                            className="form-control"
                                                            id="inputSupplier"
                                                            aria-describedby="emailHelp"
                                                            placeholder="Supplier Name"
                                                        />
                                                        <small
                                                            id="emailHelp"
                                                            className="form-text text-muted"
                                                        >
                                                            We'll never share your email with anyone else.
                                                        </small>
                                                    </div>
                                                    <div className="form-group col-4  mb-3">
                                                        {/* <label htmlFor="inputEmail">Supplier Email</label> */}
                                                        <input
                                                            {...register("email", { required: true })}
                                                            type="email"
                                                            className="form-control"
                                                            id="inputEmail"
                                                            aria-describedby="emailHelp"
                                                            placeholder="Supplier Email"
                                                        />
                                                        <small
                                                            id="emailHelp"
                                                            className="form-text text-muted"
                                                        >
                                                            We'll never share your email with anyone else.
                                                        </small>
                                                    </div>
                                                    <div className="form-group col-4  mb-3">
                                                        {/* <label htmlFor="inputMC">Supplier Phone</label> */}
                                                        <input
                                                            {...register("phone")}
                                                            type="text"
                                                            className="form-control"
                                                            id="phone"
                                                            placeholder="Supplier Phone"
                                                        />
                                                    </div>
                                                    <div className="form-group col-4  mb-3">
                                                        {/* <label htmlFor="COde">COde</label> */}
                                                        <input
                                                            {...register("code")}
                                                            type="text"
                                                            className="form-control"
                                                            id="code"
                                                            placeholder="Supplier Code"
                                                        />
                                                    </div>
                                                    <div className="form-group col-4  mb-3">
                                                        {/* <label htmlFor="status">Status</label> */}
                                                        <select
                                                            {...register("status")}
                                                            className="form-select"
                                                            id="status"
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-12  mb-3">
                                                        {/* <label htmlFor="address">Address</label> */}
                                                        <textarea
                                                            {...register("address")}
                                                            className="form-control"
                                                            id="address"
                                                            placeholder="Address"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="col-12 mb-3">
                                                    <p className="mb-1">
                                                        <b>Supplier's Products</b>
                                                    </p>
                                                    <SearchProduct
                                                        className="searchProduct"
                                                        // getValue={getValue}
                                                        addToList={addToList}
                                                        supplierProductsRef={supplierProductsRef}
                                                    ></SearchProduct>
                                                    <div className="card mt-3 p-2">
                                                        <Table>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>EAN</th>
                                                                    <th>Name</th>
                                                                    <th>Code</th>
                                                                    <th>Unit</th>
                                                                    <th>Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {pData ? (
                                                                    pData
                                                                        .sort((a, b) => b.order - a.order)
                                                                        .map((item) => (
                                                                            <tr key={item.order}>
                                                                                <th>{i++}</th>
                                                                                <td>{item.ean}</td>
                                                                                <td>{item.name}</td>
                                                                                <td>{item.article_code}</td>
                                                                                <td>{item.unit}</td>
                                                                                <td>
                                                                                    <Icons.X
                                                                                        size={20}
                                                                                        onClick={() =>
                                                                                            removeFromCart(item.id)
                                                                                        }
                                                                                    ></Icons.X>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan={6}>
                                                                            <p className="text-center m-2">
                                                                                Please select product
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>
                                                
                                                
                                                <button
                                                    type="submit"
                                                    className="btn btn-dark float-end "
                                                >
                                                    {data?._id ? (
                                                        <>
                                                            <Icons.SaveOutline></Icons.SaveOutline>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Icons.Plus> </Icons.Plus>
                                                        </>
                                                    )}
                                                    Supplier
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    )
}

export default UpdateSupplier