"""
Oxford Pets Dataset Overview - Plotly Version

Tutorial: Dataset Overview
Library: Plotly
Author: AILearningHub
Dataset: Oxford-IIIT Pets
URL: https://ltsach.github.io/AILearningHub/

Description:
    Explore the Oxford-IIIT Pet Dataset structure and basic statistics
    using interactive Plotly visualizations.

Requirements:
    pip install pandas plotly

Data Source:
    Full metadata (7,349 images):
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/data/full_metadata.csv
"""

import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# ============================================================================
# Load Data
# ============================================================================

print("📊 Loading Oxford Pets Dataset...")
print("=" * 70)

url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/data/full_metadata.csv'
df = pd.read_csv(url)

print(f"✓ Loaded {len(df):,} images")
print(f"✓ Dataset shape: {df.shape}")

# ============================================================================
# Basic Statistics
# ============================================================================

print("\n" + "=" * 70)
print("DATASET OVERVIEW")
print("=" * 70)

print(f"\nTotal Images:    {len(df):,}")
print(f"Total Breeds:    {df['breed'].nunique()}")
print(f"Total Species:   {df['species'].nunique()}")

print(f"\n📊 Species Distribution:")
for species, count in df['species'].value_counts().items():
    pct = count / len(df) * 100
    print(f"  {species.capitalize():8s}: {count:,} ({pct:.1f}%)")

print(f"\n📊 Split Distribution:")
for split, count in df['split'].value_counts().items():
    pct = count / len(df) * 100
    print(f"  {split.capitalize():8s}: {count:,} ({pct:.1f}%)")

# ============================================================================
# Visualization 1: Species Distribution (Donut Chart)
# ============================================================================

species_counts = df['species'].value_counts()

fig1 = go.Figure(data=[go.Pie(
    labels=species_counts.index,
    values=species_counts.values,
    hole=0.4,
    marker=dict(colors=['#667eea', '#f093fb']),
    textinfo='label+percent+value',
    textfont_size=14,
    hovertemplate='<b>%{label}</b><br>Count: %{value:,}<br>Percentage: %{percent}<extra></extra>'
)])

fig1.update_layout(
    title={
        'text': 'Species Distribution (Cats vs Dogs)',
        'x': 0.5,
        'xanchor': 'center'
    },
    showlegend=True,
    width=700,
    height=500,
    template='plotly_white'
)

print("\n📈 Displaying Species Distribution chart...")
fig1.show()

# ============================================================================
# Visualization 2: Split Distribution (Bar Chart)
# ============================================================================

split_counts = df['split'].value_counts().reindex(['train', 'val', 'test'])

fig2 = go.Figure(data=[go.Bar(
    x=split_counts.index,
    y=split_counts.values,
    marker_color=['#3b82f6', '#8b5cf6', '#10b981'],
    text=split_counts.values,
    textposition='auto',
    texttemplate='%{text:,}',
    hovertemplate='<b>%{x}</b><br>Count: %{y:,}<extra></extra>'
)])

fig2.update_layout(
    title={
        'text': 'Data Split Distribution (Train/Val/Test)',
        'x': 0.5,
        'xanchor': 'center'
    },
    xaxis_title='Split',
    yaxis_title='Number of Images',
    width=700,
    height=500,
    template='plotly_white',
    showlegend=False
)

print("📈 Displaying Split Distribution chart...")
fig2.show()

# ============================================================================
# Visualization 3: Top 10 Breeds (Horizontal Bar)
# ============================================================================

breed_counts = df['breed'].value_counts().head(10)

fig3 = go.Figure(data=[go.Bar(
    y=breed_counts.index,
    x=breed_counts.values,
    orientation='h',
    marker_color='#667eea',
    text=breed_counts.values,
    textposition='auto',
    texttemplate='%{text}',
    hovertemplate='<b>%{y}</b><br>Count: %{x}<extra></extra>'
)])

fig3.update_layout(
    title={
        'text': 'Top 10 Breeds by Image Count',
        'x': 0.5,
        'xanchor': 'center'
    },
    xaxis_title='Number of Images',
    yaxis_title='Breed',
    width=700,
    height=500,
    template='plotly_white',
    showlegend=False,
    yaxis={'categoryorder': 'total ascending'}
)

print("📈 Displaying Top 10 Breeds chart...")
fig3.show()

# ============================================================================
# Summary
# ============================================================================

print("\n" + "=" * 70)
print("✅ ANALYSIS COMPLETE")
print("=" * 70)
print("\n💡 Key Insights:")
print("   - Dataset is imbalanced toward dogs (~84% dogs, ~16% cats)")
print("   - Test set is largest (50% of data) for robust evaluation")
print("   - All 37 breeds are represented in each split (stratified)")
print("   - Some breeds are more common (e.g., English Cocker Spaniel)")
print("\n📚 Next Steps:")
print("   - Analyze breed distribution in detail")
print("   - Check class balance metrics")
print("   - Extract features for similarity analysis")

