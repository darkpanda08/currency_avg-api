# Currency Rate Average API

An API that calculates the Average of currency exchange rates for a given date range. Users provide Date Range and List of currencies for which average is required. Users are allowed to enter a minimum date from 01-01-2000. And maximum date till today.
The Result displayed has a List of currencies with their Average and the range provided.    
<br/><br/>
The API is written in NodeJS and uses Express framework. It has test cases which checks for the possible errors automatically in the code using Chai and Mocha library. It uses Github Actions for the CI/CD pipeline. The Github Actions generates the Docker image of the application upon successful test and pushes that image to Heroku to deploy.

## Ussage
> Base URL: https://currency-avg.herokuapp.com
```
GET /?currency=<currency>&fromdate=<start_date>&todate=<end_date>
```
> Note: As Heroku shuts down the aplication after 30mins of inactivity, the first request may take more time because the application has to start again.

## Query Params
|     Param Name  |                       Description                               |
| ----------------| ----------------------------------------------------------------|
| currency        | Short Notation of currency seperated by commas. eg INR,USD,GBP  |
| fromdate        | Start Date in format YYYY-MM-DD                                 |
| todate          | End Date in format YYYY-MM-DD                                   |

- The From date should be less than the To date
- From date not before than 2000-01-01
- To date should not be a future date

If above points are not taken care of, the API will give the response with the description of error.

To test the API in Postman [Click Here](https://www.postman.com/darkpanda08/workspace/khabri-assignment-api/overview)
