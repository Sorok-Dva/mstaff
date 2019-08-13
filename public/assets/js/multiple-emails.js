(function($) {
	$.fn.multiple_emails = function(options) {
		let defaults = {
			checkDupEmail: true,
			theme: "Bootstrap",
			position: "top",
			placeholder: ""
		};
		let settings = $.extend( {}, defaults, options );
		let deleteIconHTML = "";

		if (settings.theme.toLowerCase() === "Bootstrap".toLowerCase())
			deleteIconHTML = '<a href="#" class="multiple_emails-close" title="Remove"><i class="fal fa-times-circle"></i></a>';
		else if (settings.theme.toLowerCase() === "SemanticUI".toLowerCase() || settings.theme.toLowerCase() === "Semantic-UI".toLowerCase() || settings.theme.toLowerCase() === "Semantic UI".toLowerCase())
			deleteIconHTML = '<a href="#" class="multiple_emails-close" title="Remove"><i class="remove icon"></i></a>';
		else if (settings.theme.toLowerCase() === "Basic".toLowerCase())
			deleteIconHTML = '<a href="#" class="multiple_emails-close" title="Remove"><i class="basicdeleteicon">Remove</i></a>';

		return this.each(function() {
			let $orig = $(this);
			let $list = $('<ul class="multiple_emails-ul" />');

			if ($(this).val() !== '' && IsJsonString($(this).val())) {
				$.each(jQuery.parseJSON($(this).val()), function( index, val ) {
					$list.append($('<li class="multiple_emails-email"><span class="email_name" data-email="' + val.toLowerCase() + '">' + val + '</span></li>')
						.prepend($(deleteIconHTML).click(function(e) { $(this).parent().remove(); refresh_emails(); e.preventDefault(); })
						)
					);
				});
			}

			let $input = $('<input type="text" class="multiple_emails-input text-left" placeholder="' + settings.placeholder +'"/>').on('keyup', function(e) {
				$(this).removeClass('multiple_emails-error');
				let keynum;

				if(window.event)
					keynum = e.keyCode;
				else if(e.which)
					keynum = e.which;

				if(keynum === 9 || keynum === 32 || keynum === 188) {
					display_email($(this), settings.checkDupEmail);
				}
				else if (keynum === 13) {
					display_email($(this), settings.checkDupEmail);
					e.preventDefault();
				}
			}).on('blur', function(){
				if ($(this).val() !== '') { display_email($(this), settings.checkDupEmail); }
			});

			let $container = $('<div class="multiple_emails-container" />').click(function() { $input.focus(); } );

			if (settings.position.toLowerCase() === "top")
				$container.append($list).append($input).insertAfter($(this));
			else
				$container.append($input).append($list).insertBefore($(this));

			function display_email(t, dupEmailCheck) {
				let errorEmails = [];
				let arr = t.val().trim().replace(/^,|,$/g , '').replace(/^;|;$/g , '');
				let pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);

				arr = arr.replace(/"/g,"");
				arr = arr.split(/[\s,;]+/);
				for	(let i = 0; i < arr.length; i++) {
					if ( dupEmailCheck === true && $orig.val().indexOf(arr[i]) !== -1 ) {
						if (arr[i] && arr[i].length > 0) {
							new function () {
								let existingElement = $list.find('.email_name[data-email=' + arr[i].toLowerCase().replace('.', '\\.')
									.replace('@', '\\@') + ']');
								existingElement.css('font-weight', 'bold');
								setTimeout(function() { existingElement.css('font-weight', ''); }, 1500);
							}();
						}
					}
					else if (pattern.test(arr[i]) === true) {
						$list.append($('<li class="multiple_emails-email"><span class="email_name" data-email="' + arr[i].toLowerCase() + '">' + arr[i] + '</span></li>')
							.prepend($(deleteIconHTML).click(function(e) { $(this).parent().remove(); refresh_emails(); e.preventDefault(); })
							)
						);
					}
					else
						errorEmails.push(arr[i]);
				}
				if(errorEmails.length > 0)
					t.val(errorEmails.join("; ")).addClass('multiple_emails-error');
				else
					t.val("");
				refresh_emails ();
			}

			function refresh_emails () {
				let emails = [];
				let container = $orig.siblings('.multiple_emails-container');
				container.find('.multiple_emails-email span.email_name').each(function() { emails.push($(this).html()); });
				$orig.val(JSON.stringify(emails)).trigger('change');
			}

			/**
			 * @return {boolean}
			 */
			function IsJsonString(str) {
				try { JSON.parse(str); }
				catch (e) {	return false; }
				return true;
			}

			return $(this).hide();
		});
	};

})(jQuery);
