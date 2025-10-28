/**
 * Iris Dataset Tab Module
 * Handles all functionality for the Iris Dataset tab
 */

export class IrisDatasetTab {
    constructor() {
        this.isInitialized = false;
        this.irisData = null;
        this.model = null;
    }

    /**
     * Initialize the Iris Dataset tab
     */
    async init() {
        if (this.isInitialized) return;
        
        await this.loadIrisData();
        this.createVisualizations();
        this.setupCodeExamples();
        this.isInitialized = true;
    }

    /**
     * Load Iris dataset (simulated data for demo)
     */
    async loadIrisData() {
        // Simulated Iris data for demonstration
        this.irisData = {
            features: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
            classes: ['setosa', 'versicolor', 'virginica'],
            samples: [
                // Sample data points (simplified)
                { features: [5.1, 3.5, 1.4, 0.2], class: 'setosa' },
                { features: [4.9, 3.0, 1.4, 0.2], class: 'setosa' },
                { features: [7.0, 3.2, 4.7, 1.4], class: 'versicolor' },
                { features: [6.4, 3.2, 4.5, 1.5], class: 'versicolor' },
                { features: [6.3, 3.3, 6.0, 2.5], class: 'virginica' },
                { features: [5.8, 2.7, 5.1, 1.9], class: 'virginica' }
            ]
        };
    }

    /**
     * Create visualizations using Plotly
     */
    createVisualizations() {
        this.createScatterPlot();
        this.createFeatureDistribution();
    }

    /**
     * Create scatter plot of Iris data
     */
    createScatterPlot() {
        const traces = this.irisData.classes.map(className => {
            const classData = this.irisData.samples.filter(s => s.class === className);
            return {
                x: classData.map(d => d.features[0]), // sepal_length
                y: classData.map(d => d.features[1]), // sepal_width
                mode: 'markers',
                type: 'scatter',
                name: className,
                marker: {
                    size: 8,
                    opacity: 0.7
                }
            };
        });

        const layout = {
            title: 'Iris Dataset: Sepal Length vs Sepal Width',
            xaxis: { title: 'Sepal Length (cm)' },
            yaxis: { title: 'Sepal Width (cm)' },
            showlegend: true,
            width: 600,
            height: 400
        };

        Plotly.newPlot('iris-scatter-plot', traces, layout, {responsive: true});
    }

    /**
     * Create feature distribution plots
     */
    createFeatureDistribution() {
        const features = this.irisData.features;
        const classes = this.irisData.classes;
        
        const plots = ['feature-dist-1', 'feature-dist-2', 'feature-dist-3', 'feature-dist-4'];
        
        features.forEach((feature, index) => {
            const traces = classes.map(className => {
                const classData = this.irisData.samples
                    .filter(s => s.class === className)
                    .map(d => d.features[index]);
                
                return {
                    x: classData,
                    type: 'histogram',
                    name: className,
                    opacity: 0.7,
                    nbinsx: 10
                };
            });

            const layout = {
                title: `Distribution of ${feature.replace('_', ' ').toUpperCase()}`,
                xaxis: { title: feature.replace('_', ' ').toUpperCase() },
                yaxis: { title: 'Frequency' },
                barmode: 'overlay',
                showlegend: true,
                width: 600,
                height: 300
            };

            Plotly.newPlot(plots[index], traces, layout, {responsive: true});
        });
    }

    /**
     * Setup code examples
     */
    setupCodeExamples() {
        const codeExamples = {
            'iris-loading': `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, classification_report

# Load Iris dataset
iris = load_iris()
X, y = iris.data, iris.target
feature_names = iris.feature_names
target_names = iris.target_names

print(f"Dataset shape: {X.shape}")
print(f"Features: {feature_names}")
print(f"Classes: {target_names}")`,

            'iris-training': `# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# Train Gaussian Naive Bayes
gnb = GaussianNB()
gnb.fit(X_train, y_train)

# Make predictions
y_pred = gnb.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Accuracy: {accuracy:.3f}")
print("\\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=target_names))`,

            'iris-prediction': `# Predict new sample
new_sample = [[5.1, 3.5, 1.4, 0.2]]  # [sepal_length, sepal_width, petal_length, petal_width]
prediction = gnb.predict(new_sample)
probability = gnb.predict_proba(new_sample)

print(f"Predicted class: {target_names[prediction[0]]}")
print(f"Class probabilities: {dict(zip(target_names, probability[0]))}")`
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
     * Clean up when tab is hidden
     */
    destroy() {
        // Clean up Plotly plots
        const plotIds = ['iris-scatter-plot', 'feature-dist-1', 'feature-dist-2', 'feature-dist-3', 'feature-dist-4'];
        plotIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                Plotly.purge(element);
            }
        });
        
        this.isInitialized = false;
    }
}
