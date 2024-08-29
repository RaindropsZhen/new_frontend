import { Form, Button,InputGroup  } from 'react-bootstrap';
import React, { useState, useContext,Row } from 'react';
import TimePicker from 'react-bootstrap-time-picker';
import AuthContext from '../contexts/AuthContext';

import ImageDropzone from '../containers/ImageDropzone';
import { uploadImage,updatePlace } from '../apis';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EditPlace = ({place}) => {

    const [name, setName] = useState(place.name);
    const [image, setImage] = useState(place.image);
    const [loading, setLoading] = useState(false)
    const auth = useContext(AuthContext); 
    const [tableNumber, setTableNumber] = useState(place.number_of_tables);
    const numberOptions = Array.from({ length: 400 }, (_, index) => index + 1);
    const [interval, setInterval] = useState(place.ordering_limit_interval); 
    const [selectedLunchTimeStart, setselectedLunchTimeStart] = useState(place.lunch_time_start); // Initialize with 12PM = 12*3600
    const [selectedLunchTimeFinish, setselectedLunchTimeFinish] = useState(place.lunch_time_end); // Initialize with 3PM = 15*3600
    const [selectedDinnerTimeStart, setselectedDinnerTimeStart] = useState(place.dinne_time_start); // Initialize with 7PM = 19*3600
    const [selectedDinnerTimeFinish, setselectedDinnerTimeFinish] = useState(place.dinne_time_end); // Initialize with 11PM = 23*3600
    const [placeType, setPlaceType] = useState(place.place_type);

    const handleLunchStartChange = (time) => {
      setselectedLunchTimeStart(time);
    };
    const handleLunchFinishChange = (time) => {
      setselectedLunchTimeFinish(time);
    };
    const handleDinnerStartChange = (time) => {
      setselectedDinnerTimeStart(time);
    };
    const handleDinnerFinishChange = (time) => {
      setselectedDinnerTimeFinish(time);
    };

    const handlePlaceTypeChange  = (event) => {
      setPlaceType(event.target.value);
    };
    const handleNumberChange = (value) => {
      setTableNumber(value);
    }
    const onClick = async () => {
      setLoading(true);

      let image_name = "placeId" + "_" + (0 + 1) ;
      let folder_name = auth.token;

      const image_json = await uploadImage(image, folder_name,image_name)

      const update_json = await onUpdatePlace({ 
      name: name,
      place_type:placeType,
      image: image_json.url,
      number_of_tables: tableNumber,
      ordering_limit_interval: interval,
      lunch_time_start: selectedLunchTimeStart,
      lunch_time_end: selectedLunchTimeFinish,
      dinne_time_start : selectedDinnerTimeStart,
      dinne_time_end: selectedDinnerTimeFinish
      },
      auth.token);  

      setLoading(false);
  }
    const onUpdatePlace = (data) => {
      updatePlace(
        place.id, 
        data,
        auth.token)
    }

    return (
      <div className='page-wrapper'>
        <h4 className='text-center'>更新餐厅信息</h4>
        <Form.Group>
          <Form.Label style={{ fontWeight: 'bold' }}>名字</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="输入名字" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </Form.Group>

        <Form.Group>
          <Form.Label style={{ fontWeight: 'bold' ,marginRight: '20px'}}>输入餐桌数量</Form.Label>
          <select
            value={tableNumber}
            onChange={(e) => handleNumberChange(e.target.value)}
          >
            {numberOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Form.Group>

      <Form>
        <Form.Label style={{ fontWeight: 'bold' }}>选择餐厅类型</Form.Label>
        <div key={`inline-radio`} className="mb-3">
          <Form.Check
            inline
            label="普通点餐"
            name="place_type"
            type='radio'
            id={`inline-type-1`}
            checked={placeType === 'normal'} // Set checked attribute based on placeType value

            value="normal" // Correct value
            onChange={handlePlaceTypeChange}
          />
          <Form.Check
            inline
            label="自助点餐"
            name="place_type"
            type='radio'
            id={`inline-type-2`}
            checked={placeType === 'buffet'} // Set checked attribute based on placeType value

            value="buffet" // Correct value
            onChange={handlePlaceTypeChange}
          />
        </div>
      </Form>

      <Form.Group>
      <Form.Label style={{ fontWeight: 'bold' }}>选择餐桌点单时间间隔（秒钟）</Form.Label>
      <Form.Control 
        type="number" 
        min="1" 
        max="60" // Adjust max value according to your requirements
        placeholder="输入点单时间间隔" 
        value={interval} 
        onChange={(e) => setInterval(e.target.value)} 
      />
      </Form.Group>

      <div style={{ display: 'flex', alignItems: 'center' ,marginBottom:'20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold',}}>选择午饭时间:</label>
        <div style={{ marginRight: '10px' }}>
          <TimePicker
            start="8:00"
            end="23:00"
            step={30}
            value={selectedLunchTimeStart}
            onChange={handleLunchStartChange}
          />
        </div>
        <div>
          <TimePicker
            start="8:00"
            end="23:00"
            step={30}
            value={selectedLunchTimeFinish}
            onChange={handleLunchFinishChange}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center',marginBottom:'20px'  }}>
        <label style={{ marginRight: '10px' ,fontWeight: 'bold' }}>选择晚饭时间:</label>
        <div style={{ marginRight: '10px' }}>
          <TimePicker
            start="8:00"
            end="23:00"
            step={30}
            value={selectedDinnerTimeStart}
            onChange={handleDinnerStartChange}
          />
        </div>
        <div>
          <TimePicker
            start="8:00"
            end="23:00"
            step={30}
            value={selectedDinnerTimeFinish}
            onChange={handleDinnerFinishChange}
          />
        </div>
      </div>

      <Form.Group>
        <Form.Label style={{ fontWeight: 'bold' }}>图片</Form.Label>
        <ImageDropzone value={image} onChange={setImage} />
      </Form.Group>

      <Button variant="standard" block onClick={onClick} disabled={loading}>
        {loading ? "正在更新中...." : "点击更新"}
      </Button>
        </div>
    )
  }

export default EditPlace