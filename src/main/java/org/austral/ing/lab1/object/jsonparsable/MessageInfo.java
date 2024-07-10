package org.austral.ing.lab1.object.jsonparsable;

public class MessageInfo {
    private final Long chatId;
    private final String sender;
    private final String senderId;
    private final String message;
    private final String chatName;
    private final Integer unreadMessages;

    public MessageInfo(Long chatId, String sender, String message, String chatName, Integer unreadMessages) {
        this.chatId = chatId;
        this.sender = sender;
        this.senderId = "";
        this.message = message;
        this.chatName = chatName;
        this.unreadMessages = unreadMessages;
    }

    public MessageInfo(Long chatId, String sender, String senderId, String message, String chatName) {
        this.chatId = chatId;
        this.sender = sender;
        this.senderId = senderId;
        this.message = message;
        this.chatName = chatName;
        this.unreadMessages = 0;
    }

    public String asJson() {
        return "{" +
                "\"chatId\":" + chatId + "," +
                "\"sender\":\"" + sender + "\"," +
                "\"senderId\":\"" + senderId + "\"," +
                "\"message\":\"" + message + "\"," +
                "\"chatName\":\"" + chatName + "\"," +
                "\"unreadMessages\":" + unreadMessages +
                "}";
    }
}
