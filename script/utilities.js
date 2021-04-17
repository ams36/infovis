// Prototype Injection
// javascript magic I learned at:
if (!String.prototype.capitalise){
    String.prototype.capitalise = function(){
        return this.charAt(0).toUpperCase() + this.substring(1)
    }
}

var netflixColor = '#B20710'
// var huluColor = '#1CE783'
var huluColor = '#3DBB3D'
var disneyColor = '#006E99'
var primeColor = '#00A8E1'

// colour of each platform
var colorMap = {
    netflix: netflixColor,
    netflix_PrimeHulu: netflixColor,
    netflix_DisneyHulu: netflixColor,
    netflix_DisneyPrime: netflixColor,
    hulu: huluColor,
    hulu_NetflixDisney: huluColor,
    hulu_PrimeDisney: huluColor,
    hulu_NetflixPrime: huluColor,
    disney: disneyColor,
    disney_NetflixHulu: disneyColor,
    disney_PrimeHulu: disneyColor,
    disney_NetflixPrime: disneyColor,
    prime: primeColor,
    prime_NetflixHulu: primeColor,
    prime_DisneyHulu: primeColor,
    prime_NetflixDisney: primeColor

};

var tooltip

window.addEventListener("DOMContentLoaded", () => {
   tooltip = d3.select("body").append("div").attr("class", "toolTip");
})

var formatValue = d3.format("1")