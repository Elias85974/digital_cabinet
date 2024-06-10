package org.austral.ing.lab1.object;

public class Invitation {
  private String userId;
  private String houseId;
  private boolean state;

  // Getters and setters
  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getHouseId() {
    return houseId;
  }

  public void setHouseId(String houseId) {
    this.houseId = houseId;
  }

  public boolean isAccepted() {
    return state;
  }

  public void setState(boolean state) {
    this.state = state;
  }
}