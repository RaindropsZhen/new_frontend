import React, { useState, useContext, useRef,useEffect } from 'react';
import { Button, Form, Popover, Overlay } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { RiPlayListAddFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { 
    addCategory,
    addMenuItems,
  } from '../apis';

import AuthContext from '../contexts/AuthContext';
import ImageDropzone from './ImageDropzone';

const MenuItemForm = ({ place, onDone, item = {} }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryFormShow, setCategoryFormShow] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([{ value: 'cn', label: '中文' }]);
  const selectedlanguages_labels  = JSON.stringify(selectedLanguages)
  const [category, setCategory] = useState(item.category);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [name_to_print,set_name_to_print] = useState("")
  const [orderingTiming, setOrderingTiming] = useState("lunch_and_dinner");

  const handleOrderingTimingChange = (value) => {

    setOrderingTiming(value);

  };
  
  const [resetImageDropzone, setResetImageDropzone] = useState(false);
  const [price, setPrice] = useState(item.price || "输入价格");
  const [image, setImage] = useState(item.image);
  const [isAvailable, setIsAvailable] = useState(
    item.is_available === undefined ? true : !!item.is_available
  );
  
  const [loading, setLoading] = useState(false)

  const target = useRef(null);

  const auth = useContext(AuthContext);
  const { t } = useTranslation(); // Initialize useTranslation

  const onAddCategory = async () => {
    setLoading(true)
    const json = await addCategory({
      name: categoryName,
      place: place.id,
      languages: selectedlanguages_labels
    },
    auth.token
    );

    if (json) {
      toast(`成功创建菜品分类 ${json.category_name}.`, { type: "success"});
      setCategory(json.id);
      setCategoryName("");
      setCategoryFormShow(false);
      setLoading(false);
      onDone();
    }
    setLoading(false)
  };

  const onAddMenuItems = async () => {
    
    if (!name || name.trim() === "") {
        toast.error("菜品名称为必填项。");
        return;
    }
    if (price === "" || price === null || typeof price === 'undefined') {
        toast.error("价格为必填项。");
        return;
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
        toast.error("价格必须为大于或等于0的数字。");
        return;
    }
    if (!category) {
        toast.error("请选择一个菜品分类。");
        return;
    }


    setLoading(true)
    
    let finalNameToPrint = name_to_print.trim();
    if (!finalNameToPrint && name.trim()) {
      finalNameToPrint = name.trim();
    }

    const formData = new FormData();
    formData.append('place', place.id);
    formData.append('category', category);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    if (image instanceof File) { // Ensure image is a File object before appending
      formData.append('image', image);
    }
    formData.append('is_available', isAvailable);
    formData.append('name_to_print', finalNameToPrint);
    formData.append('ordering_timing', orderingTiming);

    const responseJson = await addMenuItems(formData, auth.token); // Renamed to responseJson for clarity

    if (responseJson && responseJson.success) { // Check for success field
      toast(`成功创建菜品 ${responseJson.menu_item_name || name}`, { type: "success" }); // Fallback to name if menu_item_name is undefined
      setName("");
      setPrice("");
      setCategoryName("");
      setDescription("");
      setImage("");
      setIsAvailable(true);
      setLoading(false);
      setResetImageDropzone(true);
      set_name_to_print("");
      onDone();
    }
    setLoading(false);
  }

  useEffect(() => {
    try {
      const storedSelectedLanguages = localStorage.getItem('selectedLanguages');
      if (storedSelectedLanguages) {
        setSelectedLanguages(JSON.parse(storedSelectedLanguages));
      }
    } catch (error) {
      console.error('Error loading selected languages from local storage:', error);
    }
  }, []); 

  const formatTime = (timeInSeconds) => {
    if (timeInSeconds === null || typeof timeInSeconds === 'undefined' || isNaN(timeInSeconds)) {
      return t('menuSettings.timeNotSet', '--:--'); // Use t() for placeholder too
    }
    const totalMinutes = Math.floor(timeInSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
  };
  
  // Check if at least one of the time values is a number to attempt formatting
  const lunchStartTime = place?.lunch_time_start;
  const lunchEndTime = place?.lunch_time_end;
  const dinnerStartTime = place?.dinne_time_start;
  const dinnerEndTime = place?.dinne_time_end;

  const lunchTimeDisplay = (typeof lunchStartTime === 'number' && typeof lunchEndTime === 'number')
    ? `(${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)})`
    : t('menuSettings.timeNotSet', '(未设置)');
  
  const dinnerTimeDisplay = (typeof dinnerStartTime === 'number' && typeof dinnerEndTime === 'number')
    ? `(${formatTime(dinnerStartTime)} - ${formatTime(dinnerEndTime)})`
    : t('menuSettings.timeNotSet', '(未设置)');

  return (
    <Form>
      {/* CATEGORIES FORM */}
      <Form.Group>
        <div style={{ marginBottom: '20px'}}>

        </div>
        <Form.Label>
          <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>第一步: 选择菜品分类</p>
        </Form.Label>
        <div className="d-flex align-items-center">
          <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">请选择以下一个菜品</option> {/* Blank or default option */}
              {place?.categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Form.Control>
            
            <Button ref={target} variant="link" onClick={() => setCategoryFormShow(true)}>
              <RiPlayListAddFill size={25} />
            </Button>

            {/* 添加菜品 */}
            <Overlay 
              show={categoryFormShow} 
              target={target.current} 
              placement="bottom" 
              rootClose 
              onHide={() => setCategoryFormShow(false)}
            >
              <Popover id="popover-contained">
                <Popover.Title as="h3">添加菜品分类</Popover.Title>
                  <Popover.Content>
                  {/*  中文菜单名字*/}
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="中文菜品名"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                      />
                    </Form.Group>

                  <Button variant="standard" block onClick={onAddCategory} disabled={loading}>
                    {loading ? "处理中" : "添加"}
                  </Button>
                </Popover.Content>
              </Popover>
            </Overlay>

        </div>
      </Form.Group>

      {/* 菜品信息*/}
      <div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>第二步: 输入餐品名</p>
        <div style={{ marginLeft: '20px' }}>
          <Form.Group>
            {/* <Form.Label>中文名</Form.Label> */}
            <Form.Control
              type="text"
              placeholder="输入菜名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              自动翻译成其他语言，可能需手动调整
            </Form.Text>
          </Form.Group>
          <Form.Group>
            {/* <Form.Label>中文名</Form.Label> */}
            <Form.Control
              type="text"
              placeholder="请输入您要打印的名字"
              value={name_to_print}
              onChange={(e) => set_name_to_print(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              该名字将会用于后厨打印的厨房小票
            </Form.Text>
          </Form.Group>
        </div>
      </div>

      {/* 菜品介绍以及价格 */}
      <div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>第三步: 输入价格和菜品介绍</p>
        <div style={{ marginLeft: '20px' }}>
          <Form.Group>
            <Form.Label>价格</Form.Label>
            <Form.Control
              type="number"
              placeholder="输入价格"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0" // Prevent negative numbers at browser level
              step="0.01" // Allow decimal prices
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>中文介绍</Form.Label>
            <Form.Control
              type="text"
              placeholder="输入中文介绍"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Form.Text className="text-muted">
              自动翻译成其他语言，可能需手动调整
            </Form.Text>
          </Form.Group>
        </div>
      </div>

      {/* 点餐*/}

    <div>
      <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>第四步: 选择点餐时段</p>
      <Form.Group>
        <Form.Check
          type="checkbox"
          label="是否可下单?"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
      </Form.Group>
      <p style={{ color: 'gray', fontSize: '14px' }}>选择点餐时段</p>
      <Form.Group>
        <Form.Check
          type="checkbox"
          label="全天"
          checked={orderingTiming === "lunch_and_dinner"}
          disabled={!isAvailable}
          onChange={() => handleOrderingTimingChange("lunch_and_dinner")}
        />
        <Form.Check
          type="checkbox"
          label={<>午饭 <span style={{fontSize: '0.8em', color: 'gray'}}>{lunchTimeDisplay}</span></>}
          checked={orderingTiming === "lunch"}
          disabled={!isAvailable}
          onChange={() => handleOrderingTimingChange("lunch")}
        />
        <Form.Check
          type="checkbox"
          label={<>晚饭 <span style={{fontSize: '0.8em', color: 'gray'}}>{dinnerTimeDisplay}</span></>}
          checked={orderingTiming === "dinner"}
          disabled={!isAvailable}
          onChange={() => handleOrderingTimingChange("dinner")}
        />
      </Form.Group>

    </div>

      {/* 加入图片*/}
      <div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>第五步: 加入图片</p>
        <Form.Group>
          {/* <Form.Label>Image</Form.Label> */}
          <ImageDropzone value={image} onChange={setImage}reset={resetImageDropzone} setReset={setResetImageDropzone}/>
        </Form.Group>
      </div>

      <Button 
        variant="standard" 
        block 
        onClick={onAddMenuItems}
        disabled={loading}
      >
        {loading ? "处理中" : "添加"}
      </Button>

    </Form>

  );
}

export default MenuItemForm;
