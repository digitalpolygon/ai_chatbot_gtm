# AI Chatbot GTM Integration

Enable this module to get the following event tracking in Google Tag Manager:

- Message sent (event name: `chatbot_message_sent`)
- Message received (event name: `chatbot_message_received`)
  - Event parameters:
    - `response_time`: The amount of time it took to receive the message (in seconds).
- Chatbot feedback given (event name: `chatbot_feedback`)
  - Event parameters:
    - `feedback_type`: Either `like` or `dislike`.
