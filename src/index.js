import ReactDOM from 'react-dom/client';
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Game from './minesweeper';

class Home extends React.Component {
    render() {
        return (
            <div>
                <h1 style={{color: 'white'}}>Yo</h1>
            </div>
        );
    }
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/minesweeper" element={<Game />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>)