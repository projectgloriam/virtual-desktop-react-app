import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './modal.css';
import data from './desktop-data.json';
import reportWebVitals from './reportWebVitals';

const loadDesktop = ()=>{

  const background = data["desktop"];

  const apps = data["apps"];

  const gridSize = data["gridSize"];

  const theme = data["theme"];

  const taskbarAlpha = data["taskbarAlpha"];

  const taskbarColor = data["taskbarColor"];

  const taskbarWidgets = data["taskbarWidgets"];

  const startMenu = data["startMenu"];

  const desktop = (
    <Desktop background={background} apps={apps} gridcount={gridSize} theme={theme} startmenu={startMenu} taskbaralpha={taskbarAlpha} taskbarcolor={taskbarColor} taskbarwidgets={taskbarWidgets} />
  );

  showDOM(desktop);

}

//Desktop with background
class Desktop extends React.Component{
  constructor(props){
    super(props);
    this.openApp = this.openApp.bind(this);
    this.closeApp = this.closeApp.bind(this);
    this.state = {displayApp: 'none', appTitle: '', appImage: ''};
  }

  componentDidMount(){
    // When the user clicks anywhere outside of the modal, close it
    var desktopComponent = this;
    window.onclick = function(event) {
      desktopComponent.closeApp();
    }
  }

    //Open App
  openApp(title, image){
    this.setState({displayApp: 'block', appTitle: title, appImage: image});
  }
  
  //Close App
  closeApp(){
    this.setState({displayApp: 'none'});
  }

  render(){
    var x = 1;
    var y = 1;

    //Grid function for Array map function
    let gridFunction = (app)=>{
      let left = x; //assigned values before incrementing them
      let top = y;
      let xoffset = 10;
      let yoffset = 10;

      if(x>1){
        xoffset = 54;
      } else {
        xoffset = 10;
      }

      if(y>1){
        yoffset = 90;
      } else {
        yoffset = 10;
      }

      if(x <= this.props.gridcount){

        x++; //If the row count isn't reached, then keep adding icons in a row
      } else {
        
        x=0;
        y++;
      }


      //Fetching list of Apps
      return(<AppIcon icon={app["icon"]} title={app["title"]} window={app["window"]} appid={app["app-id"]} gridx={xoffset * left} gridy={yoffset * top} onOpen={this.openApp} />);
    }

    const appList = this.props.apps.map(gridFunction);

    const start_menu = (<Widget startmenu={true}><img id="start-menu" src={process.env.PUBLIC_URL + "images/" + this.props.startmenu}/></Widget>);
    const clock_widget = (<Widget><Clock color={this.props.taskbarcolor}/></Widget>);
    const widgets = this.props.taskbarwidgets.map((wid)=> 
      <Widget title={wid["title"]} window={wid["window"]} ><img src={process.env.PUBLIC_URL + "images/" + wid["image"]}/></Widget>
    );

    return(
      <div id="wallpaper" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "images/" + this.props.background})`}} >
        {appList}
        <App display={this.state.displayApp} title={this.state.appTitle} window={this.state.appImage} onClose={this.closeApp} theme={this.props.theme}/>
        <TaskBar opacity={this.props.taskbaralpha} theme={this.props.theme} left={start_menu} middle={widgets} right={clock_widget} />
      </div>
    );
  }

}

//App Icon
class AppIcon extends React.Component{
  constructor(props){
    super(props);
    this.processApp = this.processApp.bind(this);
    this.dragElement = this.dragElement.bind(this);
    this.state = {top: this.props.gridy+"pt", left: this.props.gridx+"pt"};
  }

  dragElement(elmnt){
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var appIcon = this;
    if (elmnt) {
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      console.log("mouse x:"+e.clientX+", mouse y:"+e.clientY);
      //appIcon.setState({top: (elmnt.offsetTop - pos2) + "pt", left: (elmnt.offsetLeft - pos1) + "pt"});
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  componentDidMount(){
    this.dragElement(document.getElementById(this.props.appid));
  }

  //Pass App parameters to parent object to handle opening App
  processApp(){
    this.props.onOpen(this.props.title, this.props.window);
  }

  render(){
    return (
      <div id={this.props.appid} className="appIcon" onDoubleClick={this.processApp} style={{top: this.state.top, left: this.state.left}}>
        <img src={process.env.PUBLIC_URL + "images/" + this.props.icon} />
        <div className="appTitle">{this.props.title}</div>
      </div>
    );
  }
}


//App
class App extends React.Component{
  constructor(props){
    super(props);
    this.clickCloseButton = this.clickCloseButton.bind(this);
  }
  
  //Close App (Modal) 
  clickCloseButton(){
    this.props.onClose();
  }

  render(){

    return(
      //Depending the state, it'll display or not display the modal
      <div id="app" className="modal" style={{display: this.props.display}} >
       <div className="modal-content">
        <div className="modal-header" style={{backgroundColor: this.props.theme}}>
          <span className="close" onClick={this.clickCloseButton}>&times;</span>
          <h3>{this.props.title}</h3>
        </div>
        <div className="modal-body" style={{backgroundColor: this.props.theme}}>
          <img id="windowExplorer" src={process.env.PUBLIC_URL + "images/" + this.props.window} />        
        </div>
        <div className="modal-footer" style={{backgroundColor: this.props.theme}}>
        </div>
       </div>
      </div>
    );
  }
}

//Taskbar
class TaskBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {date: new Date()};
  }
  render(){

    var gridTemplateColumns = "";
    var i = 0;

    while (i < this.props.middle.length) {
      gridTemplateColumns += " 60px";
      i++;
    }

    const gridStyle = {
      gridTemplateColumns: gridTemplateColumns
    }

    return(
      <div className="taskBar" style={{backgroundColor: this.props.theme, opacity: this.props.opacity / 100}} >
        <div className="taskbar-left">
          {this.props.left}
        </div>

        <div className="taskbar-middle" style={gridStyle}>
          {this.props.middle}
        </div>

        <div className="taskbar-right">
          {this.props.right}
        </div>
      </div>
    );
  }

}


//Widget
class Widget extends React.Component{
  constructor(props){
    super(props);
  }

  render(){

    const startMenuStyle = {
      margin: this.props.startmenu? 0 : 4,
      marginLeft: this.props.startmenu? 3 : 0
    };

    return(
      <div className="widget" style={startMenuStyle}>{this.props.children}</div>
    );
  }
}



//Clock widget
class Clock extends React.Component{
  constructor(props){
    super(props);
    this.state = {date: new Date()};
  }
  render(){
    return(
      <p style={{color: this.props.color}}>{this.state.date.toLocaleTimeString()}</p>
    );
  }

  componentDidMount(){
    this.timerID = setInterval(
      ()=>this.tick(),
      1000
    );
  }

  componentWillUnmount(){
    clearInterval(this.timerID);
  }

  tick (){
    this.setState({
      date: new Date()
    });
  }

}

//Render React DOM

const showDOM = (jsx)=>{
  ReactDOM.render(
    (
      jsx
    ), 
    document.getElementById('root')
  );
}

//Load Desktop
loadDesktop();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
