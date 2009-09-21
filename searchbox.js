(function($) {
  $.searchbox = {
    before: function() {},
    after: function() {}
  }
  
  // defaults
  $.extend(true, $.searchbox, {
    settings: {
      url: '/search',
      param: 'query',
      dom_id: '#results',
      delay: 250,
      loading_css: '#loading'
    },
    
    // while the search is being performed
    loading: function() {
      $($.searchbox.settings.loading_css).show()
    },
    
    // clear outdated timers
    resetTimer: function(timer) {
      if (timer) clearTimeout(timer)
    },
    
    // before/after performing search
    idle: function() {
      $($.searchbox.settings.loading_css).hide()
    },
    
    // submits the query and handles response
    process: function(terms) {
      var path = $.searchbox.settings.url.split('?'),
        query = [$.searchbox.settings.param, '=', terms].join(''),
        base = path[0], params = path[1], query_string = query
      
      if (params) query_string = [params.replace('&amp;', '&'), query].join('&')
      
      $.get([base, '?', query_string].join(''), function(data) {
        $($.searchbox.settings.dom_id).html(data)
      })
    },
    
    // when the search starts
    start: function() {
      $.searchbox.before()
      $.searchbox.loading()
    },
    
    // when the search is done
    stop: function() {
      $.searchbox.idle()
      $.searchbox.after()
    }
  })
  
  // Example:
  //  $('input.search').searchbox({ url: '/your/search/url' })
  
  $.fn.searchbox = function(config) {
    var settings = $.extend(true, $.searchbox.settings, config || {})
    
    return this.each(function() {
      var $input = $(this)
      
      $.searchbox.idle()
      
      $input
      .focus()
      .ajaxStart(function() { $.searchbox.start() })
      .ajaxStop(function() { $.searchbox.stop() })
      .keyup(function() {
        if ($input.val() != this.previousValue) {
          $.searchbox.resetTimer(this.timer)

          this.timer = setTimeout(function() {  
            $.searchbox.process($input.val())
          }, $.searchbox.settings.delay)
        
          this.previousValue = $input.val()
        }
      })
    })
  }
})(jQuery);