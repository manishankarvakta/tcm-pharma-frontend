import * as Icons from "heroicons-react";
import { Accordion, Image, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../../logo.png";
import "./SideBar.css";

const EcomSideBar = () => {
    let active = window.location.pathname;
    return (
      <aside className="sticky-md-top">
        <Link className="nav-link logo pt-3 pb-5" to="/dashboard">
          <Image src={logo} fluid />
        </Link>
        <nav className="nav flex-column">
          {/* <Link className='nav-link' to="/"><Icons.HomeOutline size={22}></Icons.HomeOutline> Home</Link> */}
          <>
            <Link
              className={`nav-link ${active === "/ecom" && "active"}`}
              to="/ecom"
            >
              <Icons.ShoppingCartOutline size={22}></Icons.ShoppingCartOutline>{" "}
              Ecom Sales
            </Link>
          </>
        </nav>
      </aside>
    );
};

export default EcomSideBar;