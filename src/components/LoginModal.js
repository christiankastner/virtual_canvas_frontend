import React from 'react'
import { Header, Modal , Form, Divider, Icon} from 'semantic-ui-react'

class LoginModal extends React.Component {
    constructor(props) {
        super(props)
        this.state ={
            login: {
                email: "",
                password: ""
            },
            signup: {
                email: "",
                name: "",
                password: ""
            }
        }
    }

    handleOnSignupChange = (event) => {
        event.persist()
        this.setState(prevState => {
            return {
                signup: {
                    ...prevState.signup,
                    [event.target.id]: event.target.value
                }
            }
        })
    }

    handleLoginClick = () => {
        this.props.handleOnLogin(this.state.login)
    }

    handleSignupClick = () => {
        this.props.handleOnSignup(this.state.signup)
    }

    handleOnLoginChange = (event) => {
        this.setState({
            login: {
                    ...this.state.login,
                    [event.target.id]: event.target.value
                }
        })
    }

    render() {
        return (
            <Modal open={this.props.modal} closeOnDimmerClick={true} onClose={this.props.toggleModal} size="small">
                <Modal.Header><Icon name="times" onClick={this.props.toggleModal}/>Log in/Sign up</Modal.Header>
                <Modal.Content image>
                <Modal.Description>
                    <h4 style={{color: "red"}}>{this.props.message}</h4>
                    <Form onChange={this.handleOnLoginChange} key="login">
                        <Form.Field >
                            <label>Email</label>
                            <input placeholder="Email" id="email"/>
                        </Form.Field>
                        <Form.Field >
                            <label>Password</label>
                            <input type="password" placeholder="Password" id="password"/>
                        </Form.Field>
                        <Form.Button onClick={this.handleLoginClick} className="login" fluid={true} color="green">Login</Form.Button>
                    </Form>
                    <Divider horizontal>Or</Divider>
                    <Header>Sign Up</Header>
                    <Form onChange={this.handleOnSignupChange} key="signup">
                    <Form.Field >
                            <label>Name</label>
                            <input placeholder="Name" id="name"/>
                        </Form.Field>
                    <Form.Field >
                            <label>Email</label>
                            <input placeholder="Email" id="email"/>
                        </Form.Field>
                        <Form.Field >
                            <label>Password</label>
                            <input type="password" placeholder="Password" id="password"/>
                        </Form.Field>
                        <Form.Button className="login" onClick={this.handleSignupClick} fluid={true} color="yellow">Sign Up</Form.Button>
                    </Form>
                </Modal.Description>
                </Modal.Content>
            </Modal>
        )
    }
}

export default LoginModal