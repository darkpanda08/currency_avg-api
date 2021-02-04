const express = require('express')
const moment = require('moment')
const axios = require('axios');

const app = express()

// Bodyparser
app.use(express.json())

// Suppress MomentJS Deprecation Warning
moment.suppressDeprecationWarnings = true;

var base_url = 'https://api.exchangeratesapi.io/history'

// Main Route
app.get('/', async (req, res) => {
    let error = []
    let avg_out = {}
    let final_output = []
    let today_date = moment().format('YYYY-MM-DD');

    // Input Validations 
    if (!moment(req.query.fromdate, "YYYY-MM-DD",true).isValid()) {
        error.push("The From Date is not in format YYYY-MM-DD.")
    }
    if (!moment(req.query.todate, "YYYY-MM-DD",true).isValid()) {
        error.push("The To Date is not in format YYYY-MM-DD.")
    } 
    if (moment(today_date).diff(req.query.todate) < 0) {
        error.push("The To Date should not be future date.")
    }
    if (!req.query.currency) {
        error.push("Please provide atleast one currency.")
    }

    // Check if any error exists
    if (error.length > 0) {
        return res.status(422).json({ "Error": error })
    }

    // Check if from date is before 2000-01-01
    if (moment(req.query.fromdate).diff(moment('2000-01-01'), 'days') < 0 ) {
        return res.status(422).json({ "Error": "From Date should not be less than 2000-01-01" })
    }

    // Check if to date is greater than from date
    let diff_d = moment(req.query.todate).diff(moment(req.query.fromdate), 'days') + 1;
    if(diff_d <= 0) {
        return res.status(422).json({"Error": "The To Date should be greater than From Date."})
    }

    try {
        const response = await axios.get(`${base_url}?start_at=${req.query.fromdate}&end_at=${req.query.todate}&symbols=${req.query.currency}`)
        
        // Initialize JSON
        for(dates in response.data.rates) {
            for (curr in response.data.rates[dates]) {
                avg_out[curr] = 0
            }
        }

        // Add all the values to currency key in JSON
        for(dates in response.data.rates) {
            for (curr in response.data.rates[dates]) {
                avg_out[curr] += response.data.rates[dates][curr]
            }
        }

        // Find the average
        for (out_curr in avg_out) {
            avg_out[out_curr] = parseFloat((avg_out[out_curr]/(Object.keys(response.data.rates).length)).toFixed(3))
        }

        // Final output
        final_output.push(avg_out, {"From Date":req.query.fromdate, "To Date":req.query.todate})
        
        return res.status(200).json(final_output)

    } catch (err) {
        return res.status(500).json({ "Error": "Something went wrong" })
    }
})

const PORT = process.env.PORT || 5000

app.listen(PORT , console.log(`Server running on http://localhost:${PORT}/`))

module.exports = app;
