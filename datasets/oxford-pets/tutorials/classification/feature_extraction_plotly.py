"""
Oxford Pets Feature Extraction & Visualization - Plotly Version

Tutorial: Feature Extraction
Library: Plotly
Author: AILearningHub
Dataset: Oxford-IIIT Pets
URL: https://ltsach.github.io/AILearningHub/

Description:
    Visualize deep features extracted using ResNet50 with t-SNE and UMAP
    dimensionality reduction for interactive 2D projections.

Requirements:
    pip install pandas plotly

Data Source:
    Pre-computed t-SNE coordinates:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/tsne_coordinates.csv
    
    Pre-computed UMAP coordinates:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/umap_coordinates.csv

Note:
    This tutorial uses pre-computed features for instant visualization.
    Features were extracted using ResNet50 (ImageNet pretrained).
"""

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# ============================================================================
# Load Pre-computed Data
# ============================================================================

print("📊 Loading Pre-computed Feature Visualizations...")
print("=" * 70)

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/'

print("\n⏳ Loading t-SNE coordinates...")
tsne_df = pd.read_csv(base_url + 'tsne_coordinates.csv')
print(f"✓ Loaded t-SNE data: {len(tsne_df):,} samples")

print("\n⏳ Loading UMAP coordinates...")
umap_df = pd.read_csv(base_url + 'umap_coordinates.csv')
print(f"✓ Loaded UMAP data: {len(umap_df):,} samples")

# ============================================================================
# Data Overview
# ============================================================================

print("\n" + "=" * 70)
print("DATA OVERVIEW")
print("=" * 70)

print(f"\nColumns: {list(tsne_df.columns)}")
print(f"Breeds: {tsne_df['breed'].nunique()}")
print(f"Species: {tsne_df['species'].nunique()}")

print("\nSample data:")
print(tsne_df.head())

# ============================================================================
# Visualization 1: t-SNE 2D Projection
# ============================================================================

print("\n📈 Creating t-SNE visualization...")

fig_tsne = px.scatter(
    tsne_df,
    x='tsne_x',
    y='tsne_y',
    color='breed',
    hover_data=['image_name', 'species'],
    title='t-SNE 2D Projection of Pet Breeds (ResNet50 Features)',
    width=1000,
    height=700,
    template='plotly_white'
)

fig_tsne.update_traces(marker=dict(size=6, opacity=0.7, line=dict(width=0.5, color='white')))

fig_tsne.update_layout(
    xaxis_title='t-SNE Dimension 1',
    yaxis_title='t-SNE Dimension 2',
    legend=dict(
        title='Breed',
        yanchor='top',
        y=0.99,
        xanchor='right',
        x=0.99,
        bgcolor='rgba(255,255,255,0.8)'
    ),
    hovermode='closest'
)

fig_tsne.show()

# ============================================================================
# Visualization 2: UMAP 2D Projection
# ============================================================================

print("\n📈 Creating UMAP visualization...")

fig_umap = px.scatter(
    umap_df,
    x='umap_x',
    y='umap_y',
    color='breed',
    hover_data=['image_name', 'species'],
    title='UMAP 2D Projection of Pet Breeds (ResNet50 Features)',
    width=1000,
    height=700,
    template='plotly_white'
)

fig_umap.update_traces(marker=dict(size=6, opacity=0.7, line=dict(width=0.5, color='white')))

fig_umap.update_layout(
    xaxis_title='UMAP Dimension 1',
    yaxis_title='UMAP Dimension 2',
    legend=dict(
        title='Breed',
        yanchor='top',
        y=0.99,
        xanchor='right',
        x=0.99,
        bgcolor='rgba(255,255,255,0.8)'
    ),
    hovermode='closest'
)

fig_umap.show()

# ============================================================================
# Visualization 3: Colored by Species (t-SNE)
# ============================================================================

print("\n📈 Creating species-based t-SNE visualization...")

fig_species = px.scatter(
    tsne_df,
    x='tsne_x',
    y='tsne_y',
    color='species',
    hover_data=['breed', 'image_name'],
    title='t-SNE: Species Separation (Cats vs Dogs)',
    width=900,
    height=600,
    template='plotly_white',
    color_discrete_map={'cat': '#667eea', 'dog': '#f093fb'}
)

