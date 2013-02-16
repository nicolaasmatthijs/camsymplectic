var profilePictures = {
    '1113': '/pictures/AlexanderWebb.png',  
    '3954': '/pictures/ChristineHolt.png',
    '2171': '/pictures/JameHaseloff.png',
    '4138': '/pictures/MichaelPayne.png',
    '4214': '/pictures/RobertGlen.png',
    '531': '/pictures/StephenOliver.png',
    '4279': '/pictures/WilliamHarris.png',
    '536': '/pictures/AnnaPhilpott.png',
    '3966': '/pictures/ChristopherDobson.png',
    '9045': '/pictures/JamesLocke.png',
    '4129': '/pictures/MicheleVendruscolo.png',
    '4245': '/pictures/Shankar.png',
    '853': '/pictures/StevenRussell.png',
    '3927': '/pictures/AzimSurani.png',
    '856': '/pictures/DavidSummers.png',
    '4375': '/pictures/JeremyBaumberg.png',
    '603': '/pictures/MichelleOyen.png',
    '675': '/pictures/SimonTavare.png',
    '4272': '/pictures/UllrichSteiner.png',
    '168': '/pictures/CarlosCaldas.png',
    '976': '/pictures/GerardEvan.png',
    '6': '/pictures/MichaelAkam.png',
    '94': '/pictures/NormanFleck.png',
    '3160': '/pictures/SophieJackson.png',
    '3340': '/pictures/UlrichKeyser.png'
};

// Variable that will cache all of the parsed Trimpath templates. This avoids the same
// template being parsed over and over again
var templateCache = [];

/**
 * Functionality that allows you to create HTML Templates, using a JSON object. That template 
 * will then be rendered and all of the values from  the JSON object can be used to insert values 
 * into the rendered HTML. More information and examples can be found over here:
 *
 * http://code.google.com/p/trimpath/wiki/JavaScriptTemplates
 *
 * Template should be defined like this:
 *  <div><!--
 *   // Template here
 *  --></div>
 * 
 * IMPORTANT: There should be no line breaks in between the div and the <!-- declarations,
 * because that line break will be recognized as a node and the template won't show up, as
 * it's expecting the comments tag as the first one.
 *
 * This is done because otherwise a template wouldn't validate in an HTML validator and
 * to make sure that the template isn't visible in the page.
 * 
 * @param  {Element|String}     $template       jQuery element representing the HTML element that contains the template or jQuery selector for the template container.
 * @param  {Object}             [data]          JSON object representing the values used for ifs, fors and value insertions.
 * @param  {Element|String}     [$output]       jQuery element representing the HTML element in which the template output should be put, or jQuery selector for the output container.
 * @return {String}                             The rendered HTML
 * @throws {Error}                              Error thrown when no template has been provided
 */
var renderTemplate = function($template, data, $output) {
    // Parameter validation
    if (!$template) {
        throw new Error('No valid template has been provided');
    }
    
    // Make sure that the provided template is a jQuery object
    $template = $($template);
    if ($template.length === 0) {
        throw new Error('The provided template could not be found');
    }

    var templateId = $template.attr('id');
    if (!templateCache[templateId]) {
        // We extract the content from the templates, which is wrapped in <!-- -->
        var templateContent = $template[0].firstChild.data.toString();

        // Parse the template through TrimPath and add the 
        // parsed template to the template cache
        try {
            templateCache[templateId] = TrimPath.parseTemplate(templateContent, templateId);
        } catch (err) {
            throw new Error('Parsing of template "' + templateId + '" failed: ' + err);
        }
    }

    // Render the template
    var renderedHTML = null;
    try {
        renderedHTML = templateCache[templateId].process(data, {'throwExceptions': true});
    } catch (err) {
        throw new Error('Rendering of template "' + templateId + '" failed: ' + err);
    }

    // If an output element has been provided, we can just render the renderer HTML,
    // otherwise we pass it back to the call function
    if ($output) {
        // Make sure that the provided output is a jQuery object
        $output = $($output);
        $output.html(renderedHTML);
    } else {
        return renderedHTML;
    }
};