/**
 * BBC News Tab Module
 * Handles all functionality for the BBC News tab
 */

export class BBCNewsTab {
    constructor() {
        this.isInitialized = false;
        this.newsData = null;
    }

    /**
     * Initialize the BBC News tab
     */
    async init() {
        if (this.isInitialized) return;
        
        await this.loadNewsData();
        this.createVisualizations();
        this.setupCodeExamples();
        this.isInitialized = true;
    }

    /**
     * Load BBC News dataset (simulated data for demo)
     */
    async loadNewsData() {
        // Simulated BBC News data for demonstration
        this.newsData = {
            categories: ['business', 'entertainment', 'politics', 'sport', 'tech'],
            sampleTexts: {
                'business': [
                    'Stock market reaches new high as investors show confidence',
                    'Company reports record quarterly profits and growth',
                    'Economic indicators suggest strong recovery ahead'
                ],
                'entertainment': [
                    'New movie breaks box office records worldwide',
                    'Celebrity couple announces engagement plans',
                    'Music festival attracts thousands of fans'
                ],
                'politics': [
                    'Government announces new policy on healthcare reform',
                    'Election results show significant changes in parliament',
                    'International summit addresses climate change issues'
                ],
                'sport': [
                    'Team wins championship after thrilling final match',
                    'Olympic athlete sets new world record in competition',
                    'Football transfer window sees major player movements'
                ],
                'tech': [
                    'New smartphone features advanced AI capabilities',
                    'Tech company launches innovative software solution',
                    'Cybersecurity experts warn about new threats'
                ]
            },
            wordCounts: {
                'business': { 'market': 15, 'profit': 12, 'economic': 10, 'company': 8, 'growth': 7 },
                'entertainment': { 'movie': 12, 'celebrity': 10, 'music': 9, 'festival': 8, 'fans': 6 },
                'politics': { 'government': 14, 'policy': 11, 'election': 9, 'parliament': 7, 'reform': 6 },
                'sport': { 'team': 13, 'championship': 10, 'match': 9, 'athlete': 8, 'record': 7 },
                'tech': { 'technology': 12, 'software': 10, 'cybersecurity': 9, 'innovation': 8, 'digital': 7 }
            }
        };
    }

    /**
     * Create visualizations using Plotly
     */
    createVisualizations() {
        this.createWordCloud();
        this.createCategoryDistribution();
        this.createWordFrequencyChart();
    }

    /**
     * Create word cloud visualization
     */
    createWordCloud() {
        // Flatten all words with their frequencies
        const allWords = {};
        Object.values(this.newsData.wordCounts).forEach(categoryWords => {
            Object.entries(categoryWords).forEach(([word, count]) => {
                allWords[word] = (allWords[word] || 0) + count;
            });
        });

        // Convert to array and sort by frequency
        const wordData = Object.entries(allWords)
            .map(([word, count]) => ({ word, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20); // Top 20 words

        const trace = {
            x: wordData.map(d => d.word),
            y: wordData.map(d => d.count),
            type: 'bar',
            marker: {
                color: wordData.map((_, i) => `hsl(${i * 18}, 70%, 50%)`),
                line: { color: 'white', width: 1 }
            }
        };

        const layout = {
            title: 'Most Frequent Words Across All Categories',
            xaxis: { title: 'Words' },
            yaxis: { title: 'Frequency' },
            width: 600,
            height: 400
        };

        Plotly.newPlot('word-frequency-chart', [trace], layout, {responsive: true});
    }

    /**
     * Create category distribution pie chart
     */
    createCategoryDistribution() {
        const categoryCounts = this.newsData.categories.map(category => ({
            category,
            count: this.newsData.sampleTexts[category].length
        }));

        const trace = {
            labels: categoryCounts.map(d => d.category),
            values: categoryCounts.map(d => d.count),
            type: 'pie',
            textinfo: 'label+percent',
            textposition: 'outside'
        };

        const layout = {
            title: 'Distribution of News Categories',
            width: 500,
            height: 400
        };

        Plotly.newPlot('category-distribution', [trace], layout, {responsive: true});
    }

    /**
     * Create word frequency heatmap
     */
    createWordFrequencyChart() {
        const categories = this.newsData.categories;
        const allWords = new Set();
        
        // Collect all unique words
        Object.values(this.newsData.wordCounts).forEach(categoryWords => {
            Object.keys(categoryWords).forEach(word => allWords.add(word));
        });

        const words = Array.from(allWords).slice(0, 15); // Top 15 words
        const z = categories.map(category => 
            words.map(word => this.newsData.wordCounts[category][word] || 0)
        );

        const trace = {
            z: z,
            x: words,
            y: categories,
            type: 'heatmap',
            colorscale: 'Blues',
            showscale: true
        };

        const layout = {
            title: 'Word Frequency Heatmap by Category',
            xaxis: { title: 'Words' },
            yaxis: { title: 'Categories' },
            width: 600,
            height: 400
        };

        Plotly.newPlot('word-heatmap', [trace], layout, {responsive: true});
    }

    /**
     * Setup code examples
     */
    setupCodeExamples() {
        const codeExamples = {
            'bbc-preprocessing': `from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd

# Load BBC News dataset
df = pd.read_csv('bbc_news.csv')
X = df['text']  # News articles
y = df['category']  # Categories

print(f"Dataset shape: {X.shape}")
print(f"Categories: {y.unique()}")`,

            'bbc-vectorization': `# Text preprocessing and vectorization
vectorizer = TfidfVectorizer(
    max_features=5000,
    stop_words='english',
    ngram_range=(1, 2),  # unigrams and bigrams
    min_df=2,
    max_df=0.95
)

X_vectorized = vectorizer.fit_transform(X)
print(f"Vectorized shape: {X_vectorized.shape}")`,

            'bbc-training': `# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X_vectorized, y, test_size=0.2, random_state=42, stratify=y
)

# Train Multinomial Naive Bayes
mnb = MultinomialNB(alpha=1.0)  # Laplace smoothing
mnb.fit(X_train, y_train)

# Make predictions
y_pred = mnb.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Accuracy: {accuracy:.3f}")
print("\\nClassification Report:")
print(classification_report(y_test, y_pred))`,

            'bbc-prediction': `# Predict new article
new_article = ["Technology company announces breakthrough in AI research"]
new_vectorized = vectorizer.transform(new_article)
prediction = mnb.predict(new_vectorized)
probability = mnb.predict_proba(new_vectorized)

print(f"Predicted category: {prediction[0]}")
print(f"Category probabilities: {dict(zip(mnb.classes_, probability[0]))}")`
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
        const plotIds = ['word-frequency-chart', 'category-distribution', 'word-heatmap'];
        plotIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                Plotly.purge(element);
            }
        });
        
        this.isInitialized = false;
    }
}
