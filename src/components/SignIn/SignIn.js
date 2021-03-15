import React from 'react';

class SignIn extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			SignInEmail : '',
			SignInPassword : ''
		}
	}
	onEmailChange = (event) =>{
		this.setState({SignInEmail : event.target.value })
	} 
	onPasswordChange = (event) =>{
		this.setState({SignInPassword : event.target.value })
	}
	onSubmit = () =>{
		fetch('https://shielded-shore-33196.herokuapp.com/signin',{
			method : 'post',
			headers : {'Content-Type' : 'application/json'},
			body : JSON.stringify({
				email : this.state.SignInEmail,
				password : this.state.SignInPassword
			})
		}).then(response => response.json())
		  .then(user =>{
		  	if(user.id){  
		  		this.props.loadUser(user);
		  		this.props.onRouteChange('home');
		  	}
		  })
	}
	render(){
		const { onRouteChange , loaduser } = this.props;
		return(
		<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
			<main className="pa4 black-80">
			  <div className="measure">
			    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
			      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
			      <div className="mt3">
			        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
			        <input 
			        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
			        type="email" 
			        name="email-address"  
			        id="email-address"
			        onChange = {this.onEmailChange} />
			      </div>
			      <div className="mv3">
			        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
			        <input 
			        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
			        type="password" 
			        name="password"  
			        id="password"
			        onChange = {this.onPasswordChange} />
			      </div>
			      <label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox" /> Remember me </label>
			    </fieldset>
			    <div className="">
			      <input 
			      onClick = {this.onSubmit}
			      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
			      type="submit" 
			      value="Sign in" />
			    </div>
			    <div className="lh-copy mt3">
			      <a  onClick = {() => onRouteChange('Register')} href="#0" className="f6 link dim black db pointer">Register</a>
			    </div>
			  </div>
			</main>
		</article>
	);
	}
}

export default SignIn;