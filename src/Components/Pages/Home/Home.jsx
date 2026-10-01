import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../../Common/Header/Header";
import { signInUser } from "../../Utility/Auth";
import { useSelector } from "react-redux";

const Home = () => {
  const loggedInUser = signInUser();
    const lang = useSelector((state) => state.languageReducer);
  

  return (
    <div>
      <Header />

      <div className="menuWrapper container mt-5">
        <Nav
          className="
          row
        justify-content-center 
        align-items-center
        align-content-center
        mt-6
        h-full 
        w-full
        "
        >
          {loggedInUser?.type === "admin" ? (
            <>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-0">{lang?.welcome}</p>
                  <h2 className="ml-6 mt-0">{lang?.quickActions}</h2>
                </div>
                <div>
                  <p className="mb-0">{lang?.todayIs},</p>
                  <h4 className="ml-6 mt-0">
                    {format(Date.now(), "dd MMMM yyyy")}
                  </h4>
                </div>
              </div>
              <Link
                className="
              nav-link 
              d-flex 
              flex-column
              justify-content-center 
              align-items-center
              align-content-center
              col-2
              "
                style={{
                  border: "1px solid #f8f9fa",
                  padding: "20px",
                  margin: "20px",
                  borderRadius: "15px",
                  background: "#f8f9fa",
                }}
                to="/dashboard"
              >
                <Icons.AdjustmentsOutline size={30} className="pt-10" />
                <p className="text-sm mt-2">
                  <small>{lang?.dashboard}</small>
                </p>
              </Link>
              <Link
                className="
              nav-link 
              d-flex 
              flex-column
              justify-content-center 
              align-items-center
              align-content-center
              col-2
              "
                style={{
                  border: "1px solid #f8f9fa",
                  padding: "20px",
                  margin: "20px",
                  borderRadius: "15px",
                  background: "#f8f9fa",
                }}
                to="/pos"
              >
                <Icons.CalculatorOutline size={30} className="pt-10" />
                <p className="text-sm mt-2">
                  <small>{lang?.pos}</small>
                </p>
              </Link>
              <Link
                className="
              nav-link 
              d-flex 
              flex-column
              justify-content-center 
              align-items-center
              align-content-center
              col-2
              "
                style={{
                  border: "1px solid #f8f9fa",
                  padding: "20px",
                  margin: "20px",
                  borderRadius: "15px",
                  background: "#f8f9fa",
                }}
                to="/grn"
              >
                <Icons.ArchiveOutline size={30} className=" pt-10" />
                <p className="text-sm mt-2">
                  <small>{lang?.GRN}</small>
                </p>
              </Link>
              <Link
                className="
              nav-link 
              d-flex 
              flex-column
              justify-content-center 
              align-items-center
              align-content-center
              col-2
              "
                style={{
                  border: "1px solid #f8f9fa",
                  padding: "20px",
                  margin: "20px",
                  borderRadius: "15px",
                  background: "#f8f9fa",
                }}
                to="/sms"
              >
                <Icons.ChatAltOutline size={30} className="pt-10" />
                <p className="text-sm mt-2">
                  <small>{lang?.sms}</small>
                </p>
              </Link>
              <Link
                className="
              nav-link 
              d-flex 
              flex-column
              justify-content-center 
              align-items-center
              align-content-center
              col-2
              "
                style={{
                  border: "1px solid #f8f9fa",
                  padding: "20px",
                  margin: "20px",
                  borderRadius: "15px",
                  background: "#f8f9fa",
                }}
                to="/sales"
              >
                <Icons.ShoppingCartOutline size={30} className="pt-10" />
                <p className="text-sm mt-2">
                  <small>{lang?.sales}</small>
                </p>
              </Link>

              <Link
                className="
              nav-link 
              d-flex 
              flex-column
              justify-content-center 
              align-items-center
              align-content-center
              col-2
              "
                style={{
                  border: "1px solid #f8f9fa",
                  padding: "20px",
                  margin: "20px",
                  borderRadius: "15px",
                  background: "#f8f9fa",
                }}
                to="/user"
              >
                <Icons.UserOutline size={30} className="pt-10" />
                <p className="text-sm mt-2">
                  <small>{lang?.users}</small>
                </p>
              </Link>
              <Link
                className="
              nav-link 
              d-flex 
              flex-column
              justify-content-center 
              align-items-center
              align-content-center
              col-2
              "
                style={{
                  border: "1px solid #f8f9fa",
                  padding: "20px",
                  margin: "20px",
                  borderRadius: "15px",
                  background: "#f8f9fa",
                }}
                to="/product"
              >
                <Icons.ArchiveOutline size={30} className="pt-10" />
                <p className="text-sm mt-2">
                  <small>{lang?.products}</small>
                </p>
              </Link>
              <Link
                className="
              nav-link 
              d-flex 
              flex-column
              justify-content-center 
              align-items-center
              align-content-center
              col-2
              "
                style={{
                  border: "1px solid #f8f9fa",
                  padding: "20px",
                  margin: "20px",
                  borderRadius: "15px",
                  background: "#f8f9fa",
                }}
                to="/customer"
              >
                <Icons.UsersOutline size={30} className="pt-10" />
                <p className="text-sm mt-2">
                  <small>{lang?.customers}</small>
                </p>
              </Link>
              <Link
                className="
              nav-link 
              d-flex 
              flex-column
              justify-content-center 
              align-items-center
              align-content-center
              col-2
              "
                style={{
                  border: "1px solid #f8f9fa",
                  padding: "20px",
                  margin: "20px",
                  borderRadius: "15px",
                  background: "#f8f9fa",
                }}
                to="/purchase"
              >
                <Icons.CurrencyDollarOutline size={30} className="pt-10" />
                <p className="text-sm mt-2">
                  <small>{lang?.purchase}</small>
                </p>
              </Link>
              <Link
                className="
              nav-link 
              d-flex 
              flex-column
              justify-content-center 
              align-items-center
              align-content-center
              col-2
              "
                style={{
                  border: "1px solid #f8f9fa",
                  padding: "20px",
                  margin: "20px",
                  borderRadius: "15px",
                  background: "#f8f9fa",
                }}
                to="/damage"
              >
                <Icons.TrashOutline size={30} className="pt-10" />
                <p className="text-sm mt-2">
                  <small>{lang?.damage}</small>
                </p>
              </Link>
              <Link
                className="
              nav-link 
              d-flex 
              flex-column
              justify-content-center 
              align-items-center
              align-content-center
              col-2
              "
                style={{
                  border: "1px solid #f8f9fa",
                  padding: "20px",
                  margin: "20px",
                  borderRadius: "15px",
                  paddingTop: "10px",
                  background: "#f8f9fa",
                }}
                to="/inventory"
              >
                <Icons.ViewGridAddOutline size={30} className="pt-10" />
                <p className="text-sm mt-2">
                  <small>{lang?.inventory}</small>
                </p>
              </Link>
            </>
          ) : (
            <>
              <div className=" d-flex justify-content-center align-items-center animate__animated animate__fadeIn">
                <h1 className="p-5 ">{lang?.welcome} . . . !</h1>
              </div>
            </>
          )}
        </Nav>
      </div>
    </div>
  );
};

export default Home;
