(function($){
    $(document).on('ready', function(){
        // detect "questionnaire" by class, and attach component automatically..
        $('.questionnaire').each(function(i,item){
            $(item).questionnaire($);
        }); 
    });    
})(jQuery);

// Component definition
$.fn.questionnaire = function($) { 
    let _scope = $(this);
    let _step = 1;
    let _url = _scope.attr('data-url');
    let _next = $('nav > input[type=button]', _scope);
    let _submit = $('nav > input[type=submit]', _scope);
    let _steps = $('.step', _scope);
    let _map = $('.map', _scope);

    init();
    
    function init() { 
        $('.rating', _scope).barrating({theme:'css-stars'});      

        _submit.on('click', save);
        _next.on('click', onNext);
        _submit.hide();

        navigate(1);        
        if(_scope.attr('data-lt')==null || _scope.attr('data-ln')==null) console.warn('Invalid Geo coordinates');
        new GMaps({div: _map[0], lat: _scope.attr('data-lt'), lng: _scope.attr('data-ln') });  
    }

    function save() {                          
        busy(true);
        $.ajax({ url: _url, method:'post', data: JSON.stringify(getFormData()), dataType: 'json' }).then(onSave, onError); 
    }

    function busy(busy) { 
        _submit.prop('disabled', busy);
        $('textarea', _steps[_step-1]).prop('disabled', busy);
    }

    function getFormData () {
        let data = { };
        let i = 0;

        for( let form of $('.step').toArray() ) {       
            data['step'+(++i)] = {};                 
            $(form).serializeArray().map(function(obj){                 
                data['step'+(i)][obj.name] = obj.value;
            });            
        }

        return { steps: data };
    }

    function onError (error) {
        busy(false);
        swal("Error", "Error sending data.", "error");        
    }

    function onSave(data) { 
        busy(false);
        let mini_title = 'You rank #'+data.rank+' out of '+data.total+' users who submitted evaluations this week.';
        let table = '<table class="evaluation_table"><thead><tr><td>#</td><td>User</td><td>Evaluations</td></tr></thead><tbody>'+
                     data.users.map(function(user, i){ return '<tr><td>'+i+'</td><td>'+user.user+'</td><td>'+user.evaluation+'</td></tr>'; }).join('')+
                    '</tbody></table>';

        swal({ title: "Is Done.", text: mini_title + table, html: true });
    }

    function onNext() { 
        if(_step==_steps.length) return;        
        navigate(++_step);
       
        if(_step==_steps.length) { _next.hide(); _submit.show(); }
    }

    function navigate(step) {            
        if(_step>=2) $(_steps[step-2]).fadeOut(function(){ $(_steps[step-1]).fadeIn(); });  
        else $(_steps[step-1]).fadeIn();
    }
};