import React, { Component } from 'react';
import { Button } from 'antd';
import moment from 'moment'
import FeedItem from '../home/FeedItem';
import { useParams } from 'react-router-dom';
import { Auth } from 'aws-amplify' 
import { createHashHistory } from 'history';

class PublicProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            searchedUsername: "",
            userData: [],
            pageLoaded: false
        }
    }


    componentDidMount() {
        Auth.currentAuthenticatedUser()
        .then((res) => { 
            this.setState({  username: res.attributes.preferred_username });
        })
        .catch(err => console.log(err))

        this.setState({ searchedUsername: this.props.match.params.username });
        this.queryDatabaseForUser(this.props.match.params.username);
        
    }

    queryDatabaseForUser = username => {
        const { searchValue, searchFinished } = this.state;
        const API= `http://localhost:5000/user/${this.props.match.params.username}`;
        console.log(API)
        fetch(API, { method: 'GET', headers: { 'content-type': 'application/json' }})
        .then(res => res.json())
        .then((result) => { this.setState({ userData: result[0], pageLoaded: true }, () => console.log(result) )})
        .catch((err) => { this.setState({ userExists: false}); console.log(err) } );
    }

    checkFollowStatus = (username, searchedUsername) => {
        const API = `http//localhost:5000/user/check-following-status/${username}/${searchedUsername}`
        fetch(API, { method: 'GET' })
        .then(res => res.json())
        .then((result) => { console.log(result)})
        .catch((err) => { console.log(err) } );
    }


    render() {
        const { username, searchedUsername, userData, pageLoaded } = this.state;
        if(pageLoaded === true) {
            this.checkFollowStatus(username, searchedUsername);
            return (
                <React.Fragment>
                <div className="public-profile-container">
                    <h1> {`This is the public profile for ${searchedUsername}`} </h1>
                    <Button onClick={() => console.log(this.state.userData)}> Click Me</Button>
                    <div className="public-profile-header center"></div>
                    <div className="public-profile-information center">
                        <h1> BIO </h1>
                        <div>
                            <div className="public-profile-information-item"> 
                                <p> {userData.name} </p>
                            </div>
                            <div className="public-profile-information-item"> 
                                <p> @{userData.username} </p>
                            </div>
                            <div className="public-profile-information-item"> 
                                <p> Joined {moment(userData.createdAt).format('ll')} </p>
                            </div>
                            <div className="public-profile-information-item"> 
                                <p> {userData.followers.length} followers </p>
                            </div>
                            <div className="public-profile-information-item"> 
                                <p> {userData.following.length} following </p>
                            </div>
                            <div className="public-profile-information-item"> 
                                <p> {userData.posts.length} posts </p>
                            </div>
                            <div className="public-profile-information-item"> 
                                <Button onClick={() => this.checkFollowStatus(username, searchedUsername)}> Follow </Button>
                            </div>
                        </div>
                    </div>
                    <div className="public-profile-posts center"> 
                        {userData.posts.reverse().map(function(post, i) {
                            return (
                                <React.Fragment key={i}>
                                    <div className="profile-post-item" > 
                                        <FeedItem username={post.username} message={post.message} created={post.createdAt}/>
                                    </div>
                                    <br/>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
            </React.Fragment>
            )
        } else {
            return (
                <h1> Loading... </h1>
            )
        }
    }
    

    
}
 
export default PublicProfile;




// render() { 
//     const { username, userData, pageLoaded } = this.props;
//     console.log(pageLoaded)
//     if(pageLoaded === true) {
//         return (
//             <React.Fragment>
//             <div className="public-profile-container">
//                 <h1> {`This is the public profile for ${username}`} </h1>
//                 <Button onClick={() => console.log(this.state.userData)}> Click Me</Button>
//                 <div>
//                     <h1> {userData.name} </h1>
//                     <h1> {userData.createdAt} </h1>
//                     <h1> {userData.username} </h1>
//                 </div>
//             </div>
//         </React.Fragment>
//         )
//     } else {
//         return (
//             <h1> Loading... </h1>
//         )
//     }
// }