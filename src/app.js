const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000 //Heroku

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Rahmetullah'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Rahmetullah'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help!',
        name: 'Rahmetullah',
        helpText: 'This is some helpful text.'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'Address Missing'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        })
    })

})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Help',
        name: 'Rahmetullah',
        errorMessage: 'Article Not Exists.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Rahmetullah',
        errorMessage: 'Page Not Exists.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' +  port)
})