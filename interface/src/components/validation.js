import React,{Component} from 'react'
import axios from 'axios'

class Validation extends Component{
    constructor(props){
      super(props);
    }
    state = {
        isLoading: true,
        users: [],
        error: null
      }
      componentDidMount() {
        this.fetchUsers();
        console.log(this.props.fileList.fileList.experiments)
      }
      fetchUsers() {
        // Where we're fetching data from
        const formData = new FormData();
        const file= this.props.fileList.fileList.experiments;
        formData.append('fileName',file,"experiments.csv")
        axios({
          method: 'post',
          headers: {
              'Content-Type': 'multipart/form-data',
          },
          data: formData,
          url: 'http://localhost:6001/experiments?username=guestuser'
      })
          // We get the API response and receive data in JSON format...
          .then(response => console.log(response.data))
          // ...then we update the users state
          .then(data =>
            this.setState({
              users: data,
              isLoading: false,
            })
          )
          // Catch any errors we hit and update the app
          .catch(error => this.setState({ error, isLoading: false }));
      }
    
        render() {
            const { isLoading, users, error } = this.state;
            return (
              <React.Fragment>
                <h1>Random User</h1>
                // Display a message if we encounter an error
                {error ? <p>{error.message}</p> : null}
                // Here's our data check
                
              </React.Fragment>
            );
          }
}

export default Validation