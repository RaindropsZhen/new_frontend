import { Card, Button } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import newOrderSound from '../audio/notification.mp3';


const Order = ({ order, onComplete, onPrintOrder }) => {

  const orderCreatedAt = new Date(order.created_at);
  const currentTime = new Date();
  const timeDifferenceInMinutes = (currentTime - orderCreatedAt) / (1000 * 60);
  const isNew = timeDifferenceInMinutes <= 0.2;
  const componentRef = useRef(null)
  const hasAlertBeenPlayed = useRef(false);
  
  const printButtonStyle = order.isPrinted ? 
  { backgroundColor: 'grey', color: 'white', borderColor: 'grey', borderRadius: '5px' } : 
  { backgroundColor: 'green', color: 'white', borderColor: 'green', borderRadius: '5px' };

  const audioRef = useRef(new Audio(newOrderSound));


  if (isNew && !hasAlertBeenPlayed.current) {
    audioRef.current.play();
    toast.info('新订单提醒！');
    hasAlertBeenPlayed.current = true;
  }
  // Reset the flag when the order is no longer new
  if (!isNew && hasAlertBeenPlayed.current) {
    hasAlertBeenPlayed.current = false;
  }
  return (
    <Card className="mb-3 page-wrapper " >
      <Card.Header className="d-flex justify-content-between">
        <span className='order-info'>{`订单号 #${order.daily_id} - 桌号 ${order.table}`}</span>

        <span
            style={{
              color:
                timeDifferenceInMinutes > 30
                  ? 'red'
                  : timeDifferenceInMinutes > 15
                  ? 'orange'
                  : 'green',
            }}
          >
          {`${timeDifferenceInMinutes.toFixed(0)} 分钟前`}
        </span>

        <span>
          {isNew && <span className="new-order">新订单</span>}
        </span>

        {/* Print order info */}
        <div key={order.id} className="printable-section" ref={componentRef}>
            {/* Render your order details here */}
            <h1>桌号 / Número de Mesa : {order.table}</h1>
            <h2>订单号 / Número de Pedido: {order.id} </h2>
            {JSON.parse(order.detail).map((item) => (
            <div className="mb-2" >
              <h3>菜名: {item.name}  X {item.quantity} -- Prato: {item.name_pt}  X {item.quantity}</h3>
              <h4>备注{order.comment}</h4>
            </div>
          ))}
            {/* Add other order details as needed */}
        </div>

        <ReactToPrint trigger={()=> 
            <button 
            className='small-button'
            style={printButtonStyle}
          >
            {order.isPrinted ? '已打印' : '未打印'}
          </button>
          }
          content={()=>componentRef.current}
          onAfterPrint={() => onPrintOrder()}
        />
      </Card.Header>

      <Card.Body className="d-flex justify-content-between">
        <div>
          <span className='print-only'> {`订单号 #${order.daily_id} - 桌号 ${order.table}`}</span>
          {JSON.parse(order.detail).map((item) => (
            <div className="mb-2" >
              <img 
                src={item.image} 
                width={30} 
                height={30} 
                style={{ borderRadius: 3, margin: "0 10px" }} 
              />
              <span>{item.name}</span>
              <span>x{item.quantity}</span>
            </div>
          ))}
          <span>备注{order.comment}</span>
        </div>

        <div>
          {onComplete ? (
            <Button variant="standard" size="md" onClick={onComplete}>
              完成
            </Button>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  )
}

export default Order;