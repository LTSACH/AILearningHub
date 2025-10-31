/**
 * Module Link Detection
 * Maps algorithm names to available module URLs
 */

export const MODULE_LINKS = {
  // Direct algorithm matches
  'Naive Bayes': '/AILearningHub/02_Machine_Learning/naive_bayes/',
  'GaussianNB': '/AILearningHub/02_Machine_Learning/naive_bayes/',
  'MultinomialNB': '/AILearningHub/02_Machine_Learning/naive_bayes/',
  
  'Linear Regression': '/AILearningHub/02_Machine_Learning/linear_regression/',
  'LinearRegression': '/AILearningHub/02_Machine_Learning/linear_regression/',
  
  'Logistic Regression': '/AILearningHub/02_Machine_Learning/logistic_regression/',
  'LogisticRegression': '/AILearningHub/02_Machine_Learning/logistic_regression/',
  
  'Softmax Regression': '/AILearningHub/02_Machine_Learning/softmax_regression/',
  
  'CrossEntropy Loss': '/AILearningHub/02_Machine_Learning/loss_functions/crossentropy/',
  'MSE Loss': '/AILearningHub/02_Machine_Learning/loss_functions/mse/',
  
  // Category matches (if module covers the category)
  'Classification': null, // Too broad
  'Regression': null, // Too broad
};

/**
 * Get module link for a node
 * @param {Object} nodeData - Node data from hierarchy
 * @returns {string|null} - URL if available, null otherwise
 */
export function getModuleLink(nodeData) {
  const name = nodeData.name;
  
  // Direct match
  if (MODULE_LINKS[name]) {
    return MODULE_LINKS[name];
  }
  
  // Check if it's a leaf node (algorithm) without direct match
  // Could add fuzzy matching here if needed
  
  return null;
}

/**
 * Check if node has module link
 * @param {Object} nodeData - Node data
 * @returns {boolean}
 */
export function hasModuleLink(nodeData) {
  return getModuleLink(nodeData) !== null;
}