fig_species.update_traces(marker=dict(size=8, opacity=0.6, line=dict(width=1, color='white')))

fig_species.update_layout(
    xaxis_title='t-SNE Dimension 1',
    yaxis_title='t-SNE Dimension 2',
    legend=dict(title='Species', font=dict(size=14)),
    hovermode='closest'
)

fig_species.show()

# ============================================================================
# Visualization 4: Side-by-Side Comparison
# ============================================================================

print("\n📈 Creating t-SNE vs UMAP comparison...")

fig_compare = make_subplots(
    rows=1, cols=2,
    subplot_titles=('t-SNE Projection', 'UMAP Projection'),
    horizontal_spacing=0.1
)

# t-SNE subplot
for species in ['cat', 'dog']:
    df_species = tsne_df[tsne_df['species'] == species]
    fig_compare.add_trace(
        go.Scatter(
            x=df_species['tsne_x'],
            y=df_species['tsne_y'],
            mode='markers',
            name=species.capitalize(),
            marker=dict(
                size=5,
                opacity=0.6,
                color='#667eea' if species == 'cat' else '#f093fb'
            ),
            hovertemplate='<b>%{text}</b><extra></extra>',
            text=df_species['breed']
        ),
        row=1, col=1
    )

# UMAP subplot
for species in ['cat', 'dog']:
    df_species = umap_df[umap_df['species'] == species]
    fig_compare.add_trace(
        go.Scatter(
            x=df_species['umap_x'],
            y=df_species['umap_y'],
            mode='markers',
            name=species.capitalize(),
            marker=dict(
                size=5,
                opacity=0.6,
                color='#667eea' if species == 'cat' else '#f093fb'
            ),
            hovertemplate='<b>%{text}</b><extra></extra>',
            text=df_species['breed'],
            showlegend=False
        ),
        row=1, col=2
    )

fig_compare.update_xaxes(title_text="Dimension 1", row=1, col=1)
fig_compare.update_yaxes(title_text="Dimension 2", row=1, col=1)
fig_compare.update_xaxes(title_text="Dimension 1", row=1, col=2)
fig_compare.update_yaxes(title_text="Dimension 2", row=1, col=2)

fig_compare.update_layout(
    title_text='t-SNE vs UMAP Comparison',
    width=1400,
    height=600,
    template='plotly_white',
    hovermode='closest'
)

fig_compare.show()

# ============================================================================
# Analysis
# ============================================================================

print("\n" + "=" * 70)
print("FEATURE SPACE ANALYSIS")
print("=" * 70)

# Check clustering by species
cat_samples = tsne_df[tsne_df['species'] == 'cat']
dog_samples = tsne_df[tsne_df['species'] == 'dog']

print(f"\n📊 Sample Distribution:")
print(f"  Cats: {len(cat_samples):,} ({len(cat_samples)/len(tsne_df)*100:.1f}%)")
print(f"  Dogs: {len(dog_samples):,} ({len(dog_samples)/len(tsne_df)*100:.1f}%)")

print(f"\n📊 t-SNE Coordinate Ranges:")
print(f"  X: [{tsne_df['tsne_x'].min():.2f}, {tsne_df['tsne_x'].max():.2f}]")
print(f"  Y: [{tsne_df['tsne_y'].min():.2f}, {tsne_df['tsne_y'].max():.2f}]")

print(f"\n📊 UMAP Coordinate Ranges:")
print(f"  X: [{umap_df['umap_x'].min():.2f}, {umap_df['umap_x'].max():.2f}]")
print(f"  Y: [{umap_df['umap_y'].min():.2f}, {umap_df['umap_y'].max():.2f}]")

# ============================================================================
# Summary
# ============================================================================

print("\n" + "=" * 70)
print("✅ VISUALIZATION COMPLETE")
print("=" * 70)
print("\n💡 Key Insights:")
print("   - Breeds form distinct clusters in feature space")
print("   - Clear separation between cats and dogs")
print("   - Some breed clusters overlap (visually similar breeds)")
print("   - Both t-SNE and UMAP reveal similar structure")
print("\n📚 Next Steps:")
print("   - Analyze breed similarity using cosine distance")
print("   - Identify most/least similar breed pairs")
print("   - Understand classification challenges")

