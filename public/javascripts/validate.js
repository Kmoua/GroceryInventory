$(document).ready(function(){
  $(function() {
	$.validator.addMethod("skuregex", function(value, element, regexpr) {
        return regexpr.test(value);
    }, "Invalid SKU. Must follow the format: xxxx-xxxx");
	  
	$.validator.addMethod("msrpregex", function(value, element, regexpr) {
        return regexpr.test(value);
    }, "Numbers only");
	
	$.validator.addMethod("nameregex", function(value, element, regexpr) {
        return regexpr.test(value);
    }, "Only alphanumeric and - : () characters are allowed");
	
	$.validator.addMethod('filesize', function (value, element, param) {
		return this.optional(element) || (element.files[0].size <= param)
	}, 'File size must be less than {0} bytes');

			
	$("form[name='form']").validate({  
		rules: {
			product_name: {
				required: true,
				nameregex: /^[a-zA-Z0-9-():\s]*$/
			},
					 					 
			msrp: {
				required: true,
				msrpregex: /^\d{0,8}(\.\d{1,4})?$/
			},
			sku: {               
				required: true,
				minlength: 9,
				skuregex: /^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/
			},
			image: {
				filesize: 500000
			},
			
			category: {
				required: true
			},
			
			name: {
				required: true
			}
		},
		
					 submitHandler: function(form) {
						 form.submit();
					 }
			 });

  });
})
