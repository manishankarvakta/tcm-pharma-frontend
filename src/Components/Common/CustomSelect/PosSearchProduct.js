import axios from "../../../services/apiClient";
import { useCallback, useRef, useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { signInUser } from "../../Utility/Auth";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const SelectProduct = ({ addToList, hideEmpty, supplierProductsRef }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const selectRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const hideEmptyRef = useRef(hideEmpty);

  useEffect(() => {
    hideEmptyRef.current = hideEmpty;
  }, [hideEmpty]);

  // Optimized fetchData to only trigger when debounced
  const fetchData = useCallback(
    async (inputValue, callback) => {
      if (!inputValue || inputValue.length < 2) {
        callback([{ label: "Type at least 2 characters...", value: "info", isDisabled: true }]);
        return;
      }

      const auth = signInUser();
      const { aamarId, warehouse } = auth;

      try {
        const result = await axios.get(
          `${BASE_URL}/product/search/pos/${aamarId}/${warehouse}/${inputValue}`
        );

        let filteredProducts = Array.isArray(result.data) ? result.data : [];
        if (!hideEmptyRef.current) {
          filteredProducts = filteredProducts.filter(
            (element) => (parseFloat(element?.stock) || 0) > 0
          );
        }

        const tempArray = filteredProducts.map((element) => ({
          label: `${element.name}-${element?.group[0]?.name || "N/A"}-(${element?.supplierCompany || "N/A"}) [${element.mrp} BDT] Stock: ${element?.stock || 0}`,
          value: element._id,
          rawData: element
        }));

        if (tempArray.length === 0) {
          tempArray.push({ label: "No products found", value: "none", isDisabled: true });
        } else if (tempArray.length === 1 && inputValue.length > 5) {
          // Auto-add if it's a perfect match (likely barcode)
          if (addToList(filteredProducts[0], selectRef.current)) {
            setSelectedOption(null);
          }
        }

        callback(tempArray);
      } catch (error) {
        console.error("Error fetching products", error);
        callback([]);
      }
    },
    [addToList, hideEmpty]
  );

  // Debounce logic for react-select loadOptions
  const loadOptions = (inputValue, callback) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchData(inputValue, callback);
    }, 400); // 400ms debounce
  };

  const getValue = useCallback(
    async (data) => {
      try {
        const result = await axios.get(`${BASE_URL}/product/details/new/${data}`);
        if (addToList(result.data) === false) {
          selectRef.current?.focus();
        }
      } catch (error) {
        console.error("Error fetching product details", error);
      }
    },
    [addToList]
  );

  const handleSearchChange = (selectedOption) => {
    if (selectedOption && selectedOption.value !== "none" && selectedOption.value !== "info") {
      setSelectedOption(selectedOption);
      if (selectedOption.rawData) {
        addToList(selectedOption.rawData);
        setSelectedOption(null);
      } else {
        getValue(selectedOption.value);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  return (
    <AsyncSelect
      value={selectedOption}
      loadOptions={loadOptions}
      placeholder="Product Search (Name/Brand/Barcode)"
      onChange={handleSearchChange}
      defaultOptions={false} // Don't load on focus to save resources
      classNamePrefix="react-select"
      ref={supplierProductsRef || selectRef}
      noOptionsMessage={() => "Type to search..."}
      isClearable
    />
  );
};

export default SelectProduct;
