import { toast } from 'react-toastify';

function request(path,{ data = null, token = null, method = "GET"}) {
    const headers = {
      Authorization: token ? `Token ${token}` : "",
    };
    let body = null;

    if (data instanceof FormData) {
      // For FormData, don't set Content-Type, browser will do it with boundary
      body = data;
    } else if (method !== "GET" && method !== "DELETE" && data !== null) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }

    return fetch(path, {
        method,
        headers,
        body,
      })
    .then((response) => {
        // If it is success
        if(response.ok) {
            if (method === "DELETE") {
                // if delete, nothing return
                return true;
            }
            return response.json();
        }
        //Otherwise, if there are errors
        return response
            .json()
            .then((json)=>{
                // Handle Json Error, response by the server
                if (response.status === 400) {
                    const errors = Object.keys(json).map(
                        (k) => `${(json[k].join(" "))}`
                    );
                    throw new Error(errors.join(" "));
                } 
                throw new Error(JSON.stringify(json));
            })
            .catch((e) => {
                if (e.name === "SyntaxError") {
                    throw new Error(response.statusText);
                }
                throw new Error(e);
            })
    })
    .catch((e) =>{
        //Handle all errors 
        toast(e.message || "An API request error occurred.",{type: "error"}); // Ensure a message
        throw e; // Re-throw the error so calling code can also catch it
    })
}

export function signIn(email, password) {
    return request("/auth/token/login/",{
        data: {"email": email, "password":password},
        method: "POST",
    })
}

export function register(username, password,password_confirmation,email, phoneNumber) {
    const data = { "user_name":username, "password":password,"email":email, "phone_number":phoneNumber,'password_confirmation':password_confirmation }
    return request("/auth/users/", {
      data: data,
      method: "POST",
    })
  }

export function fetchPlaces(token) {
    return request("/api/places/", {token});
}

export function addPlace(data, token) {
    return request("/api/places/", { data, token, method: "POST" });
  }

// Removed Cloudinary-specific uploadImage function
// function generateRandomId() {
//     // You can use any method you prefer to generate a random ID.
//     // Here's an example using a timestamp and a random number.
//     const timestamp = new Date().getTime();
//     const randomNum = Math.floor(Math.random() * 1000000); // Adjust as needed
//     return `${timestamp}_${randomNum}`;
// }
//
// export function uploadImage(image, folder_name) {
//     const formData = new FormData();
//     formData.append("file", image);
//     formData.append("upload_preset", "qrmenu_photos");
//     //formData.append("overwrite", "true");
//
//     const randomId = generateRandomId();
//     const publicId = `${folder_name}/${randomId}`;
//     formData.append("public_id", publicId);    
//    
//     return fetch("https://api.cloudinary.com/v1_1/qrmenudemo/image/upload", {
//         method: "POST",
//         body: formData,
//     }).then((response) => {
//         return response.json();
// });
// }
// export function deleteImage(data) {
//     return request("/api/delete_image/",{data,token:null, method:'DELETE'})

//   }
  
// export function deleteImage(data) {

//     return request("/api/delete_image/", {method: 'DELETE', data: data});
// }

export function fetchPlace(id, token) {
    return request(`/api/places/${id}`, { token });
}

export function updateCategory(id, data, token) {
    return request(`/api/categories/${id}`, { data, token, method: "PATCH" });
}

export function addCategory(data, token) {
    return request("/api/create_category_intent/", { data, token, method: "POST" });
}

export function reprintOrder(data, token) {
  return request("/api/reprint_order/", { data, token, method: "POST" });
}

export function updatePrinters(id,data, token) {
    return request(`/api/printers/${id}`, { data, token, method: "PATCH" });
}

export function addMenuItems(data, token) {
    return request("/api/create_menu_items_intent/", { data, token, method: "POST" });
}

export function updateMenuItem(id, data, token) {
    return request(`/api/menu_items/${id}`, { data, token, method: "PATCH" });
}

export function removePlace(id, token) {
    return request(`/api/places/${id}`, { token, method: "DELETE" });
}

export function removeCategory(id, token) {
    return request(`/api/categories/${id}`, { token, method: "DELETE" });
}

export function removeMenuItem(id, token) {
    return request(`/api/menu_items/${id}`, { token, method: "DELETE" });
}

export function reorderCategories(placeId, orderedCategoryIds, token) {
  const data = { ordered_category_ids: orderedCategoryIds };
  return request(`/api/places/${placeId}/categories/reorder/`, { data, token, method: "POST" });
}

export function reorderMenuItems(categoryId, orderedItemIds, token) {
  const data = { ordered_item_ids: orderedItemIds };
  return request(`/api/categories/${categoryId}/menu-items/reorder/`, { data, token, method: "POST" });
}

export function updatePlace(id, data, token) {
    return request(`/api/places/${id}`, { data, token, method: "PATCH" });
}

export function createOrderIntent(data, token) {
    return request("/api/create_order_intent/", { data, token, method: "POST" });
}

export function fetchOrders(placeId, token) {
    return request(`/api/orders/?place=${placeId}`, { token });
  }
  
export function completeOrder(id, data, token) {
    return request(`/api/orders/${id}`, { data, token, method: "PATCH" });
}

export function updateTableBlockedStatus(tableId, blocked, token) {
    return request(`/api/tables/${tableId}/`, {
        data: { blocked },
        token,
        method: "PATCH",
    });
}

export function updateTableNumberPeople(tableId, numberPeople, token) {
    return request(`/api/tables/${tableId}/`, {
        data: { number_people: numberPeople },
        token,
        method: "PATCH",
    });
}

export const updateOrderStatus = async (orderIds, token) => {
    try {
      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderIds, status: 'done' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating order status:', error);
      return null;
    }
  };
