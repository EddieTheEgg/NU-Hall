package com.nudining.nudining_info.entities;

public class Nutrition {
    private String name;
    private Float minAmount;
    private Float maxAmount;

    public Nutrition(String name, Float minAmount, Float maxAmount) {
        this.name = name;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getMinAmount() {
        return minAmount;
    }

    public void setMinAmount(Float minAmount) {
        this.minAmount = minAmount;
    }

    public Float getMaxAmount() {
        return maxAmount;
    }

    public void setMaxAmount(Float maxAmount) {
        this.maxAmount = maxAmount;
    }
}
