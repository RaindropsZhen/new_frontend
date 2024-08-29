import React, { useState,useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { updatePrinters } from '../apis';
import { toast } from 'react-toastify';
import Select from 'react-select';
import AuthContext from '../contexts/AuthContext';

const EditPrinter = ({ printer,categories }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const auth = useContext(AuthContext);

  const options = categories ? categories.map(category => ({
    value: category.id,
    label: category.name,
  })) : [];
  const onUpdatePrinter = async () => {

    const json = await updatePrinters(
        printer.id, // Pass printer id as the first argument
        { 
            category: selectedOptions.map(option => option.value).join(',') ,
            category_name: selectedOptions.map(option => option.label).join(',')
        }, // Pass data object with category and printer id
        auth.token
    );

    if (json) {
      toast(`成功更新`, { type: "success" });
    }
    else {
        toast(`更新失败，请稍后重试`, { type: "error" });
    }
}

  return (
    <div>
      <Card>
        <Card.Body>
            <h5>设置打印内容</h5>
            <p>注: 更新打印内容后需刷新页面才能显示更新内容</p>
            <Select
            options={options}
            value={selectedOptions}
            isMulti
            onChange={(selected) => setSelectedOptions(selected)}
            placeholder="选择打印内容"
            style={{ marginBottom: '10px' }} // Add margin bottom for spacing
            />
            <Button 
            variant='standard'
            onClick={onUpdatePrinter}
            style={{ marginTop: '10px' }} // Add margin top for spacing
            >
                更新打印内容
            </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditPrinter;
