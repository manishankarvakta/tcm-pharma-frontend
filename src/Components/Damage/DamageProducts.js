import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Textarea } from "react-daisyui";
import "./Damage.css";
const DamageProducts = ({
  damageProducts,
  i,
  //   removeQuantities,
  handleCustomQty,
  //   addQuantities,
  removeFromCart,
  handleCustomReason,
  handleOnChangePrice,
}) => {
  const [tempQty, setTempQty] = useState([]);

  useEffect(() => {
    let cartTempQty = [];

    damageProducts?.map((item) => {
      cartTempQty = [...cartTempQty, { id: item.article_code, qty: item.qty }];
    });
    setTempQty(cartTempQty);
  }, [damageProducts]);
  console.log(damageProducts);

  return (
    <>
      {damageProducts?.length > 0 ? (
        damageProducts
          ?.slice()
          ?.sort((a, b) => a.order - b.order)
          // sorting a problem hosse // pleas check
          ?.map((item) => (
            <tr key={item?.order}>
              <th>{i++}</th>
              {/* <td>{item?.ean}</td> */}
              <td>{item?.article_code}</td>
              <td>{item?.name}</td>
              <td>{item?.group}</td>
              <td>{item?.stock}</td>
              <td className="col-md-2">
                <div className="input-group ">
                  {/* quantity */}
                  <input
                    type="text"
                    className="form-control quantity"
                    width="40%"
                    id={item?.article_code}
                    onChange={(e) =>
                      handleCustomQty(e.target.value, item?.article_code)
                    }
                    value={item?.qty}
                    defaultValue={item?.qty}
                  />
                </div>
              </td>
              <td className="col-md-2">
                {/* tp */}
                <input
                  type="text"
                  className="form-control quantity sm-input"
                  // width="40%"
                  id={item?.article_code}
                  value={item?.tp}
                  onChange={(e) =>
                    handleOnChangePrice(e.target.value, item?.article_code)
                  }
                  defaultValue={item?.tp}
                  disabled
                />
              </td>
              {/* <td>{item?.tp}</td> */}
              {/* <SelectTpDamage
                sc={item?.id}
                setVal={item?.tp}
                handleOnChangeCategory={handleOnChangePrice}
              // handleCustomMrp={handleCustomMrp}
              ></SelectTpDamage> */}
              <td>{parseFloat(item?.tp * item?.qty).toFixed(2)}</td>
              <td>
                <Textarea
                  type="text"
                  className="form-control quantity"
                  width="30%"
                  rows="1"
                  onChange={(e) =>
                    handleCustomReason(e.target.value, item?.article_code)
                  }
                />
              </td>
              <td>
                <Icons.X
                  size={20}
                  onClick={() => removeFromCart(item?.id)}
                ></Icons.X>
              </td>
            </tr>
          ))
      ) : (
        <tr>
          <td colSpan={6}>
            {/* <p className="text-center m-2">
                            Please select product
                        </p> */}
          </td>
        </tr>
      )}
    </>
  );
};

export default DamageProducts;
