"""
Oxford Pets Breed Distribution Analysis - Plotly Version

Tutorial: Breed Distribution
Library: Plotly
Author: AILearningHub
Dataset: Oxford-IIIT Pets
URL: https://ltsach.github.io/AILearningHub/

Description:
    Analyze the distribution of 37 breeds and check class balance
    using interactive Plotly visualizations.

Requirements:
    pip install pandas numpy plotly

Data Source:
    Full metadata (7,349 images):
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/data/full_metadata.csv
"""

import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

# ============================================================================
# Load Data
# ============================================================================

print("📊 Loading Oxford Pets Dataset...")
print("=" * 70)

url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/data/full_metadata.csv'
df = pd.read_csv(url)

print(f"✓ Loaded {len(df):,} images across {df['breed'].nunique()} breeds")

# ============================================================================
# Breed Distribution Analysis
# ============================================================================

print("\n" + "=" * 70)
print("BREED DISTRIBUTION ANALYSIS")
print("=" * 70)

breed_counts = df['breed'].value_counts()

print(f"\n📊 Overall Statistics:")
print(f"  Total breeds:        {len(breed_counts)}")
print(f"  Mean images/breed:   {breed_counts.mean():.1f}")
print(f"  Median images/breed: {breed_counts.median():.1f}")
print(f"  Min images/breed:    {breed_counts.min()}")
print(f"  Max images/breed:    {breed_counts.max()}")
print(f"  Std deviation:       {breed_counts.std():.1f}")

# ============================================================================
# Class Balance Metrics
# ============================================================================

def calculate_gini_coefficient(counts):
    """Calculate Gini coefficient for class imbalance"""
    sorted_counts = np.sort(counts)
    n = len(counts)
    cumsum = np.cumsum(sorted_counts)
    return (2 * np.sum((np.arange(1, n+1)) * sorted_counts)) / (n * cumsum[-1]) - (n + 1) / n

def calculate_entropy(counts):
    """Calculate entropy for class distribution"""
    proportions = counts / counts.sum()
    return -np.sum(proportions * np.log2(proportions + 1e-10))

gini = calculate_gini_coefficient(breed_counts.values)
entropy = calculate_entropy(breed_counts.values)
max_entropy = np.log2(len(breed_counts))
normalized_entropy = entropy / max_entropy

print(f"\n📊 Class Balance Metrics:")
print(f"  Gini Coefficient:      {gini:.4f} (0=perfect balance, 1=perfect imbalance)")
print(f"  Entropy:               {entropy:.4f} bits")
print(f"  Normalized Entropy:    {normalized_entropy:.4f} (1=perfect balance)")
print(f"\n  ✓ Dataset is {'well-balanced' if gini < 0.3 else 'moderately imbalanced' if gini < 0.5 else 'highly imbalanced'}")

# ============================================================================
# Visualization 1: All 37 Breeds Distribution (Bar Chart)
# ============================================================================

# Sort breeds by count
breed_counts_sorted = breed_counts.sort_values(ascending=True)

# Add species information for coloring
breed_species = df.groupby('breed')['species'].first()
colors = [' #667eea' if breed_species[breed] == 'cat' else '#f093fb' for breed in breed_counts_sorted.index]

fig1 = go.Figure(data=[go.Bar(
    y=breed_counts_sorted.index,
    x=breed_counts_sorted.values,
    orientation='h',
    marker=dict(
        color=colors,
        line=dict(color='rgba(0,0,0,0.3)', width=1)
    ),
    text=breed_counts_sorted.values,
    textposition='auto',
    hovertemplate='<b>%{y}</b><br>Images: %{x}<br>Species: %{customdata}<extra></extra>',
    customdata=[breed_species[breed] for breed in breed_counts_sorted.index]
)])

fig1.update_layout(
    title={
        'text': 'Breed Distribution (All 37 Breeds)',
        'x': 0.5,
        'xanchor': 'center'
    },
    xaxis_title='Number of Images',
    yaxis_title='Breed',
    width=900,
    height=1000,
    template='plotly_white',
    showlegend=False
)

