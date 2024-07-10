package org.austral.ing.lab1.object.jsonparsable;

public class ExpirationInfo {
    private final Long houseId;
    private final String houseName;
    private final String productName;
    private final Long daysLeft;

    public ExpirationInfo(Long houseId, String houseName, String productName, Long daysLeft) {
        this.houseId = houseId;
        this.houseName = houseName;
        this.productName = productName;
        this.daysLeft = daysLeft;
    }

    public String asJson() {
        return "{" +
                "\"houseId\":" + houseId + "," +
                "\"houseName\":\"" + houseName + "\"," +
                "\"productName\":\"" + productName + "\"," +
                "\"daysLeft\":" + daysLeft +
                "}";
    }
}
