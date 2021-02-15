function sendData(data) {
    ws.send(JSON.stringify(data));
}

function actionMicrophone(action) {
    let rec = $('.vocal').attr('rec');

    if(rec === 'false') {
        sendData({"payload": "start"});
        $('.vocal').attr('rec', true);
    } else if (rec === 'true') {
        sendData({"payload": "stop"});
        $('.vocal').attr('rec', false);
    }
}

function scrollDownChat() {
    $('.boxe-answer').scrollTop($('.boxe-answer').prop('scrollHeight'));
}

$('input').change(function() {
    sendData({"text": true, payload: $(this).val()});
    $(this).val('');
});

if('WebSocket' in window) {
    var ws = new WebSocket("ws://localhost:1880/fyc");

    ws.onopen = function() {
        console.log('Connexion à la WebSocket : OK');
    };

    ws.onmessage = function(event) {
        let data = JSON.parse(event.data);

        if(data.event == "start") {
            $('.boxe-answer').append('<div class="answer pending">\n' +
                '            <div class="me">\n' +
                '                ...\n' +
                '            </div>\n' +
                '        </div>');
        }

        if(data.event == "end") {
            $('.pending').remove();

            $('.boxe-answer').append('<div class="answer">\n' +
                '            <div class="me">\n' +
                                    data.payload +
                '            </div>\n' +
                '        </div>');

            $('.boxe-answer').append('<div class="answer">\n' +
                '            <div class="other">\n' +
                            data._dialogflow.fulfillmentText +
                '            </div>\n' +
                '        </div>');
        }

        return scrollDownChat();
    };

    ws.onclose = function() {
        console.log('Connexion à la WebSocket : TERMINÉ')
    };
}