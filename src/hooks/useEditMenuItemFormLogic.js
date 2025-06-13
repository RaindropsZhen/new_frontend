import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { updateMenuItem } from '../apis';
import AuthContext from '../contexts/AuthContext';

const useEditMenuItemFormLogic = (initialItem = {}, place, onDoneCallback) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState(initialItem.category);
  const [itemName, setItemName] = useState({
    default: initialItem.name || '',
    en: initialItem.name_en || '',
    // es: initialItem.name_es || '', // Removed Spanish
    pt: initialItem.name_pt || '',
  });
  const [name_to_print, set_name_to_print] = useState(initialItem.name_to_print);
  const [itemDescription, setItemDescription] = useState({
    default: initialItem.description || '',
    en: initialItem.description_en || '',
    // es: initialItem.description_es || '', // Removed Spanish
    pt: initialItem.description_pt || '',
  });
  const [price, setPrice] = useState(initialItem.price || t("editMenuItemForm.placeholder.enterPrice"));
  const [image, setImage] = useState(initialItem.image);
  const [isAvailable, setIsAvailable] = useState(
    initialItem.is_available === undefined ? true : !!initialItem.is_available
  );
  const [orderingTiming, setOrderingTiming] = useState(initialItem.ordering_timing);
  const [resetImageDropzone, setResetImageDropzone] = useState(false);

  const auth = useContext(AuthContext);

  const handleOrderingTimingChange = (value) => {
    setOrderingTiming(value);
  };

  const onUpdateMenuItem = async () => {
    if (price === "" || price === null || typeof price === 'undefined') {
      toast.error(t("editMenuItemForm.placeholder.enterPrice")); // Or a more generic "Price is required"
      return;
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      toast.error(t("menuSettings.toast.priceMustBePositive", "价格必须为大于或等于0的数字。")); // Add this key to translation
      return;
    }
    if (!itemName.default || itemName.default.trim() === "") {
      toast.error(t("menuSettings.toast.itemNameEmpty", "菜品名称不能为空。")); // Add this key to translation
      return;
    }

    const formData = new FormData();
    formData.append('place', place.id);
    formData.append('category', category); // Assuming category is just an ID
    formData.append('name', itemName.default);
    formData.append('name_en', itemName.en);
    // formData.append('name_es', itemName.es); // Removed Spanish
    formData.append('name_pt', itemName.pt);
    formData.append('price', price);
    formData.append('description', itemDescription.default);
    formData.append('description_en', itemDescription.en);
    // formData.append('description_es', itemDescription.es); // Removed Spanish
    formData.append('description_pt', itemDescription.pt);
    formData.append('name_to_print', name_to_print);
    formData.append('is_available', isAvailable);
    formData.append('ordering_timing', orderingTiming);

    // Only append image if it's a new File object, not the old URL string
    if (image instanceof File) {
      formData.append('image', image);
    }

    const json = await updateMenuItem(
      initialItem.id,
      formData, // Pass FormData directly
      auth.token
    );

    if (json) {
      toast(t("editMenuItemForm.toast.updateSuccess", { itemName: json.name }), { type: "success" });
      setCategory("");
      setItemName({ default: '', en: '', pt: '' }); // Removed Spanish
      setPrice(0);
      setItemDescription({ default: '', en: '', pt: '' }); // Removed Spanish
      setImage("");
      setIsAvailable(true);
      setResetImageDropzone(true);
      set_name_to_print("");
      setOrderingTiming(null); // Reset ordering timing
      if (onDoneCallback) {
        onDoneCallback();
      }
    }
  };

  return {
    category,
    setCategory,
    itemName,
    setItemName,
    name_to_print,
    set_name_to_print,
    itemDescription,
    setItemDescription,
    price,
    setPrice,
    image,
    setImage,
    isAvailable,
    setIsAvailable,
    orderingTiming,
    handleOrderingTimingChange, // Keep this specific handler if it's used directly
    setOrderingTiming, // Also provide direct setter if needed elsewhere
    resetImageDropzone,
    setResetImageDropzone,
    onUpdateMenuItem,
  };
};

export default useEditMenuItemFormLogic;
