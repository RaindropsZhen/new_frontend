import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import React from 'react';

import { AuthProvider } from '../contexts/AuthContext';
import PrivateRoute from './PrivateRoute';

import Login from '../pages/Login';
import Places from '../pages/Places';
import Place from '../pages/Place';
import Menu from '../pages/Menu';
import Orders from '../pages/Orders';
import MenuSettings from '../pages/MenuSettings';
import TableNumberInput from '../pages/SelectTable';
import QRCode from '../pages/QRCode';
function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Switch>
                    <Redirect from="/" to="/login" exact />
                    <Route exact path='/login'>
                        <Login/>
                    </Route>
                    
                    <Route exact path='/:id/select_table/'>
                        <TableNumberInput/>
                    </Route>

                    <Route exact path='/menu/:code/:id/:table/'>
                        <Menu/>
                    </Route>

                    <Route exact path='/menu/:id/takeaway'>
                        <Menu/>
                    </Route>

                    <PrivateRoute exact path='/places/:id'>
                        <Place/>
                    </PrivateRoute>

                    <PrivateRoute exact path='/places'>
                        <Places/>
                    </PrivateRoute>
                    <PrivateRoute exact path='/places/:id/orders'>
                        <Orders/>
                    </PrivateRoute>
                    <PrivateRoute exact path='/places/:id/settings'>
                        <MenuSettings/>
                    </PrivateRoute>

                    <PrivateRoute exact path='/places/:id/qrcode'>
                        <QRCode/>
                    </PrivateRoute>

                </Switch>
            </BrowserRouter>
          <ToastContainer/>
        </AuthProvider>


    )
  }
  
  export default App;