print("\n📈 Displaying all breeds distribution...")
fig1.show()

# ============================================================================
# Visualization 2: Class Balance Overview (Box Plot + Histogram)
# ============================================================================

fig2 = make_subplots(
    rows=1, cols=2,
    subplot_titles=('Distribution Summary (Box Plot)', 'Image Count Distribution (Histogram)')
)

# Box plot
fig2.add_trace(
    go.Box(
        y=breed_counts.values,
        name='Breed Counts',
        marker_color='#667eea',
        boxmean='sd'
    ),
    row=1, col=1
)

# Histogram
fig2.add_trace(
    go.Histogram(
        x=breed_counts.values,
        nbinsx=10,
        marker_color='#f093fb',
        name='Distribution'
    ),
    row=1, col=2
)

fig2.update_xaxes(title_text="", row=1, col=1)
fig2.update_yaxes(title_text="Number of Images", row=1, col=1)
fig2.update_xaxes(title_text="Number of Images per Breed", row=1, col=2)
fig2.update_yaxes(title_text="Frequency", row=1, col=2)

fig2.update_layout(
    title={
        'text': 'Class Balance Analysis',
        'x': 0.5,
        'xanchor': 'center'
    },
    width=1000,
    height=500,
    template='plotly_white',
    showlegend=False
)

print("📈 Displaying class balance analysis...")
fig2.show()

# ============================================================================
# Visualization 3: Cats vs Dogs Breeds (Grouped)
# ============================================================================

# Group by species
cat_breeds = breed_counts[breed_species == 'cat'].sort_values(ascending=False)
dog_breeds = breed_counts[breed_species == 'dog'].sort_values(ascending=False)

fig3 = make_subplots(
    rows=1, cols=2,
    subplot_titles=(f'Cat Breeds (n={len(cat_breeds)})', f'Dog Breeds (n={len(dog_breeds)})'),
    horizontal_spacing=0.15
)

# Cat breeds
fig3.add_trace(
    go.Bar(
        y=cat_breeds.index,
        x=cat_breeds.values,
        orientation='h',
        marker_color='#667eea',
        text=cat_breeds.values,
        textposition='auto',
        name='Cats',
        hovertemplate='<b>%{y}</b><br>Images: %{x}<extra></extra>'
    ),
    row=1, col=1
)

# Dog breeds
fig3.add_trace(
    go.Bar(
        y=dog_breeds.index[:12],  # Show top 12 to match cat count
        x=dog_breeds.values[:12],
        orientation='h',
        marker_color='#f093fb',
        text=dog_breeds.values[:12],
        textposition='auto',
        name='Dogs',
        hovertemplate='<b>%{y}</b><br>Images: %{x}<extra></extra>'
    ),
    row=1, col=2
)

fig3.update_xaxes(title_text="Number of Images", row=1, col=1)
fig3.update_xaxes(title_text="Number of Images", row=1, col=2)

fig3.update_layout(
    title={
        'text': 'Breed Distribution by Species',
        'x': 0.5,
        'xanchor': 'center'
    },
    width=1200,
    height=600,
    template='plotly_white',
    showlegend=False
)

print("📈 Displaying species-wise breed distribution...")
fig3.show()

# ============================================================================
# Summary
# ============================================================================

print("\n" + "=" * 70)
print("✅ ANALYSIS COMPLETE")
print("=" * 70)
print("\n💡 Key Insights:")
print(f"   - Relatively balanced distribution (Gini={gini:.3f})")
print(f"   - Most breeds have 180-220 images")
print(f"   - 12 cat breeds, 25 dog breeds")
print(f"   - Minimal class imbalance across breeds")
print("\n📚 Next Steps:")
print("   - Extract features for breed similarity")
print("   - Analyze visual similarity between breeds")
print("   - Identify potentially confusing breed pairs")

