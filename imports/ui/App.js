import React from 'react';
import AppBody from './AppBody';

const App = ({ loading }) => {

    if(loading) return null;
    return (
        <AppBody/>
    )
};

export default App;