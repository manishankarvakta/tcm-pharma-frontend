const useRtv = () => {
  const totalItems = (products) => {
    // console.log(products)
    let totalItem = 0;
    let total = 0;
    let discount = 0;
    products?.map((product) => {
      if (product?.article_code) {
        totalItem = parseFloat(totalItem) + parseFloat(product?.qty);
        total =
          parseFloat(total) + parseFloat(product?.tp) * parseFloat(product?.qty);
        discount = parseFloat(discount) + parseFloat(product?.discount);
      }
    });

    return { totalItem, total };
  };

  return {
    totalItems,
  };
};

export default useRtv;
