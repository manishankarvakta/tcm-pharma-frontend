import SupplierProductDetail from "./SupplierProductDetail";
// import { createDispatchHook } from 'react-redux';

const SupplierProduct = ({
  productList,
  localStorageAddFromCart,
  selectedIndex,
  warehouse,
}) => {
  console.log("productList", productList);
  // const { data, error, isSuccess } = useInventoryByArticleQuery()
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  let i = 1;

  return (
    <>
      {productList?.length > 0 ? (
        productList?.map((cartItem, index) =>
          // cartItem.quantity=tempQty;
          // console.log("cartItem", cartItem);
          <SupplierProductDetail
            // firstProductRef={firstProductRef}
            selectedIndex={selectedIndex}
            cartItem={cartItem}
            index={index}
            i={i++}
            localStorageAddFromCart={localStorageAddFromCart}
            warehouse={warehouse}
          ></SupplierProductDetail>

          // <tr key={cartItem?.article_code}>
          //   {/* <th scope="row">{i++}</thproductList> */}
          //   <td>{cartItem?.article_code}</td>
          //   <td title={cartItem?.article_code}>
          //     {cartItem?.name?.substr(0, 30)}...
          //   </td>
          //   {/* {getStockData(cartItem?.article_code)} */}
          //   <td>0</td>
          //   <td>
          //     {/* <input
          //       class="form-check-input"
          //       onChange={() => localStorageAddFromCart(cartItem)}
          //       type="checkbox"
          //       value=""
          //       id="flexCheckChecked"
          //     /> */}
          //     <BsArchive onClick={() => localStorageAddFromCart(cartItem)} />
          //     {/* <Icons.X
          //       className="float-end"
          //       onClick={() => removeFromCart(cartItem.article_code)}
          //     /> */}
          //   </td>
          // </tr>
        )
      ) : (
        <tr>
          <th scope="row" colSpan="9">
            <p className="text-center">No Item in Purchase List</p>
          </th>
        </tr>
      )}
    </>
  );
};

export default SupplierProduct;
