// On Page Load
$(function () {
  var ireloWidget    = $('#irelo-widget'),
      transportBTN    = $('#transport-btns .btn'),
      title           = $('#transport-btns .btn').attr('title'),
      hiddenInput     = $('input[name=transportBtn]'),
      transporters    = $('#transporters'),
      regForm         = $('#reg-form'),
      regPhone        = $('#phone'),
      regMail         = $('#mail'),
      confirmation    = $('#confirmation'),
      view_1_adv_btn  = $('#view-1-adv-btn'),
      view_2_adv_btn  = $('#view-2-adv-btn'),
      view_3_adv_btn  = $('#view-3-adv-btn'),
      btnID           = '';

  $('form').validate();

  transportBTN.on('click', function () {
    btnID = $(this).attr('btn-id');
    hiddenInput.val(btnID).trigger('change');

    console.log(btnID + ' Button Clicked');
    console.log('Hidden Input Value = ' + hiddenInput.val());

    $.magnificPopup.open({
      items: {
        src:  '#' + btnID + '-lb',
        type: 'inline'
      },
      closeOnContentClick: false,
      closeOnBgClick:      true,
      showCloseBtn:        true,
      enableEscapeKey:     true,
      callbacks: {
        open: function () {
          // Hijacks Default Close Function And Injects Close Animation Into It
          $.magnificPopup.instance.close = function () {
            $('#' + btnID + '-lb').removeClass("opened");

            // Call The Original Close Method To Close The Popup
            setTimeout(function () {
              $.magnificPopup.proto.close.call(this);
            }, 500);
          };

          // Make Background Scrollable While Popup is Fixed
          $("html").css({ "margin-right": 0, "overflow": "auto" });

          // Show Lightbox
          $('#' + btnID + '-lb').show();

          // Animate The Lightbox On Open
          $('#' + btnID + '-lb').addClass("opened");

          // Focus On Close Button
          setTimeout(function () {
            $('#' + btnID + '-lb').find('.mfp-close').get(0).focus();
          }, 200);
        }, beforeClose: function () {
            // Do Something Before Close
        }, close: function () {
            // Do Something When Popup Closes
        }
      }
    });
  });

  hiddenInput.change(function() {
    if ((this.value != null) && (this.value != '')) {
      view_1_adv_btn.removeAttr('disabled').removeClass('disabled');
    } else {
      view_1_adv_btn.attr({ 'disabled': 'disabled' }).addClass('disabled');
    }
  });

  view_1_adv_btn.on('click', function () {
    if ((hiddenInput.val() != null) && (hiddenInput.val() != '')) {
      transporters.removeClass('show').addClass('hide');
      regForm.removeClass('hidden');
      ireloWidget.removeClass().addClass('reg-form');
      regPhone.val('');
      regMail.val('');

      setTimeout(function () {
        regForm.addClass('show');
      }, 10);

      setTimeout(function () {
        transporters.removeClass('hide').addClass('hidden');
      }, 500);
    }
  });

  regPhone.on('keyup', function (e) {
    this.value = this.value.replace(/[^0-9]/g, '');

    if ((this.value != null) && (this.value != '')) {
      regMail.removeAttr('required');
      regPhone.attr({ 'required': 'required' });
      view_2_adv_btn.removeAttr('disabled').removeClass('disabled');
    } else if ((regMail.val() != null) && (regMail.val() != '')) {
      regPhone.removeAttr('required');
      regMail.attr({ 'required': 'required' });
      view_2_adv_btn.removeAttr('disabled').removeClass('disabled');
    } else {
      view_2_adv_btn.attr({ 'disabled': 'disabled' }).addClass('disabled');
    }
  });

  regMail.on('keyup', function (e) {
    if ((this.value != null) && (this.value != '')) {
      regPhone.removeAttr('required');
      regMail.attr({ 'required': 'required' });
      view_2_adv_btn.removeAttr('disabled').removeClass('disabled');
    } else if ((regPhone.val() != null) && (regPhone.val() != '')) {
      regMail.removeAttr('required');
      regPhone.attr({ 'required': 'required' });
      view_2_adv_btn.removeAttr('disabled').removeClass('disabled');
    } else {
      view_2_adv_btn.attr({ 'disabled': 'disabled' }).addClass('disabled');
    }
  });

  $('form').submit(function(e) {
    // Uncomment To Advance Without Submitting The Form
    e.preventDefault();

    if($(this).valid()) {
      if ((regPhone.val() != null) && (regPhone.val() != '')) {
        var varifyData = regPhone.val().toString().toLowerCase();
      } else if ((regMail.val() != null) && (regMail.val() != '')) {
        var varifyData = regMail.val().toString().toLowerCase();
      }

      $.ajax({
        type: 'POST',
        url:  'https://valet.irelo.com/api/widget/auto/coop-embed',
        headers: {
            "Authorization":"4d69e62f60ab-mdinder"
        },
        data: {
           "verify": varifyData
        }
      }).done(function(data) {
        console.log('--- You Revealed ' + btnID + ' Quotes ---\n     Your Server Response =');
        console.log(data);
      });

      if (((regPhone.val() != null) && (regPhone.val() != '')) || ((regMail.val() != null) && (regMail.val() != ''))) {
        regForm.removeClass('show').addClass('hide');
        confirmation.removeClass('hidden');
        ireloWidget.removeClass().addClass('confirmation');

        setTimeout(function () {
          confirmation.addClass('show');
          $('#' + btnID.toString().toLowerCase() + '-qt').show().addClass('show');
        }, 10);

        setTimeout(function () {
          regForm.removeClass('hide').addClass('hidden');
        }, 500);
      }
    }
  });
});
