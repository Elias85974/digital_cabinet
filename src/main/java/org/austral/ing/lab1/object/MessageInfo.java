package org.austral.ing.lab1.object;

public class MessageInfo {
    private final Long chatId;
    private final String sender;
    private final String senderId;
    private final String message;
    private final String chatName;

    public MessageInfo(Long chatId, String sender, String senderId, String message, String chatName) {
        this.chatId = chatId;
        this.sender = sender;
        this.senderId = senderId;
        this.message = message;
        this.chatName = chatName;
    }

    public String asJson() {
        return "{" +
                "\"chatId\": " + chatId + "," +
                "\"sender\": \"" + sender + "\"," +
                "\"senderId\": \"" + senderId + "\"," +
                "\"message\": \"" + message + "\"," +
                "\"chatName\": \"" + chatName + "\"" +
                "}";
    }
}
