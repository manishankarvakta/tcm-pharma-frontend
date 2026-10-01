import { notify } from "./Notify";
const productById = async (id) => {
  await fetch(`${process.env.REACT_APP_API_URL}productbycode/${id}`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

const categoryByCode = (id) => {
  const product = productById(id);
  return product.category;
};
const mcByCode = (id) => {
  const product = productById(id);
  return product.master_category;
};

const apiUniqueErrHandle = (response) => {
  const errorData = response.error?.data?.error;
  if (errorData?.code === 11000) {
    for (const key in errorData.keyValue) {
      let message = `${key} "${errorData.keyValue[key]}" already exists!`;
      if (key === "name") {
        message = `${errorData.keyValue[key]} name already exists, please choose another name`;
      }
      notify(message, "error");
      return false;
    }
  }
  const generalMessage = response.error?.data?.message || "Operation failed. Please try again.";
  notify(generalMessage, "error");
  return false;
};

export { categoryByCode, mcByCode, apiUniqueErrHandle };
