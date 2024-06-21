import React, {useState, useEffect} from "react";
import Modal from 'react-modal';


//Custom Dropdown menu

function DropdownMenu({ options, value, onChange}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="dropdown">
            <div className="dropdown-button" onClick={handleClick}>
                {value}
            </div>
            {isOpen && (
                <div className="dropdown-menu">
                    {options.map((option) => (
                        <div
                            className="dropdown-option"
                            key={option}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function Configurations ( {opened, onSave, onClosed, dcolor, dspeed, dsize} ) {
    const [color, setColor] = useState(dcolor)
    const [speed, setSpeed] = useState(dspeed)
    const [size, setSize] = useState(dsize)

    function closeAndSave() {
        onSave(color, speed, size)
        onClosed()
    }


    const colors = ['#228B22', '#7F1734', '#87CEEB', '#FFFF00', '#E6E6FA', '#CC5500']
    return (
        <Modal isOpen={opened} className="config-menu" onRequestClose={onClosed} contentLabel="Configurations" style={{overlay: {backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 5}}}>
            <h4>Configurations</h4>
            <p className='config-text'>Choose color:</p>
            <div className='colors-container'>
                {colors.map((c, i) => <div className='color-choice' key={c} style={{backgroundColor: c, borderColor: color===c ? 'white' : null}} onClick={() => setColor(c)}></div>)}
            </div>
            
            <p className='config-text'>Animation speed:</p>
            <input type="range" min={0} max={1} step={0.01} value={speed} onChange={(e) => setSpeed(e.target.value)}></input>
            <p className='config-text'>Board Size:</p>
            <div className="size-container">
                <DropdownMenu options={['Small', 'Medium', 'Large']} value={size} onChange={setSize}></DropdownMenu>
            </div>
            <button className='config-save' onClick={closeAndSave}>Save</button>
        </Modal>
    )
}


function Timer({ reset, pause }) {
    const [seconds, setSeconds] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        setSeconds(0);
    }, [reset]);

    useEffect(() => {
        if (pause) {
            clearInterval(intervalId);
        } else {
            const newIntervalId = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000); 
            setIntervalId(newIntervalId);

            return () => clearInterval(newIntervalId);
        }
    }, [pause]);

    const formatTime = (value) => {
        return value.toString().padStart(2, '0');
    };

    const minutes = Math.floor(seconds / 60);
    const second = seconds % 60;

    return (
        <div>
            {formatTime(minutes)}:{formatTime(second)}
        </div>
    );
}


export {DropdownMenu, Configurations, Timer}