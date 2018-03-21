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
    let _step = -1;
    let _url = _scope.attr('data-url');
    let _next = $('nav input[data-next]', _scope);
    let _back = $('nav input[data-back]', _scope);
    let _submit = $('nav input[type=submit]', _scope);
    let _forms = $('.step', _scope);
    let _map = $('.map', _scope);    
    let _error = $('.errors', _scope);      
    
    init();
    
    function init() { 
        $('.rating').val(-1).barrating({ theme: 'css-stars', allowEmpty: true, emptyValue:-1, initialRating: '' });
        _submit.on('click', save);
        _next.on('click', onNext);
        _back.on('click', onBack);
        
        navigateTo(_step+1);    
            
        if(_scope.attr('data-lt')==null || _scope.attr('data-ln')==null) console.warn('Invalid Geo coordinates');
        if(_map.length==0) console.warn('Map container not exists');
        new GMaps({div: _map[0], lat: _scope.attr('data-lt'), lng: _scope.attr('data-ln') });  
    }

    function save() {    
        if(!validate()) return;                      
        busy(true);
        $.ajax({ url: _url, method:'post', data: JSON.stringify(getFormData()), dataType: 'json' }).then(onSave, onError); 
    }

    function busy(busy) {   
        $('nav input', _scope).prop('disabled', busy);
        $('*', _forms[_step]).prop('disabled', busy);                              
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
        if (_step == _forms.length-1 || !validate()) return;        
        navigateTo(_step+1);       
        updateNavBar();
    }

    function onBack() {
        if (_step == 0) return;        
        navigateTo(_step-1);
        updateNavBar();             
    }

    function navigateTo(to) {            
        if(_step<0) $(_forms[to]).fadeIn();
        else $(_forms[_step]).fadeOut(x=>$(_forms[to]).fadeIn());

        _step = to;
    }

    function updateNavBar() { 
        _back.css({ display: _step>0?'inline-block':'none'});
        _next.css({ display: _step<_forms.length-1 ? 'inline-block':'none'});
        _submit.css({ display: _step==_forms.length-1 ? 'inline-block' : 'none' });
    }

    function validate() {          
        _error.empty();
        $(_forms[_step]).serializeArray().map(obj=>{                        
            if( obj.value.trim()=='' || parseInt(obj.value)<0 ) {
                let formInput = $('[name='+obj.name+']', _forms[_step]);
                _error.append('<li>'+formInput.attr('data-required')+'</li>');                
            }
        });

        return _error.children().length==0;            
    }
};