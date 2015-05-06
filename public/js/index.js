$(function () {
    var currentMessageType = '';
    var showMessage = function (message, type) {
        $('.alert-message-wrapper .message').html(message);

        $('.alert-message-wrapper').removeClass(currentMessageType);
        currentMessageType = 'alert-' + (type == 'error' ? 'danger' : 'success');
        $('.alert-message-wrapper').addClass(currentMessageType).show();
    };

    var hideMessage = function () {
        $('.alert-message-wrapper').hide();
    };

    $('.alert-message-wrapper button.close').on('click', function () {
        hideMessage();
    });

    var disableButton = function (btn) {
        btn.attr('disabled', true);
    };

    var enableButton = function (btn) {
        btn.removeAttr('disabled');
    };

    $('#login-btn').on('click', function () {
        var me = $(this);
        var apiKey = $('#api_key').val();
        var userId = $('#username').val();
        var password = $('#password').val();
        disableButton(me);
        $.ajax({
            dataType: 'json',
            data: {apiKey: apiKey, userId: userId, password: password},
            url: 'getUserAccessToken',
            type: 'GET'
        })
            .done(function (data) {
                if (data.message != 'success') {
                    showMessage('Login failed! Please check your login credentials.', 'error');
                } else {
                    onLoginSuccess(userId, data.result.user_access_token);
                }
            })
            .fail(function () {
                showMessage('Sorry, there was an error with your request!', 'error');
            })
            .always(function () {
                enableButton(me);
            });

        return false;
    });

    var onLoginSuccess = function (userId, userAccessToken) {
        sessionStorage['user_access_token'] = userAccessToken;
        sessionStorage['user_id'] = userId;
        // UI
        $('#login-form').addClass('hidden');
        $('#login-form')[0].reset();
        $('#logged-in').removeClass('hidden');
        $('.username').text(userId);
        hideMessage();
    };

    // Handle refresh page
    if (sessionStorage['user_access_token'] != undefined) {
        onLoginSuccess(sessionStorage['user_id'], sessionStorage['user_access_token']);
    }

    $('#logout-btn').on('click', function () {
        onLogoutSuccess();
    });

    var onLogoutSuccess = function () {
        sessionStorage.removeItem('user_access_token');
        sessionStorage.removeItem('user_id');
        // UI
        $('#login-form').removeClass('hidden');
        $('#logged-in').addClass('hidden');
        $('.username').text('');
        hideMessage();
    };

    $('#send-btn').on('click', function () {
        var me = $(this);
        var from = $('#sms_from').val();
        var to = $('#sms_to').val();
        var message = $('#sms_message').val();
        if (to == '' || message == '') {
            showMessage('Please input fields marked (*).', 'error');
            return false;
        }
        disableButton(me);
        $.ajax({
            dataType: 'json',
            data: {userAccessToken: sessionStorage['user_access_token'], from: from, to: to, text: message},
            url: 'sms',
            type: 'GET'
        })
            .done(function (data) {
                if (data.message != 'success') {
                    showMessage('Failed to send message! Please try again.', 'error');
                } else {
                    showMessage('The message has been sent!', 'success');
                }
            })
            .fail(function () {
                alert('Sorry, there was an error with your request!');
            })
            .always(function () {
                enableButton(me);
            });
        return false;
    });
});