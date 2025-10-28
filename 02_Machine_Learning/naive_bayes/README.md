# 🎯 Naive Bayes Tutorial

Interactive tutorial on probabilistic classification using Bayes' theorem with independence assumption.

## 📚 Overview

This tutorial provides a comprehensive, hands-on introduction to Naive Bayes classification with interactive visualizations and real-world examples.

## 🌟 Features

- **Interactive Bayes Calculator**: Real-time calculation of posterior probabilities
- **D3.js Network Visualizations**: Dynamic diagrams showing Bayes' theorem and Naive Bayes networks
- **Plotly.js Charts**: Feature distributions, decision boundaries, and confusion matrices
- **Real Datasets**: Iris flowers and BBC News text classification
- **Code Examples**: Python implementations using scikit-learn
- **Multiple Variants**: Gaussian, Multinomial, and Bernoulli Naive Bayes

## 🎯 Learning Objectives

After completing this tutorial, you will understand:

1. **Bayes' Theorem**: Mathematical foundation and components (prior, likelihood, evidence, posterior)
2. **Naive Independence Assumption**: Why it's "naive" and when it works
3. **Classification Process**: How Naive Bayes makes predictions
4. **Real Applications**: Iris species classification and news categorization
5. **Algorithm Variants**: Different types for different data types

## 📖 Tutorial Structure

### Tab 1: Bayes Formula
- Mathematical foundation of Bayes' theorem
- Interactive calculator with sliders
- Real-world medical diagnosis example
- D3.js visualization of probability relationships

### Tab 2: Naive Bayes
- Network diagram showing independence assumption
- Advantages and limitations
- Mathematical formulation
- When to use Naive Bayes

### Tab 3: Iris Dataset
- Gaussian Naive Bayes on famous Iris dataset
- Feature distribution visualizations
- Decision boundary plots
- Confusion matrix analysis
- Python code implementation

### Tab 4: BBC News
- Multinomial Naive Bayes for text classification
- Text preprocessing pipeline
- Word frequency analysis
- Performance comparison with other algorithms

### Tab 5: Variants
- Gaussian Naive Bayes (continuous features)
- Multinomial Naive Bayes (discrete/count features)
- Bernoulli Naive Bayes (binary features)
- Use case recommendations

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualizations**: D3.js v7, Plotly.js
- **Code Highlighting**: Prism.js
- **Styling**: Custom CSS with glass morphism effects
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

1. Open `index.html` in a modern web browser
2. Navigate through the tabs using the tab navigation
3. Interact with sliders and visualizations
4. Explore the code examples
5. Try different datasets and parameters

## 📊 Datasets Used

### Iris Dataset
- **Source**: UCI Machine Learning Repository
- **Samples**: 150 flowers (50 per species)
- **Features**: 4 measurements (sepal/petal length/width)
- **Classes**: 3 species (setosa, versicolor, virginica)

### BBC News Dataset
- **Source**: BBC News articles
- **Samples**: 2,225 articles
- **Features**: TF-IDF vectors (1,000 most common words)
- **Classes**: 5 categories (business, entertainment, politics, sport, tech)

## 🎨 Design Features

- **Consistent Theme**: Matches AI Learning Hub design system
- **Interactive Elements**: Hover effects, smooth transitions
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Accessibility**: Keyboard navigation, screen reader friendly
- **Performance**: Optimized for smooth interactions

## 🔧 Customization

### Adding New Datasets
1. Create data file in `data/` directory
2. Add loading logic in `tab-handlers.js`
3. Create visualization functions in `plotly-charts.js`
4. Update tab content in respective handler

### Modifying Visualizations
- **D3.js**: Edit `d3-bayes-network.js`
- **Plotly.js**: Edit `plotly-charts.js`
- **Styling**: Modify `css/main.css`

## 📈 Performance Considerations

- Lazy loading of tab content
- Efficient D3.js updates
- Responsive Plotly.js charts
- Optimized CSS animations
- Minimal external dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This tutorial is part of the AI Learning Hub educational content. Feel free to use and share for educational purposes.

## 👨‍💻 Author

Created as part of the AI Learning Hub project for comprehensive AI education.

---

⭐ **Star this repository** if you find this tutorial helpful for your AI learning journey!
