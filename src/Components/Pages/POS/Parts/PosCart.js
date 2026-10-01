import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import "../POS.css"
import { useDispatch, useSelector } from "react-redux";
import {
  itemPrice,
  itemVat,
  // posFinalizer,
  itemVatTotal,
  toDecimal,
} from "../../../Utility/PosCalculations";
// import PriceSelectByProduct from "../../../Common/CustomSelect/PriceSelectByProduct";
import { saleReturnProducts } from "../../../../features/posSlice";
import ProductDetailsUpdateModal from "../../../Common/Modal/ProductDetailsUpdateModal";

const PosCart = ({
  addQuantities,
  removeQuantities,
  removeFromCart,
  handleCustomQty,
  updateCart,
  invoice,
  handleNoOfBox,
  handleItemDiscount,
  handleSoldInBox,
  returnProducts,
  firstProductRef,
  handleKeyDownToSearch,
  reCal,
}) => {
  let i = 1;
  let j = 1;
  // console.log(carts)
  const dispatch = useDispatch();
  const [tempQty, setTempQty] = useState([]);
  const [reTempQty, setReTempQty] = useState([]);
  const [isBox, setIsBox] = useState(false);
  const [noInBox, setNoInBox] = useState(1);
  const [itemDiscount, setItemDiscount] = useState(0);
  const [mrpEdit, setMrpEdit] = useState(false);
  const [newProfit, setNewProfit] = useState(0);

  const posSaleData = useSelector((state) => state.posReducer);
  const carts = useSelector((state) => state.posReducer.products);
  const reCarts = useSelector((state) => state.posReducer.returnProducts);

  // console.log(carts);

  // useEffect(() => {
  //   setScValue(carts.id);
  // }, [carts]);

  const [product, setProduct] = useState({});
  const [productUpdate, setProductUpdate] = useState(false);
  const handleProductUpdateClose = () => {
    setProductUpdate(false);
    setMrpEdit(false);
    setNewProfit(0);
  };

  useEffect(() => {
    let cartTempQty = [];
    let reCartTempQty = [];
    let cartIsBox = [];
    let cartNoInBox = [];
    let itmDiscount = [];

    carts?.map((item) => {
      cartTempQty = [...cartTempQty, { id: item.article_code, qty: item.qty }];
      cartIsBox = [
        ...cartIsBox,
        { id: item.article_code, soldInBox: item.soldInBox },
      ];
      cartNoInBox = [
        ...cartNoInBox,
        { id: item.article_code, noOfBox: item.noOfBox },
      ];
      itmDiscount = [
        ...itmDiscount,
        { id: item.article_code, discount: item.discount },
      ];
    });

    reCarts?.map((item) => {
      reCartTempQty = [
        ...reCartTempQty,
        { id: item.article_code, qty: item.qty },
      ];
    });

    setIsBox(cartIsBox);
    setNoInBox(cartNoInBox);
    setTempQty(cartTempQty);
    setReTempQty(reCartTempQty);
    setItemDiscount(itmDiscount);
  }, [carts, reCarts]);

  const handleOnChangeCategory = (id, e) => {
    let ProductCart = JSON.parse(localStorage.getItem("pos_cart"));
    let selected = ProductCart.find((item) => item.id === id);
    let rest = ProductCart.filter((item) => item.id !== id);
    let newCart = [];
    newCart = [
      ...rest,
      {
        ...selected,
        mrp: e.option,
      },
    ];

    localStorage.setItem("pos_cart", JSON.stringify(newCart));
    console.log(e.option);
    updateCart();
  };

  const returnCustomQuantity = (e, old, id) => {
    if (reCarts) {
      let selectedItem = reCarts.find((p) => p.article_code === id);
      let restItem = reCarts.filter((p) => p.article_code !== id);

      console.log(reCarts, id, e.target.value);

      selectedItem = {
        ...selectedItem,
        qty: e.target.value > 0 ? e.target.value : 0,
      };
      restItem = [...restItem, selectedItem];

      console.log(restItem);
      const returnItems = restItem.sort((a, b) => a.order - b.order);

      // GET OLD QTY
      if (invoice?.products) {
        const selectedOldItem = invoice.products.filter(
          (pro) => pro.article_code === id
        );
        console.log(selectedOldItem[0].qty);
        if (selectedOldItem[0].qty >= e.target.value) {
          dispatch(saleReturnProducts(returnItems));
        } else {
          return;
        }
      } else {
        dispatch(saleReturnProducts(returnItems));
      }

      // return localStorage.setItem("pos_cart", JSON.stringify(newCart))
      //   ? "true"
      //   : "false";
      updateCart();
    }
  };
  // console.log("reCarts", reCarts);
  const handleProductDetails = (product) => {
    setProductUpdate(true);
    setProduct(product);
    setNewProfit(0);
  };

  const handleRemoveReturnProduct = () => {
    dispatch(saleReturnProducts([]));
    updateCart();
  };

  const handleRemoveSingleReturnProduct = (id) => {
    const updatedReturnProducts = reCarts.filter(
      (item) => item.article_code !== id
    );
    dispatch(saleReturnProducts(updatedReturnProducts));
    updateCart();
  };

  return (
    <>
      {/* {console.log(carts, reCarts)} */}
      {carts ? (
        carts
          .slice()
          .sort((a, b) => {
            return b.order - a.order;
          })
          .map((cartItem, index) => (
            <tr key={cartItem?.article_code}>
              <th scope="row">{i++}</th>
              <td title={cartItem?.article_code} className="w-25">
                <span
                  onClick={() => handleProductDetails(cartItem)}
                  className=" nav-link"
                  style={{ cursor: "pointer" }}
                >
                  {cartItem?.name}
                </span>
              </td>
              <td title={cartItem?.article_code}>{cartItem?.group[0]?.name}</td>
              <td className="text-center" title={cartItem?.article_code}>
                {cartItem?.stock || 0}
              </td>
              <td class="text-center">
                <input
                  className="form-check-input mr-3"
                  type="checkbox"
                  checked={isBox[index]?.soldInBox ? "checked" : ""}
                  onClick={(e) =>
                    handleSoldInBox(e, index, cartItem?.article_code)
                  }
                  id={cartItem?.article_code}
                />
              </td>
              <td class="text-center">
                <input
                  className="form-control quantity"
                  type="text"
                  disabled={isBox[index]?.soldInBox ? "" : "disabled"}
                  value={
                    noInBox[index]?.noOfBox
                      ? noInBox[index]?.noOfBox
                      : cartItem?.noOfBox
                  }
                  onChange={(e) =>
                    handleNoOfBox(e, index, cartItem?.article_code)
                  }
                  id={cartItem?.article_code}
                  style={{ maxWidth: "80px" }}
                />
              </td>
              <td>
                {/* <PriceSelectByProduct
                sc={cartItem?.id}
                setVal={cartItem?.mrp}
                handleOnChangeCategory={handleOnChangeCategory}
              ></PriceSelectByProduct> */}
                <strong>
                  {cartItem?.discount > 0
                    ? itemPrice(cartItem.discount, cartItem.mrp)
                    : cartItem.mrp}
                </strong>
                <small>TK</small>
              </td>
              <td className="col-md-2 align-content-center">
                <div className="  d-md-flex align-items-center">
                  <div className="input-group-prepend ">
                    <div
                      onClick={() => removeQuantities(cartItem.article_code)}
                      className="input-group-text"
                    >
                      <Icons.Minus size="28" />
                    </div>
                  </div>
                  <input
                    type="number"
                    style={{ maxWidth: "100px" }}
                    className="form-control  sm-input"
                    ref={index === 0 ? firstProductRef : null}
                    id={cartItem?.article_code}
                    onChange={(e) =>
                      handleCustomQty(e, index, cartItem?.article_code)
                    }
                    value={
                      tempQty[index]?.qty ? tempQty[index]?.qty : cartItem?.qty
                    }
                    onKeyDown={handleKeyDownToSearch}
                  />
                  <div className="input-group-append">
                    <div
                      onClick={() => addQuantities(cartItem.article_code)}
                      className="input-group-text"
                    >
                      <Icons.Plus size="28" />
                    </div>
                  </div>
                </div>
              </td>
              {/* <td className="text-center">
                {toDecimal(
                  parseFloat(
                    itemVat(cartItem?.vat, cartItem?.qty, cartItem?.mrp)
                  )
                )}
              </td> */}
              <td>
                {/* DISCOUNT */}
                <div className="input-group input-group-sm">
                  <input
                    className="form-control quantity"
                    type="number"
                    min={1}
                    max={15}
                    value={
                      itemDiscount[index]?.discount
                        ? itemDiscount[index]?.discount
                        : cartItem?.discount
                    }
                    onChange={(e) => {
                      e.preventDefault();
                      handleItemDiscount(e, index, cartItem?.article_code);
                    }}
                    id={cartItem?.article}
                    style={{ maxWidth: "50px" }}
                  />
                  <span className="input-group-text px-2" id="basic-addon2">
                    %
                  </span>
                </div>
              </td>
              <td className="text-center">
                {toDecimal(
                  itemVatTotal(
                    cartItem?.vat,
                    cartItem?.qty,
                    itemPrice(cartItem.discount, cartItem.mrp)
                  )
                )}

                <Icons.X
                  className="float-end"
                  onClick={() => removeFromCart(cartItem.article_code)}
                />
              </td>
            </tr>
          ))
      ) : (
        <tr>
          <th scope="row" colSpan="5">
            <p className="text-center">No Item in Cart</p>
          </th>
        </tr>
      )}
      {posSaleData.returnProducts?.length > 0 && (
        <>
          <tr>
            <th
              className="border-bottom-1 border-top-1 bg-light py-2"
              colSpan={12}
            >
              <div className="d-flex justify-content-between align-items-center px-2">
                <span className="">
                  <b>RETURN PRODUCTS</b>
                </span>
                <button
                  className="btn btn-sm border-0"
                  onClick={() => handleRemoveReturnProduct()}
                  title="Clear All Returns"
                >
                  <Icons.Trash size="18" /> Clear All
                </button>
              </div>
            </th>
          </tr>
          {reCarts?.map((reItem, index) => (
            <tr key={reItem?.article_code} className="">
              <th scope="row">{j++}</th>
              <td title={reItem?.article_code} className="w-25">
                {reItem?.name}
              </td>
              <td> {reItem?.group[0]?.name}</td>
              <td className="text-center"> {reItem?.stock} </td>
              <td></td>
              <td></td>
              <td>
                <strong>{reItem?.mrp}</strong> <small>TK</small>
              </td>
              <td className="col-md-2">
                <input
                  type="number"
                  className="form-control quantity mx-auto"
                  style={{ maxWidth: "80px" }}
                  id={reItem?.article_code}
                  onChange={(e) =>
                    returnCustomQuantity(
                      e,
                      reTempQty[index]?.qty,
                      reItem.article_code
                    )
                  }
                  value={
                    reTempQty[index]?.qty ? reTempQty[index]?.qty : reItem.qty
                  }
                />
              </td>
              <td>
                <div className="input-group input-group-sm">
                  <input
                    className="form-control quantity"
                    type="number"
                    readOnly
                    value={reItem?.discountPercent || 0}
                    style={{ maxWidth: "50px" }}
                  />
                  <span className="input-group-text px-2">%</span>
                </div>
              </td>
              <td className="text-center">
                {toDecimal(itemVatTotal(reItem?.vat, reItem?.qty, reItem?.mrp))}
                <Icons.X
                  className="float-end cursor-pointer"
                  onClick={() =>
                    handleRemoveSingleReturnProduct(reItem.article_code)
                  }
                />
              </td>
            </tr>
          ))}
          <tr className="bg-light">
            <td colSpan={2}>
              <b>Item No:</b> {posSaleData.returnCal.totalItem}
            </td>
            <td colSpan={2}>
              <b>Total:</b> {posSaleData.returnCal.total?.toFixed(2)}
            </td>
            <td colSpan={2}>
              <b>Gross Total:</b> {posSaleData?.returnCal?.grossTotal}
            </td>
            <td colSpan={2}>
              <b>Round Total:</b> {posSaleData.returnCal.grossTotalRound}
            </td>
            <td colSpan={2}>
              <b>Point:</b> {posSaleData.returnCal.point}
            </td>
            <td></td>
          </tr>
        </>
      )}
      <ProductDetailsUpdateModal
        onShow={productUpdate}
        setOnShow={setProductUpdate}
        product={product}
        handleClose={handleProductUpdateClose}
        setMrpEdit={setMrpEdit}
        mrpEdit={mrpEdit}
        setNewProfit={setNewProfit}
        newProfit={newProfit}
      ></ProductDetailsUpdateModal>
    </>
  );
};

export default PosCart;
