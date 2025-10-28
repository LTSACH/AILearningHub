/**
 * Variants Tab Module
 * Handles all functionality for the Naive Bayes Variants tab
 */

export class VariantsTab {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialize the Variants tab
     */
    async init() {
        if (this.isInitialized) return;
        
        this.createComparisonChart();
        this.setupCodeExamples();
        this.createInteractiveDemo();
        this.isInitialized = true;
    }

    /**
     * Create comparison chart of different Naive Bayes variants
     */
    createComparisonChart() {
        const variants = [
            { name: 'Gaussian', dataType: 'Continuous', smoothing: 'None', useCase: 'Iris, Height/Weight' },
            { name: 'Multinomial', dataType: 'Discrete Counts', smoothing: 'Laplace', useCase: 'Text, Word Counts' },
            { name: 'Bernoulli', dataType: 'Binary', smoothing: 'Laplace', useCase: 'Spam Detection, Binary Features' }
        ];

        // Create comparison table
        const tableData = variants.map(variant => [
            variant.name,
            variant.dataType,
            variant.smoothing,
            variant.useCase
        ]);

        const trace = {
            type: 'table',
            header: {
                values: ['Variant', 'Data Type', 'Smoothing', 'Use Case'],
                fill: { color: '#2c3e50' },
                font: { color: 'white', size: 14 }
            },
            cells: {
                values: tableData,
                fill: { color: ['#ecf0f1', '#d5dbdb'] },
                font: { size: 12 },
                align: 'left'
            }
        };

        const layout = {
            title: 'Naive Bayes Variants Comparison',
            width: 800,
            height: 200
        };

        Plotly.newPlot('variants-comparison', [trace], layout, {responsive: true});
    }

    /**
     * Setup code examples for each variant
     */
    setupCodeExamples() {
        const codeExamples = {
            'gaussian-example': `from sklearn.naive_bayes import GaussianNB
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

# Load continuous data
iris = load_iris()
X, y = iris.data, iris.target

# Gaussian Naive Bayes (no parameters needed)
gnb = GaussianNB()
gnb.fit(X, y)

# Predict probabilities
probabilities = gnb.predict_proba(X[:5])
print("Gaussian NB probabilities:", probabilities)`,

            'multinomial-example': `from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer

# Text data
texts = ["good movie", "bad movie", "excellent film"]
labels = [1, 0, 1]  # positive/negative

# Convert text to counts
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)

# Multinomial Naive Bayes with smoothing
mnb = MultinomialNB(alpha=1.0)  # Laplace smoothing
mnb.fit(X, labels)

# Predict
new_text = ["great film"]
X_new = vectorizer.transform(new_text)
prediction = mnb.predict(X_new)
print("Multinomial NB prediction:", prediction)`,

            'bernoulli-example': `from sklearn.naive_bayes import BernoulliNB
import numpy as np

# Binary features (e.g., word presence)
X = np.array([
    [1, 0, 1, 0],  # has "good", no "bad", has "great", no "terrible"
    [0, 1, 0, 1],  # no "good", has "bad", no "great", has "terrible"
    [1, 0, 1, 0]
])
y = [1, 0, 1]  # positive/negative

# Bernoulli Naive Bayes
bnb = BernoulliNB(alpha=1.0, binarize=0.5)
bnb.fit(X, y)

# Predict
prediction = bnb.predict([[1, 0, 1, 0]])
print("Bernoulli NB prediction:", prediction)`
        };

        // Add code examples to the page
        Object.entries(codeExamples).forEach(([id, code]) => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = `<pre><code class="language-python">${code}</code></pre>`;
            }
        });
    }

    /**
     * Create interactive demo showing different variants
     */
    createInteractiveDemo() {
        // Create sample data for each variant
        this.createGaussianDemo();
        this.createMultinomialDemo();
        this.createBernoulliDemo();
    }

    /**
     * Create Gaussian NB demo
     */
    createGaussianDemo() {
        // Simulate continuous data
        const setosa = { x: [5.1, 4.9, 4.7, 4.6, 5.0], y: [3.5, 3.0, 3.2, 3.1, 3.6] };
        const versicolor = { x: [7.0, 6.4, 6.9, 5.5, 6.5], y: [3.2, 3.2, 3.1, 2.3, 2.8] };
        const virginica = { x: [6.3, 5.8, 7.1, 6.3, 6.5], y: [3.3, 2.7, 3.0, 2.9, 3.0] };

        const traces = [
            { x: setosa.x, y: setosa.y, mode: 'markers', name: 'Setosa', type: 'scatter' },
            { x: versicolor.x, y: versicolor.y, mode: 'markers', name: 'Versicolor', type: 'scatter' },
            { x: virginica.x, y: virginica.y, mode: 'markers', name: 'Virginica', type: 'scatter' }
        ];

        const layout = {
            title: 'Gaussian Naive Bayes: Continuous Data',
            xaxis: { title: 'Feature 1' },
            yaxis: { title: 'Feature 2' },
            width: 500,
            height: 400
        };

        Plotly.newPlot('gaussian-demo', traces, layout, {responsive: true});
    }

    /**
     * Create Multinomial NB demo
     */
    createMultinomialDemo() {
        const categories = ['Sports', 'Politics', 'Technology'];
        const wordCounts = {
            'Sports': { 'game': 15, 'team': 12, 'player': 10, 'match': 8 },
            'Politics': { 'government': 14, 'policy': 11, 'election': 9, 'vote': 7 },
            'Technology': { 'software': 13, 'digital': 10, 'computer': 9, 'internet': 8 }
        };

        const words = Object.keys(wordCounts.Sports);
        const traces = categories.map(category => ({
            x: words,
            y: words.map(word => wordCounts[category][word] || 0),
            name: category,
            type: 'bar'
        }));

        const layout = {
            title: 'Multinomial Naive Bayes: Word Counts',
            xaxis: { title: 'Words' },
            yaxis: { title: 'Count' },
            barmode: 'group',
            width: 500,
            height: 400
        };

        Plotly.newPlot('multinomial-demo', traces, layout, {responsive: true});
    }

    /**
     * Create Bernoulli NB demo
     */
    createBernoulliDemo() {
        const features = ['has_good', 'has_bad', 'has_great', 'has_terrible'];
        const spam = [0.1, 0.8, 0.05, 0.7];  // Probability of feature presence
        const ham = [0.7, 0.1, 0.6, 0.05];

        const traces = [
            { x: features, y: spam, name: 'Spam', type: 'bar' },
            { x: features, y: ham, name: 'Ham', type: 'bar' }
        ];

        const layout = {
            title: 'Bernoulli Naive Bayes: Binary Features',
            xaxis: { title: 'Features' },
            yaxis: { title: 'Probability' },
            barmode: 'group',
            width: 500,
            height: 400
        };

        Plotly.newPlot('bernoulli-demo', traces, layout, {responsive: true});
    }

    /**
     * Clean up when tab is hidden
     */
    destroy() {
        // Clean up Plotly plots
        const plotIds = [
            'variants-comparison', 
            'gaussian-demo', 
            'multinomial-demo', 
            'bernoulli-demo'
        ];
        
        plotIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                Plotly.purge(element);
            }
        });
        
        this.isInitialized = false;
    }
}
