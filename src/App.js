import Header from "./com/Header.js";
import Order from "./com/func/Order.js";
import Account from "./com/func/Account.js";
import Login from "./com/func/Login.js";
import ManagerCategory from "./com/func/ManagerCategory.js";
import ManagerProduct from "./com/func/ManagerProduct.js";
import Checkout from "./com/func/Checkout.js";
import ManagerVoucher from "./com/func/ManagerVoucher.js";
import { useState } from "react";

import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import React from "react";

import { setTileWeb } from "./lib/lib.js";

function App() {
    React.useEffect(() => {
        setTileWeb("ahihiihiih");
    }, []);
    const [guest, setGuest] = useState({ u: "", p: "", name: "", add: "", phone: "", money: "", permission: 2 });
    const [title, setTitle] = useState("");
    const [productOrder, setProductOrder] = useState([]);

    return (
        <Router>
            <Header guest={guest} title={title} />
            <Switch>
                <Route path="/login">
                    <Login setTitle={setTitle} guest={guest} setGuest={setGuest} setProductOrder={setProductOrder} />
                </Route>
                <Route path="/account">
                    <Account guest={guest} setTitle={setTitle} setGuest={setGuest} />
                </Route>
                <Route path="/order/checkout">
                    <Checkout setTitle={setTitle} productOrder={productOrder} guest={guest} setProductOrder={setProductOrder} />
                </Route>
                <Route path="/manager-category">
                    <ManagerCategory guest={guest} setTitle={setTitle} />
                </Route>
                <Route path="/manager-product">
                    <ManagerProduct guest={guest} setTitle={setTitle} />
                </Route>
                <Route path="/manager-voucher">
                    <ManagerVoucher guest={guest} setTitle={setTitle} />
                </Route>
                <Route>
                    <Order setTitle={setTitle} setProductOrder={setProductOrder} productOrder={productOrder} />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
