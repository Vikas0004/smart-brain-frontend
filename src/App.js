import React , {Component} from 'react';
import './App.css';
// const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo.js';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';




// const stub = ClarifaiStub.grpc();

// const metadata = new grpc.Metadata();
// metadata.set("authorization", "Key {7d3f2f8fb9054e61b098513ecb98be94}");
 // Clarifai.FACE_DETECT_MODEL

const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
      input : '',
      imageUrl: '' ,
      box : {},
      route : 'signin',
      isSignedIn : false ,
      user : {
        id : '',
        name : '',
        email : '',
        entries : 0,
        joined : ''
      }
    }
class App extends Component{
  constructor(){
    super();
    this.state = initialState
  }

  loadUser = (data) =>{
    this.setState({user :{
      id : data.id,
      name : data.name,
      email : data.email,
      entries : data.entries,
      joined : data.joined
    }})
  }


   faceLocation = (data) =>{
    const coordinates = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol : coordinates.left_col * width,
      topRow : coordinates.top_row * height,
      rightCol : width - (coordinates.right_col * width),
      bottomRow : height -(coordinates.bottom_row * height)
    }
  }

  setBoxState = (box) =>{
    console.log(box);
    this.setState({box : box});
  }

    onInputChange = (event) =>{
      this.setState({input : event.target.value});
    }

    onButtonClick = () =>{
      this.setState({imageUrl : this.state.input});
	      fetch('https://shielded-shore-33196.herokuapp.com/imageUrl',{
	        method : 'post',
	        headers : {'Content-Type' : 'application/json'},
	        body : JSON.stringify({
	        input : this.state.input
	        })
	    })
	    .then(response => response.json())
        .then((response)=> {
        if(response){
	          fetch('https://shielded-shore-33196.herokuapp.com/image',{
	            method : 'put',
	            headers : {'Content-Type' : 'application/json'},
	            body : JSON.stringify({
	            id : this.state.user.id
	            })
	          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user , {entries : count}))
          })
          .catch(console.log)
        }

        this.setBoxState(this.faceLocation(response))
       })
       .catch((err)=> console.log(err));       
    }

    onRouteChange = (route) =>{
      if(route === 'signOut'){
        this.setState(initialState)
      }else if(route === 'home'){
        this.setState({isSignedIn : true})
      }
      this.setState({route : route})
    }

  render(){
    return(
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedIn = {this.state.isSignedIn} onRouteChange = {this.onRouteChange} />

        {this.state.route === 'home' 
        ? <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
          <ImageLinkForm onInputChange = {this.onInputChange} onButtonClick = {this.onButtonClick} />
        
          <FaceRecognition box = {this.state.box} imageUrl = {this.state.imageUrl}/>
          </div>
        
        :(this.state.route === 'signin'
          ? <SignIn  loadUser={this.loadUser} onRouteChange = {this.onRouteChange} />
          : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
          )          
         } 
      </div>
    );  
  } 
}

export default App;
