import React from "react";
import {nanoid} from 'nanoid';
import {getDatabase, child, ref, set, get} from "firebase/database";
import {isWebUri} from 'valid-url';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from "react-bootstrap/Tooltip";

class Form extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state =  {
            longURL: '',
            preferedAlias: '',
            generatedURL: '',
            loading: false,
            errors: [],
            errorMessage: {},
            toolTipMessage: 'Copy To Clip Board'
        };
    }

    //When user clicks submit, this is called
    OnSubmit = async(event) => 
    {
        event.preventDefault(); //Prevents page from reloading when submit is clicked
        this.setState({
            loading: true,
            generatedURL: ''
        })

        //Validate entered input
        var isFormValid = await this.ValidateInput()
        
        if (!isFormValid) 
        {
            return
        }

        //If the user inputs an extension use it, if not generate
        var generateKey = nanoid(5);
        var generatedURL = " " + generateKey

        if (this.state.preferedAlias !== '')
        {
            generateKey = this.state.preferedAlias
            generatedURL = " " + this.state.preferedAlias
        }

        const db = getDatabase(); //DB reference
        set(ref(db, '/' + generateKey), { //Set DB ref values
            generateKey: generateKey,
            longURL: this.state.longURL,
            preferedAlias: this.state.preferedAlias,
            generatedURL: generatedURL
        }).then((result) => {
            this.setState({
                generatedURL: generatedURL,
                loading: false
            })
        }).catch((e) => {
            //handle error
        })
    }

    //Checks if field has any error
    HasError = (key) => {
        return this.state.errors.indexOf(key) !== -1;
    }

    //Save content of form as user is typing
    HandleChange = (e) => {
        const {id, value} = e.target
        this.setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    ValidateInput = async () => {
        var errors = [];
        var errorMessage = this.state.errorMessage

        //Validate long url
        if (this.state.longURL.length === 0) {
            errors.push("longURL");
            errorMessage['longURL'] = 'Please enter your URL!';
        } else if (!isWebUri(this.state.longURL)) {
            errors.push("longURL");
            errorMessage['longURL'] = 'Please use a URL in the form of https://www...';
        }

        //Preferred Alias
        if (this.state.preferedAlias !== '') {
            if (this.state.preferedAlias.length > 7) {
                errors.push("suggestedAlias");
                errorMessage['suggestedAlias'] = 'Please enter an alias less than 7 characters';
            } else if (this.state.preferedAlias.indexOf(' ') >= 0) {
                errors.push("suggestedAlias");
                errorMessage['suggestedAlias'] = 'Spaces are not allowed in URLs';
            }

            var keyExists = await this.CheckKeyExists()

            if (keyExists.exists()) {
                errors.push("suggestedAlias");
                errorMessage['suggestedAlias'] = 'This alias already exist. Please choose another';
            }
        }
        this.setState({
            errors: errors,
            errorMessage: errorMessage,
            loading: false
        });

        if (errors.length > 0) {
            return false;
        }

        return true;
    }

    CheckKeyExists = async () => {
        const dbRef = ref(getDatabase());
        return get(child(dbRef, `/${this.state.preferedAlias}`)).catch((error) => {
            return false;
        });
    }

    CopyToClipboard = () => {
        navigator.clipboard.writeText(this.state.generatedURL)
        this.setState({
            toolTipMessage: 'Copied!'
        })
    }

    render() {
        return (
            <div className="container">
                <form autoComplete="off">
                    <h3>Owi's URL Shortener Demo</h3>

                    <div className="form-group">
                        <label>Enter your URL</label>
                            <input id="longURL" onChange={this.HandleChange} value={this.state.longURL} type="url" required className={this.HasError("longURL")? "form-control is-invalid" : "form-control"} placeholder="https://www..."/>
                    <div className={this.HasError("longURL") ? "text-danger" : "visually-hidden"}>
                        {this.state.errorMessage.longURL}
                    </div>
                    <div className="form-group">
                        <label htmlFor="basic-url">Your Shortened URL</label>
                        <div className="input-group mb-3">
                            <span className="input-group-text">surl.com/</span>
                        </div>
                        <input id="preferedAlias" onChange={this.HandleChange} value={this.state.preferedAlias} className={this.HasError("preferedAlias") ? "form-control is-invalid" : "form-control"} type="text" placeholder="ex. 7kn14 (Optional)"/>
                    </div>
                    <div className={this.HasError("preferedAlias") ? "text-danger" : "visually-hidden"}>
                        {this.state.errorMessage.suggestedAlias}
                    </div>
                    </div>

                    <button className="btn btn-primary" type="button" onClick={this.OnSubmit}>
                        {
                            this.state.loading ?
                            <div>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </div> :
                            <div>
                                <span className="visually-hidden spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span>Simplify</span>
                            </div>
                        }
                    </button>

                    {
                        this.state.generatedURL === '' ?
                        <div></div>
                        :
                        <div className="generatedURL">
                            <span>Your generated URL is: </span>
                            <div className="input-group mb-3">
                                <input disabled type="text" value={this.state.generatedURL} className="form-control" placeholder="Rec un" aria-label="Rec UN" aria-describedby="basic-addon2"/>
                                <div className="input-group-append">
                                    <OverlayTrigger key={'top'} placement={'top'} overlay={<Tooltip id={`tooltip-${'top'}`}>{this.state.toolTipMessage}</Tooltip>}>
                                        <button onClick={() => this.CopyToClipboard()} data-toggle="tooltip" data-placement="top" title="Tooltip on Top" className="btn btn-outline-secondary" type="button"></button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </div>
                    }
                </form>
            </div>
        );
    }
}

export default Form;