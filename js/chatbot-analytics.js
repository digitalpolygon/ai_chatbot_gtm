(function ($, Drupal, once) {
  Drupal.behaviors.aiChatbotGtmAnalytics = {
    attach: function (context, settings) {

      once('ai-chatbot-gtm-analytics', 'body', context).forEach(function () {

        // Track intervals and timings per chat instance.
        var stopwatchIntervals = {};

        Drupal.behaviors.deepChatToggle.chats.forEach(function (deepchatElement) {

          var chatId = $(deepchatElement).closest('[data-chat-id]').data('chat-id');
          const shadowRoot = deepchatElement.shadowRoot;
          const messagesContainer = shadowRoot.querySelector('#container');

          deepchatElement.addEventListener('new-message', function (event) {
            // When the user sends a message, Deep Chat disables the send button
            // until a response is received. This prevents multiple submissions,
            // so we don't have to track that here, and we can assume that works
            // as expected.
            if (!event.detail.isHistory) {
              if (event.detail.message.role === 'user') {
                dataLayer.push({
                  'event': 'chatbot_message_sent',
                });
                let stopwatchIntervalData = {
                  count: 0
                };
                stopwatchIntervals[chatId] = stopwatchIntervalData;
                stopwatchIntervalData.interval = setInterval(function () {
                  stopwatchIntervalData.count++;
                }, 1000);
              }
              else if (event.detail.message.role === 'ai') {
                if (stopwatchIntervals[chatId]) {
                  clearInterval(stopwatchIntervals[chatId].interval);
                  stopwatchIntervals[chatId].interval = null;
                  dataLayer.push({
                    'event': 'chatbot_message_received',
                    'response_time': stopwatchIntervals[chatId].count
                  });
                  delete stopwatchIntervals[chatId];
                }
              }
            }
          });

          if (messagesContainer) {
            messagesContainer.addEventListener('click', function (event) {
              if (event.target.matches('.like-button')) {
                event.stopPropagation();
                dataLayer.push({
                  'event': 'chatbot_feedback',
                  'feedback_type': 'like'
                });
              }
              if (event.target.matches('.dislike-button')) {
                event.stopPropagation();
                dataLayer.push({
                  'event': 'chatbot_feedback',
                  'feedback_type': 'dislike'
                });
              }
            });
          }

        });

      });
    }
  }
})(jQuery, Drupal, once);
