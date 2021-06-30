const express = require("express")
const bodyParser = require("body-parser")
const https = require("https")
const app = express()
var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/css/favicon.png'));

var nc=""
var flag;
var CN = ""
var searchMiss = false;
var countryTotalConfirmed, countryTotalDeaths, countryTotalRecovered, globalTotalConfirmed=0, globalTotalDeaths=0, globalTotalRecovered=0;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))


app.get("/", function(req, res){

    https.get('https://www.trackcorona.live/api/countries', function(response){
        var Items = ''
        response.on("data", function(data){
            Items += data;
        })
        response.on("end", function(){
            try{
                var mainData = JSON.parse(Items)
                var j = 0
                while (j < 230){
                    globalTotalConfirmed = globalTotalConfirmed + mainData.data[j].confirmed
                    globalTotalDeaths = globalTotalDeaths + mainData.data[j].dead
                    globalTotalRecovered = globalTotalRecovered + mainData.data[j].recovered
                    j = j+1
                }
                console.log(mainData.data.length, globalTotalConfirmed, globalTotalDeaths, globalTotalRecovered);
                var i = 0;
                if (nc !== ""){
                    while (i < 230) {
                        if ((mainData.data[i].location).toLowerCase().indexOf(nc.toLowerCase()) !== -1){
                            flag = 0;
                            breakCalled=true
                            break
                        }
                        i = i + 1;
                    }
                }
                if (i === 230){
                    i = 0;
                    searchMiss = true;
                }
                countryTotalConfirmed = mainData.data[i].confirmed
                countryTotalDeaths = mainData.data[i].dead
                countryTotalRecovered = mainData.data[i].recovered
                const CN = mainData.data[i].location
                if (nc !== ""){
                    nc = ""
                    i = 0
                    if (searchMiss === false){
                    res.render("list", {searchMiss: searchMiss , flag:flag, countryName: CN , gtc: globalTotalConfirmed, gtd: globalTotalDeaths, gtr: globalTotalRecovered, ctc: countryTotalConfirmed, ctd: countryTotalDeaths, ctr: countryTotalRecovered })
                    searchMiss = false
                    flag=-1
                    } else {
                        res.render("list", {searchMiss: searchMiss , flag:flag, countryName: CN , gtc: globalTotalConfirmed, gtd: globalTotalDeaths, gtr: globalTotalRecovered, ctc: "", ctd: "", ctr: ""})
                        flag=-1
                        searchMiss = false

                    }
                } else {
                    nc = ""
                    i = 0
                    res.render("list", {searchMiss: searchMiss , flag:flag, countryName: "" , gtc: globalTotalConfirmed, gtd: globalTotalDeaths, gtr: globalTotalRecovered, ctc: "", ctd: "", ctr: "" })
                    flag=-1
            }
            } catch (error){
                const data = Items.toString()
                console.log(data);
            } 

        })

        response.on("error", function(error){
            console.log(error);
        })
    })
    
})

app.post("/", function(req, res){
    nc = req.body.InputCountry
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
})
