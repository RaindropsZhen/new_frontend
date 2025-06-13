import { Form, Button } from 'react-bootstrap';
import React, { useState, useContext } from 'react'; // Removed Row as it's not used directly here
import TimePicker from 'react-bootstrap-time-picker';
import AuthContext from '../contexts/AuthContext';

import ImageDropzone from '../containers/ImageDropzone';
import { updatePlace } from '../apis'; // uploadImage was removed previously
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EditPlace = ({place, onDone}) => {

    const [name, setName] = useState(place.name);
    const [image, setImage] = useState(place.image);
    const [loading, setLoading] = useState(false)
    const auth = useContext(AuthContext); 
    const [tableNumber, setTableNumber] = useState(place.number_of_tables);
    const numberOptions = Array.from({ length: 400 }, (_, index) => index + 1);
    const [interval, setInterval] = useState(place.ordering_limit_interval); 
    const [selectedLunchTimeStart, setselectedLunchTimeStart] = useState(place.lunch_time_start);
    const [selectedLunchTimeFinish, setselectedLunchTimeFinish] = useState(place.lunch_time_end);
    const [selectedDinnerTimeStart, setselectedDinnerTimeStart] = useState(place.dinne_time_start);
    const [selectedDinnerTimeFinish, setselectedDinnerTimeFinish] = useState(place.dinne_time_end);
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
      setTableNumber(parseInt(value, 10)); // Ensure it's an integer
    }

    const onUpdatePlaceInternal = async (formData) => { 
      try {
        await updatePlace(
          place.id, 
          formData, 
          auth.token
        );
        return true; 
      } catch (error) {
        console.error("Failed to update place:", error);
        return false; 
      }
    }

    const handleSubmit = async () => { // Renamed onClick to handleSubmit for clarity
      setLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('place_type', placeType);
      formData.append('number_of_tables', tableNumber);
      formData.append('ordering_limit_interval', interval);
      
      // Handle null or undefined time values before appending
      if (selectedLunchTimeStart !== null && typeof selectedLunchTimeStart !== 'undefined') formData.append('lunch_time_start', selectedLunchTimeStart);
      if (selectedLunchTimeFinish !== null && typeof selectedLunchTimeFinish !== 'undefined') formData.append('lunch_time_end', selectedLunchTimeFinish);
      if (selectedDinnerTimeStart !== null && typeof selectedDinnerTimeStart !== 'undefined') formData.append('dinne_time_start', selectedDinnerTimeStart);
      if (selectedDinnerTimeFinish !== null && typeof selectedDinnerTimeFinish !== 'undefined') formData.append('dinne_time_end', selectedDinnerTimeFinish);
      
      if (image instanceof File) {
        formData.append('image', image);
      }
      
      const success = await onUpdatePlaceInternal(formData);  

      setLoading(false);
      if (success) { 
        toast.success("餐厅信息已更新!", { autoClose: 2000 });
        if (onDone) {
          onDone(); 
        }
      } else {
        toast.error("更新餐厅信息失败!", { autoClose: 2000 });
      }
  }
  
    return (
      <div className='page-wrapper'>
        <h4 className='text-center mb-4'>更新餐厅信息</h4> {/* Added mb-4 for spacing */}
        <Form.Group className="mb-3"> {/* Added className for spacing */}
          <Form.Label style={{ fontWeight: 'bold' }}>名字</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="输入名字" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </Form.Group>

        <Form.Group className="mb-3"> {/* Added className for spacing */}
          <Form.Label style={{ fontWeight: 'bold' ,marginRight: '20px'}}>输入餐桌数量</Form.Label>
          <Form.Control // Changed to Form.Control for better styling consistency
            as="select"
            value={tableNumber}
            onChange={(e) => handleNumberChange(e.target.value)}
          >
            {numberOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

      <Form className="mb-3"> {/* Added className for spacing */}
        <Form.Label style={{ fontWeight: 'bold' }}>选择餐厅类型</Form.Label>
        <div key={`inline-radio`} className="mb-3">
          <Form.Check
            inline
            label="普通点餐"
            name="place_type"
            type='radio'
            id={`inline-type-1`}
            checked={placeType === 'normal'} 
            value="normal" 
            onChange={handlePlaceTypeChange}
          />
          <Form.Check
            inline
            label="自助点餐"
            name="place_type"
            type='radio'
            id={`inline-type-2`}
            checked={placeType === 'buffet'}
            value="buffet" 
            onChange={handlePlaceTypeChange}
          />
        </div>
      </Form>

      <Form.Group className="mb-3"> {/* Added className for spacing */}
      <Form.Label style={{ fontWeight: 'bold' }}>选择餐桌点单时间间隔（秒钟）</Form.Label>
      <Form.Control 
        type="number" 
        min="1" 
        // max="60" // Max might be too restrictive, consider removing or increasing
        placeholder="输入点单时间间隔" 
        value={interval === null ? '' : interval} // Handle null for controlled input
        onChange={(e) => setInterval(parseInt(e.target.value, 10) || null)} 
      />
      </Form.Group>

      <div style={{ display: 'flex', alignItems: 'center' ,marginBottom:'20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold',}}>选择午饭时间:</label>
        <div style={{ marginRight: '10px' }}>
          <TimePicker
            start="00:00" // Start from midnight
            end="23:30"   // End before next midnight
            step={30}
            value={selectedLunchTimeStart}
            onChange={handleLunchStartChange}
            format={24}
          />
        </div>
        <div>
          <TimePicker
            start="00:00"
            end="23:30"
            step={30}
            value={selectedLunchTimeFinish}
            onChange={handleLunchFinishChange}
            format={24}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center',marginBottom:'20px'  }}>
        <label style={{ marginRight: '10px' ,fontWeight: 'bold' }}>选择晚饭时间:</label>
        <div style={{ marginRight: '10px' }}>
          <TimePicker
            start="00:00"
            end="23:30"
            step={30}
            value={selectedDinnerTimeStart}
            onChange={handleDinnerStartChange}
            format={24}
          />
        </div>
        <div>
          <TimePicker
            start="00:00"
            end="23:30"
            step={30}
            value={selectedDinnerTimeFinish}
            onChange={handleDinnerFinishChange}
            format={24}
          />
        </div>
      </div>

      <Form.Group className="mb-3"> {/* Added className for spacing */}
        <Form.Label style={{ fontWeight: 'bold' }}>图片</Form.Label>
        <ImageDropzone value={image} onChange={setImage} />
      </Form.Group>

      <Button variant="primary" className="w-100" onClick={handleSubmit} disabled={loading}> {/* Changed to primary, w-100 */}
        {loading ? "正在更新中...." : "点击更新"}
      </Button>
    </div>
    )
  }

export default EditPlace
