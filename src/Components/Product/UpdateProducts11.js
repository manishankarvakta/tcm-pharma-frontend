import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
import Header from '../Common/Header/Header';
import AlertService from '../Utility/AlertService';

const UpdateProducts = () => {
    const { id } = useParams()
    const [EAN, setEAN] = useState('');
    const [article_code, setArticle_code] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [cost, setCost] = useState('');
    const [featured, setFeatured] = useState('');
    const [master_category, setMaster_category] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [product_details, setProduct_details] = useState('');
    const [product_specification, setProduct_specification] = useState('');
    const [promotion_ends, setPromotion_ends] = useState('');
    const [promotion_start, setPromotion_start] = useState('');
    const [promotional_price, setPromotional_price] = useState('');
    const [purchase_unit, setPurchase_unit] = useState('');
    const [sale_unit, setSale_unit] = useState('');
    const [shipping, setShipping] = useState('');
    const [slug, setSlug] = useState('');
    const [type, setType] = useState('');
    const [unit_code, setUnit_code] = useState('');
    const [vat, setVat] = useState('');
    const [vat_method, setVat_method] = useState('');

    const [product, SetProduct] = useState([]);


    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}product/${id}`)
            .then(res => res.json())
            .then(data => {

                SetProduct(data);


                setEAN(data.EAN)
                setArticle_code(data.article_code)
                setBrand(data.brand)
                setCategory(data.category)
                setCost(data.cost)
                setFeatured(data.featured)
                setMaster_category(data.master_category)
                setName(data.name)
                setPrice(data.price)
                setProduct_details(data.product_details)
                setProduct_specification(data.product_specification)
                setPromotion_ends(data.promotion_ends)
                setPromotion_start(data.promotion_start)
                setPromotional_price(data.promotional_price)
                setPurchase_unit(data.purchase_unit)
                setSale_unit(data.sale_unit)
                setShipping(data.shipping)
                setSlug(data.slug)
                setType(data.type)
                setUnit_code(data.unit_code)
                setVat(data.vat)
                setVat_method(data.vat_method)
            })
    }, [id]);


    const { register, handleSubmit } = useForm();
    const handelAddProduct = data => {
        console.log(data)


        // send data to the server
        fetch(`${process.env.REACT_APP_API_URL}product`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                AlertService.alert('Success', 'Add Product Successfully !');

            })

    }
    return (
        <div>
            <Header></Header>
            <div className='container mt-5 pt-5'>
                <div className="row py-4">
                    <div className="col-md-10 offset-1">
                        <h1 className='text-center mb-4'>Add New Product</h1>

                        <form onSubmit={handleSubmit(handelAddProduct)}>
                            {/* 1st row */}
                            <div className="row">
                                <div className="col-md-4">
                                    <Form.Group className="mb-3" controlId="master_category">
                                        <Form.Label>Master Category</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={master_category}
                                            onChange={(e) => setMaster_category(e.target.value)}
                                            id="master_category"
                                            {...register("master_category", { required: true, maxLength: 20 })}
                                            placeholder="Master Category" />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group className="mb-3" controlId="EAN">
                                        <Form.Label>EAN Code </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={EAN}
                                            onChange={(e) => setEAN(e.target.value)}
                                            name="EAN"
                                            id="EAN"
                                            placeholder='EAN CODE'
                                        ></Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group className="mb-3" controlId="EAN">
                                        <Form.Label>EAN Code </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            name="type"
                                            id="type"
                                            placeholder='Product Type'
                                        ></Form.Control>
                                    </Form.Group>
                                </div>
                            </div>

                            {/* 2nd row */}
                            <div className="row">
                                <div className="col-md-8">
                                    <Form.Group className="mb-3" controlId="EAN">
                                        <Form.Label>EAN Code </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            name="name"
                                            id="name"
                                            placeholder='Product Name'
                                        ></Form.Control>
                                    </Form.Group>

                                </div>
                                <div className="col-md-4">
                                    <Form.Group className="mb-3" controlId="EAN">
                                        <Form.Label>EAN Code </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            name="name"
                                            id="name"
                                            placeholder='Product Name'
                                        ></Form.Control>
                                    </Form.Group>
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_article_code">Article Code</label>
                                        <input placeholder='Article Code' className="form-control" id="p_article_code" aria-describedby="article_codeHelp" {...register("article_code", { required: true, maxLength: 20 })} />
                                        <div id="article_codeHelp" className="form-text">Article code start with Master Category id</div>
                                    </div>
                                </div>
                            </div>

                            {/* 3rd row  */}
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_brand">Brand</label>
                                        <input placeholder='Brand' className="form-control" id="p_brand" aria-describedby="brandHelp" {...register("brand", { required: true, maxLength: 20 })} />
                                        <div id="brandHelp" className="form-text">Article code start with Master Category id</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_category">Category</label>
                                        <input placeholder='Category' className="form-control" id="p_category" aria-describedby="categoryHelp" {...register("category", { required: true, maxLength: 20 })} />
                                        <div id="categoryHelp" className="form-text">Article code start with Master Category id</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_slug">Slug</label>
                                        <input placeholder='Slug' className="form-control" id="p_slug" aria-describedby="slugHelp" {...register("slug", { required: true, maxLength: 20 })} />
                                        <div id="slugHelp" className="form-text">Article code start with Master Category id</div>
                                    </div>
                                </div>
                            </div>

                            {/* 4th row  */}
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_unit_code">Product Unit</label>
                                        <input placeholder='Product Unit' className="form-control" id="p_unit_code" aria-describedby="unit_codeHelp" {...register("unit_code", { required: true, maxLength: 20 })} />
                                        <div id="unit_codeHelp" className="form-text">Article code start with Master Category id</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_sale_unit">Sale Unit</label>
                                        <input placeholder='Sale Unit' className="form-control" id="p_sale_unit" aria-describedby="sale_unitHelp" {...register("sale_unit", { required: true, maxLength: 20 })} />
                                        <div id="sale_unitHelp" className="form-text">Article code start with Master sale_unit id</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_purchase_unit">Purchase Unit</label>
                                        <input placeholder='Purchase Unit' className="form-control" id="p_purchase_unit" aria-describedby="purchase_unitHelp" {...register("purchase_unit", { required: true, maxLength: 20 })} />
                                        <div id="purchase_unitHelp" className="form-text">Article code start with Master Category id</div>
                                    </div>
                                </div>
                            </div>

                            {/* 5th row  */}
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_cost">Trade Price [TP] </label>
                                        <input placeholder='Trade Price [TP]' className="form-control" id="p_cost" aria-describedby="costHelp" {...register("cost", { required: true, maxLength: 20 })} />
                                        <div id="costHelp" className="form-text">Product Cost </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_price">Max Retail Price [MRP]</label>
                                        <input placeholder='Max Retail Price [MRP]' className="form-control" id="p_price" aria-describedby="priceHelp" {...register("price", { required: true, maxLength: 20 })} />
                                        <div id="priceHelp" className="form-text">Product Price</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_slug">Alert Quantity</label>
                                        <input placeholder='Alert Quantity' className="form-control" id="p_slug" aria-describedby="slugHelp" {...register("slug", { required: true, maxLength: 20 })} />
                                        <div id="slugHelp" className="form-text">Article code start with Master Category id</div>
                                    </div>
                                </div>
                            </div>

                            {/* 6th row  */}
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_vat">VAT</label>
                                        <input placeholder='VAT' className="form-control" id="p_vat" aria-describedby="vatHelp" {...register("vat", { required: true, maxLength: 20 })} />
                                        <div id="vatHelp" className="form-text">Article code start with Master Category id</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_vat_method">Vat Method</label>
                                        <input placeholder='Vat Method' className="form-control" id="p_vat_method" aria-describedby="vat_methodHelp" {...register("vat_method", { required: true, maxLength: 20 })} />
                                        <div id="vat_methodHelp" className="form-text">Vat Include or Not</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_shipping">Shipping Method</label>
                                        <input placeholder='shipping' className="form-control" id="p_shipping" aria-describedby="shippingHelp" {...register("shipping", { required: true, maxLength: 20 })} />
                                        <div id="shippingHelp" className="form-text">What is the delivery method?</div>
                                    </div>
                                </div>
                            </div>

                            {/* 7th row */}
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <input type="checkbox" className="form-check-input me-2" {...register("featured")} id="featured" />
                                        <label className="form-check-label" for="featured" aria-describedby="featuredHelp"> Is Featured?</label>
                                        <div id="featuredHelp" className="form-text">Is this product featured on E-commerce?</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <input type="checkbox" className="form-check-input me-2" {...register("slug")} id="hide_on_website" />
                                        <label className="form-check-label" for="hide_on_website" aria-describedby="hide_on_websiteHelp"> Is hide on website?</label>
                                        <div id="hide_on_websiteHelp" className="form-text">Is this product hide on  E-commerce?</div>
                                    </div>
                                </div>

                            </div>

                            {/* 8th row */}
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="card-text">
                                                Product Photo
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_product_details">Product Description</label>
                                        <textarea placeholder='Product Description' className="form-control" id="p_product_details" aria-describedby="product_detailsHelp" {...register("product_details", { required: true, maxLength: 20 })} />
                                        <div id="product_detailsHelp" className="form-text">Product Details for E-commerce</div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_product_specification">Product Specification</label>
                                        <textarea placeholder='Product Specification' className="form-control" id="p_product_specification" aria-describedby="product_specificationHelp" {...register("product_specification", { required: true, maxLength: 20 })} />
                                        <div id="product_specificationHelp" className="form-text">Product Details for E-commerce</div>
                                    </div>
                                </div>
                            </div>

                            {/* 9th row  */}
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_promotional_price">Promotional Price </label>
                                        <input placeholder='Promotional Price' className="form-control" id="p_promotional_price" aria-describedby="promotional_priceHelp" {...register("promotional_price", { required: true, maxLength: 20 })} />
                                        <div id="promotional_priceHelp" className="form-text">Product Cost </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_promotion_start">Promotion Starts</label>
                                        <input placeholder='Promotion Starts' className="form-control" id="p_promotion_start" aria-describedby="promotion_startHelp" {...register("promotion_start", { required: true, maxLength: 20 })} />
                                        <div id="promotion_startHelp" className="form-text">Product Price</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label" for="p_promotion_ends">Promotion Ends</label>
                                        <input placeholder='Promotion Ends' className="form-control" id="p_promotion_ends" aria-describedby="promotion_endsHelp" {...register("promotion_ends", { required: true, maxLength: 20 })} />
                                        <div id="promotion_endsHelp" className="form-text">Article code start with Master Category id</div>
                                    </div>
                                </div>
                            </div>

                            <input type="submit" className="btn btn-dark" value="Add Product" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProducts;