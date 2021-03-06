import React, { Component } from 'react';
import { Input, Button, Modal } from 'antd';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import PublicProfile from '../profile/PublicProfile'
import Feed from './Feed'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            searchFinished: false,
            userExists: false,
            modalTime: 5,
            searchedUser: ''
        }
    }

    componentDidMount() {
        const object = {
            name: this.props.name,
            username: this.props.username
        }
        this.sendPOSTRequest(object);
    }

    sendPOSTRequest(user) {
        const API="http://localhost:5000/user/"
        fetch(API, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    searchForUser = username => {
        console.log(`Searching for user ${username}`)
        const { searchValue, searchFinished, searchedUser } = this.state;
        this.setState({ userExists: false })
        this.queryDatabaseForUser(username);
        console.log(searchedUser);
        console.log("Done")
    }

    queryDatabaseForUser = async username => {
        const { searchValue, searchFinished } = this.state;
        const submittedUsername = username;
        const API= `http://localhost:5000/user/${username}`;
        console.log(API)
        fetch(API, { method: 'GET' })
        .then(res => res.json())
        .then((result) => { this.setState({ searchFinished: true, userExists: result.length > 0 !== true ? false : true, searchedUser: searchValue}, 
            () => {  } )})
        .catch((err) => { this.setState({ userExists: false}); console.log(err) } );
    }
    
    render() {
        const { searchValue, userExists, searchFinished, searchedUser } = this.state;
        return (
            <React.Fragment>
                    <div className="home-container" style={{ paddingTop: "50px"}}>
                        <Link to={`/u/${searchedUser}`} style={{ marginLeft: "20px"}}> 
                            <h1 className={userExists === true ? 'home-user-found' : 'home-user-not-found'}>{userExists === true ? `Visit ${searchedUser}'s Profile` : ''}</h1> 
                        </Link>
                        <div className="home-search-bar">
                            <Input placeholder="Search for user" style={{ width: "250px"}}  onSelect={(value) => this.setState({ searchValue: value.target.value, searchFinished: false })}/>
                            <Button onClick={() => { this.searchForUser(searchValue) }}>Search</Button>
                        </div>
                        <div className="home-feed">
                            <Feed />
                        </div>
                    </div>
                    <Route path="/u/:username"> <PublicProfile username={searchValue}/> </Route>  
            </React.Fragment>
        );
    }
}

export default Home;