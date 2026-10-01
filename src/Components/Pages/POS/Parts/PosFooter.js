import React, { useState } from "react";
import "./PosFooter.css";
import { Button, ButtonGroup } from "react-bootstrap";
import * as Icons from "heroicons-react";
import { Link } from "react-router-dom";
import SelectHoldSale from "../../../Common/CustomSelect/SelectHoldSale";
import { useDispatch } from "react-redux";
// import { FontAwesomeIcon } from "@react";
import logo from "../../../../logo-s.svg";

const PosFooter = ({
  genericSearch,
  emptyCart,
  LastBillId,
  handleHoldSale,
  holdSale,
  handleReturn,
  updateCartState,
  handleVoidReturn
}) => {
  const holdCart = JSON.parse(localStorage.getItem("hold_cart"));
  const holdLength = holdCart?.length;

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const dispatch = useDispatch();

  // Toggle Popup Visibility
  const togglePopup = () => setIsPopupOpen((prevState) => !prevState);

  return (
    <footer className="fixed-bottom">
      <div className="container-fluid d-block d-md-none">
        <div className="floating-menu">
          {/* Floating Button */}
          <div className="floating-btn" onClick={togglePopup}>
            <img src={logo} alt="" />
          </div>

          {/* Popup Menu */}
          {isPopupOpen && (
            <div className="popup-menu">
              <Button
                variant="dark"
                onClick={handleVoidReturn}
                className="popup-btn"
              >
                <Icons.ReplyOutline className="icon" size={18} />
                Void
              </Button>

              <Button
                variant="dark"
                onClick={handleReturn}
                className="popup-btn"
              >
                <Icons.ReplyOutline className="icon" size={18} />
                Return
              </Button>

              {holdLength > 0 && (
                <SelectHoldSale updateCartState={updateCartState} />
              )}

              <Button
                variant="warning"
                onClick={handleHoldSale}
                className="popup-btn"
              >
                <Icons.HandOutline className="icon" size={18} />
                {holdLength > 0 ? `Hold (${holdLength})` : "Hold"}
              </Button>

              <Button
                variant="success"
                onClick={emptyCart}
                className="popup-btn"
              >
                <Icons.Refresh className="icon" size={18} />
                Refresh
              </Button>

              <Button
                variant="danger"
                onClick={genericSearch}
                className="popup-btn"
              >
                <Icons.SearchCircleOutline className="icon" size={18} />
                Generic
              </Button>

              <Link
                className="btn btn-primary popup-btn"
                to={`/print/${LastBillId ? LastBillId : "lastsale"}`}
                target="_blank"
              >
                <Icons.PrinterOutline className="icon" size={18} />
                Last Bill
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="container-fluid d-none d-md-block">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <ButtonGroup aria-label="Basic">
                {/* <Button variant="info" >
                        Sales 
                        <Icons.ClipboardListOutline className='ms-3'  size={18}/>         
                  </Button> */}

                <Button variant="d-block" onClick={handleVoidReturn}>
                  Void
                  <Icons.ReplyOutline className="ms-3" size={18} />
                  {/* <Icons.XOutline  className='ms-3' size={18}/> */}
                </Button>
                <Button variant="dark d-block" onClick={handleReturn}>
                  Return
                  <Icons.ReplyOutline className="ms-3" size={18} />
                  {/* <Icons.XOutline  className='ms-3' size={18}/> */}
                </Button>
                {/* <Button variant="secondary"> */}
                {holdLength > 0 && (
                  <SelectHoldSale updateCartState={updateCartState} />
                )}
                {/* </Button> */}
                <Button variant="warning" onClick={handleHoldSale}>
                  {holdLength > 0 && `(${holdLength})`} Hold
                  <Icons.HandOutline className="ms-3" size={18} />
                </Button>
                <Button variant="success" onClick={emptyCart}>
                  Refresh
                  <Icons.Refresh className="ms-3" size={18} />
                </Button>
                <Button variant="danger" onClick={genericSearch}>
                  Generic
                  <Icons.SearchCircleOutline className="ms-3" size={18} />
                </Button>
                <Link
                  variant="primary"
                  className="btn btn-primary"
                  to={`/print/${LastBillId ? LastBillId : "lastsale"}`}
                  target="_blank"
                >
                  Last Bill
                  <Icons.PrinterOutline className="ms-3" size={18} />
                </Link>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PosFooter;
