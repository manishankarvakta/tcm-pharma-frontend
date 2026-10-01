import userEvent from "@testing-library/user-event";
import axios from "../../services/apiClient";
import React from "react";
import { useEffect, useState } from "react";
import {
  useUpdateInventoryMutation,
  useAddInventoryMutation,
} from "../../services/inventoryApi";
import { signInUser } from "../Utility/Auth";

const useInventory = () => {
  const user = signInUser();
  const [inventory, setInventory] = useState({});
  const [updateInventory] = useUpdateInventoryMutation();
  const [createInventory] = useAddInventoryMutation();
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // UPDATE INVENTORY (IN/OUT)
  // const inventoryUpdate = async (article_code, priceId, qty)
  // const inventoryIn = async (product) => {
  //   // let inventory = {};
  //   const success = await axios.get(
  //     `${BASE_URL}/inventory/article_code/${product.article_code}`
  //   );
  //   console.log("matched Inventory", success?.data);
  // };

  // INVENTORY IN - RETURN | SALE DEL | GRN DEL | Damage
  //inventory in on grn in

  /**
   *
   * GRN OPERATIONS
   *
   */
  // Inventory In
  const updateInventoryIn = async (products) => {
    console.log("inventory Products", products);
    if (products.length > 0) {
      for (const product of products) {
        const { article_code, qty, priceId, name } = product;

        // Safety check for article_code and user.aamarId
        if (!article_code || !user?.aamarId) {
          console.error("Missing article_code or aamarId for inventory update", { article_code, aamarId: user?.aamarId });
          continue;
        }

        let inventory = {};
        const success = await axios.get(
          `${BASE_URL}/inventory/article_code/${article_code}/${user.aamarId}/${user.warehouse}`
        );
        console.log("matched Inventory", success?.data);
        // inventory = { ...success.data };
        // CHECK IF INVENTORY EXIST WITH article_code
        if (success?.data?._id) {
          // CHECK IF PRICE TABLE EXIST
          if (success?.data?.priceTable?.length > 0) {
            // CHECK IF PRICE EXIST
            const checked = success.data.priceTable.find(
              (p) => p.id === priceId
            );
            const rest = success.data.priceTable.filter(
              (p) => p.id !== priceId
            );
            if (checked) {
              // IF INVENTORY PRICE EXIST UPDATE PRICE WITH qty
              console.log(checked, "exist", qty, Number(checked.currentQty));
              inventory = {
                ...success.data,
                priceTable: [
                  ...rest,
                  {
                    ...checked,
                    currentQty: Number(checked.currentQty) + Number(qty),
                    totalQty: Number(checked.totalQty) + Number(qty),
                  },
                ],
                currentQty: Number(success.data.currentQty) + Number(qty),
                totalQty: Number(success.data.totalQty) + Number(qty),
              };
            } else {
              // IF INVENTORY PRICE DOES NOT EXIST
              inventory = {
                ...success?.data,
                priceTable: [
                  ...rest,
                  {
                    id: priceId,
                    openingQty: Number(qty),
                    currentQty: Number(qty),
                    totalQty: Number(qty),
                    soldQty: 0,
                    rtvQty: 0,
                    damageQty: 0,
                  },
                ],
                openingQty: Number(success.data.openingQty) + Number(qty),
                currentQty: Number(success.data.currentQty) + Number(qty),
                totalQty: Number(success.data.totalQty) + Number(qty),
              };
            }
          } else {
            // CREATE NEW PRICE TABLE WITH (price + qty)
            inventory = {
              ...success?.data,
              priceTable: [
                {
                  id: priceId,
                  openingQty: Number(qty),
                  currentQty: Number(qty),
                  totalQty: Number(qty),
                  soldQty: 0,
                  rtvQty: 0,
                  damageQty: 0,
                },
              ],
              openingQty: Number(success.data.openingQty) + Number(qty),
              currentQty: Number(success.data.currentQty) + Number(qty),
              totalQty: Number(success.data.totalQty) + Number(qty),
            };
          }
          console.log(inventory);
          const update = await updateInventory(inventory);
          console.log(update);
          // return update;
          // success.then((res) => (inventory = { ...res.data }));
        } else {
          // CREATE INVENTORY WITH (article_code + priceList + qty)
          console.log("create New Inventory");
          let newInventory = {
            article_code: product.article_code,
            warehouse: user?.warehouse,
            aamarId: user?.aamarId,
            priceTable: [
              {
                id: priceId,
                currentQty: qty,
                openingQty: qty,
                totalQty: qty,
                soldQty: 0,
                damageQty: 0,
                rtvQty: 0,
              },
            ],
            name: name,
            currentQty: qty,
            openingQty: qty,
            totalQty: qty,
            damageQty: 0,
            rtvQty: 0,
            status: "active",
          };
          const inventory = await createInventory(newInventory);
          console.log(inventory);
        }
      }
      return true;
    } else {
      return false;
    }
  };
  // Inventory Out
  const updateInventoryOUTOnGRNDel = async (products) => {
    console.log("inventory Products", products);
    if (products.length > 0) {
      for (const product of products) {
        console.log(product);
        const { article_code, qty, priceId, name } = product;

        // Safety check for article_code and user.aamarId
        if (!article_code || !user?.aamarId) {
          console.error("Missing article_code or aamarId for inventory update", { article_code, aamarId: user?.aamarId });
          return;
        }

        let inventory = {};
        const success = await axios.get(
          `${BASE_URL}/inventory/article_code/${article_code}/${user.aamarId}/${user.warehouse}`
        );
        console.log("matched Inventory", success?.data);
        // inventory = { ...success.data };
        // CHECK IF INVENTORY EXIST WITH article_code
        if (success?.data?._id) {
          // CHECK IF PRICE TABLE EXIST
          if (success?.data?.priceTable?.length > 0) {
            // CHECK IF PRICE EXIST
            const checked = success.data.priceTable.find(
              (p) => p.id === priceId
            );
            const rest = success.data.priceTable.filter(
              (p) => p.id !== priceId
            );
            if (checked) {
              // IF INVENTORY PRICE EXIST UPDAET PRICE WITH qty
              console.log(checked, "exist", qty, Number(checked.currentQty));
              inventory = {
                ...success.data,
                priceTable: [
                  ...rest,
                  {
                    ...checked,
                    currentQty: Number(checked.currentQty) - Number(qty),
                    totalQty: Number(checked.totalQty) - Number(qty),
                  },
                ],
                currentQty: Number(success.data.currentQty) - Number(qty),
                totalQty: Number(success.data.totalQty) - Number(qty),
              };
            } else {
              // IF INVENTORY PRICE DOES NOT EXIST
              inventory = {
                ...success?.data,
                priceTable: [
                  ...rest,
                  {
                    id: priceId,
                    openingQty: -Number(qty),
                    currentQty: -Number(qty),
                    totalQty: -Number(qty),
                    soldQty: 0,
                    rtvQty: 0,
                    damageQty: 0,
                  },
                ],
                openingQty: Number(success.data.openingQty) - Number(qty),
                currentQty: Number(success.data.currentQty) - Number(qty),
                totalQty: Number(success.data.totalQty) - Number(qty),
              };
            }
          } else {
            // CREATE NEW PRICE TABLE WITH (price + qty)
            inventory = {
              ...success?.data,
              priceTable: [
                {
                  id: priceId,
                  openingQty: -Number(qty),
                  currentQty: -Number(qty),
                  totalQty: -Number(qty),
                  soldQty: 0,
                  rtvQty: 0,
                  damageQty: 0,
                },
              ],
              openingQty: Number(success.data.openingQty) - Number(qty),
              currentQty: Number(success.data.currentQty) - Number(qty),
              totalQty: Number(success.data.totalQty) - Number(qty),
            };
          }
          console.log(inventory);
          const update = await updateInventory(inventory);
          console.log(update);
          return update;
          // success.then((res) => (inventory = { ...res.data }));
        } else {
          // CREATE INVENTORY WITH (article_code + priceList + qty)
          console.log("create New Inventory");
          let newInventory = {
            article_code: product.article_code,
            warehouse: user?.warehouse,
            aamarId: user?.aamarId,
            priceTable: [
              {
                id: priceId,
                openingQty: -qty,
                currentQty: -qty,
                totalQty: -qty,
                soldQty: 0,
                rtvQty: 0,
                damageQty: 0,
              },
            ],
            name: name,
            openingQty: -qty,
            currentQty: -qty,
            totalQty: -qty,
            soldQty: 0,
            rtvQty: 0,
            damageQty: 0,
            status: "active",
          };
          const inventory = await createInventory(newInventory);
          console.log(inventory);
        }
      }
    } else {
      return false;
    }
  };

  /**
   *
   * Sales OPERATIONS
   *
   */
  //inventory in sale del
  const updateInventoryInOnSaleDel = async (products) => {
    console.log("inventory Products", products);
    if (products.length > 0) {
      for (const product of products) {
        console.log(product);
        const { article_code, qty, priceId, name } = product;
        let inventory = {};
        const success = await axios.get(
          `${BASE_URL}/inventory/article_code/${article_code}/${user.aamarId}/${user.warehouse}`
        );
        console.log("matched Inventory", success?.data);
        // inventory = { ...success.data };
        // CHECK IF INVENTORY EXIST WITH article_code
        if (success?.data?._id) {
          // CHECK IF PRICE TABLE EXIST
          if (success?.data?.priceTable?.length > 0) {
            // CHECK IF PRICE EXIST
            const checked = success.data.priceTable.find(
              (p) => p.id === priceId
            );
            const rest = success.data.priceTable.filter(
              (p) => p.id !== priceId
            );
            if (checked) {
              // IF INVENTORY PRICE EXIST UPDATE PRICE WITH qty
              console.log(checked, "exist", qty, Number(checked.currentQty));
              inventory = {
                ...success.data,
                priceTable: [
                  ...rest,
                  {
                    ...checked,
                    currentQty: Number(checked.currentQty) + Number(qty),
                    soldQty: Number(checked.soldQty) - Number(qty),
                  },
                ],
                currentQty: Number(success.data.currentQty) + Number(qty),
                soldQty: Number(success.data.soldQty) - Number(qty),
              };
            } else {
              // IF INVENTORY PRICE DOES NOT EXIST
              inventory = {
                ...success?.data,
                priceTable: [
                  ...rest,
                  {
                    id: priceId,
                    openingQty: Number(qty),
                    currentQty: Number(qty),
                    totalQty: Number(qty),
                    soldQty: -Number(qty),
                    rtvQty: 0,
                    damageQty: 0,
                  },
                ],
                currentQty: Number(success.data.currentQty) + Number(qty),
                soldQty: Number(success.data.soldQty) - Number(qty),
              };
            }
          } else {
            // CREATE NEW PRICE TABLE WITH (price + qty)
            inventory = {
              ...success?.data,
              priceTable: [
                {
                  id: priceId,
                  openingQty: Number(qty),
                  currentQty: Number(qty),
                  totalQty: Number(qty),
                  soldQty: -Number(qty),
                  rtvQty: 0,
                  damageQty: 0,
                },
              ],
              currentQty: Number(success.data.currentQty) + Number(qty),
              totalQty: Number(success.data.totalQty) + Number(qty),
              soldQty: Number(success.data.soldQty) - Number(qty),
            };
          }
          console.log(inventory);
          const update = await updateInventory(inventory);
          console.log(update);
          return update;
          // success.then((res) => (inventory = { ...res.data }));
        } else {
          // CREATE INVENTORY WITH (article_code + priceList + qty)
          console.log("create New Inventory");
          let newInventory = {
            article_code: product.article_code,
            warehouse: user?.warehouse,
            aamarId: user?.aamarId,
            priceTable: [
              {
                id: priceId,
                openingQty: qty,
                currentQty: qty,
                totalQty: qty,
                soldQty: -qty,
                rtvQty: 0,
                damageQty: 0,
              },
            ],
            name: name,
            openingQty: Number(qty),
            currentQty: Number(qty),
            totalQty: Number(qty),
            soldQty: -Number(qty),
            rtvQty: 0,
            damageQty: 0,
            status: "active",
          };
          const inventory = await createInventory(newInventory);
          console.log(inventory);
        }
      }
    } else {
      return false;
    }
  };
  //inventory out on sale create
  const updateInventoryOut = async (products) => {
    if (products.length > 0) {
      for (const data of products) {
        const { article_code, qty, priceId, name } = data;
        console.log(article_code);
        let inventory = {};
        const success = await axios.get(
          `${BASE_URL}/inventory/article_code/${article_code}/${user.aamarId}/${user.warehouse}`
        );
        console.log(success.data);
        // inventory = { ...success.data };

        if (success.data.priceTable.length > 0) {
          // CHECK IF PRICE TABLE EXIST
          const checked = success.data.priceTable.filter(
            (p) => p.id === priceId
          );
          const rest = success.data.priceTable.filter((p) => p.id !== priceId);
          if (checked?.length > 0) {
            // IF INVENTORY PRICE EXIST
            console.log(checked, "exist", qty, Number(checked[0].currentQty));
            inventory = {
              ...success.data,
              priceTable: [
                ...rest,
                {
                  id: priceId,
                  currentQty: Number(checked[0].currentQty) - Number(qty),
                  soldQty: Number(checked[0].soldQty) + Number(qty),
                },
              ],
              currentQty: Number(success.data.currentQty) - Number(qty),
              soldQty: Number(success.data.soldQty) + Number(qty),
            };
          } else {
            // IF INVENTORY PRICE DOES NOT EXIST | CREATE NEW PRICE TABLE
            inventory = {
              ...success.data,
              priceTable: [
                ...rest,
                {
                  id: priceId,
                  openingQty: -Number(qty),
                  currentQty: -Number(qty),
                  totalQty: -Number(qty),
                  soldQty: 0 + Number(qty),
                  damageQty: 0,
                  rtvQty: 0,
                },
              ],
              currentQty: Number(success.data.currentQty) - Number(qty),
              totalQty: Number(success.data.totalQty) - Number(qty),
              soldQty: Number(success.data.soldQty) + Number(qty),
            };
          }
        } else {
          // CREATE A NEW INVENTORY
          inventory = {
            article_code: article_code,
            name: name,
            warehouse: user?.warehouse,
            aamarId: user?.aamarId,
            priceTable: [
              ...success.data.priceTable,
              {
                id: priceId,
                openingQty: -Number(qty),
                currentQty: -Number(qty),
                totalQty: -Number(qty),
                soldQty: 0 + Number(qty),
                rtvQty: 0,
                damageQty: 0,
              },
            ],
            openingQty: -Number(qty),
            currentQty: -Number(qty),
            totalQty: -Number(qty),
            soldQty: 0 + Number(qty),
            rtvQty: 0,
            damageQty: 0,
            status: "active",
          };
        }

        // success.then((res) => (inventory = { ...res.data }));
        // console.log(inventory);
        const update = await updateInventory(inventory);
        console.log(update);
      }
    } else {
      return false;
    }
  };

  /**
   *
   * rtv OPERATIONS
   *
   */

  // inventory in rtv del
  const updateInventoryInOnRTVDel = async (products) => {
    console.log("inventory Products", products);
    if (products.length > 0) {
      for (const product of products) {
        console.log(product);
        const { article_code, qty, priceId, name } = product;
        let inventory = {};
        const success = await axios.get(
          `${BASE_URL}/inventory/article_code/${article_code}/${user.aamarId}/${user.warehouse}`
        );
        console.log("matched Inventory", success?.data);
        // inventory = { ...success.data };
        // CHECK IF INVENTORY EXIST WITH article_code
        if (success?.data?._id) {
          // CHECK IF PRICE TABLE EXIST
          if (success?.data?.priceTable?.length > 0) {
            // CHECK IF PRICE EXIST
            const checked = success.data.priceTable.find(
              (p) => p.id === priceId
            );
            const rest = success.data.priceTable.filter(
              (p) => p.id !== priceId
            );
            if (checked) {
              // IF INVENTORY PRICE EXIST UPDAET PRICE WITH qty
              console.log(checked, "exist", qty, Number(checked.currentQty));
              inventory = {
                ...success.data,
                priceTable: [
                  ...rest,
                  {
                    ...checked,
                    currentQty: Number(checked.currentQty) + Number(qty),
                    rtvQty: Number(checked.rtvQty) - Number(qty),
                  },
                ],
                currentQty: Number(success.data.currentQty) + Number(qty),
                rtvQty: Number(success.data.rtvQty) - Number(qty),
              };
            } else {
              // IF INVENTORY PRICE DOES NOT EXIST
              inventory = {
                ...success?.data,
                priceTable: [
                  ...rest,
                  {
                    id: priceId,
                    openingQty: Number(qty),
                    currentQty: Number(qty),
                    totalQty: Number(qty),
                    soldQty: 0,
                    rtvQty: 0 - Number(qty),
                    damageQty: 0,
                  },
                ],
                currentQty: Number(success.data.currentQty) + Number(qty),
                totalQty: Number(success.data.totalQty) + Number(qty),
                rtvQty: Number(success.data.rtvQty) - Number(qty),
              };
            }
          } else {
            // CREATE NEW PRICE TABLE WITH (price + qty)
            inventory = {
              ...success?.data,
              priceTable: [
                {
                  id: priceId,
                  openingQty: Number(qty),
                  currentQty: Number(qty),
                  totalQty: Number(qty),
                  soldQty: 0,
                  rtvQty: -Number(qty),
                  damageQty: 0,
                },
              ],
              currentQty: Number(success.data.currentQty) + Number(qty),
              totalQty: Number(success.data.totalQty) + Number(qty),
              rtvQty: Number(success.data.rtvQty) - Number(qty),
            };
          }
          console.log(inventory);
          const update = await updateInventory(inventory);
          console.log(update);
          return update;
          // success.then((res) => (inventory = { ...res.data }));
        } else {
          // CREATE INVENTORY WITH (article_code + priceList + qty)
          console.log("create New Inventory");
          let newInventory = {
            article_code: product.article_code,
            warehouse: user?.warehouse,
            aamarId: user?.aamarId,
            priceTable: [
              {
                id: priceId,
                openingQty: qty,
                currentQty: qty,
                totalQty: qty,
                soldQty: 0,
                rtvQty: -qty,
                damageQty: 0,
              },
            ],
            name: name,
            openingQty: qty,
            currentQty: qty,
            totalQty: qty,
            soldQty: 0,
            rtvQty: -qty,
            damageQty: 0,
            status: "active",
          };
          const inventory = await createInventory(newInventory);
          console.log(inventory);
        }
      }
    } else {
      return false;
    }
  };

  //inventory out rtv create
  const updateInventoryOUTOnRTVIn = async (products) => {
    console.log("inventory Products", products);
    if (products?.length > 0) {
      for (const data of products) {
        const { article_code, qty, priceId, name } = data;
        // console.log(article_code);
        let inventory = {};
        const success = await axios.get(
          `${BASE_URL}/inventory/article_code/${article_code}/${user.aamarId}/${user.warehouse}`
        );
        console.log(success?.data);
        // inventory = { ...success.data };

        if (success?.data?.priceTable?.length > 0) {
          // CHECK IF PRICE TABLE EXIST
          const checked = success?.data?.priceTable?.filter(
            (p) => p.id === priceId
          );
          const rest = success?.data?.priceTable?.filter(
            (p) => p.id !== priceId
          );
          if (checked?.length > 0) {
            // IF INVENTORY PRICE EXIST
            console.log(checked, "exist", qty, Number(checked[0].currentQty));
            inventory = {
              ...success.data,
              priceTable: [
                ...rest,
                {
                  ...checked,
                  currentQty: Number(checked[0].currentQty) - Number(qty),
                  rtvQty: Number(checked[0].rtvQty) + Number(qty),
                },
              ],
              currentQty: Number(success.data.currentQty) - Number(qty),
              rtvQty: Number(success.data.rtvQty) + Number(qty),
            };
          } else {
            // IF INVENTORY PRICE DOES NOT EXIST | CREATE NEW PRICE TABLE
            inventory = {
              ...success.data,
              priceTable: [
                ...rest,
                {
                  id: priceId,
                  openingQty: -Number(qty),
                  currentQty: -Number(qty),
                  totalQty: -Number(qty),
                  soldQty: 0,
                  rtvQty: Number(qty),
                  damageQty: 0,
                },
              ],
              openingQty: Number(success.data.openingQty) - Number(qty),
              currentQty: Number(success.data.currentQty) - Number(qty),
              rtvQty: Number(success.data.rtvQty) + Number(qty),
            };
          }
        } else {
          // CREATE A NEW INVENTORY
          inventory = {
            article_code: article_code,
            name: name,
            warehouse: user?.warehouse,
            aamarId: user?.aamarId,
            priceTable: [
              {
                id: priceId,
                openingQty: -Number(qty),
                currentQty: -Number(qty),
                totalQty: -Number(qty),
                soldQty: 0,
                rtvQty: Number(qty),
                damageQty: 0,
              },
            ],
            openingQty: -Number(qty),
            currentQty: -Number(qty),
            totalQty: -Number(qty),
            soldQty: 0,
            rtvQty: Number(qty),
            damageQty: 0,
            status: "active",
          };
        }

        // success.then((res) => (inventory = { ...res.data }));
        // console.log(inventory);
        const update = await updateInventory(inventory);
        console.log(update);
      }
    } else {
      return false;
    }
  };

  /**
   *
   * damage OPERATIONS
   *
   */

  // inventory in damage del
  const updateInventoryInOnDamageDel = async (products) => {
    console.log("inventory Products", products);
    if (products.length > 0) {
      for (const product of products) {
        console.log(product);
        const { article_code, qty, priceId, name } = product;
        let inventory = {};
        const success = await axios.get(
          `${BASE_URL}/inventory/article_code/${article_code}/${user.aamarId}/${user.warehouse}`
        );
        console.log("matched Inventory", success?.data);
        // inventory = { ...success.data };
        // CHECK IF INVENTORY EXIST WITH article_code
        if (success?.data?._id) {
          // CHECK IF PRICE TABLE EXIST
          if (success?.data?.priceTable?.length > 0) {
            // CHECK IF PRICE EXIST
            const checked = success.data.priceTable.find(
              (p) => p.id === priceId
            );

            const rest = success.data.priceTable.filter(
              (p) => p.id !== priceId
            );
            if (checked) {
              // IF INVENTORY PRICE EXIST UPDAET PRICE WITH qty
              console.log(checked, "exist", qty, Number(checked.currentQty));
              inventory = {
                ...success.data,
                priceTable: [
                  ...rest,
                  {
                    ...checked,
                    currentQty: Number(checked.currentQty) + Number(qty),
                    damageQty: Number(checked.damageQty) - Number(qty),
                  },
                ],
                currentQty: Number(success.data.currentQty) + Number(qty),
                damageQty: Number(success.data.damageQty) - Number(qty),
              };
            } else {
              // IF INVENTORY PRICE DOES NOT EXIST
              inventory = {
                ...success?.data,
                priceTable: [
                  ...rest,
                  {
                    id: priceId,
                    openingQty: Number(qty),
                    currentQty: Number(qty),
                    totalQty: Number(qty),
                    soldQty: 0,
                    rtvQty: 0,
                    damageQty: -Number(qty),
                  },
                ],
                currentQty: Number(success.data.currentQty) + Number(qty),
                damageQty: Number(success.data.damageQty) - Number(qty),
              };
            }
          } else {
            // CREATE NEW PRICE TABLE WITH (price + qty)
            inventory = {
              ...success?.data,
              priceTable: [
                {
                  id: priceId,
                  openingQty: Number(qty),
                  currentQty: Number(qty),
                  totalQty: Number(qty),
                  soldQty: 0,
                  rtvQty: 0,
                  damageQty: -Number(qty),
                },
              ],
              currentQty: Number(success.data.damageQty) + Number(qty),
              damageQty: Number(success.data.damageQty) - Number(qty),
            };
          }
          console.log(inventory);
          const update = await updateInventory(inventory);
          console.log(update);
          return update;
          // success.then((res) => (inventory = { ...res.data }));
        } else {
          // CREATE INVENTORY WITH (article_code + priceList + qty)
          console.log("create New Inventory");
          let newInventory = {
            article_code: product.article_code,
            warehouse: user?.warehouse,
            aamarId: user?.aamarId,
            priceTable: [
              {
                id: priceId,
                openingQty: qty,
                currentQty: qty,
                totalQty: qty,
                soldQty: 0,
                rtvQty: 0,
                damageQty: -qty,
              },
            ],
            name: name,
            openingQty: qty,
            currentQty: qty,
            totalQty: qty,
            soldQty: 0,
            rtvQty: 0,
            damageQty: -qty,
            status: "active",
          };
          const inventory = await createInventory(newInventory);
          console.log(inventory);
        }
      }
    } else {
      return false;
    }
  };

  //inventory out in damage in
  const updateInventoryOutOnDamageIn = async (products) => {
    console.log("inventory Products", products);
    if (products.length > 0) {
      for (const data of products) {
        const { article_code, qty, priceId, name } = data;
        console.log(article_code);
        let inventory = {};
        const success = await axios.get(
          `${BASE_URL}/inventory/article_code/${article_code}/${user.aamarId}`
        );
        console.log(success.data);
        // inventory = { ...success.data };

        if (success.data.priceTable.length > 0) {
          // CHECK IF PRICE TABLE EXIST
          const checked = success.data.priceTable.filter(
            (p) => p.id === priceId
          );
          const rest = success.data.priceTable.filter((p) => p.id !== priceId);
          if (checked?.length > 0) {
            // IF INVENTORY PRICE EXIST
            console.log(checked, "exist", qty, Number(checked[0].currentQty));
            inventory = {
              ...success.data,
              priceTable: [
                ...rest,
                {
                  ...checked,
                  currentQty: Number(checked.currentQty) - Number(qty),
                  damageQty: Number(checked.damageQty) + Number(qty),
                },
              ],
              currentQty: Number(success.data.currentQty) - Number(qty),
              damageQty: Number(success.data.damageQty) + Number(qty),
            };
          } else {
            // IF INVENTORY PRICE DOES NOT EXIST | CREATE NEW PRICE TABLE
            inventory = {
              ...success.data,
              priceTable: [
                ...rest,
                {
                  id: priceId,
                  openingQty: -Number(qty),
                  currentQty: -Number(qty),
                  totalQty: -Number(qty),
                  soldQty: 0,
                  damageQty: 0 + Number(qty),
                  rtvQty: 0,
                },
              ],
              openingQty: Number(success.data.openingQty),
              currentQty: Number(success.data.currentQty) - Number(qty),
              damageQty: Number(success.data.damageQty) + Number(qty),
            };
          }
        } else {
          // CREATE A NEW INVENTORY
          inventory = {
            article_code: article_code,
            name: name,
            warehouse: user?.warehouse || "62b5b575b4facb87eef3b47c",
            priceTable: [
              ...success.data.priceTable,
              {
                id: priceId,
                openingQty: -Number(qty),
                currentQty: -Number(qty),
                totalQty: -Number(qty),
                soldQty: 0,
                damageQty: Number(qty),
                rtvQty: 0,
              },
            ],
            openingQty: -Number(qty),
            currentQty: -Number(qty),
            totalQty: -Number(qty),
            soldQty: 0,
            damageQty: Number(qty),
            rtvQty: 0,
            status: "active",
          };
        }

        // success.then((res) => (inventory = { ...res.data }));
        // console.log(inventory);
        const update = await updateInventory(inventory);
        console.log(update);
      }
    } else {
      return false;
    }
  };

  // INVENTORY OUT - SALE | RTV | DAMAGE | ORDER

  // // INVENTORY ADJUSTMENT - GRN DEL |
  // const adjustInventoryGRNDel = async (products) => {
  //   // let productInventory = {};
  //   products.map(async (product) => {
  //     let productInventory = {};

  //     await axios
  //       .get(
  //         `${process.env.REACT_APP_API_URL}inventory-by-code/${product.article_code}`
  //       )
  //       .then(async (res) => {
  //         const inventory = res.data;
  //         console.log(inventory);
  //         productInventory.current_qty =
  //           parseInt(inventory.current_qty) - parseInt(product.qty);
  //         // productInventory.sold_qty = 0;
  //         productInventory.total_qty =
  //           parseInt(inventory.total_qty) - parseInt(product.qty);
  //         inventory.update_date = new Date();

  //         await axios
  //           .put(
  //             `${process.env.REACT_APP_API_URL}inventory/${inventory._id}`,
  //             productInventory
  //           )
  //           .then((res) => {
  //             console.log(res);
  //             if (res.status === 200) {
  //               console.log(res);
  //             }
  //           }
  //         return true;
  //       }
  //   });
  // };

  // // INVENTORY ADJUSTMENT - SALE | RETURN DEL
  // const adjustInventorySaleDel = async (products) => {
  //   // let productInventory = {};
  //   products.map(async (product) => {
  //     let productInventory = {};

  //     await axios
  //       .get(
  //         `${process.env.REACT_APP_API_URL}inventory-by-code/${product.article_code}`
  //       )
  //       .then(async (res) => {
  //         const inventory = res.data;
  //         console.log(inventory);
  //         productInventory.current_qty =
  //           parseFloat(inventory.current_qty) + parseFloat(product.qty);
  //         // productInventory.sold_qty = 0;
  //         productInventory.sold_qty =
  //           parseFloat(inventory.sold_qty) - parseFloat(product.qty);
  //         inventory.update_date = new Date();

  //         await axios
  //           .put(
  //             `${process.env.REACT_APP_API_URL}inventory/${inventory._id}`,
  //             productInventory
  //           )
  //           .then((res) => {
  //             console.log(res);
  //             if (res.status === 200) {
  //               console.log(res);
  //               // return true
  //             }
  //           }
  //         return true;
  //       }
  //   });
  // };

  return {
    // adjustInventoryGRNDel,
    updateInventoryIn, //grn in
    updateInventoryOut, // sale out ///
    updateInventoryInOnSaleDel, //sale in on delete or return,
    updateInventoryOutOnDamageIn, //damage out
    updateInventoryInOnDamageDel, //damage del in
    updateInventoryOUTOnRTVIn, //rtv out
    updateInventoryInOnRTVDel, //rtv delete in
    updateInventoryOUTOnGRNDel, //grn del out
    // adjustInventorySaleDel,
    // inventory,
    // inventoryIn,
    setInventory,
  };
};

export default useInventory;
