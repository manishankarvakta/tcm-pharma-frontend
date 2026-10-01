import axios from "../../../services/apiClient";
import { useEffect, useState } from "react";
import { BsArchive } from "react-icons/bs";
import { signInUser } from "../../Utility/Auth";

const SupplierProductDetail = ({
  localStorageAddFromCart,
  cartItem,
  i,
  index,
  selectedIndex,
  warehouse,
}) => {
  const auth = signInUser();
  const { aamarId } = auth;
  const BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  // console.log(aamarId);
  const [inventoryData, setInventoryData] = useState([]);
  const url = `${BASE_URL}/inventory/article_code/${cartItem.article_code}/${aamarId}/${warehouse}`;

  const getInventory = async () => {
    const result = await axios.get(url);
    setInventoryData(result.data);
  };

  useEffect(() => {
    getInventory();
  }, [cartItem, warehouse]);

  console.log("cart-items", cartItem);

  return (
    <tr
      // style={index === selectedIndex ? { backgroundColor: "yellow" } : null}
      // ref={index === 0 ? firstProductRef : null}
      key={cartItem?.article_code}
    >
      {/* <th scope="row">{i++}</th> */}
      {/* <td title={cartItem?.article_code} className="text-break">
        {cartItem?.name}-{cartItem?.group}
      </td>
      <td className="text-center">{cartItem?.stock}</td>
      <td className="text-center">
        <BsArchive onClick={() => localStorageAddFromCart(cartItem)} />
      </td> */}
      <td className="ps-2">{i}</td>
      <td title={cartItem?.article_code} className="text-break px-4">
        {cartItem?.article_code}
      </td>
      <td title={cartItem?.article_code} className="text-break px-4">
        {cartItem?.name}
      </td>
      {/* <td className="ps-2">{cartItem?.brand || "N/A"}</td> */}
      {/* <td className="ps-2">{cartItem?.generic || "N/A"}</td> */}
      {/* {getStockData(cartItem?.article_code)} */}
      <td className="ps-2">{parseInt(inventoryData?.currentQty) || 0}</td>
      <td className="ps-2">
        {/* <input
                className="form-check-input"
                onChange={() => localStorageAddFromCart(cartItem)}
                type="checkbox"
                value=""
                id="flexCheckChecked"
              /> */}
        <BsArchive onClick={() => localStorageAddFromCart(cartItem)} />
        {/* <Icons.X
                className="float-end"
                onClick={() => removeFromCart(cartItem.article_code)}
              /> */}
      </td>
    </tr>
  );
};

export default SupplierProductDetail;
