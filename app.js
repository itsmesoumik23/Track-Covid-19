const express = require("express")
const bodyParser = require("body-parser")
const https = require("https")
const app = express()
var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/css/favicon.png'));

var nc=""
var flag;
var searchMiss = false;
var countryNewConfirmed, countryTotalConfirmed, countryNewDeaths, countryTotalDeaths, countryNewRecovered, countryTotalRecovered, globalNewConfirmed, globalTotalConfirmed, globalNewDeaths, globalTotalDeaths, globalNewRecovered, globalTotalRecovered;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))



app.get("/", function(req, res){

    var request = https.request('https://api.covid19api.com/summary', function(response){
        var chunks = []
        
        response.on("data", function(chunk){
            chunks.push(chunk)
        })

        response.on("end", function(chunk){
            var body = Buffer.concat(chunks)
            try{
                data = JSON.parse(body)
            } catch (error){
                const data = body.toString()
                console.log(data);
            }
            

            const globalNewConfirmed = data.Global.NewConfirmed
            const globalTotalConfirmed = data.Global.TotalConfirmed
            const globalNewDeaths = data.Global.NewDeaths
            const globalTotalDeaths = data.Global.TotalDeaths
            const globalNewRecovered = data.Global.NewRecovered
            const globalTotalRecovered = data.Global.TotalRecovered
            console.log(data.Countries.length);

            var i = 0;
            if (nc !== ""){
                while (i < 191) {
                    if ((data.Countries[i].Slug).toLowerCase().indexOf(nc.toLowerCase()) !== -1){
                        flag = 0;
                        breakCalled=true
                        break
                    }
                    i = i + 1;
                }
            }
            if (i === 191){
                i = 0;
                searchMiss = true;
            }

            const countryNewConfirmed = data.Countries[i].NewConfirmed
            const countryTotalConfirmed = data.Countries[i].TotalConfirmed
            const countryNewDeaths = data.Countries[i].NewDeaths
            const countryTotalDeaths = data.Countries[i].TotalDeaths
            const countryNewRecovered = data.Countries[i].NewRecovered
            const countryTotalRecovered = data.Countries[i].TotalRecovered
            const CN = data.Countries[i].Country
            if (nc !== ""){
                nc = ""
                i = 0
                if (searchMiss === false){
                res.render("list", {searchMiss: searchMiss , flag:flag, countryName: CN , gnc: globalNewConfirmed, gtc: globalTotalConfirmed, gnd: globalNewDeaths, gtd: globalTotalDeaths, gnr: globalNewRecovered, gtr: globalTotalRecovered, cnc: countryNewConfirmed, ctc: countryTotalConfirmed, cnd: countryNewDeaths, ctd: countryTotalDeaths, cnr: countryNewRecovered, ctr: countryTotalRecovered })
                searchMiss = false
                flag=-1
                } else {
                    res.render("list", {searchMiss: searchMiss , flag:flag, countryName: CN , gnc: globalNewConfirmed, gtc: globalTotalConfirmed, gnd: globalNewDeaths, gtd: globalTotalDeaths, gnr: globalNewRecovered, gtr: globalTotalRecovered, cnc: "", ctc: "", cnd: "", ctd: "", cnr: "", ctr: ""})
                    flag=-1
                    searchMiss = false

                }
            } else {
                nc = ""
                i = 0
                res.render("list", {searchMiss: searchMiss , flag:flag, countryName: "" , gnc: globalNewConfirmed, gtc: globalTotalConfirmed, gnd: globalNewDeaths, gtd: globalTotalDeaths, gnr: globalNewRecovered, gtr: globalTotalRecovered, cnc: "", ctc: "", cnd: "", ctd: "", cnr: "", ctr: "" })
                flag=-1
            }

        })

        response.on("error", function(error){
            console.log(error);
        })
    })
    request.end()
    // res.sendFile(__dirname+"/index.html")
    
})

app.post("/", function(req, res){
    nc = req.body.InputCountry
    // console.log(nc);
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
})
