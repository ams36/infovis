// Prototype Injection
// javascript magic I learned at:
if (!String.prototype.capitalise){
    String.prototype.capitalise = function(){
        return this.charAt(0).toUpperCase() + this.substring(1)
    }
}