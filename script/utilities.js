/**
 * This javascript class creates functions that need to be ran after load
 * as well as holds any public varaiables / functions that need to be
 * accessible by the rest of the scripts.
 */

// Prototype Injection to turn the first letter of any string to capital for visualisation
// javascript magic I learned at (Polyfill example): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
if (!String.prototype.capitalise){
    String.prototype.capitalise = function(){
        return this.charAt(0).toUpperCase() + this.substring(1)
    }
}


// varaibles to hold the colours of each platform for the visualisations
var netflixColor = '#B20710'
var huluColor = '#3DBB3D'
var disneyColor = '#006E99'
var primeColor = '#00A8E1'

// colour of each platform in a colour map so it is accessible by a key
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

// tooltip is initialised here so all functions can use it
// but it is set only after the DOM has loaded
// global tooltip used to to minimise the amount of duplicated code
var tooltip

/**
 * Function to be ran after the DOM has finished loading
 * It adds any javascript needed for HTML elements
 */
const initialise = () => {
    // select the tooltip with d3 so the visualisations can use it
    tooltip = d3.select("body")
        .append("div")
        .attr("class", "toolTip");

    // set the header / about "pop up" functions
    var header = document.getElementById('header');
    header.onclick = (e) => {

        // if the target is anywhere but the visual header box, then transition to hide it
        if(e.target === header){
            document.body.style.overflow =  'unset';
            header.classList.remove('in');
            header.classList.add('out');
        }
    }

    // add an onclick function to the about button to reshow the header
    document.getElementById('about-button').onclick = () => {
        header.classList.add('in');
        header.classList.remove('out');
    }

    // when the info-modal is shown, it spans the whole screen
    // so on click, hide the info-content to re-hide the information
    document.getElementById('info-modal').onclick = () => {
        document.getElementById('info-modal').classList.remove('shown')
    }
}

// once the visualisation has finished loading, run initialise
if (document.readyState !== "complete"){
    window.addEventListener("load", initialise)
} else {
    initialise()
}

// show the visualisation information
function configureHelp(button, title, content){
    // Attach a listener to the info button provided by ID
    document.getElementById(button).onclick = () => {
        // When its called, update the content to replace whatever the last help text was
        document.getElementById('info-content').innerHTML = `<h4>${title}</h4><p>${content}</p>`;
        // Add the shown class. This will trigger the css animation effects to make it fade in
        document.getElementById('info-modal').classList.add('shown');
    }
}

//formats a number as a number (needed for some visualisations)
var formatValue = d3.format("1")

// icons used for the web page
var stackSVG = `<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0L3 7L4.63 8.27L12 14L19.36 8.27L21 7L12 0M19.37 10.73L12 16.47L4.62 10.74L3 12L12 19L21 12L19.37 10.73M19.37 15.73L12 21.47L4.62 15.74L3 17L12 24L21 17L19.37 15.73Z" /></svg>`
var rhombusSVG = `<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C11.5 2 11 2.19 10.59 2.59L7.29 5.88L12 10.58L16.71 5.88L13.41 2.59C13 2.19 12.5 2 12 2M5.88 7.29L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L5.88 16.71L10.58 12L5.88 7.29M18.12 7.29L13.42 12L18.12 16.71L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L18.12 7.29M12 13.42L7.29 18.12L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L16.71 18.12L12 13.42Z" /></svg>`
var leftArrowSVG = `<svg style="width:30px;height:30px" viewBox="0 0 24 24"><path fill="currentColor" d="M18,11V13H10L13.5,16.5L12.08,17.92L6.16,12L12.08,6.08L13.5,7.5L10,11H18M2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12M4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12Z" /></svg>`
var rightArrowSVG =  `<svg style="width:30px;height:30px" viewBox="0 0 24 24"><path fill="currentColor" d="M6,13V11H14L10.5,7.5L11.92,6.08L17.84,12L11.92,17.92L10.5,16.5L14,13H6M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12Z" /></svg>`;