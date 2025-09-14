# MSE Loss Function

Mean Squared Error (MSE) is a fundamental loss function for regression problems.

## Overview
MSE measures the average squared differences between predicted and actual values. It's widely used in regression tasks where we predict continuous numerical values.

## Mathematical Foundation
- **Formula**: MSE = (1/n) * Σ(y_true - y_pred)²
- **Properties**: Always non-negative, penalizes large errors more heavily
- **Gradient**: Simple linear relationship

## Applications
- Linear regression
- Neural network regression
- Time series forecasting
- Any continuous value prediction

## Comparison with CrossEntropy
- **MSE**: For regression (continuous values)
- **CrossEntropy**: For classification (discrete classes)

## Learning Objectives
- Understand when to use MSE vs other loss functions
- Implement MSE from scratch
- Visualize loss behavior
- Apply MSE in real regression problems
