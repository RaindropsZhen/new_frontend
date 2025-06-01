import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { updateMenuItem, uploadImage } from '../apis';
import AuthContext from '../contexts/AuthContext';

const useEditMenuItemFormLogic = (initialItem = {}, place, onDoneCallback) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState(initialItem.category);
  const [itemName, setItemName] = useState({
    default: initialItem.name || '',
    en: initialItem.name_en || '',
    es: initialItem.name_es || '',
    pt: initialItem.name_pt || '',
  });
  const [name_to_print, set_name_to_print] = useState(initialItem.name_to_print);
  const [itemDescription, setItemDescription] = useState({
    default: initialItem.description || '',
    en: initialItem.description_en || '',
    es: initialItem.description_es || '',
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
    let image_name = itemName.default;
    let folder_name = auth.token + '/' + 'category_id_' + category;
    const image_json = await uploadImage(image, folder_name, image_name);

    const json = await updateMenuItem(
      initialItem.id,
      {
        place: place.id,
        category,
        name: itemName.default,
        name_en: itemName.en,
        name_es: itemName.es,
        name_pt: itemName.pt,
        price,
        description: itemDescription.default,
        description_en: itemDescription.en,
        description_es: itemDescription.es,
        description_pt: itemDescription.pt,
        image: image_json.url,
        name_to_print: name_to_print,
        is_available: isAvailable,
        ordering_timing: orderingTiming,
      },
      auth.token
    );

    if (json) {
      toast(t("editMenuItemForm.toast.updateSuccess", { itemName: json.name }), { type: "success" });
      setCategory("");
      setItemName({ default: '', en: '', es: '', pt: '' });
      setPrice(0);
      setItemDescription({ default: '', en: '', es: '', pt: '' });
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
