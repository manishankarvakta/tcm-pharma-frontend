/* eslint-disable react-hooks/exhaustive-deps */
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDeleteUserMutation, useUsersQuery } from "../../services/userApi";
import "../Common/CSS/Table.css";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import "./User.css";
import AlertService from "../Utility/AlertService";
import { useSelector } from "react-redux";
import { RootState } from "../../features/languageSlice";

const User = () => {
  const lang = useSelector((state: RootState) => state.languageReducer);

  const authUser = signInUser();

  const [warehouse, SetWarehouse] = useState("allWh");
  const [loader, setLoader] = useState(true);
  const [aamarId, setAamarId] = useState("");
  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useUsersQuery({
      warehouse,
      aamarId,
    });
  // console.log(data);
  let i = 1;
  const [deleteUser] = useDeleteUserMutation();
  useEffect(() => {
    isFetching ? setLoader(true) : setLoader(false);
  }, [data, isLoading, isFetching]);
  useEffect(() => {
    refetch();
  }, [warehouse, aamarId]);
  // console.log("auth", authUser);

  useEffect(() => {
    if (authUser?.type === "admin") {
      SetWarehouse("allWh");
    } else {
      const warehouseValue =
        typeof authUser?.warehouse === "string"
          ? authUser.warehouse
          : authUser?.warehouse?.name || ""; // Extract `name` if it's an object
      SetWarehouse(warehouseValue);
    }
  }, [authUser]);

  useEffect(() => {
    setAamarId(authUser?.aamarId || "");
  }, []);

  const deleteHandler = async (id: string) => {
    const confirm = await AlertService.confirm("Are you Sure?", "Delete this User?");
    if (confirm) {
      const res = await deleteUser(id);
      if (res) {
        // TODO::
        // add error hendaler for delete error
        console.log(res);
      } else {
        console.log("Delete Operation Canceled by user!");
        return;
      }
    }
  };
  function isWarehouseObject(
    warehouse: unknown
  ): warehouse is { name: string } {
    return (
      typeof warehouse === "object" && warehouse !== null && "name" in warehouse
    );
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <SideBar></SideBar>
        </div>
        <div className="col-md-10">
          <Header title={lang?.allUsers}></Header>
          <div className="row pt-3">
            <div className="col-md-6">{/* <h3>All Users</h3> */}</div>

            <div className="col-md-6">
              <span className="float-end">
                <Link className="btn btn-dark" to="/user/add">
                  <Icons.UserAddOutline size={18}></Icons.UserAddOutline>
                  {lang?.createUser}
                </Link>
              </span>
            </div>
          </div>

          {/* Responsive table with overflow */}
          <div className="table-responsive">
            <Table hover className="mt-3">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col" className="text-nowrap">
                    User Name
                  </th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Warehouse</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isSuccess && (
                  <>
                    {data?.map((user, index) => (
                      <tr key={user?._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{user?.name}</td>
                        <td className="text-nowrap">{user?.username}</td>
                        <td>{user?.email}</td>
                        <td>{user?.phone}</td>
                        <td>
                          {isWarehouseObject(user?.warehouse)
                            ? user?.warehouse?.name
                            : "No warehouse"}
                        </td>
                        <td>{user?.type}</td>
                        <td>{user?.status}</td>
                        <td className="d-flex align-items-center">
                          <Link to={`/user/${user._id}`}>
                            <Icons.EyeOutline className="icon-eye" size={22} />
                          </Link>
                          <Link to={`/user/update/${user._id}`}>
                            <Icons.PencilAltOutline
                              className="icon-edit ms-2"
                              size={22}
                            />
                          </Link>
                          {authUser?.type === "admin" && (
                            <Icons.TrashOutline
                              onClick={() => deleteHandler(user?._id)}
                              className="icon-trash ms-2"
                              size={22}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                )}
                {isLoading && (
                  <tr>
                    <td colSpan={9} className="text-center">
                      <h2>...Loading</h2>
                    </td>
                  </tr>
                )}
                {isFetching && (
                  <tr>
                    <td colSpan={9} className="text-center">
                      <h2>...isFetching</h2>
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={9} className="text-center">
                      <h2>Something went wrong</h2>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
