import React, {useRef} from 'react';

const PrintableOrders = ({ orders }) => {
    const componentRef = useRef();
  
  return (
    <div>

      <div ref={componentRef} className="printable-section">
        {orders.filter(order => !order.is_Printed).map(order => (
          <div key={order.id}>
            {/* Render your order details here */}
            <h1>桌号 / Número de Mesa : {order.table}</h1>
            <h2>订单号 / Número de Pedido: {order.id} </h2>
            <h4>备注{order.comment}</h4>
            {JSON.parse(order.detail).map((item) => (
            <div className="mb-2" >
              <h3>菜名: {item.name} -- Prato: {item.name_pt} X {item.quantity}</h3>
            </div>
          ))}
            
            {/* Add other order details as needed */}
          </div>
        ))}
      </div>

    </div>
  );
};

export default PrintableOrders;
