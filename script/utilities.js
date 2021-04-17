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

var stackSVG = `<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0L3 7L4.63 8.27L12 14L19.36 8.27L21 7L12 0M19.37 10.73L12 16.47L4.62 10.74L3 12L12 19L21 12L19.37 10.73M19.37 15.73L12 21.47L4.62 15.74L3 17L12 24L21 17L19.37 15.73Z" /></svg>`
var rhombusSVG = `<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C11.5 2 11 2.19 10.59 2.59L7.29 5.88L12 10.58L16.71 5.88L13.41 2.59C13 2.19 12.5 2 12 2M5.88 7.29L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L5.88 16.71L10.58 12L5.88 7.29M18.12 7.29L13.42 12L18.12 16.71L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L18.12 7.29M12 13.42L7.29 18.12L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L16.71 18.12L12 13.42Z" /></svg>`
var leftArrowSVG = `<svg style="width:30px;height:30px" viewBox="0 0 24 24"><path fill="currentColor" d="M18,11V13H10L13.5,16.5L12.08,17.92L6.16,12L12.08,6.08L13.5,7.5L10,11H18M2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12M4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12Z" /></svg>`
var rightArrowSVG =  `<svg style="width:30px;height:30px" viewBox="0 0 24 24"><path fill="currentColor" d="M6,13V11H14L10.5,7.5L11.92,6.08L17.84,12L11.92,17.92L10.5,16.5L14,13H6M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12Z" /></svg>`;