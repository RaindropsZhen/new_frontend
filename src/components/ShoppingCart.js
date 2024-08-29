import React, { useMemo, useState,useEffect  } from 'react';
import { Card,Form,Button  } from 'react-bootstrap';
import OperationButton from './OperationButton';
import { useLocation } from 'react-router-dom';
import Popup from 'reactjs-popup';
import OrderForm from '../containers/OrderForm';
import { FaCommentDots } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";

const renderMenuItemName = (item,selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return item.name;
      case 'English':
      return item.name_en;
      case 'Español':
      return item.name_es;
      case 'Português':
      return item.name_pt;
    default:
      return item.name;
  }
};

const renderCommentName = (selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return "备注";
    case 'English':
      return "Comment";
    case 'Español':
      return "comentario";
    case 'Português':
      return "comentario";
    default:
      return "备注";
  }
};

const renderConfirm = (selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return "确认";
    case 'English':
      return "Confirm";
    case 'Español':
      return "Confirmar";
    case 'Português':
      return "Confirmar";
    default:
      return "备注"; 
  }
};

const renderCancel = (selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return "取消";
    case 'English':
      return "Cancel";
    case 'Español':
      return "Cancelar";
    case 'Português':
      return "Cancelar";
    default:
      return "备注"; 
  }
};

