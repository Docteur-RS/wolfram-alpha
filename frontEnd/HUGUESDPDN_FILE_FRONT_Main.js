main.HUGUESDPDN_CLASSNAME_Wolframalpha = Backbone.View.extend({
    el: '',

    initialize: function () {
    this.firstCard = "";
    this.allCards = [];
    this.current = -1;
	this.research = "";
    },

    reset: function (calledFromRestore) {
        var that = this;

        this.firstCard = main.cardMngr.addNewCard(true);
        var template = main.cardMngr.getTemplate("Wolframalpha", "HUGUESDPDN_TEMPLATE_Reset");
        var templateFilled = template();
        this.firstCard.append(templateFilled);
    },

    showResults: function (data, calledFromRestore) {
		var that = this;

		if (data != null)
			this.research = data;
		else
			main.cardMngr.deleteCard();
        this.firstCard = main.cardMngr.addNewCard(true);
        var template = main.cardMngr.getTemplate("Wolframalpha", "HUGUESDPDN_TEMPLATE_ShowResults");
        var templateFilled = template();
		this.firstCard.append(templateFilled);
		this.firstCard.find("#HUGUESDPDN_LOADING_Wolframalpha").css('display', 'block');
		this.firstCard.find("#HUGUESDPDN_Wolframalpha_Results").css('display', 'none');
		this.firstCard.find("#HUGUESDPDN_Wolframalpha_Retry_Button").click(this.showResults.bind(this, null));
        $(".add-card").last().off();
        $(".add-card").last().on("click", function (node) {that.next();});
    },
    
    fillResults: function (result, calledFromRestore) {
		var that = this;
		var counter = 0;
		var data = "";
		var elem;

		if (result.queryresult["$"].success.localeCompare("true") === 0)
		{
			while (counter < parseInt(result.queryresult["$"].numpods))
			{
				var templateResult = main.cardMngr.getTemplate("Wolframalpha", "HUGUESDPDN_TEMPLATE_Result");
				var templateToFill = {	HUGUESDPDN_TEMPLATE_MAINDIV_Wolframalpha_Result_Text:	result.queryresult.pod[counter]["$"].title,
										HUGUESDPDN_TEMPLATE_MAINDIV_Wolframalpha_Result_Image:	result.queryresult.pod[counter].subpod[0].img[0]["$"].src,
										HUGUESDPDN_TEMPLATE_MAINDIV_Wolframalpha_Result_Alt: 	counter};
				data = data + templateResult(templateToFill);
				counter = counter + 1;
			}
		}
		else 
		{
			try
			{
				var templateResult = main.cardMngr.getTemplate("Wolframalpha", "HUGUESDPDN_TEMPLATE_ShowFirstPossibilities");
				var templateToFill = {HUGUESDPDN_TEMPLATE_MAINDIV_Wolframalpha_Meaning_First:
				result.queryresult.didyoumeans[0].didyoumean[0]._};
				data = data + templateResult(templateToFill);
				var templateResult = main.cardMngr.getTemplate("Wolframalpha", "HUGUESDPDN_TEMPLATE_ShowPossibilities");
				data = data + templateResult(templateToFill);
			}
			catch (e)
			{
				data = "<hr><b>No results found.</b>";
			}
		}
		this.firstCard.find("#HUGUESDPDN_Wolframalpha_Results_Raw")[0].innerHTML = data;
		if ($('.firstResult').length)
		{
			this.firstCard.find(".firstResult").on("click", function ()
			{
				main.moduleMngr.call('Wolframalpha', 'HUGUESDPDN_OBJECTNAME_Wolframalpha', 'prelaunch', result.queryresult.didyoumeans[0].didyoumean[0]._);
			}.bind(this));
		}		
		this.firstCard.find("#HUGUESDPDN_LOADING_Wolframalpha").css('display', 'none');
		this.firstCard.find("#HUGUESDPDN_Wolframalpha_Results").css('display', 'block');
        $(".add-card").last().off();
        $(".add-card").last().on("click", function (node) {that.next();});
    },

    errorServer: function (calledFromRestore) {
        var that = this;

        this.firstCard = main.cardMngr.addNewCard(true);
        var template = main.cardMngr.getTemplate("Wolframalpha", "HUGUESDPDN_TEMPLATE_ErrorServer");
        var templateFilled = template();
        this.firstCard.append(templateFilled);
    },

    errorInternet: function (calledFromRestore) {
        var that = this;

        this.firstCard = main.cardMngr.addNewCard(true);
        var template = main.cardMngr.getTemplate("Wolframalpha", "HUGUESDPDN_TEMPLATE_ErrorInternet");
        var templateFilled = template();
        this.firstCard.append(templateFilled);
    },

    next: function ()
    {
        var that = this;
        var newCard = main.cardMngr.addNewCard(true);
        this.allCards.push(newCard);
        that.current = that.allCards.length - 1;
        var template = main.cardMngr.getTemplate("myNewArchi", "myTemplate");
        var templateFilled = template({title: "Nouvelle card...", plop: newCard});
        $(newCard).append(templateFilled);
        this.showControls(newCard);
        $(".add-card").last().off();
        $(".add-card").last().on("click", function (node) {
            that.next();});
    },
	
    showControls: function (newCard)
    {
        var that = this;
        var controlNext = $(newCard).children(".show-next-card");
        controlNext.css("visibility", "visible");
        $(controlNext).on("click", function () {
            if (that.current >= that.allCards.length - 1)
                return;
            that.current += 1;
            main.cardMngr.showCard(that.allCards[that.current]);});
        var controlPrevious = $(newCard).children(".show-previous-card");
        controlPrevious.css("visibility", "visible");
        controlPrevious.on("click", function () {
            if (that.current <= 0)
                return;
            that.current -= 1;
            main.cardMngr.showCard(that.allCards[that.current]);});
    },
    
    HUGUESDPDN_OBJECTNAME_Wolframalpha: function ()
    {
    }
});