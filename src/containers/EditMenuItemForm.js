import React, { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';

import { toast } from 'react-toastify';


import { 
    updateMenuItem,
    uploadImage
  } from '../apis';

import AuthContext from '../contexts/AuthContext';
import ImageDropzone from './ImageDropzone';


const EditMenuItemForm = ({ place, onDone, item = {} }) => {
  const [category, setCategory] = useState(item.category);

  const [name, setName] = useState(item.name);
  const [Enname, setEnName] = useState(item.name_en);
  const [Esname, setEsname] = useState(item.name_es);
  const [Ptname, setPtname] = useState(item.name_pt);
  const [name_to_print,set_name_to_print] = useState(item.name_to_print)

  const [description, setDescription] = useState(item.description);
  const [Endescription, setEndescription] = useState(item.description_en);
  const [Esdescription, setEsdescription] = useState(item.description_es);
  const [Ptdescription, setPtdescription] = useState(item.description_pt);
  const [orderingTiming, setOrderingTiming] = useState(item.ordering_timing);

  const handleOrderingTimingChange = (value) => {

    setOrderingTiming(value);

  };

  const [resetImageDropzone, setResetImageDropzone] = useState(false);

  const [price, setPrice] = useState(item.price || "输入价格");
  const [image, setImage] = useState(item.image);
  const [isAvailable, setIsAvailable] = useState(
    item.is_available === undefined ? true : !!item.is_available
  );

  const auth = useContext(AuthContext);

  const onUpdateMenuItem = async () => {

    let image_name =  name ;
    let folder_name = auth.token + '/' + 'category_id_' + category;
    const image_json = await uploadImage(image, folder_name,image_name)

    const json = await updateMenuItem(
      item.id,
      {
        place: place.id,
        category,
        name,
        name_en: Enname,
        name_es:Esname,
        name_pt: Ptname,
        price,
        description,
        description_en: Endescription,
        description_es: Esdescription,
        description_pt: Ptdescription,
        image: image_json.url,
        name_to_print: name_to_print,
        is_available: isAvailable,
        ordering_timing: orderingTiming
      },
      auth.token
    );

    if (json) {
      toast(`成功更新菜品${json.name}`, { type: "success" });
      setCategory("");
      setName("");
      setEnName("");
      setEsname("");
      setPtname("");
      setPrice(0);
      setDescription("");
      setEndescription("");
      setEsdescription("");
      setPtdescription("");
      setImage("");
      setIsAvailable(true);
      setResetImageDropzone(true);
      set_name_to_print("");
      onDone();
    }
  }

  return (
    <div>
      {/* 菜品信息*/}
      <div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>更改餐品名</p>
        <div style={{ marginLeft: '20px' }}>
          <Form.Group>
            <Form.Label>中文名</Form.Label>
            {/* <Form.Label>中文名</Form.Label> */}
            <Form.Control
              type="text"
              placeholder="输入中文名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>英文名</Form.Label>
            <Form.Control
              type="text"
              placeholder="输入英文名"
              value={Enname}
              onChange={(e) => setEnName(e.target.value)}
            />
            </Form.Group>

            <Form.Group>
              <Form.Label>西语名</Form.Label>
              <Form.Control
                type="text"
                placeholder="输入西语名"
                value={Esname}
                onChange={(e) => setEsname(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>葡语名</Form.Label>
              <Form.Control
                type="text"
                placeholder="输入葡语名"
                value={Ptname}
                onChange={(e) => setPtname(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>打印名</Form.Label>
              <Form.Control
                type="text"
                placeholder="输入打印名"
                value={name_to_print}
                onChange={(e) => setPtname(e.target.value)}
              />
            </Form.Group>
        </div>
      </div>

      {/* 菜品介绍以及价格 */}
      <div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>更改价格和菜品介绍</p>
        <div style={{ marginLeft: '20px' }}>
          <Form.Group>
            <Form.Label>价格</Form.Label>
            <Form.Control
              type="number"
              placeholder="输入价格"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
          </Form.Group>
            <Form.Group>
              <Form.Label>英语介绍</Form.Label>
              <Form.Control
                type="text"
                placeholder="输入英语介绍"
                value={Endescription}
                onChange={(e) => setEndescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>西语介绍</Form.Label>
              <Form.Control
                type="text"
                placeholder="输入西语介绍"
                value={Esdescription}
                onChange={(e) => setEsdescription(e.target.value)}
              />
            </Form.Group>


            <Form.Group>
              <Form.Label>葡语介绍</Form.Label>
              <Form.Control
                type="text"
                placeholder="输入葡语介绍"
                value={Ptdescription}
                onChange={(e) => setPtdescription(e.target.value)}
              />
            </Form.Group>

        </div>
      </div>
      <div>
      <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>更改点餐时段</p>
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
          label="午饭"
          checked={orderingTiming === "lunch"}
          disabled={!isAvailable}
          onChange={() => handleOrderingTimingChange("lunch")}
        />
        <Form.Check
          type="checkbox"
          label="晚饭"
          checked={orderingTiming === "dinner"}
          disabled={!isAvailable}
          onChange={() => handleOrderingTimingChange("dinner")}
        />
      </Form.Group>

    </div>

      {/* 加入图片*/}
      <div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: 'black', margin: '10px 0' }}>更改图片</p>
        <Form.Group>
          {/* <Form.Label>Image</Form.Label> */}
          <ImageDropzone value={image} onChange={setImage} reset={resetImageDropzone} setReset={setResetImageDropzone}/>
        </Form.Group>
      </div>
      
      <Button 
        variant="standard" 
        block 
        onClick={onUpdateMenuItem}
      >
        更新
      </Button>
    </div>

  );
}

export default EditMenuItemForm;