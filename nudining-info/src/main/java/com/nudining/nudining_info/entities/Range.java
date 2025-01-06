package com.nudining.nudining_info.entities;

public class Range {
    private Double min;
    private Double max;

    // Constructors
    public Range() {}

    public Range(Double min, Double max) {
        this.min = min;
        this.max = max;
    }

    // Getters and Setters
    public Double getMin() {
        return min;
    }

    public void setMin(Double min) {
        this.min = min;
    }

    public Double getMax() {
        return max;
    }

    public void setMax(Double max) {
        this.max = max;
    }

    // Optional: Helper method to check if a value falls within the range
    public boolean isWithinRange(int value) {
        return (min == null || value >= min) && (max == null || value <= max);
    }
}
