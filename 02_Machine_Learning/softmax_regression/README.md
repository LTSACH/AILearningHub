# Softmax Regression

Softmax Regression (also called Multinomial Logistic Regression) extends logistic regression to multiclass classification problems.

## Overview
Softmax Regression is the generalization of logistic regression for multiclass classification. It uses the softmax function to convert raw scores (logits) into probability distributions over multiple classes.

## Mathematical Foundation
- **Softmax Function**: σ(z_i) = e^(z_i) / Σ(j=1 to K) e^(z_j)
- **Model**: P(y=k|x) = e^(w_k^T x + b_k) / Σ(j=1 to K) e^(w_j^T x + b_j)
- **Cross-Entropy Loss**: For multiclass classification
- **MLE Derivation**: From categorical distribution assumption

## Key Concepts
- **Multiclass Classification**: More than two classes (K > 2)
- **Softmax Function**: Normalizes logits to probability distribution
- **One-vs-Rest**: Alternative approach to multiclass classification
- **Maximum Likelihood Estimation**: Deriving the loss function from categorical distribution
- **Gradient Descent**: Optimization for softmax regression

## Applications
- **Computer Vision**: Image classification (CIFAR-10, ImageNet)
- **NLP**: Text classification, sentiment analysis, language detection
- **Healthcare**: Disease classification, medical image analysis
- **Finance**: Risk rating, customer segmentation
- **Engineering**: Quality classification, fault diagnosis

## Learning Objectives
- Understand the mathematical foundation of softmax regression
- Derive the softmax function and its properties
- Implement softmax regression from MLE perspective
- Apply softmax regression to multiclass problems
- Compare with binary logistic regression
