define(function(){

  return function(str){
    if (str == null){
      return '';
    }
    return String(str).replace(/<\/?[^>]+>/g, ' ');
  };

});
