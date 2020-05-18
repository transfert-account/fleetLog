import React, { Component } from 'react'

export class DuoIcon extends Component {
    render() {
        if(this.props.name == "double-chevron-right"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <g className="fa-group">
                        <path d="M285.6 273L90.79 467a24 24 0 0 1-33.88.1l-.1-.1-22.74-22.7a24 24 0 0 1 0-33.85L188.39 256 34.07 101.55A23.8 23.8 0 0 1 34 67.8l.11-.1L56.81 45a24 24 0 0 1 33.88-.1l.1.1L285.6 239a24.09 24.09 0 0 1 0 34z" className="fa-secondary">
                        </path>
                        <path d="M478 273L283.19 467a24 24 0 0 1-33.87.1l-.1-.1-22.75-22.7a23.81 23.81 0 0 1-.1-33.75l.1-.1L380.8 256 226.47 101.55a24 24 0 0 1 0-33.85L249.22 45a24 24 0 0 1 33.87-.1.94.94 0 0 1 .1.1L478 239a24.09 24.09 0 0 1 0 34z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "calendar"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <g className="fa-group">
                        <path d="M0 192v272a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48V192zm128 244a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12v-40a12 12 0 0 1 12-12h40a12 12 0 0 1 12 12zm0-128a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12v-40a12 12 0 0 1 12-12h40a12 12 0 0 1 12 12zm128 128a12 12 0 0 1-12 12h-40a12 12 0 0 1-12-12v-40a12 12 0 0 1 12-12h40a12 12 0 0 1 12 12zm0-128a12 12 0 0 1-12 12h-40a12 12 0 0 1-12-12v-40a12 12 0 0 1 12-12h40a12 12 0 0 1 12 12zm128 128a12 12 0 0 1-12 12h-40a12 12 0 0 1-12-12v-40a12 12 0 0 1 12-12h40a12 12 0 0 1 12 12zm0-128a12 12 0 0 1-12 12h-40a12 12 0 0 1-12-12v-40a12 12 0 0 1 12-12h40a12 12 0 0 1 12 12zm-80-180h32a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16h-32a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16zm-192 0h32a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16h-32a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16z" className="fa-secondary">
                        </path>
                        <path d="M448 112v80H0v-80a48 48 0 0 1 48-48h48v48a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V64h128v48a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V64h48a48 48 0 0 1 48 48z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "poweroff"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <g className="fa-group">
                        <path d="M272 0a23.94 23.94 0 0 1 24 24v240a23.94 23.94 0 0 1-24 24h-32a23.94 23.94 0 0 1-24-24V24a23.94 23.94 0 0 1 24-24z" className="fa-secondary">
                        </path>
                        <path d="M504 256c0 136.8-110.8 247.7-247.5 248C120 504.3 8.2 393 8 256.4A248 248 0 0 1 111.8 54.2a24.07 24.07 0 0 1 35 7.7L162.6 90a24 24 0 0 1-6.6 31 168 168 0 0 0 100 303c91.6 0 168.6-74.2 168-169.1a168.07 168.07 0 0 0-68.1-134 23.86 23.86 0 0 1-6.5-30.9l15.8-28.1a24 24 0 0 1 34.8-7.8A247.51 247.51 0 0 1 504 256z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "adressbook"){
            return(
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" >
                    <g className="fa-group">
                        <path fill="currentColor" d="M416 48a48 48 0 0 0-48-48H48A48 48 0 0 0 0 48v416a48 48 0 0 0 48 48h320a48 48 0 0 0 48-48zm-208 80a64 64 0 1 1-64 64 64.06 64.06 0 0 1 64-64zm112 236.8c0 10.6-10 19.2-22.4 19.2H118.4C106 384 96 375.4 96 364.8v-19.2c0-31.8 30.1-57.6 67.2-57.6h5a103 103 0 0 0 79.6 0h5c37.1 0 67.2 25.8 67.2 57.6z" className="fa-secondary">
                        </path>
                        <path fill="currentColor" d="M252.8 288h-5a103 103 0 0 1-79.6 0h-5c-37.1 0-67.2 25.8-67.2 57.6v19.2c0 10.6 10 19.2 22.4 19.2h179.2c12.4 0 22.4-8.6 22.4-19.2v-19.2c0-31.8-30.1-57.6-67.2-57.6zM208 256a64 64 0 1 0-64-64 64.06 64.06 0 0 0 64 64zm228-32h-20v64h20a12 12 0 0 0 12-12v-40a12 12 0 0 0-12-12zm0 128h-20v64h20a12 12 0 0 0 12-12v-40a12 12 0 0 0-12-12zm0-256h-20v64h20a12 12 0 0 0 12-12v-40a12 12 0 0 0-12-12z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "shieldcheck"){
            return(
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <g className="fa-group">
                        <path d="M466.5 83.67l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80A48 48 0 0 0 16 128c0 198.5 114.5 335.69 221.5 380.29a48.15 48.15 0 0 0 36.9 0C360.1 472.58 496 349.27 496 128a48 48 0 0 0-29.5-44.33zm-47.2 114.21l-184 184a16.06 16.06 0 0 1-22.6 0l-104-104a16.07 16.07 0 0 1 0-22.61l22.6-22.6a16.07 16.07 0 0 1 22.6 0l70.1 70.1 150.1-150.1a16.07 16.07 0 0 1 22.6 0l22.6 22.6a15.89 15.89 0 0 1 0 22.61z" className="fa-secondary">
                        </path>
                        <path d="M419.3 197.88l-184 184a16.06 16.06 0 0 1-22.6 0l-104-104a16.07 16.07 0 0 1 0-22.61l22.6-22.6a16.07 16.07 0 0 1 22.6 0l70.1 70.1 150.1-150.1a16.07 16.07 0 0 1 22.6 0l22.6 22.6a15.89 15.89 0 0 1 0 22.61z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "account"){
            return(
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <g className="fa-group">
                        <path d="M352 128A128 128 0 1 1 224 0a128 128 0 0 1 128 128z" className="fa-secondary">
                        </path>
                        <path d="M313.6 288h-16.7a174.1 174.1 0 0 1-145.8 0h-16.7A134.43 134.43 0 0 0 0 422.4V464a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48v-41.6A134.43 134.43 0 0 0 313.6 288z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "idcard"){
            return(
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <g className="fa-group">
                        <path d="M0 128v304a48 48 0 0 0 48 48h480a48 48 0 0 0 48-48V128zm176 64a64 64 0 1 1-64 64 64 64 0 0 1 64-64zm93.3 224H82.7c-10.4 0-18.8-10-15.6-19.8A64.09 64.09 0 0 1 128 352h8.2a103 103 0 0 0 79.6 0h8.2a64.09 64.09 0 0 1 60.9 44.2c3.2 9.9-5.2 19.8-15.6 19.8zM512 344a8 8 0 0 1-8 8H360a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8h144a8 8 0 0 1 8 8zm0-64a8 8 0 0 1-8 8H360a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8h144a8 8 0 0 1 8 8zm0-64a8 8 0 0 1-8 8H360a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8h144a8 8 0 0 1 8 8z" className="fa-secondary">
                        </path>
                        <path d="M224 352h-8.2a103 103 0 0 1-79.6 0H128a64.09 64.09 0 0 0-60.9 44.2C63.9 406 72.3 416 82.7 416h186.6c10.4 0 18.8-9.9 15.6-19.8A64.09 64.09 0 0 0 224 352zM528 32H48A48 48 0 0 0 0 80v48h576V80a48 48 0 0 0-48-48zM176 320a64 64 0 1 0-64-64 64 64 0 0 0 64 64z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "random"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <g className="fa-group">
                        <path d="M505 359l-80-80c-15-15-41-4.47-41 17v40h-32l-52.78-56.55-53.33 57.14 70.55 75.6a12 12 0 0 0 8.77 3.81H384v40c0 21.46 26 32 41 17l80-80a24 24 0 0 0 0-34zM122.79 96H12a12 12 0 0 0-12 12v56a12 12 0 0 0 12 12h84l52.78 56.55 53.33-57.14-70.55-75.6a12 12 0 0 0-8.77-3.81z" className="fa-secondary">
                        </path>
                        <path d="M505 119a24 24 0 0 1 0 34l-80 80c-15 15-41 4.48-41-17v-40h-32L131.56 412.19a12 12 0 0 1-8.77 3.81H12a12 12 0 0 1-12-12v-56a12 12 0 0 1 12-12h84L316.44 99.81a12 12 0 0 1 8.78-3.81H384V56c0-21.44 25.94-32 41-17z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "fingerglove"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <g className="fa-group">
                        <path fill="currentColor" d="M408 200a40 40 0 0 0-40 40h-8v-24a40 40 0 0 0-80 0v24h-8v-40a40 40 0 0 0-80 0v40h-8V40a40 40 0 0 0-80 0v276l-31.65-43.53a40 40 0 0 0-64.7 47.06l128 176A40 40 0 0 0 168 512h208a40 40 0 0 0 38.94-30.84l32-136A40.36 40.36 0 0 0 448 336v-96a40 40 0 0 0-40-40zM224 400a16 16 0 0 1-32 0v-64a16 16 0 0 1 32 0zm64 0a16 16 0 0 1-32 0v-64a16 16 0 0 1 32 0zm64 0a16 16 0 0 1-32 0v-64a16 16 0 0 1 32 0z" className="fa-secondary">
                        </path>
                        <path fill="currentColor" d="M272 320a16 16 0 0 0-16 16v64a16 16 0 0 0 32 0v-64a16 16 0 0 0-16-16zm-64 0a16 16 0 0 0-16 16v64a16 16 0 0 0 32 0v-64a16 16 0 0 0-16-16zm128 0a16 16 0 0 0-16 16v64a16 16 0 0 0 32 0v-64a16 16 0 0 0-16-16z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "finger"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <g className="fa-group">
                        <path d="M0 224c0-34.22 35.1-57.75 66.91-44.12A135.83 135.83 0 0 1 91.83 194V44.8c0-23.45 20.54-44.8 43.82-44.8 23.63 0 43.83 20.65 43.83 44.8v99.85c17.05-16.34 49.76-18.35 70.94 6.3 22.83-14.29 53-2.15 62.32 16.45 49.14-9 71.26 21.95 71.26 72.6 0 2.75-.2 13.28-.2 16 .17 62-31.06 76.89-38.31 123.73a24 24 0 0 1-23.7 20.27H150.26a48 48 0 0 1-43.84-28.47c-13-28.88-49-95.41-77.33-107.53C10.9 256.2 0 242.62 0 224z" className="fa-secondary">
                        </path>
                        <path d="M328 416H136a24 24 0 0 0-24 24v48a24 24 0 0 0 24 24h192a24 24 0 0 0 24-24v-48a24 24 0 0 0-24-24zm-24 68a20 20 0 1 1 20-20 20 20 0 0 1-20 20z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "search"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <g className="fa-group">
                        <path d="M208 80a128 128 0 1 1-90.51 37.49A127.15 127.15 0 0 1 208 80m0-80C93.12 0 0 93.12 0 208s93.12 208 208 208 208-93.12 208-208S322.88 0 208 0z" className="fa-secondary">
                        </path>
                        <path d="M504.9 476.7L476.6 505a23.9 23.9 0 0 1-33.9 0L343 405.3a24 24 0 0 1-7-17V372l36-36h16.3a24 24 0 0 1 17 7l99.7 99.7a24.11 24.11 0 0 1-.1 34z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "check"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <g className="fa-group">
                        <path d="M504.5 144.42L264.75 385.5 192 312.59l240.11-241a25.49 25.49 0 0 1 36.06-.14l.14.14L504.5 108a25.86 25.86 0 0 1 0 36.42z" className="fa-secondary">
                        </path>
                        <path d="M264.67 385.59l-54.57 54.87a25.5 25.5 0 0 1-36.06.14l-.14-.14L7.5 273.1a25.84 25.84 0 0 1 0-36.41l36.2-36.41a25.49 25.49 0 0 1 36-.17l.16.17z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "cancel"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" >
                    <g className="fa-group">
                        <path d="M9.21,356.07a31.46,31.46,0,0,0,0,44.48l22.24,22.24a31.46,31.46,0,0,0,44.48,0L176,322.72,109.28,256ZM342.79,111.45,320.55,89.21a31.46,31.46,0,0,0-44.48,0L176,189.28,242.72,256,342.79,155.93a31.46,31.46,0,0,0,0-44.48Z" className="fa-secondary">
                        </path>
                        <path d="M342.79,356.07a31.46,31.46,0,0,1,0,44.48l-22.24,22.24a31.46,31.46,0,0,1-44.48,0L9.21,155.93a31.46,31.46,0,0,1,0-44.48L31.45,89.21a31.46,31.46,0,0,1,44.48,0Z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "plus"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <g className="fa-group">
                        <path d="M176 448a32 32 0 0 0 32 32h32a32 32 0 0 0 32-32V304h-96zm64-416h-32a32 32 0 0 0-32 32v144h96V64a32 32 0 0 0-32-32z" className="fa-secondary">
                        </path>
                        <path d="M448 240v32a32 32 0 0 1-32 32H32a32 32 0 0 1-32-32v-32a32 32 0 0 1 32-32h384a32 32 0 0 1 32 32z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "car-crash"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <g className="fa-group">
                        <path d="M545.44 262.61l-247.93-63.75 31.71-43.3a48 48 0 0 1 50.68-18.12l123 31.62a48 48 0 0 1 35.66 40.32zm-334.1-109.53l10.71-14.32 32.15-43c2.48-3.31 5.2-6.35 7.91-9.4l11.33-56.16a9 9 0 0 0-14.62-8.77l-60.4 49.71a9.06 9.06 0 0 1-13.29-2l-43.3-65.09a9.05 9.05 0 0 0-16.55 4.14l-7.55 77.86a9.05 9.05 0 0 1-10.8 8L30.25 78.61a9.05 9.05 0 0 0-8.78 14.62l49.71 60.41a9.06 9.06 0 0 1-2 13.29l-65.13 43.3a9 9 0 0 0 4.14 16.54l77.86 7.55a9 9 0 0 1 8 10.79l-15.44 76.68a9 9 0 0 0 14.62 8.77l35.2-29a94.29 94.29 0 0 1 2.41-34.39l12.42-46.37a96.46 96.46 0 0 1 68.08-67.72zM548.11 445l-46.49-12-8 31a32 32 0 0 0 23 39l31 8a32 32 0 0 0 39-23l12-46.49a32.9 32.9 0 0 0 .88-5.14 63.82 63.82 0 0 1-51.39 8.63zM207.2 357.36A63.8 63.8 0 0 1 166.4 325a32.23 32.23 0 0 0-1.71 4.93l-11.95 46.47a32 32 0 0 0 23 39l31 8a32 32 0 0 0 39-23l8-31z" className="fa-secondary">
                        </path>
                        <path d="M612.8 284.4L602 201.16a111.45 111.45 0 0 0-83.18-94.08l-123-31.62a111.47 111.47 0 0 0-118.25 42.28L228 185.46A63.85 63.85 0 0 0 173.1 233l-4 15.5-8 31a64 64 0 0 0 46 77.92L548.11 445A64 64 0 0 0 626 399l8-31 4-15.5a63.84 63.84 0 0 0-25.2-68.1zM329.22 155.56a48 48 0 0 1 50.68-18.12l123 31.63a48 48 0 0 1 35.65 40.31l6.9 53.23-247.94-63.75zm-90.55 143.61c-18.59-4.78-27.81-20.33-23-38.87s20.34-27.7 38.93-22.92 39.34 39.76 34.57 58.29-31.9 8.33-50.5 3.5zm309.92 79.68c-18.59-4.78-47.28-8.86-42.51-27.4s39.81-39.17 58.4-34.39 27.82 20.33 23 38.87-20.29 27.7-38.89 22.92z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "truck"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <g className="fa-group">
                        <path d="M176 352a80 80 0 1 0 80 80 80 80 0 0 0-80-80zm288 0a80 80 0 1 0 80 80 80 80 0 0 0-80-80z" className="fa-secondary">
                        </path>
                        <path d="M624 352h-16V243.9a48 48 0 0 0-14.1-33.9L494 110.1A48 48 0 0 0 460.1 96H416V48a48 48 0 0 0-48-48H48A48 48 0 0 0 0 48v320a48 48 0 0 0 48 48h18.16C74 361.93 119.78 320 176 320s102.54 41.86 110.38 96h67.24c7.85-54.14 54.1-96 110.38-96s102 41.93 109.84 96H624a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-64-96H416V144h44.1l99.9 99.9z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "warehouse"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <g className="fa-group">
                        <path d="M504 448H136.1a8 8 0 0 0-8 8l-.1 48a8 8 0 0 0 8 8h368a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8zm0-192H136.6a8 8 0 0 0-8 8l-.1 48a8 8 0 0 0 8 8H504a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8zm0 96H136.4a8 8 0 0 0-8 8l-.1 48a8 8 0 0 0 8 8H504a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8z" className="fa-secondary">
                        </path>
                        <path d="M640 161.28V504a8 8 0 0 1-8 8h-80a8 8 0 0 1-8-8V256c0-17.6-14.6-32-32.6-32H128.6c-18 0-32.6 14.4-32.6 32v248a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V161.28A48.11 48.11 0 0 1 29.5 117l272-113.3a48.06 48.06 0 0 1 36.9 0L610.5 117a48.11 48.11 0 0 1 29.5 44.28z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "garage"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <g className="fa-group">
                        <path d="M128.65,224s-.65,0-.65,0l0,64H511.47l.53-64Zm104.21,96-8,32H415.14l-8-32Z" className="fa-secondary">
                        </path>
                        <path d="M610.5,117,338.41,3.67A57.4,57.4,0,0,0,320,0,57.4,57.4,0,0,0,301.5,3.67L29.5,117A48.14,48.14,0,0,0,0,161.28V496a16,16,0,0,0,16,16H80a16,16,0,0,0,16-16V224c0-17.59,14.59-32,32.59-32H511.41c18,0,32.59,14.41,32.59,32V496a16,16,0,0,0,16,16h64a16,16,0,0,0,16-16V161.28A48.14,48.14,0,0,0,610.5,117Zm-145,238.42L456.62,320H407.14l8,32H224.86l8-32H183.38l-8.85,35.39A47.93,47.93,0,0,0,144,400v32c0,11.71,6.61,21.52,16,27.1V488a24,24,0,0,0,24,24h32a24,24,0,0,0,24-24V464H400v24a24,24,0,0,0,24,24h32a24,24,0,0,0,24-24V459.1c9.39-5.58,16-15.39,16-27.1V400A47.93,47.93,0,0,0,465.47,355.39ZM208,431.85c-14.4,0-24-9.56-24-23.92S193.6,384,208,384s36,21.53,36,35.88S222.4,431.85,208,431.85Zm224,0c-14.4,0-36,2.39-36-12S417.6,384,432,384s24,9.58,24,23.93S446.4,431.85,432,431.85Z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "phone"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <g className="fa-group">
                        <path d="M192 0h-64a32 32 0 0 0-32 32v352a32 32 0 0 0 32 32h64a32 32 0 0 0 32-32V32a32 32 0 0 0-32-32zm304 384h-32a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-128h-32a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM368 384h-32a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-128h-32a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" className="fa-secondary">
                        </path>
                        <path d="M528 32H256v352a64.07 64.07 0 0 1-64 64h-64a64.07 64.07 0 0 1-64-64V32H48A48 48 0 0 0 0 80v384a48 48 0 0 0 48 48h480a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48zM384 432a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16zm0-128a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16zm128 128a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16zm0-128a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16zm0-112H320V96h192z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "filter"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <g className="fa-group">
                        <path d="M505 41L320 225.93V488c0 19.51-22 30.71-37.76 19.66l-80-56A24 24 0 0 1 192 432V226L7 41C-8 25.87 2.69 0 24 0h464c21.33 0 32 25.9 17 41z" className="fa-primary">
                        </path>
                        <path d="" className="fa-seconday">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "home"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <g className="fa-group">
                        <path d="M352 496V368a16 16 0 0 0-16-16h-96a16 16 0 0 0-16 16v128a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16V311.07c1.78-1.21 3.85-1.89 5.47-3.35L288 115l218.74 192.9c1.54 1.38 3.56 2 5.26 3.2V496a16 16 0 0 1-16 16H368a16 16 0 0 1-16-16z" className="fa-secondary">
                        </path>
                        <path d="M527.92 283.91L298.6 81.64a16 16 0 0 0-21.17 0L48.11 283.92a16 16 0 0 1-22.59-1.21L4.1 258.89a16 16 0 0 1 1.21-22.59l256-226a39.85 39.85 0 0 1 53.45 0l255.94 226a16 16 0 0 1 1.22 22.59l-21.4 23.82a16 16 0 0 1-22.6 1.2z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "chevron-right"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <g className="fa-group">
                        <path d="M188.74 256l56.78 56.89L91.21 466.9a24 24 0 0 1-33.94 0l-22.7-22.65a23.93 23.93 0 0 1 0-33.84z" className="fa-secondary">
                        </path>
                        <path d="M91.25 45.06l194.33 194a23.93 23.93 0 0 1 0 33.84l-40 40-211-211.34a23.92 23.92 0 0 1 0-33.84l22.7-22.65a24 24 0 0 1 33.97-.01z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        if(this.props.name == "double-chevron-left"){
            return (
                <svg className={"svg "+(this.props.color!=null?this.props.color:"")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <g className="fa-group">
                        <path d="M226.56 239l194-194a23.84 23.84 0 0 1 33.73-.1l.1.1L477 67.7a24.06 24.06 0 0 1 0 33.85L323.36 256l153.58 154.45a23.87 23.87 0 0 1 .1 33.75l-.1.1-22.65 22.7a23.84 23.84 0 0 1-33.73.1l-.1-.1-193.9-194a24.17 24.17 0 0 1 0-34z" className="fa-secondary">
                        </path>
                        <path d="M35 239L229 45a23.84 23.84 0 0 1 33.73-.1l.1.1 22.61 22.7a23.87 23.87 0 0 1 .1 33.75l-.1.1L131.76 256l153.68 154.45a24.06 24.06 0 0 1 0 33.85L262.79 467a23.84 23.84 0 0 1-33.73.1l-.1-.1L35 273a24.17 24.17 0 0 1 0-34z" className="fa-primary">
                        </path>
                    </g>
                </svg>
            )
        }
        return 'err'
    }
}