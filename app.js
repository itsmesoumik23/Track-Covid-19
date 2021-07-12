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
    globalTotalConfirmed = 0;
    globalTotalDeaths = 0;
    globalTotalRecovered = 0;

    https.get('https://api.covid19api.com/summary', function(response){
        // var chunks = []
        var Items = ''
        
        response.on("data", function(data){
            Items += data;
        })

        response.on("end", function(){
            // const body = Buffer.concat(chunks)
            try{
                var mainData = JSON.parse(Items)
                globalTotalConfirmed = mainData.Global.TotalConfirmed
                globalTotalRecovered = mainData.Global.TotalRecovered
                globalTotalDeaths = mainData.Global.TotalDeaths
                
                function comparator(a, b){
                    return a-b
                }

                var i = 0;
                var all = new Array();
                const topFive = new Array();
                var j = 0
                // console.log(mainData.Countries.length);
                while (j < 192){
                    all.push(Number(mainData.Countries[j].TotalConfirmed))
                    j++;
                }
                // console.log(all);
                var sorted = all.sort((a, b)=>{
                    return b-a;
                })
                // console.log(sorted);
                // console.log(all);
                // console.log(all.length);
                x = 0
                while (x < 5){
                    topFive.push(all[x])
                    x++;
                }
                console.log(topFive);
                if (nc !== ""){
                    while (i < 192) {
                        if ((mainData.Countries[i].Slug).toLowerCase().indexOf(nc.toLowerCase()) !== -1){
                            flag = 0;
                            breakCalled=true
                            break
                        }
                        i = i + 1;
                    }
                }
                if (i === 192){
                    i = 0;
                    searchMiss = true;
                }

                // const countryNewConfirmed = data.Countries[i].NewConfirmed
                countryTotalConfirmed = mainData.Countries[i].TotalConfirmed
                // const countryNewDeaths = data.Countries[i].NewDeaths
                countryTotalDeaths = mainData.Countries[i].TotalDeaths
                // const countryNewRecovered = data.Countries[i].NewRecovered
                countryTotalRecovered = mainData.Countries[i].TotalRecovered
                const CN = mainData.Countries[i].Country
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
    // console.log(nc);
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
})
