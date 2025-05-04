import React, { useState } from "react";
import { Typer } from "./helpers";
import './index.css'


function Navbar() {

    return (
        <div>
            <div className="navbar">
                <div className="logo">
                    Harris
                </div>
                <div className="navbar-right">
                    <a href="#">Home</a>
                    <a href="#">Expertise</a>
                    <a href="#">Projects</a>
                    <a href="#">Contact</a>
                </div>
                <div className="hamburger" onClick={() => document.querySelector(".mobile-menu").classList.toggle("active")}>
                    <div className="bar1"></div>
                    <div className="bar2"></div>
                    <div className="bar3"></div>
                </div> 
            </div>
            <div className="mobile-menu">
                <a href="#">Home</a>
                <a href="#">Expertise</a>
                <a href="#">Projects</a>
                <a href="#">Contact</a>
            </div>
        </div>
    )
}
 
function MesssageForm() {
    const [inputs, setInputs] = useState({});

    const handleInputs = (e) => {
        const name = e.target.name;
        const val = e.target.value;
        setInputs(values => ({...values, [name]:val}))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="one-form">
                <label for='name'>Name:</label>
                <input type="text" id="name" name="name" value={inputs.name||""} placeholder="Your name" onChange={handleInputs} required></input>
            </div>
            <div className="one-form">
                <label for='email'>Email:</label>
                <input type="email" id="email" name="email" placeholder="Your email" value={inputs.email||""} onChange={handleInputs} required></input>
            </div>
            <div className="one-form">
                <label for='sub'>Subject:</label>
                <input type="text" id="sub" name="sub" placeholder="Message Subject" value={inputs.sub||""} onChange={handleInputs} required></input>
            </div>
            <div className="one-form">
                <label for='msg'>Message:</label>
                <textarea className="message-input" id="msg" name="msg" placeholder="Message..." value={inputs.msg||""} onChange={handleInputs} required></textarea>
            </div>
            <input className="btn" type="submit" value='Submit'></input>
        </form>
    )
}


export default function Home() {
    document.body.style = 'margin: 0; background-image: linear-gradient(to right, rgb(17 17 17), #434343); background-repeat: no-repeat; height: 100%;';
    return (
        <div>
            <Navbar/>
            <div className="content">
                <div className="headings">
                    <h1>Hey there, I'm Harris!</h1>
                    <h1>I'm a <Typer texts={['Full Stack Developer', 'Software Devolper', 'Discord Bot Developer', 'Mobile App Developer', 'Data Scientist', 'Graphics designer']}/></h1>
                    <p>I'm a software developer based in Pakistan. I will help you build your next project that your users will love.</p>
                    <a className="btn" href="#"><img src="/img/github.svg"/>Github</a> 
                </div>
            </div>  
            <div className="content-break"></div>
            <div className="content">
                <div className="expertise-container">
                    <h2>My Expertise</h2>
                    <div className="icons">
                        <div className="skill">
                            <img className="skill-icon" src='/img/python.svg'/>
                            <div className="skill-name">Python</div>
                        </div>
                        <div className="skill">
                            <img className="skill-icon" src="/img/js.svg"/>
                            <div className="skill-name">Javascript</div>
                        </div>
                        <div className="skill">
                            <img className="skill-icon" src="/img/C.svg"/>
                            <div className="skill-name">C language</div>
                        </div>
                        <div className="skill">
                            <img className="skill-icon" src="/img/C++.svg"/>
                            <div className="skill-name">C++ language</div>
                        </div>
                        <div className="skill">
                            <img className="skill-icon" src="/img/flask.svg"/>
                            <div className="skill-name">Flask backend</div>
                        </div>
                        <div className="skill">
                            <img className="skill-icon" src="/img/react.svg"/>
                            <div className="skill-name">React & React Native</div>
                        </div>
                        <div className="skill">
                            <img className="skill-icon" src="/img/pandas.svg"/>
                            <div className="skill-name">Pandas Python</div>
                        </div>
                        <div className="skill">
                            <img className="skill-icon" src="https://go.dev/blog/go-brand/Go-Logo/SVG/Go-Logo_Blue.svg"/>
                            <div className="skill-name">Golang</div>
                        </div>
                        <div className="skill">
                            <img className="skill-icon" src="/img/postgres.svg"/>
                            <div className="skill-name">Postgres Database</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-break"></div>
            <div className="content">
                <div className="project-container">
                    <h2>My Projects</h2>
                    <div className="projects">
                        <div className="project" onClick={() => window.location="http://localhost:3000/minesweeper"}>
                            <img src="/img/bomb.svg"/>
                            <div className="project-text">
                                <p className="project-title">Minesweeper</p>
                                <p className="project-description">A simple minesweeper game made in react.</p>
                            </div>
                        </div>
                        <div className="project" onClick={() => window.location="https://discord.com/application-directory/916587441526296609"}>
                            <img src="/img/yujin.png"/>
                            <div className="project-text">
                                <p className="project-title">Yujin</p>
                                <p className="project-description">A discord bot made in Golang.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-break"></div>
            <div className="content">
                <div className="contact-container">
                    <h2>Contact</h2>
                    <div className="contacts">
                        <div className="contain-btns">
                            <a className="btn" href="https://github.com/MayoGuy"><img src="/img/github.svg"/>Github</a>
                            <a className="btn" href="https://discord.com/users/916587441526296609"><img src="/img/discord.svg"/>Discord</a>
                        </div>
                        <div className="message">
                            <MesssageForm/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                This site is made by react. Icon from <a href="https://icons8.com/">Icons8</a>
            </div>
        </div>
    );
}
