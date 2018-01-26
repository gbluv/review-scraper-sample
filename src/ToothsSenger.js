import React, {Component} from 'react';
import axios from 'axios';

import {
  downloadCSV,
  parseResponse
} from './functions/scrapeFunctions';

//https://www.upwork.com/ab/proposals/953006270098407425

const mainUrl = "https://www.toothssenger.com/118276-ofallon-dentist-dr-edward-logan";

export default class extends Component {

  state = {
    reviews: []
  };

  componentDidMount(){

    const addReviews = response =>{

      this.setState({
        reviews: parseResponse(response)
      });
    };

    axios
        .get(mainUrl)
        .then(response => addReviews(response), () =>{
          axios
              .get("/118276-ofallon-dentist-dr-edward-logan.htm")
              .then(response => addReviews(response))
        });
  }


  render(){
    const downloadWithCSVFormat = downloadCSV('reviews.csv');
    const listOfItems = (review) =>

        <div className={"card"}>

          <h1>{review.name},{review.datePublished}</h1>

          <h2>Review Body</h2>
          <p>
            {review.reviewBody}
          </p>
          <h2>About Front Desk</h2>
          <p>
            {review[ "AboutFrontDesk" ]}
          </p>
          <h2>About Hygenist</h2>
          <p>
            {review[ "AboutHygienist" ]}
          </p>
        </div>;


    const listOfReviews = this.state.reviews.map((review, i) => (

            <ul key={i}>
              {listOfItems(review)}
            </ul>

        )
    );


    return (
        <div className={"container"}>

          <div className={"row"}>
            <div className={"col l8 m8 s8"}>
              <h3>
                This is scrape result
              </h3>
              <h4>
                <a style={{ cursor: 'pointer' }} onClick={() => downloadWithCSVFormat(this.state.reviews)}>Download
                  CSV</a>
              </h4>
              <div className={"reviews"}>
                {this.state.reviews.length ? listOfReviews : <h5>"loading..."</h5>}
              </div>


            </div>
            <div className={"col l4 m4 s4"}>
              <h3> This is the page we're scraping</h3>
              <iframe title={"toothssenger"} style={{ height: '500px' }} src={mainUrl}></iframe>
            </div>
          </div>
        </div>
    )

  }
}

/* downloadCSV({ filename: "stock-data.csv" }); */