const renderWriteComment = (selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return "输入备注";
    case 'English':
      return "Write a Comment";
    case 'Español':
      return "Insertar un comentario";
    case 'Português':
      return "Inserir um ccomentario";
    default:
      return "备注"; // Change default case to return "备注"
  }
};
const ShoppingCart = ({ selectedLanguage,items, onAdd, onRemove, color,last_ordering_timing,orderingInterval }) => {
  const location = useLocation(); // This gives you the location object
  const pathParts = location.pathname.split('/');
  const isTakeAway = pathParts[pathParts.length - 1].includes('takeaway');
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [comment, setComment] = useState("no comment");
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [arrivalTime, setarrivalTime] = useState(null);  
  const [name, setName] = useState('');
  const [isValidName, setIsValidName] = useState(true);
  const [enableOrdering, setEnableOrdering] = useState(true);
  const [timeLeftToOrder, setTimeLeftToOrder] = useState(0);
  const [allcomment, setAllComment] = useState({})

  const handleCommentClick = (item, comment) => {
    // Update the comments object with the new comment for the item
    setAllComment(prevComments => ({
      ...prevComments,
      [item.id]: [item.category,comment]
    }));
  };

  const handleDeleteComment = (itemId) => {
    // Create a copy of the current comments object
    const updatedComments = { ...allcomment };
    // Delete the comment for the specified item ID
    delete updatedComments[itemId];
    // Update the state with the modified comments object
    setAllComment(updatedComments);
  };


  const date = new Date()
  const lisbonTime = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }));

  const hour = lisbonTime.getHours();
  const minute = lisbonTime.getMinutes();
  const second = lisbonTime.getSeconds();
  const currentTimeSeconds = 3600 * hour + 60 * minute + second;

  useEffect(() => {

    const timer = setInterval(() => {
      console.log('enableOrdering', enableOrdering)

      const differenceInSeconds = currentTimeSeconds - last_ordering_timing;
      if (differenceInSeconds > orderingInterval || differenceInSeconds < 0) {
        setEnableOrdering(true);
        console.log('enableOrdering', enableOrdering)
      } else {
        console.log('enableOrdering', enableOrdering)

        setEnableOrdering(false);
        setTimeLeftToOrder(orderingInterval - differenceInSeconds)
      }
    }, 500);
  
    // Clean up the timer when the component unmounts or when the dependency array changes
    return () => clearInterval(timer);
  }, [currentTimeSeconds, last_ordering_timing]); // Dependency array includes currentTimeSeconds and last_ordering_timing
  

  const handleTimeChange = (event) => {
    setarrivalTime(event.target.value);
  };

  const handleNameChange = (event) => {
    const value = event.target.value;
  
    // Regular expression to check if the input is a valid name
    // This regex allows letters, spaces, apostrophes, and hyphens
    const reg = /^[a-zA-Z\s'-]+$/;
  
    // Update state only if input is empty (to allow clearing the input) or a valid name
    if (value === '' || reg.test(value)) {
      setName(value);
      setIsValidName(true);
    } else {
      setIsValidName(false);
    }
  };
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
  const handlePhoneNumberChange = (event) => {
    const value = event.target.value;
    // Regular expression to check if the input is numeric
    const reg = /^[0-9]*$/;

    // Update state only if input is empty or a valid number
    if (value === '' || reg.test(value)) {
      setPhoneNumber(value);
      setIsValidNumber(true);
    } else {
      setIsValidNumber(false);
    }
  };

  const renderOrdername = (selectedLanguage) => {
    switch (selectedLanguage) {
      case '中文':
        return "您的订单";
        case 'English':
        return "Your Order";
        case 'Español':
        return "Su pedido";
        case 'Português':
        return "Seu pedido";
    }
  };

  const renderTotal= (selectedLanguage) => {
    switch (selectedLanguage) {
      case '中文':
        return "总计";
        case 'English':
        return "Total";
        case 'Español':
        return "Total";
        case 'Português':
        return "Total";

    }
  };

  const totalPrice = useMemo(
    () => items.map((i) => i.quantity * i.price).reduce((a,b) => a + b, 0),
    [items]
  );

  return (
    <>
      <h3 className="text-center mb-4">
        <b>{renderOrdername(selectedLanguage)}</b>
      </h3>
      <Card  style={{ width: '100%' }}>
        <Card.Body >
          {items.map((item) => (
            <div key={item.id} className="d-flex mb-4 align-items-center">
              <div className="flex-grow-1">
                <p className="mb-0">
                  <b style={{ marginRight: '10px' }}>{renderMenuItemName(item,selectedLanguage)}  €{item.price}</b>
                  <Popup 
                    trigger={
                      <Button
                        variant="primary"
                        size="sm"
                        style={{ backgroundColor: '#FE6C4C', fontSize: '0.1rem' }}
                      >
                        <FaCommentDots style={{ fontSize: '14px' }} />
                      </Button>
                    } 
                    modal
                    closeOnDocumentClick={false} // Prevent closing on document click
                  >
                    {(close) => (
                      <div 
                        style={{
                          backgroundColor: 'white',
                          width: '20rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '10px',
                          margin: 'auto'
                        }}
                      >
                        <Form.Group style={{ backgroundColor: 'white' }}>
                          <Form.Label>{renderCommentName(selectedLanguage)}</Form.Label>
                          <Form.Control 
                            as="textarea"
                            placeholder={renderWriteComment(selectedLanguage)}
                            onChange={handleCommentChange}
                          />
                        </Form.Group>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Button 
                            variant="secondary" 
                            onClick={close} // Close the modal when cancel button is clicked
                          >
                            {renderCancel(selectedLanguage)}
                          </Button>
                          <Button 
                            variant="primary" 
                            onClick={() => { handleCommentClick(item, comment); close(); }} 
                            type="submit" 
                            style={{ backgroundColor: '#FE6C4C'}}
                          >
                            {renderConfirm(selectedLanguage)}
                          </Button>
                        </div>
                      </div>
                    )}
                  </Popup>

                </p>

                  {allcomment[item.id] && (
                    <p style={{ margin: '5px 0' }}>
                      <span style={{ marginRight: '5px' }}>
                        Comment: {allcomment[item.id][1]} 
                      </span>
                      <Button
                        onClick={() => handleDeleteComment(item.id)}
                        variant="primary"
                        size="sm"
                        style={{ backgroundColor: '#FE6C4C', fontSize: '0.1rem'}}
                      >
                        <TiDelete style={{ fontSize: '14px' }} />
                      </Button>
                    </p>
                  )}

                <span>
                   
                </span>
              </div>

              <div className="d-flex align-items-center">
                <OperationButton
                  variant="lightgray"
                  size="sm"
                  onClick={() => onRemove(item)}
                >
                  - 
                </OperationButton>
                <span>{item.quantity}</span>
                <OperationButton
                  variant="lightgray"
                  size="sm"
                  onClick={() => onAdd(item)}
                >
                  +
                </OperationButton>
              </div>
            </div>
            
          ))}

          {
            isTakeAway &&
            <div>
              <hr/>
                <Form.Group>
                  <Form.Label>备注</Form.Label>
                  <Form.Control 
                    as="textarea"
                    placeholder="输入备注" 
                    onChange={handleCommentChange}
                  />
                </Form.Group>
              <hr className="mb-4" />

              {/* Name input group */}
              <Form.Group>
                <Form.Label>姓名</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="输入姓名" 
                  value={name}
                  onChange={handleNameChange}
                  isInvalid={!isValidName}
                />
                {!isValidName && (
                  <Form.Text className="text-muted">
                    请输入有效的姓名。
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label>电话号码</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="输入电话号码" 
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  isInvalid={!isValidNumber}
                />
                {!isValidNumber && (
                  <Form.Text className="text-muted">
                    请输入有效的电话号码（只能包含数字）。
                  </Form.Text>
                )}
              </Form.Group>
              <hr className="mb-4" />

              {/* Time picker */}
              <Form.Group>
                <Form.Label>选择时间</Form.Label>
                <Form.Control 
                  type="time" 
                  value={arrivalTime}
                  onChange={handleTimeChange}
                />
              </Form.Group>

            </div>
          }
          <hr/>
            <div className="d-flex justify-content-between">
              <h5><b>{renderTotal(selectedLanguage)}</b></h5>
              <h5><b>€{totalPrice}</b></h5>
            </div>
          <hr className="mb-4" />
          
        </Card.Body>
          <OrderForm 
            selectedLanguage={selectedLanguage} 
            amount={totalPrice} 
            items={items} 
            color={color}
            isTakeAway = {isTakeAway}
            phoneNumber={phoneNumber}
            arrivalTime={arrivalTime}
            comment={allcomment}
            customer_name={name}
            timeLeftToOrder={timeLeftToOrder}
            enable_ordering={enableOrdering}
          />
      </Card>
    </>
  );
};

export default ShoppingCart;