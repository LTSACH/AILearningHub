# Logistic Regression

Logistic Regression is a fundamental classification algorithm that models the probability of binary outcomes.

## Overview
Logistic Regression uses the logistic (sigmoid) function to model the relationship between features and binary class probabilities. Despite its name, it's actually a classification algorithm, not regression.

## Mathematical Foundation
- **Sigmoid Function**: σ(z) = 1/(1 + e^(-z))
- **Model**: P(y=1|x) = σ(w₀ + w₁x₁ + w₂x₂ + ... + wₙxₙ)
- **Decision Boundary**: When P(y=1|x) = 0.5
- **MLE Derivation**: From Bernoulli distribution assumption

## Key Concepts
- **Binary Classification**: Two-class problem (0 or 1)
- **Sigmoid Function**: Maps real numbers to probabilities (0, 1)
- **Maximum Likelihood Estimation**: Deriving the loss function
- **Cross-Entropy Loss**: The natural loss function for classification
- **Gradient Descent**: Optimization for logistic regression

## Applications
- **Healthcare**: Disease diagnosis, treatment outcome prediction
- **Finance**: Credit scoring, fraud detection
- **Marketing**: Customer churn prediction, conversion analysis
- **Engineering**: Quality control, failure prediction

## Learning Objectives
- Understand the mathematical foundation of logistic regression
- Derive the sigmoid function and decision boundary
- Implement logistic regression from MLE perspective
- Apply logistic regression to binary classification problems
- Compare with linear regression for classification tasks
