var InteractionReporter = require("../../../sysModules/interactionReporter");
var http = require('http');
var parseString = require('xml2js').parseString;

var Wolframalpha = function (moduleSysMngr) {
    this.moduleSysMngr = moduleSysMngr;
};

Wolframalpha.prototype.makeURL = function (text)
{
	text = encodeURIComponent(text);
    text = "http://api.wolframalpha.com/v2/query?input=" + text;
    text = text + "&appid=LPK95J-5V2YWERKVK";
    return (text);
};

Wolframalpha.prototype.deleteResearch = function (text)
{
    text = text.substring(9);
    return (text);
};

Wolframalpha.prototype.replace = function (text, character, to)
{
    var count = 16;

    while (count > 0)
    {
		text = text.replace(character, to);
		count = count - 1;
    }
    return (text);
};

Wolframalpha.prototype.parseResponse = function (that, rawData)
{
    rawData = this.replace(rawData, "&s=", "&amp;s=");
    rawData = this.replace(rawData, '\"${word}\"', '${word}');
    parseString(rawData, {trim: true}, function (err, result) {
	that.moduleSysMngr.frontMngr.callFrontModule("Wolframalpha", "HUGUESDPDN_CLASSNAME_Wolframalpha", "fillResults", result);});
};

Wolframalpha.prototype.getWebPage = function (myURL)
{
    var rawData = "";
    var that = this;

    http.get(myURL, function(res) {
	var statusCode = res.statusCode;
	var contentType = res.headers['content-type'];
	var error;

	if (statusCode !== 200) {
            that.moduleSysMngr.frontMngr.callFrontModule("Wolframalpha", "HUGUESDPDN_CLASSNAME_Wolframalpha", "errorServer", null);
	    error = new Error('Request Failed.\n' +
			      'Status Code: ${statusCode}');}
	if (error) {
	    console.log(error.message);
            that.moduleSysMngr.frontMngr.callFrontModule("Wolframalpha", "HUGUESDPDN_CLASSNAME_Wolfralpha", "errorInternet", null);
	    res.resume();}
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            rawData += chunk;
        });
        res.on('end', function () {
            that.parseResponse(that, rawData);
        });
    }).on('error', function (e) {
        console.log('Got error: ', e.message);
    });
};

Wolframalpha.prototype.prelaunch = function (userText)
{
    console.log("un peu decu lol = ", userText);
    userText = this.makeURL(userText);
    this.getWebPage(userText);
};

Wolframalpha.prototype.launch1 = function (paramFromTree, userText)
{
    this.parse("(?:search|find|research)(?: (?:on wolfram alpha)| (?:on wolframalpha)| (?:on wolfram))(.*)", userText);
};

Wolframalpha.prototype.launch2 = function (paramFromTree, userText)
{
    this.parse("(?:search|find|research)(.*)(?: (?:on wolfram alpha)| (?:on wolframalpha)| (?:on wolfram))", userText)
};


Wolframalpha.prototype.launch3 = function (paramFromTree, userText)
{
    this.parse("(?:(?:wolframe? alpha)|(?:wolframe?alpha)|(?:wolframe?))(.*)", userText);
};

Wolframalpha.prototype.parse = function (sRegex, userText)
{
    var regex = new RegExp(sRegex);
    var match = regex.exec(userText.toLowerCase());

    if (match !== null)
    {
        this.moduleSysMngr.frontMngr.callFrontModule("Wolframalpha", "HUGUESDPDN_CLASSNAME_Wolframalpha", "showResults", userText);
        this.prelaunch(match[1].trim());
    }
    else
        this.moduleSysMngr.frontMngr.callFrontSysModule("tchat", "postMessage", "Hum, an error occured sorry. Maybe try again later...")
};

//Wolframalpha.prototype.launch = function (paramFromTree, userText)
//{
//	userText = this.deleteResearch(userText);
//    this.moduleSysMngr.frontMngr.callFrontModule("Wolframalpha", "HUGUESDPDN_CLASSNAME_Wolframalpha", "showResults", userText);
//	this.prelaunch(userText);
//};

module.exports = Wolframalpha;