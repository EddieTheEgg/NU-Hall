package com.nudining.nudining_info.entities;

public class Range {
    private Integer min;
    private Integer max;

    // Constructors
    public Range() {}

    public Range(Integer min, Integer max) {
        this.min = min;
        this.max = max;
    }

    // Getters and Setters
    public Integer getMin() {
        return min;
    }

    public void setMin(Integer min) {
        this.min = min;
    }

    public Integer getMax() {
        return max;
    }

    public void setMax(Integer max) {
        this.max = max;
    }

    // Optional: Helper method to check if a value falls within the range
    public boolean isWithinRange(int value) {
        return (min == null || value >= min) && (max == null || value <= max);
    }
}
