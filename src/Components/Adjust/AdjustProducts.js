import React from "react";
import SelectTpDamage from "../Common/CustomSelect/SelectTpDamage";
import * as Icons from "heroicons-react";
import { Textarea } from "react-daisyui";

const AdjustProducts = ({
  adjustProducts,
  i,
  handleCustomQty,
  removeFromCart,
  handleOnChangePrice,
  handleCustomReason,
  handleDeSelectIsType,
  handleIsType,
}) => {
  return (
    <>
      {adjustProducts?.length > 0 ? (
        adjustProducts
          ?.slice()
          ?.sort((a, b) => (a.order || 0) - (b.order || 0))
          ?.map((item, index) => {
            const currentStock = Number(item?.currentStock) || 0;
            const adjustQty =
              item?.qty === "" ? 0 : parseFloat(item?.qty) || 0;
            const isTypeIn = item?.type !== false;
            const finalStock = isTypeIn
              ? currentStock + adjustQty
              : currentStock - adjustQty;

            return (
              <tr key={item?.id || item?.article_code || index}>
                <th>{i++}</th>
                <td>{item?.article_code}</td>
                <td>{item?.name}</td>
                <td
                  className="text-center fw-bold"
                  style={{ verticalAlign: "middle" }}
                >
                  <span
                    className={
                      currentStock < 0 ? "text-danger" : "text-dark"
                    }
                  >
                    {item?.currentStock ?? 0}
                  </span>
                </td>
                <td className="col-md-2">
                  <div className="input-group">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="form-control quantity"
                      width="40%"
                      id={item?.article_code}
                      onChange={(e) =>
                        handleCustomQty(e.target.value, item?.article_code)
                      }
                      value={item?.qty ?? ""}
                    />
                  </div>
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  <select
                    className={`form-select form-select-sm fw-bold ${
                      isTypeIn
                        ? "text-success border-success"
                        : "text-danger border-danger"
                    }`}
                    style={{ minWidth: "90px" }}
                    value={isTypeIn ? "in" : "out"}
                    onChange={(e) => {
                      if (e.target.value === "in") {
                        handleIsType(item?.article_code);
                      } else {
                        handleDeSelectIsType(item?.article_code);
                      }
                    }}
                  >
                    <option value="in" className="text-success fw-bold">
                      + In
                    </option>
                    <option value="out" className="text-danger fw-bold">
                      - Out
                    </option>
                  </select>
                </td>
                <td
                  className="text-center fw-bold"
                  style={{ verticalAlign: "middle" }}
                >
                  <span
                    className={`badge ${
                      finalStock < 0 ? "bg-danger" : "bg-primary"
                    }`}
                    style={{ fontSize: "13px", padding: "6px 10px" }}
                  >
                    {finalStock}
                  </span>
                </td>
                <td>
                  <SelectTpDamage
                    sc={item?.id}
                    setVal={item?.tp}
                    handleOnChangeCategory={handleOnChangePrice}
                  />
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  {parseFloat((Number(item?.tp) || 0) * adjustQty).toFixed(2)}
                </td>
                <td>
                  <Textarea
                    type="text"
                    className="form-control quantity"
                    width="30%"
                    rows="1"
                    value={item?.reason || ""}
                    onChange={(e) =>
                      handleCustomReason(e.target.value, item?.article_code)
                    }
                  />
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  <Icons.X
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={() => removeFromCart(item?.id)}
                  />
                </td>
              </tr>
            );
          })
      ) : (
        <tr>
          <td colSpan={11} className="text-center p-3">
            Please select product
          </td>
        </tr>
      )}
    </>
  );
};

export default AdjustProducts;
